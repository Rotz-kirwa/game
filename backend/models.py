from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import secrets

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    balance = db.Column(db.Float, default=0.0)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bets = db.relationship('Bet', backref='user', lazy=True)
    transactions = db.relationship('Transaction', backref='user', lazy=True)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    min_bet = db.Column(db.Float, default=1.0)
    max_bet = db.Column(db.Float, default=10000.0)
    
    bets = db.relationship('Bet', backref='game', lazy=True)

class Bet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    multiplier = db.Column(db.Float, default=1.0)
    result = db.Column(db.String(20), nullable=False)  # 'win', 'loss'
    payout = db.Column(db.Float, default=0.0)
    game_data = db.Column(db.Text)  # JSON data for game-specific info
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit', 'withdrawal', 'bet', 'win'
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='completed')
    reference = db.Column(db.String(100), unique=True, default=lambda: secrets.token_hex(16))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_winnings = db.Column(db.Float, default=0.0)
    total_bets = db.Column(db.Integer, default=0)
    biggest_win = db.Column(db.Float, default=0.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='leaderboard_entry')