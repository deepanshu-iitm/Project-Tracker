from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.team import Team
from app.utils.github import fetch_commits

github_bp = Blueprint('github', __name__)

@github_bp.route('/instructor/teams/<int:team_id>/github/commits', methods=['GET'])
@jwt_required()
def get_team_commits(team_id):
    user_id = get_jwt_identity()

    # Check if the instructor owns the team
    team = Team.query.filter_by(id=team_id, instructor_id=user_id).first()
    if not team:
        return jsonify({"error": "Team not found or unauthorized"}), 404

    try:
        commits = fetch_commits(team.repository_url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"team": team.name, "commits": commits}), 200


@github_bp.route('/student/github/commits', methods=['GET'])
@jwt_required()
def get_student_commits():
    user_id = get_jwt_identity()

    team = Team.query.join(Team.students).filter_by(id=user_id).first()
    if not team:
        return jsonify({"error": "Team not found"}), 404

    try:
        commits = fetch_commits(team.repository_url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"team": team.name, "commits": commits}), 200
