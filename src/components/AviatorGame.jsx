import { useState, useEffect } from 'react';

const AviatorGame = ({ betAmount, onGameResult, onBack }) => {
  const [gameState, setGameState] = useState('betting'); // betting, flying, crashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(null);
  const [gameHistory, setGameHistory] = useState([2.34, 1.67, 5.23, 1.12, 3.45]);

  useEffect(() => {
    let interval;
    if (isFlying && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const newMultiplier = prev + (Math.random() * 0.1 + 0.01);
          
          // Random crash logic - higher multipliers have higher crash chance
          const crashChance = Math.min(0.02 + (newMultiplier - 1) * 0.01, 0.15);
          if (Math.random() < crashChance) {
            handleCrash(newMultiplier);
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isFlying, cashedOut]);

  const startFlight = () => {
    setGameState('flying');
    setIsFlying(true);
    setMultiplier(1.00);
    setCashedOut(false);
    setCrashPoint(null);
  };

  const cashOut = () => {
    if (!isFlying || cashedOut) return;
    
    setCashedOut(true);
    setIsFlying(false);
    
    const winAmount = betAmount * multiplier;
    const profit = winAmount - betAmount;
    
    setTimeout(() => {
      onGameResult('Aviator', true, profit, `Cashed out at ${multiplier.toFixed(2)}x!`);
      // Don't reset game automatically - let user choose to play again
    }, 1000);
  };

  const handleCrash = (crashMultiplier) => {
    setIsFlying(false);
    setCrashPoint(crashMultiplier);
    setGameState('crashed');
    
    // Add to history
    setGameHistory(prev => [crashMultiplier, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      if (!cashedOut) {
        onGameResult('Aviator', false, -betAmount, `Crashed at ${crashMultiplier.toFixed(2)}x!`);
      }
      // Don't reset game automatically - let user choose to play again
    }, 2000);
  };

  const resetGame = () => {
    setGameState('betting');
    setMultiplier(1.00);
    setIsFlying(false);
    setCashedOut(false);
    setCrashPoint(null);
  };

  const getPlanePosition = () => {
    const progress = Math.min((multiplier - 1) * 20, 80);
    return progress;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-blue-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">✈️ Aviator</h2>
          
          {/* Game Area */}
          <div className="relative bg-gradient-to-t from-blue-800 to-sky-400 rounded-lg h-64 mb-6 overflow-hidden">
            {/* Clouds */}
            <div className="absolute top-4 left-8 text-white/30 text-2xl">☁️</div>
            <div className="absolute top-12 right-12 text-white/30 text-xl">☁️</div>
            <div className="absolute top-20 left-1/3 text-white/30 text-lg">☁️</div>
            
            {/* Flight Path */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={`M 20 240 Q ${getPlanePosition() * 4} ${240 - getPlanePosition() * 2} ${getPlanePosition() * 5} ${200 - getPlanePosition() * 1.5}`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
            
            {/* Plane */}
            <div 
              className={`absolute transition-all duration-100 text-3xl ${
                gameState === 'crashed' ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${Math.min(getPlanePosition(), 85)}%`,
                bottom: `${Math.min(getPlanePosition() * 1.5, 75)}%`,
                transform: `rotate(${Math.min(getPlanePosition() * 0.5, 30)}deg)`
              }}
            >
              {gameState === 'crashed' ? '💥' : '✈️'}
            </div>
            
            {/* Multiplier Display */}
            <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-4 py-2">
              <div className={`text-3xl font-bold ${
                gameState === 'crashed' ? 'text-red-400' : 
                cashedOut ? 'text-green-400' : 'text-white'
              }`}>
                {multiplier.toFixed(2)}x
              </div>
            </div>
            
            {/* Game Status */}
            <div className="absolute top-4 right-4 bg-black/50 rounded-lg px-4 py-2">
              <div className={`font-semibold ${
                gameState === 'betting' ? 'text-yellow-400' :
                gameState === 'flying' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState === 'betting' ? 'WAITING...' :
                 gameState === 'flying' ? (cashedOut ? 'CASHED OUT!' : 'FLYING...') : 'CRASHED!'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            {gameState === 'betting' && (
              <button
                onClick={startFlight}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700"
              >
                🚀 Start Flight (KSh{betAmount.toLocaleString()})
              </button>
            )}
            
            {gameState === 'flying' && !cashedOut && (
              <button
                onClick={cashOut}
                className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 animate-pulse"
              >
                💰 Cash Out (KSh{(betAmount * multiplier).toLocaleString()})
              </button>
            )}
            
            {(gameState === 'crashed' || cashedOut) && (
              <button
                onClick={resetGame}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
              >
                🎮 Play Again
              </button>
            )}
          </div>

          {/* Game History */}
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Recent Flights:</h4>
            <div className="flex gap-2 flex-wrap">
              {gameHistory.map((crash, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    crash >= 2 ? 'bg-green-600/30 text-green-300' :
                    crash >= 1.5 ? 'bg-yellow-600/30 text-yellow-300' :
                    'bg-red-600/30 text-red-300'
                  }`}
                >
                  {crash.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="mt-4 bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
            <h4 className="text-purple-300 font-semibold mb-2">How to Play:</h4>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Watch the plane fly and multiplier increase</li>
              <li>• Cash out before it crashes to win</li>
              <li>• Higher multipliers = bigger wins but higher risk</li>
              <li>• If you don't cash out before crash, you lose</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviatorGame;