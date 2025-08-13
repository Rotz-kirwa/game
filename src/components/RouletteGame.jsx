import { useState } from 'react';

const RouletteGame = ({ betAmount, onGameResult, onBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [selectedBet, setSelectedBet] = useState('red');
  const [gameComplete, setGameComplete] = useState(false);

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const getNumberColor = (num) => {
    if (num === 0) return 'green';
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const spinWheel = () => {
    setIsSpinning(true);
    setGameComplete(false);
    
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 37));
      spinCount++;
      
      if (spinCount >= 30) {
        clearInterval(spinInterval);
        const finalNumber = Math.floor(Math.random() * 37);
        setCurrentNumber(finalNumber);
        setIsSpinning(false);
        setGameComplete(true);
        
        let win = false;
        let multiplier = 0;
        
        if (selectedBet === 'red' && redNumbers.includes(finalNumber)) {
          win = true;
          multiplier = 2;
        } else if (selectedBet === 'black' && blackNumbers.includes(finalNumber)) {
          win = true;
          multiplier = 2;
        } else if (selectedBet === 'even' && finalNumber > 0 && finalNumber % 2 === 0) {
          win = true;
          multiplier = 2;
        } else if (selectedBet === 'odd' && finalNumber % 2 === 1) {
          win = true;
          multiplier = 2;
        }
        
        const winAmount = win ? betAmount * multiplier : -betAmount;
        onGameResult('Roulette', win, winAmount, `Number ${finalNumber} (${getNumberColor(finalNumber)})!`);
      }
    }, 80);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-green-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-red-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">🎰 Roulette</h2>
          
          <div className="mb-6">
            <div className={`text-6xl mb-4 ${isSpinning ? 'animate-spin' : ''}`}>
              🎯
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              getNumberColor(currentNumber) === 'red' ? 'text-red-400' :
              getNumberColor(currentNumber) === 'black' ? 'text-gray-300' : 'text-green-400'
            }`}>
              {currentNumber}
            </div>
            <p className="text-gray-300 capitalize">{getNumberColor(currentNumber)}</p>
          </div>

          <div className="mb-6">
            <p className="text-white font-semibold mb-3">Choose your bet:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedBet('red')}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  selectedBet === 'red' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-600/30 text-red-300'
                }`}
              >
                Red (2x)
              </button>
              <button
                onClick={() => setSelectedBet('black')}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  selectedBet === 'black' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-800/30 text-gray-300'
                }`}
              >
                Black (2x)
              </button>
              <button
                onClick={() => setSelectedBet('even')}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  selectedBet === 'even' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600/30 text-blue-300'
                }`}
              >
                Even (2x)
              </button>
              <button
                onClick={() => setSelectedBet('odd')}
                className={`py-2 px-4 rounded-lg font-semibold ${
                  selectedBet === 'odd' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-600/30 text-purple-300'
                }`}
              >
                Odd (2x)
              </button>
            </div>
          </div>

          <p className="text-gray-300 mb-4">Bet: ${betAmount} | Win: ${betAmount * 2}</p>

          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Spin Wheel'}
          </button>

          {gameComplete && (
            <div className="mt-4 p-4 bg-red-600/20 border border-red-400/30 rounded-lg">
              <p className="text-red-200">
                {currentNumber === 0 ? '🏠 House Wins!' : 
                 (selectedBet === 'red' && redNumbers.includes(currentNumber)) ||
                 (selectedBet === 'black' && blackNumbers.includes(currentNumber)) ||
                 (selectedBet === 'even' && currentNumber > 0 && currentNumber % 2 === 0) ||
                 (selectedBet === 'odd' && currentNumber % 2 === 1) ? '🎉 You Win!' : '😔 You Lose!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouletteGame;