# MegaOdds - Complete Online Betting Platform

A comprehensive full-stack online betting platform with 20+ realistic games, built with React frontend and Flask backend.

## 🎮 Available Games

### Core Casino Games
- **🎲 Dice Roll** - Roll dice with 2x payout on 4,5,6
- **🪙 Coin Flip** - Classic heads/tails with side selection
- **🎰 Roulette** - European style with multiple betting options
- **🃏 Blackjack** - Play against dealer with realistic cards
- **🎰 Slot Machine** - 3-reel slots with symbol matching

### Sports & Skill Games
- **⚽ Sports Betting** - Live matches with real odds
- **🥅 Penalty Shootout** - Aim and shoot with goalkeeper AI
- **✈️ Aviator** - Multiplier flight game, cash out before crash

### Modern Games
- **🟢 Plinko** - Drop ball through pegs for random multipliers
- **💣 Mines** - Click safe tiles, avoid mines, cash out anytime
- **🎡 Wheel Spin** - Spinning prize wheel with various multipliers

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
- **Modern UI** with responsive design
- **Real-time animations** for all games
- **Mobile-friendly** interface
- **JWT authentication** with protected routes
- **Balance management** with live updates

### Backend (Flask + PostgreSQL)
- **Secure game logic** with cryptographic randomness
- **JWT authentication** system
- **PostgreSQL database** for data persistence
- **RESTful APIs** for all operations
- **Transaction logging** for audit trails

## 🚀 Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd megaodds
```

2. **Start with Docker Compose**
```bash
docker-compose up --build
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🛠️ Manual Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://user:password@localhost/megaodds
export JWT_SECRET_KEY=your-secret-key

# Run migrations and start server
python app.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

## 🎯 Key Features

### Security
- **Secure random number generation** using Python's `secrets` module
- **Password hashing** with Werkzeug
- **JWT token authentication** with expiration
- **Input validation** and sanitization
- **SQL injection prevention** through ORM

### Gaming Features
- **Real-time balance updates**
- **Comprehensive betting history**
- **Leaderboard system**
- **Multiple currency support** (KSh)
- **Responsive game interfaces**
- **Smooth animations** and transitions

### Payment System
- **M-Pesa integration** for deposits
- **Bank withdrawal** support
- **Transaction history** tracking
- **Balance validation** and limits

## 📊 Database Schema

### Core Tables
- **Users** - Authentication and balance management
- **Games** - Game configuration and settings
- **Bets** - Individual bet records with results
- **Transactions** - All financial transactions
- **Leaderboard** - Player rankings and statistics

## 🎮 Game Mechanics

Each game implements:
- **Provably fair** random number generation
- **Configurable** minimum/maximum bets
- **Real-time** result calculation
- **Secure** server-side validation
- **Detailed** game history logging

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@localhost/megaodds
JWT_SECRET_KEY=your-super-secret-key
FLASK_ENV=development
```

### Game Settings
- Minimum bet: KSh650
- Maximum bet: KSh130,000
- Starting balance: KSh162,500
- JWT token expiry: 7 days

## 📱 Mobile Support

- **Responsive design** works on all screen sizes
- **Touch-friendly** game interfaces
- **Optimized performance** for mobile devices
- **Progressive Web App** capabilities

## 🏆 Admin Features

- User management dashboard
- Game configuration panel
- Transaction monitoring
- Payout management
- System statistics

## 🔒 Security Measures

- **Rate limiting** on API endpoints
- **CORS protection** for cross-origin requests
- **Input sanitization** for all user data
- **Secure session management**
- **Audit logging** for all transactions

## 📈 Scalability

- **Docker containerization** for easy deployment
- **PostgreSQL** for reliable data storage
- **Modular architecture** for easy feature additions
- **API-first design** for multiple client support

## 🎨 UI/UX Features

- **Dark theme** with gradient backgrounds
- **Smooth animations** using CSS transitions
- **Loading states** for better user experience
- **Error handling** with user-friendly messages
- **Accessibility** considerations

This platform provides a complete, production-ready online betting experience with enterprise-level security and scalability.