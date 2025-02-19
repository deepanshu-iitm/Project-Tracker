from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.project import Project
from app.models.user import User
from app.utils.db import db
from app.models.milestone import Milestone
from app.models.team import Team

project_bp = Blueprint('project', __name__)

@project_bp.route('/instructor/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    title, description = data.get('title'), data.get('description')

    if not all([title, description]):
        return jsonify({"error": "Missing fields"}), 400

    user_id = get_jwt_identity()  # Get instructor's user ID from JWT
    instructor = User.query.get(user_id)
    if instructor.role != 'instructor':
        return jsonify({"error": "Only instructors can create projects"}), 403

    project = Project(title=title, description=description, instructor_id=user_id)
    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project successfully created", "project_id": project.id}), 201


@project_bp.route('/instructor/projects', methods=['GET'])
@jwt_required()
def get_projects():
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(instructor_id=user_id).all()

    project_list = []
    for project in projects:
        upcoming_milestone = Milestone.query.filter_by(project_id=project.id).order_by(Milestone.due_date.asc()).first()
        project_list.append({
            "id": project.id, 
            "title": project.title, 
            "description": project.description, 
            "created_at": project.created_at, 
            "due_date": upcoming_milestone.due_date if upcoming_milestone else None
        })

    return jsonify(project_list), 200

@project_bp.route('/instructor/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_details(project_id):
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, instructor_id=user_id).first()
    

    if not project:
        return jsonify({"error": "Project not found"}), 404

    milestones = Milestone.query.filter_by(project_id=project_id).order_by(Milestone.due_date.asc()).all()

    assigned_teams = Team.query.filter_by(project_id=project_id).all()
    assigned_team_names = [
        {'id': team.id, 'name': team.name} for team in assigned_teams
    ]

    project_data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "milestones": [
            {
                "id": milestone.id,
                "title": milestone.title,
                "description": milestone.description,
                "due_date": milestone.due_date
            }
            for milestone in milestones           
        ],
        "assignedTeams": assigned_team_names
    }

    return jsonify(project_data), 200


@project_bp.route('/instructor/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    data = request.get_json()
    title, description = data.get('title'), data.get('description')

    if not all([title, description]):
        return jsonify({"error": "Missing fields"}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, instructor_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.title = title
    project.description = description
    db.session.commit()

    return jsonify({"message": "Project successfully updated"}), 200


@project_bp.route('/instructor/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, instructor_id=user_id).first()
    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": "Project successfully deleted"}), 204
