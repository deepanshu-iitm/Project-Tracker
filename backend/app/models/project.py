from app.utils.db import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    milestones = db.relationship('Milestone', backref='parent_project', cascade='all, delete', lazy=True)
    instructor = db.relationship('User', backref=db.backref('projects', lazy=True))
