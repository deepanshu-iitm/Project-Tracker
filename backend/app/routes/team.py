from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.team import Team, db
import logging
from app.models.project import Project
from app.models.milestone import Milestone
from datetime import datetime
from app.utils.github import fetch_commits

team_bp = Blueprint('team', __name__)



@team_bp.route('/teams/students', methods=['GET'])
@jwt_required()
def get_students_and_projects():
    students = User.query.filter_by(role='student').all()
    student_list = [{"id": student.id, "name": student.username, "email": student.email} for student in students]

    projects = Project.query.all()
    project_list = [{"id": project.id, "title": project.title} for project in projects]

    return jsonify({
        "students": student_list,
        "projects": project_list
    }), 200

@team_bp.route('/teams/create', methods=['POST'])
@jwt_required()
def create_team():
    data = request.get_json()
    project_id = data.get('project_id')  
    repository_url = data.get('repository_url')
    member_ids = data.get('member_ids')

    if not project_id:
        return jsonify({"error": "Project ID is required"}), 400
    if not repository_url:
        return jsonify({"error": "Repository URL is required"}), 400
    if not member_ids:
        return jsonify({"error": "No members provided"}), 400

    team_name = f"Team {Team.query.count() + 1}"
    team = Team(name=team_name, repository_url=repository_url, project_id=project_id)
    team.members.extend(User.query.filter(User.id.in_(member_ids)).all())

    db.session.add(team)
    db.session.commit()

    return jsonify({"message": "Team successfully created", "team_id": team.id}), 201

@team_bp.route('/teams/<int:team_id>/progress', methods=['GET'])
@jwt_required()
def get_team_progress(team_id):
    team = Team.query.filter_by(id=team_id).first()
    if not team:
        return jsonify({"error": "Team not found"}), 404

    milestones = Milestone.query.filter_by(project_id=team.project_id).order_by(Milestone.due_date.asc()).all()
    try:
        github_activity = fetch_commits(team.repository_url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


    progress_data = {
        "teamName": team.name,
        "members": [{"name": member.username, "email": member.email} for member in team.members],
        "githubRepo": team.repository_url,
        "projectId": team.project_id,
        "milestones": [
            {
                "id": milestone.id,
                "title": milestone.title,
                "status": "Completed" if milestone.submitted_on and (
                    (milestone.submitted_on if isinstance(milestone.submitted_on, datetime) else datetime.combine(milestone.submitted_on, datetime.min.time())) <=
                    (milestone.due_date if isinstance(milestone.due_date, datetime) else datetime.combine(milestone.due_date, datetime.min.time()))
                ) else "In Progress",
                "dueDate": milestone.due_date.strftime("%Y-%m-%d")
            }
            for milestone in milestones
        ],
        "githubActivity": [
            {
                "type": activity.get('type', 'Unknown'),
                "description": activity.get('commit', {}).get('message', 'No description'),
                "branch": activity.get('ref', 'N/A'),
                "date": activity.get('commit', {}).get('author', {}).get('date', 'Unknown date')
            }
            for activity in github_activity
        ]
    }

    return jsonify(progress_data), 200


