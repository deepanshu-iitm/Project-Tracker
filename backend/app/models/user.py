from app.utils.db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def set_password(self, raw_password):
        """Hash and store the password."""
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        """Verify the password against its hash."""
        return check_password_hash(self.password, raw_password)
