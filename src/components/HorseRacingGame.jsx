import { useState } from 'react';

const HorseRacingGame = ({ betAmount, onGameResult, onBack }) => {
  const [isRacing, setIsRacing] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [positions, setPositions] = useState([0, 0, 0, 0, 0]);
  const [winner, setWinner] = useState(null);

  const horses = [
    { id: 0, name: 'Thunder', odds: 2.5, emoji: '🐎' },
    { id: 1, name: 'Lightning', odds: 3.0, emoji: '🏇' },
    { id: 2, name: 'Storm', odds: 4.0, emoji: '🐴' },
    { id: 3, name: 'Blaze', odds: 5.0, emoji: '🦄' },
    { id: 4, name: 'Spirit', odds: 6.0, emoji: '🐎' }
  ];

  const startRace = () => {
    if (!selectedHorse) return;
    
    setIsRacing(true);
    setWinner(null);
    setPositions([0, 0, 0, 0, 0]);
    
    const raceInterval = setInterval(() => {
      setPositions(prev => {
        const newPositions = prev.map(pos => pos + Math.random() * 3);
        
        const maxPos = Math.max(...newPositions);
        if (maxPos >= 90) {
          clearInterval(raceInterval);
          const winnerIndex = newPositions.indexOf(maxPos);
          setWinner(winnerIndex);
          setIsRacing(false);
          
          setTimeout(() => {
            const win = winnerIndex === selectedHorse;
            const winAmount = win ? betAmount * horses[selectedHorse].odds : -betAmount;
            onGameResult('Horse Racing', win, winAmount, `${horses[winnerIndex].name} won!`);
          }, 2000);
        }
        
        return newPositions;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-brown-600 to-yellow-700 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-green-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🏇 Horse Racing</h2>
          
          {/* Race Track */}
          <div className="bg-green-600 rounded-lg p-4 mb-6">
            {horses.map((horse, index) => (
              <div key={index} className="relative mb-4 last:mb-0">
                <div className="bg-brown-400 h-8 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-brown-600 w-2"></div>
                  <div className="absolute right-0 top-0 h-full bg-red-600 w-2"></div>
                  
                  <div
                    className="absolute top-1 text-2xl transition-all duration-100"
                    style={{ left: `${positions[index]}%` }}
                  >
                    {horse.emoji}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white font-semibold">{horse.name}</span>
                  <span className="text-yellow-300">{horse.odds}x</span>
                </div>
              </div>
            ))}
          </div>

          {/* Horse Selection */}
          {!isRacing && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Select your horse:</h3>
              <div className="grid grid-cols-5 gap-2">
                {horses.map((horse) => (
                  <button
                    key={horse.id}
                    onClick={() => setSelectedHorse(horse.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedHorse === horse.id
                        ? 'bg-yellow-600 border-yellow-400 text-white'
                        : 'bg-white/20 border-white/30 text-gray-300 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{horse.emoji}</div>
                    <div className="text-sm font-semibold">{horse.name}</div>
                    <div className="text-xs">{horse.odds}x</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="text-center">
            {selectedHorse !== null && (
              <p className="text-white mb-4">
                Betting on {horses[selectedHorse].name} - Win: KSh{(betAmount * horses[selectedHorse].odds).toLocaleString()}
              </p>
            )}
            
            <button
              onClick={startRace}
              disabled={isRacing || selectedHorse === null}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {isRacing ? 'Racing...' : 'Start Race'}
            </button>
            
            {winner !== null && (
              <div className="mt-4 p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                <p className="text-green-200 font-semibold">
                  🏆 {horses[winner].name} wins! {winner === selectedHorse ? '🎉 You win!' : '😔 You lose!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorseRacingGame;