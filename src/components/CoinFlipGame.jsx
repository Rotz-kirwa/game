import { useState } from 'react';

const CoinFlipGame = ({ betAmount, onGameResult, onBack }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState('heads');
  const [selectedSide, setSelectedSide] = useState('heads');
  const [gameComplete, setGameComplete] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    setGameComplete(false);
    
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinSide(result);
      setIsFlipping(false);
      setGameComplete(true);
      
      const win = result === selectedSide;
      const winAmount = win ? betAmount : -betAmount;
      onGameResult('Coin Flip', win, winAmount, `${result.charAt(0).toUpperCase() + result.slice(1)}!`);
      
      // Reset for next round after showing result
      setTimeout(() => {
        setGameComplete(false);
        setCoinSide('heads');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-green-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">🪙 Coin Flip</h2>
          
          {/* Instructions */}
          <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">📋 How to Play:</h3>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• Choose Heads (👑) or Tails (🪙)</li>
              <li>• Click "Flip Coin" to start</li>
              <li>• Win if coin lands on your choice</li>
              <li>• Winning pays 1x your bet (double money)</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className={`text-8xl mb-4 ${isFlipping ? 'animate-spin' : ''}`}>
              {coinSide === 'heads' ? '👑' : '🪙'}
            </div>
            <p className="text-white font-semibold">Choose your side:</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedSide('heads')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                selectedSide === 'heads' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white/20 text-gray-300'
              }`}
            >
              👑 Heads
            </button>
            <button
              onClick={() => setSelectedSide('tails')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                selectedSide === 'tails' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white/20 text-gray-300'
              }`}
            >
              🪙 Tails
            </button>
          </div>

          <p className="text-gray-300 mb-4">Bet: ${betAmount} | Win: ${betAmount}</p>

          <button
            onClick={flipCoin}
            disabled={isFlipping}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>

          {gameComplete && (
            <div className="mt-4 p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
              <p className="text-green-200">
                {coinSide === selectedSide ? '🎉 You Win!' : '😔 You Lose!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinFlipGame;