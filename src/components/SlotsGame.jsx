import { useState } from 'react';

const SlotsGame = ({ betAmount, onGameResult, onBack }) => {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const symbols = ['🍒', '🍋', '⭐', '💎', '🔔', '🍇', '🍊'];

  const spinReels = () => {
    setIsSpinning(true);
    setGameComplete(false);
    
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      spinCount++;
      
      if (spinCount >= 20) {
        clearInterval(spinInterval);
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setReels(finalReels);
        setIsSpinning(false);
        setGameComplete(true);
        
        const win = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
        const winAmount = win ? betAmount * 5 : -betAmount;
        onGameResult('Slots', win, winAmount, `${finalReels.join(' ')}!`);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-yellow-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">🎰 Slot Machine</h2>
          
          {/* Instructions */}
          <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">📋 How to Play:</h3>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• Pull the lever to spin 3 reels</li>
              <li>• Match 3 symbols to win</li>
              <li>• 🍒🍒🍒 = 10x payout</li>
              <li>• 🔔🔔🔔 = 5x payout</li>
              <li>• 🍋🍋🍋 = 3x payout</li>
            </ul>
          </div>
          
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <div className="flex justify-center gap-4 mb-4">
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className={`text-6xl bg-white/20 rounded-lg p-4 ${
                    isSpinning ? 'animate-bounce' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {symbol}
                </div>
              ))}
            </div>
            <p className="text-gray-300">Match 3 symbols to win!</p>
          </div>

          <p className="text-white font-semibold mb-4">Bet: ${betAmount} | Win: ${betAmount * 5}</p>

          <button
            onClick={spinReels}
            disabled={isSpinning}
            className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Spin Reels'}
          </button>

          {gameComplete && (
            <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-200">
                {reels[0] === reels[1] && reels[1] === reels[2] ? '🎉 JACKPOT!' : '😔 Try Again!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotsGame;