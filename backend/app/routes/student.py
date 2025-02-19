from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.team import Team
from app.models.milestone import Milestone  
from app.utils.github import fetch_commits 
from datetime import datetime
from app.models.feedback import Feedback

student_bp = Blueprint('student', __name__)

@student_bp.route('/student/dashboard', methods=['GET'])
@jwt_required()
def get_student_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    team = Team.query.join(Team.members).filter(User.id == user_id).first()

    if not team:
        return jsonify({"error": "Team not found"}), 404

    milestones = Milestone.query.filter_by(project_id=team.project_id).all()

    try:
        github_activity = fetch_commits(team.repository_url)
    except ValueError as e:

        return jsonify({"error": f"GitHub commit fetching failed: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error occurred: {str(e)}"}), 400

    response = {
        "student": {
            "id": user.id,
            "name": user.username,
        },
        "team": {
            "id": team.id,
            "name": team.name,
            "repository_url": team.repository_url
        },
        "milestones": [
            {
                "id": milestone.id,
                "title": milestone.title,
                "dueDate": milestone.due_date.strftime("%Y-%m-%d"),
                "status": "Completed" if milestone.submitted_on and datetime.combine(milestone.due_date, datetime.min.time()) <= milestone.submitted_on else "In Progress",
                "dueDate": milestone.due_date,
                "instructorFeedback": next(
                    (f.feedback for f in milestone.feedback if not f.is_ai_generated), None
                ),
                "aiFeedback": next(
                    (f.feedback for f in milestone.feedback if f.is_ai_generated), None
                )
            }
            for milestone in milestones
        ],
        "githubRepo": team.repository_url,
        "githubActivity": [
            {
                "type": activity.get('type', 'Unknown'),
                "description": activity.get('commit', {}).get('message', 'No description'),
                "branch": activity.get('ref', 'N/A'),
                "date": activity.get('commit', {}).get('author', {}).get('date', 'Unknown date')
            }
            for activity in github_activity
        ],
        "projectId": team.project_id
    }

    return jsonify(response), 200