from app.utils.db import db
from datetime import datetime

class Submission(db.Model):
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestones.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    file_url = db.Column(db.String(200), nullable=False)
    comments = db.Column(db.Text, nullable=True)
    submitted_on = db.Column(db.DateTime, default=datetime.utcnow)

    team = db.relationship('Team', backref='submissions')

    def __init__(self, milestone_id, file_url, team_id, comments=None):
        self.milestone_id = milestone_id
        self.team_id = team_id 
        self.file_url = file_url
        self.comments = comments
