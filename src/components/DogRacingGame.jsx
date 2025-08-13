import { useState } from 'react';

const DogRacingGame = ({ betAmount, onGameResult, onBack }) => {
  const [isRacing, setIsRacing] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [positions, setPositions] = useState([0, 0, 0, 0, 0]);
  const [winner, setWinner] = useState(null);

  const dogs = [
    { id: 0, name: 'Bolt', odds: 2.2, emoji: '🐕' },
    { id: 1, name: 'Flash', odds: 2.8, emoji: '🦮' },
    { id: 2, name: 'Rocket', odds: 3.5, emoji: '🐶' },
    { id: 3, name: 'Speedy', odds: 4.2, emoji: '🐕‍🦺' },
    { id: 4, name: 'Dash', odds: 5.5, emoji: '🐩' }
  ];

  const startRace = () => {
    if (!selectedDog) return;
    
    setIsRacing(true);
    setWinner(null);
    setPositions([0, 0, 0, 0, 0]);
    
    const raceInterval = setInterval(() => {
      setPositions(prev => {
        const newPositions = prev.map(pos => pos + Math.random() * 4);
        
        const maxPos = Math.max(...newPositions);
        if (maxPos >= 90) {
          clearInterval(raceInterval);
          const winnerIndex = newPositions.indexOf(maxPos);
          setWinner(winnerIndex);
          setIsRacing(false);
          
          setTimeout(() => {
            const win = winnerIndex === selectedDog;
            const winAmount = win ? betAmount * dogs[selectedDog].odds : -betAmount;
            onGameResult('Dog Racing', win, winAmount, `${dogs[winnerIndex].name} won!`);
          }, 2000);
        }
        
        return newPositions;
      });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-green-700 to-yellow-600 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-blue-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🐕 Dog Racing</h2>
          
          {/* Race Track */}
          <div className="bg-green-500 rounded-lg p-4 mb-6">
            {dogs.map((dog, index) => (
              <div key={index} className="relative mb-4 last:mb-0">
                <div className="bg-gray-400 h-8 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-gray-600 w-2"></div>
                  <div className="absolute right-0 top-0 h-full bg-red-600 w-2"></div>
                  
                  <div
                    className="absolute top-1 text-2xl transition-all duration-100"
                    style={{ left: `${positions[index]}%` }}
                  >
                    {dog.emoji}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white font-semibold">{dog.name}</span>
                  <span className="text-yellow-300">{dog.odds}x</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dog Selection */}
          {!isRacing && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Select your dog:</h3>
              <div className="grid grid-cols-5 gap-2">
                {dogs.map((dog) => (
                  <button
                    key={dog.id}
                    onClick={() => setSelectedDog(dog.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDog === dog.id
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-white/20 border-white/30 text-gray-300 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{dog.emoji}</div>
                    <div className="text-sm font-semibold">{dog.name}</div>
                    <div className="text-xs">{dog.odds}x</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="text-center">
            {selectedDog !== null && (
              <p className="text-white mb-4">
                Betting on {dogs[selectedDog].name} - Win: KSh{(betAmount * dogs[selectedDog].odds).toLocaleString()}
              </p>
            )}
            
            <button
              onClick={startRace}
              disabled={isRacing || selectedDog === null}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isRacing ? 'Racing...' : 'Start Race'}
            </button>
            
            {winner !== null && (
              <div className="mt-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                <p className="text-blue-200 font-semibold">
                  🏆 {dogs[winner].name} wins! {winner === selectedDog ? '🎉 You win!' : '😔 You lose!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogRacingGame;