from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.project import Project
from app.models.milestone import Milestone
from app.utils.db import db
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from app.models.submission import Submission
from app.models.team import Team
from flask import send_from_directory
from flask_jwt_extended import create_access_token, decode_token

milestone_bp = Blueprint('milestone', __name__)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'submission_folder'))
ALLOWED_EXTENSIONS = {'pdf', 'zip', 'rar', 'docx', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@milestone_bp.route('/milestone/submit', methods=['POST'])
@jwt_required()
def submit_milestone():
    user_id = get_jwt_identity()
    file = request.files.get('file')
    comments = request.form.get('comments')
    milestone_id = request.form.get('milestoneId')
    team_id = request.form.get('teamId')

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type or no file uploaded."}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    milestone = Milestone.query.get(milestone_id)
    if not milestone:
        return jsonify({"error": "Milestone not found."}), 404
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found."}), 404
    
    existing_submission = Submission.query.filter_by(milestone_id=milestone_id, team_id=team_id).first()
    if existing_submission:
        return jsonify({"error": "Milestone already submitted by this team."}), 400

    submission = Submission(
        milestone_id=milestone_id,
        team_id=team_id,
        file_url=filename,
        comments=comments
    )
    milestone.submitted_on = datetime.utcnow()

    db.session.add(submission)
    db.session.commit() 

    return jsonify({"message": "Milestone submitted successfully."}), 200

@milestone_bp.route('/submission_folder/<filename>', methods=['GET'])   
def serve_submission_file(filename):

    filename = secure_filename(filename) 
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    print(f"Resolved file path: {file_path}")

    if os.path.exists(file_path):
        return send_from_directory(
            directory=UPLOAD_FOLDER,
            path=filename,
            as_attachment=False  
        )
    else:
        return jsonify({"msg": "File not found"}), 404

@milestone_bp.route('/instructor/projects/<int:project_id>/milestones', methods=['POST'])
@jwt_required()
def create_milestone(project_id):
    data = request.get_json()
    title, description, due_date = data.get('title'), data.get('description'), data.get('due_date')

    if not all([title, description, due_date]):
        return jsonify({"error": "Missing fields"}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, instructor_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404

    milestone = Milestone(title=title, description=description, due_date=due_date, project_id=project_id)
    db.session.add(milestone)
    db.session.commit()

    return jsonify({"message": "Milestone successfully created", "milestone_id": milestone.id}), 201


@milestone_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>', methods=['PUT'])
@jwt_required()
def update_milestone(project_id, milestone_id):
    data = request.get_json()
    title, description, due_date = data.get('title'), data.get('description'), data.get('due_date')

    if not all([title, description, due_date]):
        return jsonify({"error": "Missing fields"}), 400

    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Project).filter(
        Milestone.id == milestone_id, 
        Project.id == project_id, 
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    milestone.title = title
    milestone.description = description
    milestone.due_date = due_date
    db.session.commit()

    return jsonify({"message": "Milestone successfully updated"}), 200


@milestone_bp.route('/instructor/projects/<int:project_id>/milestones/<int:milestone_id>', methods=['DELETE'])
@jwt_required()
def delete_milestone(project_id, milestone_id):
    user_id = get_jwt_identity()
    milestone = Milestone.query.join(Project).filter(
        Milestone.id == milestone_id, 
        Project.id == project_id, 
        Project.instructor_id == user_id
    ).first()

    if not milestone:
        return jsonify({"error": "Milestone not found"}), 404

    db.session.delete(milestone)
    db.session.commit()

    return jsonify({"message": "Milestone successfully deleted"}), 204
