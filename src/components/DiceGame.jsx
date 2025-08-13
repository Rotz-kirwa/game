import { useState } from 'react';

const DiceGame = ({ betAmount, onGameResult, onBack }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setGameComplete(false);
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        setGameComplete(true);
        
        const win = finalRoll >= 4;
        const winAmount = win ? betAmount * 2 : -betAmount;
        onGameResult('Dice Roll', win, winAmount, `Rolled ${finalRoll}!`);
        
        // Reset for next round after showing result
        setTimeout(() => {
          setGameComplete(false);
        }, 3000);
      }
    }, 100);
  };

  const getDiceDisplay = (value) => {
    const dots = {
      1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'
    };
    return dots[value];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-blue-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">🎲 Dice Roll</h2>
          
          <div className="mb-8">
            <div className={`text-8xl mb-4 transition-transform ${isRolling ? 'animate-spin' : ''}`}>
              {getDiceDisplay(diceValue)}
            </div>
            <p className="text-gray-300">Roll 4, 5, or 6 to win!</p>
            <p className="text-white font-semibold">Bet: ${betAmount} | Win: ${betAmount * 2}</p>
          </div>

          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>

          {gameComplete && (
            <div className="mt-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200">
                {diceValue >= 4 ? '🎉 You Win!' : '😔 You Lose!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceGame;