import { useState } from 'react';

const LottoGame = ({ betAmount, onGameResult, onBack }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [bonusNumber, setBonusNumber] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const maxSelections = 6;
  const maxNumber = 49;

  const toggleNumber = (number) => {
    if (isDrawing || gameComplete) return;
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < maxSelections) {
      setSelectedNumbers(prev => [...prev, number].sort((a, b) => a - b));
    }
  };

  const quickPick = () => {
    if (isDrawing || gameComplete) return;
    
    const numbers = [];
    while (numbers.length < maxSelections) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const startDraw = () => {
    if (selectedNumbers.length !== maxSelections) return;
    
    setIsDrawing(true);
    setWinningNumbers([]);
    setBonusNumber(null);
    setGameComplete(false);
    
    // Generate winning numbers
    const winning = [];
    while (winning.length < maxSelections) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!winning.includes(num)) winning.push(num);
    }
    
    // Generate bonus number
    let bonus;
    do {
      bonus = Math.floor(Math.random() * maxNumber) + 1;
    } while (winning.includes(bonus));
    
    // Animate drawing
    let currentIndex = 0;
    const drawInterval = setInterval(() => {
      if (currentIndex < winning.length) {
        setWinningNumbers(prev => [...prev, winning[currentIndex]]);
        currentIndex++;
      } else {
        setBonusNumber(bonus);
        clearInterval(drawInterval);
        
        // Calculate matches
        const matches = selectedNumbers.filter(num => winning.includes(num)).length;
        const hasBonus = selectedNumbers.includes(bonus);
        
        setIsDrawing(false);
        setGameComplete(true);
        
        // Calculate payout
        const payouts = {
          6: 1000, 5: 100, 4: 50, 3: 10, 2: 0
        };
        
        let multiplier = payouts[matches] || 0;
        if (matches === 5 && hasBonus) multiplier = 500; // 5 + bonus
        
        const win = multiplier > 0;
        const winAmount = win ? betAmount * multiplier : -betAmount;
        
        setTimeout(() => {
          onGameResult('Lotto', win, winAmount, `${matches} matches${hasBonus && matches === 5 ? ' + bonus' : ''}!`);
        }, 2000);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-800 to-red-900 p-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-yellow-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎟 Number Lotto</h2>
          
          <div className="text-center mb-6">
            <p className="text-white mb-2">Select {maxSelections} numbers from 1 to {maxNumber}</p>
            <p className="text-gray-300">Selected: {selectedNumbers.length}/{maxSelections}</p>
          </div>

          {/* Selected Numbers */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Your Numbers:</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {selectedNumbers.map(number => (
                <div key={number} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {number}
                </div>
              ))}
              {Array(maxSelections - selectedNumbers.length).fill(0).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center">
                  ?
                </div>
              ))}
            </div>
            
            <button
              onClick={quickPick}
              disabled={isDrawing}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
            >
              Quick Pick
            </button>
          </div>

          {/* Number Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({length: maxNumber}, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => toggleNumber(number)}
                disabled={isDrawing}
                className={`aspect-square rounded text-sm font-bold transition-all ${
                  selectedNumbers.includes(number)
                    ? 'bg-blue-600 text-white'
                    : winningNumbers.includes(number)
                    ? 'bg-green-600 text-white'
                    : number === bonusNumber
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          {/* Winning Numbers */}
          {winningNumbers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Winning Numbers:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {winningNumbers.map(number => (
                  <div key={number} className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {number}
                  </div>
                ))}
                {bonusNumber && (
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {bonusNumber}
                  </div>
                )}
              </div>
              {bonusNumber && (
                <p className="text-center text-purple-300 mt-2">Bonus: {bonusNumber}</p>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="text-center">
            <button
              onClick={startDraw}
              disabled={isDrawing || selectedNumbers.length !== maxSelections}
              className="bg-orange-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              {isDrawing ? 'Drawing...' : `Draw Numbers (KSh${betAmount.toLocaleString()})`}
            </button>
          </div>

          {/* Payout Table */}
          <div className="mt-6 bg-orange-600/20 border border-orange-400/30 rounded-lg p-4">
            <h4 className="text-orange-300 font-semibold mb-2">Prize Structure:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-white">6 matches: 1000x</div>
              <div className="text-white">5 + bonus: 500x</div>
              <div className="text-white">5 matches: 100x</div>
              <div className="text-white">4 matches: 50x</div>
              <div className="text-white">3 matches: 10x</div>
              <div className="text-gray-300">2 matches: No prize</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LottoGame;