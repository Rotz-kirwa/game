import { useState } from 'react';

const MinesGame = ({ betAmount, onGameResult, onBack }) => {
  const [gameState, setGameState] = useState('setup');
  const [mineCount, setMineCount] = useState(3);
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);

  const initializeGame = () => {
    const newBoard = Array(25).fill(false);
    const mines = [];
    
    while (mines.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!mines.includes(pos)) mines.push(pos);
    }
    
    mines.forEach(pos => newBoard[pos] = true);
    setBoard(newBoard);
    setRevealed(Array(25).fill(false));
    setGameState('playing');
    setGameOver(false);
    setMultiplier(1.0);
  };

  const revealTile = (index) => {
    if (revealed[index] || gameOver) return;
    
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    
    if (board[index]) {
      setGameOver(true);
      setGameState('lost');
      setTimeout(() => {
        onGameResult('Mines', false, -betAmount, 'Hit a mine!');
      }, 1000);
    } else {
      const safeCount = newRevealed.filter((r, i) => r && !board[i]).length;
      const newMultiplier = 1 + (safeCount * 0.3);
      setMultiplier(newMultiplier);
    }
  };

  const cashOut = () => {
    setGameState('won');
    const winAmount = betAmount * multiplier;
    const profit = winAmount - betAmount;
    setTimeout(() => {
      onGameResult('Mines', true, profit, `Cashed out at ${multiplier.toFixed(2)}x!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-red-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">💣 Mines</h2>
          
          {/* Instructions */}
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">📋 How to Play:</h3>
            <ul className="text-red-200 text-sm space-y-1">
              <li>• Choose number of mines (1-5)</li>
              <li>• Click tiles to reveal diamonds 💎</li>
              <li>• Avoid mines 💣 or you lose everything</li>
              <li>• Each safe tile increases your multiplier</li>
              <li>• Cash out anytime to secure your winnings</li>
            </ul>
          </div>
          
          {gameState === 'setup' && (
            <div className="text-center">
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Number of Mines:</label>
                <select
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  className="bg-black/30 text-white px-4 py-2 rounded border border-white/20"
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} mines</option>
                  ))}
                </select>
              </div>
              <button
                onClick={initializeGame}
                className="bg-red-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-700"
              >
                Start Game (KSh{betAmount.toLocaleString()})
              </button>
            </div>
          )}

          {gameState !== 'setup' && (
            <>
              <div className="mb-4 text-center">
                <p className="text-white font-semibold">
                  Multiplier: {multiplier.toFixed(2)}x | Potential Win: KSh{(betAmount * multiplier).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array(25).fill(0).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => revealTile(index)}
                    disabled={revealed[index] || gameOver}
                    className={`aspect-square rounded-lg font-bold text-lg transition-all ${
                      revealed[index]
                        ? board[index]
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    {revealed[index] ? (board[index] ? '💣' : '💎') : '?'}
                  </button>
                ))}
              </div>

              {gameState === 'playing' && multiplier > 1 && (
                <div className="text-center">
                  <button
                    onClick={cashOut}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700"
                  >
                    Cash Out (KSh{(betAmount * multiplier).toLocaleString()})
                  </button>
                </div>
              )}

              {gameState === 'lost' && (
                <div className="text-center">
                  <p className="text-red-400 font-bold text-xl mb-4">💥 BOOM! You hit a mine!</p>
                  <button
                    onClick={() => setGameState('setup')}
                    className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
                  >
                    Play Again
                  </button>
                </div>
              )}

              {gameState === 'won' && (
                <div className="text-center">
                  <p className="text-green-400 font-bold text-xl mb-4">🎉 Cashed Out Successfully!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinesGame;