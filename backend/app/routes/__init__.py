from app.routes.auth import auth_bp
from app.routes.project import project_bp
from app.routes.milestone import milestone_bp
from app.routes.feedback import feedback_bp
from app.routes.team import team_bp
from app.routes.student import student_bp
from app.routes.github import github_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(milestone_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(github_bp)

