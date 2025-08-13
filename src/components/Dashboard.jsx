import { useState, useEffect } from 'react';
import axios from 'axios';
import { DEMO_MODE, DEMO_USER, API_BASE_URL } from '../api';
import DiceGame from './DiceGame';
import CoinFlipGame from './CoinFlipGame';
import SlotsGame from './SlotsGame';
import RouletteGame from './RouletteGame';
import BlackjackGame from './BlackjackGame';
import SportsGame from './SportsGame';
import PaymentSystem from './PaymentSystem';
import PenaltyGame from './PenaltyGame';
import AviatorGame from './AviatorGame';
import PlinkoGame from './PlinkoGame';
import MinesGame from './MinesGame';
import WheelGame from './WheelGame';
import HorseRacingGame from './HorseRacingGame';
import DogRacingGame from './DogRacingGame';
import ScratchCardGame from './ScratchCardGame';
import KenoGame from './KenoGame';
import LottoGame from './LottoGame';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(162500);
  const [betAmount, setBetAmount] = useState(1300);
  const [gameResult, setGameResult] = useState('');
  const [currentGame, setCurrentGame] = useState(null);
  const [activity, setActivity] = useState([
    { game: 'Dice Roll', result: 'Win', amount: 6500 },
    { game: 'Coin Flip', result: 'Loss', amount: -3250 },
    { game: 'Blackjack', result: 'Win', amount: 13000 }
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (DEMO_MODE) {
          const demoUser = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(demoUser.email ? demoUser : DEMO_USER);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/protected`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const addActivity = (game, result, amount) => {
    setActivity(prev => [{ game, result, amount }, ...prev.slice(0, 4)]);
  };

  const handleGameResult = (gameName, win, winAmount, resultText) => {
    setBalance(prev => prev + winAmount);
    setGameResult(`${resultText} ${win ? 'You win!' : 'You lose!'} ${win ? '+' : ''}KSh${Math.abs(winAmount).toLocaleString()}`);
    addActivity(gameName, win ? 'Win' : 'Loss', winAmount);
    // Don't automatically return to dashboard - let user stay in game
  };

  const openGame = (gameName) => {
    if (balance < betAmount) {
      setGameResult('Insufficient balance!');
      return;
    }
    setCurrentGame(gameName);
  };

  const playRoulette = () => {
    if (balance < betAmount) return setGameResult('Insufficient balance!');
    const number = Math.floor(Math.random() * 37);
    const win = number % 2 === 0 && number !== 0;
    const winAmount = win ? betAmount * 2 : -betAmount;
    setBalance(prev => prev + winAmount);
    setGameResult(`Number ${number}! ${win ? 'You win!' : 'You lose!'} ${win ? '+' : ''}KSh${Math.abs(winAmount).toLocaleString()}`);
    addActivity('Roulette', win ? 'Win' : 'Loss', winAmount);
  };

  const playBlackjack = () => {
    if (balance < betAmount) return setGameResult('Insufficient balance!');
    const playerCard = Math.floor(Math.random() * 10) + 1;
    const dealerCard = Math.floor(Math.random() * 10) + 1;
    const win = playerCard > dealerCard;
    const winAmount = win ? betAmount * 1.5 : -betAmount;
    setBalance(prev => prev + winAmount);
    setGameResult(`You: ${playerCard}, Dealer: ${dealerCard}! ${win ? 'You win!' : 'You lose!'} ${win ? '+' : ''}KSh${Math.abs(winAmount).toLocaleString()}`);
    addActivity('Blackjack', win ? 'Win' : 'Loss', winAmount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (currentGame === 'dice') {
    return <DiceGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'coinflip') {
    return <CoinFlipGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'slots') {
    return <SlotsGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'roulette') {
    return <RouletteGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'blackjack') {
    return <BlackjackGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'sports') {
    return <SportsGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'payment') {
    return <PaymentSystem balance={balance} onBalanceUpdate={setBalance} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'penalty') {
    return <PenaltyGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'aviator') {
    return <AviatorGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'plinko') {
    return <PlinkoGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'mines') {
    return <MinesGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'wheel') {
    return <WheelGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'horses') {
    return <HorseRacingGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'dogs') {
    return <DogRacingGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'scratch') {
    return <ScratchCardGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'keno') {
    return <KenoGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'lotto') {
    return <LottoGame betAmount={betAmount} onGameResult={handleGameResult} onBack={() => setCurrentGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">🎯 MegaOdds</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 px-4 py-2 rounded-lg text-white font-semibold">
                Balance: KSh{balance.toLocaleString()}
              </div>
              <button
                onClick={() => setCurrentGame('payment')}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700"
              >
                💳 Payment
              </button>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Betting Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to MegaOdds!</h2>
              <p className="text-gray-300">{user ? `Logged in as ${user.email}` : 'Ready to place your bets?'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white">
                <label className="block text-sm mb-1">Bet Amount:</label>
                <select 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-black/30 text-white px-3 py-2 rounded border border-white/20"
                >
                  <option value={650}>KSh650</option>
                  <option value={1300}>KSh1,300</option>
                  <option value={3250}>KSh3,250</option>
                  <option value={6500}>KSh6,500</option>
                  <option value={13000}>KSh13,000</option>
                </select>
              </div>
            </div>
          </div>
          {gameResult && (
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 font-semibold">{gameResult}</p>
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          {/* Dice Game */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-white mb-2">Dice Roll</h3>
            <p className="text-gray-300 mb-4">Roll the dice and win big!</p>
            <button onClick={() => openGame('dice')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Play Dice (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Coin Flip */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🪙</div>
            <h3 className="text-xl font-bold text-white mb-2">Coin Flip</h3>
            <p className="text-gray-300 mb-4">Heads or tails? 50/50 chance!</p>
            <button onClick={() => openGame('coinflip')} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Play Coin Flip (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Roulette */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-white mb-2">Roulette</h3>
            <p className="text-gray-300 mb-4">Spin the wheel of fortune!</p>
            <button onClick={() => openGame('roulette')} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
              Play Roulette (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Blackjack */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🃏</div>
            <h3 className="text-xl font-bold text-white mb-2">Blackjack</h3>
            <p className="text-gray-300 mb-4">Beat the dealer to 21!</p>
            <button onClick={() => openGame('blackjack')} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Play Blackjack (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Slots */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🎰</div>
            <h3 className="text-xl font-bold text-white mb-2">Slot Machine</h3>
            <p className="text-gray-300 mb-4">Pull the lever and win!</p>
            <button onClick={() => openGame('slots')} className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700">
              Play Slots (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Sports Betting */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">⚽</div>
            <h3 className="text-xl font-bold text-white mb-2">Sports Betting</h3>
            <p className="text-gray-300 mb-4">Bet on your favorite teams!</p>
            <button onClick={() => openGame('sports')} className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
              Sports Betting (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Penalty Shootout */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">🥅</div>
            <h3 className="text-xl font-bold text-white mb-2">Penalty Shootout</h3>
            <p className="text-gray-300 mb-4">Score goals to win big!</p>
            <button onClick={() => openGame('penalty')} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Play Penalty (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Aviator */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">✈️</div>
            <h3 className="text-lg font-bold text-white mb-1">Aviator</h3>
            <p className="text-gray-300 text-sm mb-3">Cash out before crash!</p>
            <button onClick={() => openGame('aviator')} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Plinko */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🔴</div>
            <h3 className="text-lg font-bold text-white mb-1">Plinko</h3>
            <p className="text-gray-300 text-sm mb-3">Drop ball through pegs!</p>
            <button onClick={() => openGame('plinko')} className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Mines */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">💣</div>
            <h3 className="text-lg font-bold text-white mb-1">Mines</h3>
            <p className="text-gray-300 text-sm mb-3">Avoid the mines!</p>
            <button onClick={() => openGame('mines')} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Wheel Spin */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🎡</div>
            <h3 className="text-lg font-bold text-white mb-1">Wheel Spin</h3>
            <p className="text-gray-300 text-sm mb-3">Spin for prizes!</p>
            <button onClick={() => openGame('wheel')} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Horse Racing */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🏇</div>
            <h3 className="text-lg font-bold text-white mb-1">Horse Racing</h3>
            <p className="text-gray-300 text-sm mb-3">Bet on horses!</p>
            <button onClick={() => openGame('horses')} className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Dog Racing */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🐕</div>
            <h3 className="text-lg font-bold text-white mb-1">Dog Racing</h3>
            <p className="text-gray-300 text-sm mb-3">Bet on dogs!</p>
            <button onClick={() => openGame('dogs')} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Scratch Cards */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="text-lg font-bold text-white mb-1">Scratch Cards</h3>
            <p className="text-gray-300 text-sm mb-3">Scratch to win!</p>
            <button onClick={() => openGame('scratch')} className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Keno */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🔢</div>
            <h3 className="text-lg font-bold text-white mb-1">Keno</h3>
            <p className="text-gray-300 text-sm mb-3">Pick numbers!</p>
            <button onClick={() => openGame('keno')} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>

          {/* Number Lotto */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="text-lg font-bold text-white mb-1">Number Lotto</h3>
            <p className="text-gray-300 text-sm mb-3">Lottery draw!</p>
            <button onClick={() => openGame('lotto')} className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-sm">
              Play (KSh{betAmount.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                <span className="text-gray-300">{item.game} - {item.result}</span>
                <span className={`font-semibold ${item.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.amount > 0 ? '+' : ''}KSh{Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;