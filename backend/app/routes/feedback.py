from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.milestone import Milestone
from app.models.project import Project
from app.models.feedback import Feedback
from app.utils.db import db
from app.models.submission import Submission
import google.generativeai as genai
from dotenv import load_dotenv
import os
import requests
import re
import time
import fitz
import random

load_dotenv()

GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/submission', methods=['GET'])
@jwt_required()
def get_submission(project_id, milestone_id):
    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Milestone.parent_project).filter(
        Milestone.id == milestone_id,
        Milestone.project_id == project_id,
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    submission = milestone.submission[0]

    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    file_url = f"http://127.0.0.1:5000/submission_folder/{submission.file_url}"

    submission_data = {
        "content": submission.comments,
        "fileUrl": file_url,
    }

    return jsonify({"submission": submission_data}), 200



@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/feedback', methods=['POST'])
@jwt_required()
def add_manual_feedback(project_id, milestone_id):
    data = request.get_json()
    feedback_content = data.get('feedback')

    if not feedback_content:
        return jsonify({"error": "Feedback content is required"}), 400

    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Milestone.parent_project).filter(
        Milestone.id == milestone_id,
        Milestone.project_id == project_id,
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    feedback = Feedback(feedback=feedback_content, milestone_id=milestone_id, is_ai_generated=False)
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback successfully added", "feedback_id": feedback.id}), 201


def download_file(url, download_folder="temp_folder"):
    
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    local_filename = os.path.join(download_folder, url.split("/")[-1])
    
    with requests.get(url, stream=True) as r:
        r.raise_for_status()  
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    
    return local_filename

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file.
    """
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def summarize_with_gemini(text):
    """Send extracted text to Google Gemini for summarization."""
    prompt = f"""
    You are an expert evaluator. Summarize the following project submission in a structured way:
    
    1. **Concise Summary**  
    2. **Key Strengths** (with supporting examples)  
    3. **Weaknesses or areas needing improvement**  
    4. **Constructive suggestions for improvement**  
    
    Submission Content:  
    {text[:8000]}  # Gemini has a token limit, so we truncate if necessary.
    """

    model = genai.GenerativeModel("gemini-pro")
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip() if response else "AI feedback not generated."
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "AI feedback could not be generated due to an error."

@feedback_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>/ai-feedback', methods=['GET'])
@jwt_required()
def generate_ai_feedback(project_id, milestone_id):
    """Generate AI feedback for a project milestone using Google Gemini."""
    milestone = Milestone.query.filter_by(id=milestone_id, project_id=project_id).first()
    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    submission = Submission.query.filter_by(milestone_id=milestone_id).first()
    if not submission:
        return jsonify({"error": "No submission found for this milestone"}), 404

    file_url = f"http://127.0.0.1:5000/submission_folder/{submission.file_url}"
    local_file_path = download_file(file_url)

    if not local_file_path.endswith('.pdf'):
        return jsonify({"error": "Unsupported file format"}), 400

    # Extract text from PDF
    file_content = extract_text_from_pdf(local_file_path)

    # Get AI-generated summary from Gemini
    ai_feedback = summarize_with_gemini(file_content)

    # Save feedback in the database
    feedback = Feedback(feedback=ai_feedback, milestone_id=milestone_id, is_ai_generated=True)
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "AI feedback generated", "feedback": ai_feedback}), 200