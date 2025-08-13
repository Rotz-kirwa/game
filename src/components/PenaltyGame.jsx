import { useState } from 'react';

const PenaltyGame = ({ betAmount, onGameResult, onBack }) => {
  const [gameState, setGameState] = useState('aiming'); // aiming, shooting, result
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [ballPosition, setBallPosition] = useState(null);
  const [goalieMove, setGoalieMove] = useState(null);
  const [shootResult, setShootResult] = useState(null);

  const shootingSpots = [
    { id: 'top-left', name: 'Top Left', odds: 5.0, winChance: 0.80, x: 20, y: 20 },
    { id: 'top-right', name: 'Top Right', odds: 5.0, winChance: 0.80, x: 80, y: 20 },
    { id: 'middle-left', name: 'Middle Left', odds: 3.0, winChance: 0.70, x: 20, y: 50 },
    { id: 'middle-right', name: 'Middle Right', odds: 3.0, winChance: 0.70, x: 80, y: 50 },
    { id: 'center', name: 'Center', odds: 1.5, winChance: 0.40, x: 50, y: 50 },
    { id: 'bottom-left', name: 'Bottom Left', odds: 2.5, winChance: 0.75, x: 20, y: 80 },
    { id: 'bottom-right', name: 'Bottom Right', odds: 2.5, winChance: 0.75, x: 80, y: 80 }
  ];

  const shoot = () => {
    if (!selectedSpot) return;
    
    const spot = shootingSpots.find(s => s.id === selectedSpot);
    setGameState('shooting');
    setBallPosition(spot);
    
    // Goalkeeper randomly moves to a position
    const goalieSpot = shootingSpots[Math.floor(Math.random() * shootingSpots.length)];
    setGoalieMove(goalieSpot);
    
    setTimeout(() => {
      const goal = Math.random() < spot.winChance;
      setShootResult(goal);
      setGameState('result');
      
      setTimeout(() => {
        const winAmount = goal ? betAmount * spot.odds : -betAmount;
        onGameResult('Penalty Kick', goal, winAmount, `Shot ${spot.name}!`);
        // Reset for next round after showing result
        setTimeout(() => {
          setGameState('aiming');
          setSelectedSpot(null);
          setBallPosition(null);
          setGoalieMove(null);
          setShootResult(null);
        }, 3000);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-blue-800 p-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-green-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">⚽ Penalty Kick</h2>
          
          {/* Football Field */}
          <div className="relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg h-80 mb-6 border-4 border-white overflow-hidden">
            
            {/* Goal Posts */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-32">
              {/* Goal frame */}
              <div className="absolute top-0 left-0 w-2 h-full bg-white"></div>
              <div className="absolute top-0 right-0 w-2 h-full bg-white"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-white"></div>
              
              {/* Net */}
              <div className="absolute inset-2 opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute w-full h-px bg-white" style={{top: `${i * 16.67}%`}}></div>
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute h-full w-px bg-white" style={{left: `${i * 12.5}%`}}></div>
                ))}
              </div>
            </div>

            {/* Goalkeeper */}
            <div 
              className={`absolute text-3xl transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 ${
                goalieMove ? '' : ''
              }`}
              style={{
                left: goalieMove ? `${40 + goalieMove.x * 0.2}%` : '50%',
                top: goalieMove ? `${15 + goalieMove.y * 0.15}%` : '25%'
              }}
            >
              🥅
            </div>

            {/* Odds around goalkeeper */}
            {gameState === 'aiming' && shootingSpots.map(spot => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 transition-all ${
                  selectedSpot === spot.id 
                    ? 'bg-yellow-400 border-yellow-600 scale-125' 
                    : 'bg-red-500/80 border-red-600 hover:bg-red-400'
                }`}
                style={{
                  left: `${40 + spot.x * 0.2}%`,
                  top: `${15 + spot.y * 0.15}%`
                }}
              >
                <div className="text-white text-xs font-bold">
                  {spot.odds}x
                </div>
              </button>
            ))}

            {/* Ball */}
            {ballPosition && (
              <div 
                className={`absolute text-2xl transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 ${
                  gameState === 'shooting' ? 'animate-bounce' : ''
                }`}
                style={{
                  left: `${40 + ballPosition.x * 0.2}%`,
                  top: `${15 + ballPosition.y * 0.15}%`
                }}
              >
                ⚽
              </div>
            )}

            {/* Player */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-4xl">
              🏃‍♂️
            </div>

            {/* Penalty spot */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
          </div>

          {/* Selected spot info */}
          {selectedSpot && gameState === 'aiming' && (
            <div className="mb-4 p-4 bg-yellow-600/20 border border-yellow-400/30 rounded-lg text-center">
              <p className="text-yellow-200 font-semibold">
                Aiming at {shootingSpots.find(s => s.id === selectedSpot)?.name} - 
                {shootingSpots.find(s => s.id === selectedSpot)?.odds}x odds
              </p>
              <p className="text-yellow-300 text-sm">
                Win: KSh{(betAmount * shootingSpots.find(s => s.id === selectedSpot)?.odds).toLocaleString()}
              </p>
            </div>
          )}

          {/* Game Controls */}
          {gameState === 'aiming' && (
            <div className="text-center">
              <p className="text-white mb-4">
                {selectedSpot ? 'Ready to shoot!' : 'Click on the odds around the goal to aim'}
              </p>
              <button
                onClick={shoot}
                disabled={!selectedSpot}
                className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                🦵 SHOOT!
              </button>
            </div>
          )}

          {gameState === 'shooting' && (
            <div className="text-center">
              <p className="text-yellow-300 font-semibold text-lg animate-pulse">
                Taking the shot...
              </p>
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center">
              <div className={`text-6xl mb-4 ${shootResult ? 'animate-bounce' : 'animate-pulse'}`}>
                {shootResult ? '⚽🥅' : '🥅✋'}
              </div>
              <p className={`font-bold text-xl ${shootResult ? 'text-green-300' : 'text-red-300'}`}>
                {shootResult ? '🎉 GOAL!' : '😤 SAVED!'}
              </p>
            </div>
          )}

          {/* Odds Guide */}
          <div className="mt-6 bg-green-600/20 border border-green-400/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">Shooting Guide:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-green-200">Top Corners: 5.0x (Hardest)</div>
              <div className="text-green-200">Side Corners: 2.5-3.0x (Medium)</div>
              <div className="text-green-200">Center: 1.5x (Easiest)</div>
              <div className="text-green-200">Bet: KSh{betAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyGame;