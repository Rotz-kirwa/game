import { useState } from 'react';

const ScratchCardGame = ({ betAmount, onGameResult, onBack }) => {
  const [scratched, setScratched] = useState(Array(9).fill(false));
  const [prizes, setPrizes] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalWin, setTotalWin] = useState(0);

  const initializeCard = () => {
    const newPrizes = [];
    const prizeValues = [0, 0, 0, 0, 0, 0.5, 1, 2, 5]; // Most are losses, few wins
    
    // Shuffle prizes
    for (let i = prizeValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [prizeValues[i], prizeValues[j]] = [prizeValues[j], prizeValues[i]];
    }
    
    setPrizes(prizeValues);
    setScratched(Array(9).fill(false));
    setGameComplete(false);
    setTotalWin(0);
  };

  const scratchTile = (index) => {
    if (scratched[index] || gameComplete) return;
    
    const newScratched = [...scratched];
    newScratched[index] = true;
    setScratched(newScratched);
    
    const scratchedCount = newScratched.filter(Boolean).length;
    
    if (scratchedCount >= 3) {
      // Calculate total win
      const win = newScratched.reduce((total, isScratched, i) => {
        return total + (isScratched ? prizes[i] * betAmount : 0);
      }, 0);
      
      setTotalWin(win);
      setGameComplete(true);
      
      setTimeout(() => {
        const profit = win - betAmount;
        onGameResult('Scratch Card', win > betAmount, profit, `Won KSh${win.toLocaleString()}!`);
      }, 1000);
    }
  };

  useState(() => {
    initializeCard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-purple-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎟 Scratch Card</h2>
          
          <div className="text-center mb-6">
            <p className="text-white">Scratch 3 or more tiles to reveal your prize!</p>
            <p className="text-gray-300">Cost: KSh{betAmount.toLocaleString()}</p>
          </div>

          {/* Scratch Card Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
            {Array(9).fill(0).map((_, index) => (
              <button
                key={index}
                onClick={() => scratchTile(index)}
                disabled={scratched[index] || gameComplete}
                className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                  scratched[index]
                    ? prizes[index] > 0
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-white'
                    : 'bg-gradient-to-br from-silver-400 to-silver-600 text-silver-800 hover:from-silver-300 hover:to-silver-500'
                }`}
              >
                {scratched[index] 
                  ? prizes[index] > 0 
                    ? `${prizes[index]}x` 
                    : '❌'
                  : '?'
                }
              </button>
            ))}
          </div>

          {/* Game Status */}
          {gameComplete && (
            <div className="text-center">
              <div className={`p-4 rounded-lg mb-4 ${
                totalWin > betAmount 
                  ? 'bg-green-600/20 border border-green-400/30' 
                  : 'bg-red-600/20 border border-red-400/30'
              }`}>
                <p className={`font-bold text-xl ${
                  totalWin > betAmount ? 'text-green-300' : 'text-red-300'
                }`}>
                  {totalWin > betAmount ? '🎉 You Win!' : '😔 Better luck next time!'}
                </p>
                <p className="text-white mt-2">
                  Total Prize: KSh{totalWin.toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={initializeCard}
                className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700"
              >
                New Card (KSh{betAmount.toLocaleString()})
              </button>
            </div>
          )}

          {!gameComplete && (
            <div className="text-center">
              <p className="text-gray-300">
                Scratched: {scratched.filter(Boolean).length}/9
              </p>
            </div>
          )}

          {/* Prize Table */}
          <div className="mt-6 bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
            <h4 className="text-purple-300 font-semibold mb-2">Prize Multipliers:</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-green-300">5x - KSh{(betAmount * 5).toLocaleString()}</div>
              <div className="text-blue-300">2x - KSh{(betAmount * 2).toLocaleString()}</div>
              <div className="text-yellow-300">1x - KSh{betAmount.toLocaleString()}</div>
              <div className="text-gray-300">0.5x - KSh{(betAmount * 0.5).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchCardGame;