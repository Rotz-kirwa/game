from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Game, Bet, Transaction, Leaderboard
import os
import secrets
import json
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///megaodds.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
CORS(app)

# Game logic functions
def generate_secure_random():
    return secrets.randbelow(100) / 100.0

def calculate_game_result(game_name, bet_data):
    """Calculate game results using secure random generation"""
    random_val = generate_secure_random()
    
    if game_name == 'Dice Roll':
        roll = secrets.randbelow(6) + 1
        win = roll >= 4
        multiplier = 2.0 if win else 0
        return win, multiplier, {'roll': roll}
    
    elif game_name == 'Coin Flip':
        result = 'heads' if random_val < 0.5 else 'tails'
        choice = bet_data.get('choice', 'heads')
        win = result == choice
        multiplier = 1.0 if win else 0
        return win, multiplier, {'result': result, 'choice': choice}
    
    elif game_name == 'Roulette':
        number = secrets.randbelow(37)
        bet_type = bet_data.get('type', 'red')
        win = False
        multiplier = 0
        
        if bet_type == 'red' and number in [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]:
            win, multiplier = True, 2.0
        elif bet_type == 'black' and number in [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]:
            win, multiplier = True, 2.0
        elif bet_type == 'even' and number > 0 and number % 2 == 0:
            win, multiplier = True, 2.0
        elif bet_type == 'odd' and number % 2 == 1:
            win, multiplier = True, 2.0
            
        return win, multiplier, {'number': number, 'bet_type': bet_type}
    
    elif game_name == 'Aviator':
        crash_point = 1.0 + (random_val * 10)
        cash_out = bet_data.get('cash_out', 1.0)
        win = cash_out < crash_point
        multiplier = cash_out if win else 0
        return win, multiplier, {'crash_point': crash_point, 'cash_out': cash_out}
    
    elif game_name == 'Plinko':
        multipliers = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 3.0, 2.0, 1.5, 1.0, 0.5, 0.2]
        slot = secrets.randbelow(len(multipliers))
        multiplier = multipliers[slot]
        win = multiplier >= 1.0
        return win, multiplier, {'slot': slot, 'multiplier': multiplier}
    
    elif game_name == 'Mines':
        mines_count = bet_data.get('mines', 3)
        revealed_safe = bet_data.get('revealed_safe', 0)
        multiplier = 1.0 + (revealed_safe * 0.3)
        win = True  # Assuming player cashed out
        return win, multiplier, {'mines': mines_count, 'safe_tiles': revealed_safe}
    
    # Default case
    win = random_val > 0.5
    multiplier = 2.0 if win else 0
    return win, multiplier, {}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(email=email, password_hash=generate_password_hash(password), balance=162500.0)
    db.session.add(user)
    db.session.commit()
    
    # Create leaderboard entry
    leaderboard = Leaderboard(user_id=user.id)
    db.session.add(leaderboard)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({
        'access_token': access_token,
        'user': {'id': user.id, 'email': user.email, 'balance': user.balance}
    }), 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'id': user.id,
        'email': user.email,
        'balance': user.balance,
        'created_at': user.created_at.isoformat()
    })

@app.route('/games', methods=['GET'])
def get_games():
    games = Game.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': game.id,
        'name': game.name,
        'min_bet': game.min_bet,
        'max_bet': game.max_bet
    } for game in games])

@app.route('/bet', methods=['POST'])
@jwt_required()
def place_bet():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    game_name = data.get('game')
    amount = float(data.get('amount', 0))
    bet_data = data.get('data', {})
    
    if amount <= 0 or amount > user.balance:
        return jsonify({'error': 'Invalid bet amount'}), 400
    
    # Calculate game result
    win, multiplier, game_result = calculate_game_result(game_name, bet_data)
    payout = amount * multiplier if win else 0
    
    # Update user balance
    user.balance -= amount
    if win:
        user.balance += payout
    
    # Create bet record
    bet = Bet(
        user_id=user_id,
        game_id=1,  # Default game ID
        amount=amount,
        multiplier=multiplier,
        result='win' if win else 'loss',
        payout=payout,
        game_data=json.dumps(game_result)
    )
    db.session.add(bet)
    
    # Create transaction records
    bet_transaction = Transaction(user_id=user_id, type='bet', amount=-amount)
    db.session.add(bet_transaction)
    
    if win:
        win_transaction = Transaction(user_id=user_id, type='win', amount=payout)
        db.session.add(win_transaction)
        
        # Update leaderboard
        leaderboard = Leaderboard.query.filter_by(user_id=user_id).first()
        if leaderboard:
            leaderboard.total_winnings += payout
            leaderboard.total_bets += 1
            if payout > leaderboard.biggest_win:
                leaderboard.biggest_win = payout
            leaderboard.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'win': win,
        'multiplier': multiplier,
        'payout': payout,
        'balance': user.balance,
        'result': game_result
    })

@app.route('/deposit', methods=['POST'])
@jwt_required()
def deposit():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    amount = float(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    user.balance += amount
    transaction = Transaction(user_id=user_id, type='deposit', amount=amount)
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({'balance': user.balance, 'message': 'Deposit successful'})

@app.route('/withdraw', methods=['POST'])
@jwt_required()
def withdraw():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    
    amount = float(data.get('amount', 0))
    if amount <= 0 or amount > user.balance:
        return jsonify({'error': 'Invalid amount'}), 400
    
    user.balance -= amount
    transaction = Transaction(user_id=user_id, type='withdrawal', amount=-amount)
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({'balance': user.balance, 'message': 'Withdrawal successful'})

@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    bets = Bet.query.filter_by(user_id=user_id).order_by(Bet.created_at.desc()).limit(50).all()
    
    return jsonify([{
        'id': bet.id,
        'game': 'Game',
        'amount': bet.amount,
        'result': bet.result,
        'payout': bet.payout,
        'multiplier': bet.multiplier,
        'created_at': bet.created_at.isoformat()
    } for bet in bets])

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    leaders = db.session.query(Leaderboard, User).join(User).order_by(Leaderboard.total_winnings.desc()).limit(10).all()
    
    return jsonify([{
        'email': user.email[:3] + '***',
        'total_winnings': leaderboard.total_winnings,
        'total_bets': leaderboard.total_bets,
        'biggest_win': leaderboard.biggest_win
    } for leaderboard, user in leaders])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create default games if they don't exist
        games = ['Dice Roll', 'Coin Flip', 'Roulette', 'Blackjack', 'Slots', 'Sports Betting', 
                'Penalty Kick', 'Aviator', 'Plinko', 'Mines', 'Wheel Spin']
        
        for game_name in games:
            if not Game.query.filter_by(name=game_name).first():
                game = Game(name=game_name)
                db.session.add(game)
        
        db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)