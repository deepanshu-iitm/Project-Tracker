from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.db import db
from app.utils.jwt_utils import generate_jwt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username, email, password, role = data.get('username'), data.get('email'), data.get('password'), data.get('role')

    if not all([username, email, password, role]):
        return jsonify({"error": "Missing fields"}), 400

    if role not in ['student', 'instructor']:
        return jsonify({"error": "Invalid role"}), 400

    # Check if the user already exists
    existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Create a new user
    user = User(username=username, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User successfully registered"}), 201

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing fields"}), 400

    # Fetch the user by email
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT
    token = generate_jwt(user_id=user.id, role=user.role)
    return jsonify({"token": token, "role": user.role}), 200
