import { useState } from 'react';

const KenoGame = ({ betAmount, onGameResult, onBack }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [matches, setMatches] = useState(0);

  const maxSelections = 10;
  const totalNumbers = 80;

  const toggleNumber = (number) => {
    if (isDrawing || gameComplete) return;
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < maxSelections) {
      setSelectedNumbers(prev => [...prev, number]);
    }
  };

  const startDraw = () => {
    if (selectedNumbers.length === 0) return;
    
    setIsDrawing(true);
    setDrawnNumbers([]);
    setGameComplete(false);
    setMatches(0);
    
    const drawn = [];
    while (drawn.length < 20) {
      const num = Math.floor(Math.random() * totalNumbers) + 1;
      if (!drawn.includes(num)) drawn.push(num);
    }
    
    // Animate drawing
    let currentIndex = 0;
    const drawInterval = setInterval(() => {
      if (currentIndex < drawn.length) {
        setDrawnNumbers(prev => [...prev, drawn[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(drawInterval);
        
        // Calculate matches
        const matchCount = selectedNumbers.filter(num => drawn.includes(num)).length;
        setMatches(matchCount);
        setIsDrawing(false);
        setGameComplete(true);
        
        // Calculate payout based on matches
        const payoutTable = {
          1: 0, 2: 0, 3: 1, 4: 2, 5: 5, 6: 10, 7: 25, 8: 50, 9: 100, 10: 500
        };
        
        const multiplier = payoutTable[matchCount] || 0;
        const win = multiplier > 0;
        const winAmount = win ? betAmount * multiplier : -betAmount;
        
        setTimeout(() => {
          onGameResult('Keno', win, winAmount, `${matchCount} matches!`);
        }, 2000);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-indigo-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🔢 Keno</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Number Selection */}
            <div>
              <h3 className="text-white font-semibold mb-4">
                Select up to {maxSelections} numbers ({selectedNumbers.length}/{maxSelections})
              </h3>
              
              <div className="grid grid-cols-8 gap-2 mb-6">
                {Array.from({length: totalNumbers}, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => toggleNumber(number)}
                    disabled={isDrawing}
                    className={`aspect-square rounded text-sm font-bold transition-all ${
                      selectedNumbers.includes(number)
                        ? 'bg-blue-600 text-white'
                        : drawnNumbers.includes(number)
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white/20 text-gray-300 hover:bg-white/30'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                onClick={startDraw}
                disabled={isDrawing || selectedNumbers.length === 0}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isDrawing ? 'Drawing...' : `Draw Numbers (KSh${betAmount.toLocaleString()})`}
              </button>
            </div>

            {/* Results */}
            <div>
              <h3 className="text-white font-semibold mb-4">
                Drawn Numbers ({drawnNumbers.length}/20)
              </h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {drawnNumbers.map((number, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded flex items-center justify-center text-sm font-bold ${
                      selectedNumbers.includes(number)
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {number}
                  </div>
                ))}
              </div>
              
              {gameComplete && (
                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-4">
                  <p className="text-indigo-200 font-semibold text-center">
                    {matches > 2 ? '🎉' : '😔'} {matches} matches!
                  </p>
                  {matches > 2 && (
                    <p className="text-green-300 text-center mt-2">
                      Win: KSh{(betAmount * (matches <= 10 ? [0,0,0,1,2,5,10,25,50,100,500][matches] : 0)).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payout Table */}
          <div className="mt-6 bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-4">
            <h4 className="text-indigo-300 font-semibold mb-2">Payout Table:</h4>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="text-white">3 matches: 1x</div>
              <div className="text-white">4 matches: 2x</div>
              <div className="text-white">5 matches: 5x</div>
              <div className="text-white">6 matches: 10x</div>
              <div className="text-white">7+ matches: 25x+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KenoGame;