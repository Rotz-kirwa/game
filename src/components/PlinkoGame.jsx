import { useState } from 'react';

const PlinkoGame = ({ betAmount, onGameResult, onBack }) => {
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [finalMultiplier, setFinalMultiplier] = useState(null);

  const multipliers = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 3.0, 2.0, 1.5, 1.0, 0.5, 0.2];

  const dropBall = () => {
    setIsDropping(true);
    setFinalMultiplier(null);
    
    let currentX = 50;
    let currentY = 0;
    
    const dropInterval = setInterval(() => {
      currentY += 5;
      currentX += (Math.random() - 0.5) * 8;
      currentX = Math.max(5, Math.min(95, currentX));
      
      setBallPosition({ x: currentX, y: currentY });
      
      if (currentY >= 85) {
        clearInterval(dropInterval);
        const slotIndex = Math.floor((currentX / 100) * multipliers.length);
        const multiplier = multipliers[Math.max(0, Math.min(multipliers.length - 1, slotIndex))];
        setFinalMultiplier(multiplier);
        
        setTimeout(() => {
          const win = multiplier >= 1;
          const winAmount = win ? betAmount * multiplier : -betAmount;
          onGameResult('Plinko', win, winAmount, `${multiplier}x multiplier!`);
          setIsDropping(false);
        }, 1000);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-purple-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🟢 Plinko</h2>
          
          <div className="relative bg-gradient-to-b from-blue-800 to-purple-800 rounded-lg h-96 mb-6 overflow-hidden">
            {/* Pegs */}
            {[...Array(8)].map((_, row) => 
              [...Array(row + 3)].map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + (col * (60 / (row + 2)))}%`,
                    top: `${15 + row * 8}%`
                  }}
                />
              ))
            )}
            
            {/* Ball */}
            {isDropping && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full transition-all duration-100"
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
            
            {/* Multiplier slots */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              {multipliers.map((mult, index) => (
                <div
                  key={index}
                  className={`flex-1 h-12 border border-white/30 flex items-center justify-center text-white font-bold text-sm ${
                    mult >= 2 ? 'bg-green-600/50' : mult >= 1 ? 'bg-yellow-600/50' : 'bg-red-600/50'
                  }`}
                >
                  {mult}x
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-white mb-4">Bet: KSh{betAmount.toLocaleString()}</p>
            <button
              onClick={dropBall}
              disabled={isDropping}
              className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {isDropping ? 'Dropping...' : 'Drop Ball'}
            </button>
            
            {finalMultiplier && (
              <div className="mt-4 p-4 bg-purple-600/20 border border-purple-400/30 rounded-lg">
                <p className="text-purple-200 font-semibold">
                  {finalMultiplier >= 1 ? '🎉 Win!' : '😔 Loss'} - {finalMultiplier}x
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlinkoGame;