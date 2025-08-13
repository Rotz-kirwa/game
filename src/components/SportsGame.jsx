import { useState } from 'react';

const SportsGame = ({ betAmount, onGameResult, onBack }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const matches = [
    {
      id: 1,
      sport: '⚽',
      team1: 'Manchester United',
      team2: 'Liverpool',
      odds1: 2.1,
      odds2: 1.8,
      status: 'Live'
    },
    {
      id: 2,
      sport: '🏀',
      team1: 'Lakers',
      team2: 'Warriors',
      odds1: 1.9,
      odds2: 2.0,
      status: 'Starting Soon'
    },
    {
      id: 3,
      sport: '🏈',
      team1: 'Patriots',
      team2: 'Cowboys',
      odds1: 2.3,
      odds2: 1.6,
      status: 'Tomorrow'
    },
    {
      id: 4,
      sport: '🎾',
      team1: 'Djokovic',
      team2: 'Nadal',
      odds1: 1.7,
      odds2: 2.2,
      status: 'Live'
    }
  ];

  const placeBet = () => {
    if (!selectedMatch || !selectedTeam) return;
    
    const match = matches.find(m => m.id === selectedMatch);
    const odds = selectedTeam === 'team1' ? match.odds1 : match.odds2;
    const teamName = selectedTeam === 'team1' ? match.team1 : match.team2;
    
    // Simulate match result (60% chance of winning)
    const win = Math.random() < 0.6;
    const winAmount = win ? betAmount * odds : -betAmount;
    
    setGameComplete(true);
    onGameResult('Sports Bet', win, winAmount, `${teamName} ${win ? 'Won!' : 'Lost!'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-green-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-orange-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">⚽ Sports Betting</h2>
          
          <div className="space-y-4 mb-6">
            {matches.map(match => (
              <div
                key={match.id}
                className={`bg-white/10 rounded-lg p-4 border cursor-pointer transition-all ${
                  selectedMatch === match.id 
                    ? 'border-orange-400 bg-orange-600/20' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                onClick={() => setSelectedMatch(match.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl">{match.sport}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    match.status === 'Live' ? 'bg-red-600 text-white' :
                    match.status === 'Starting Soon' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {match.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-white font-semibold">{match.team1}</div>
                    <div className="text-orange-300">Odds: {match.odds1}x</div>
                  </div>
                  
                  <div className="text-white font-bold mx-4">VS</div>
                  
                  <div className="flex-1 text-right">
                    <div className="text-white font-semibold">{match.team2}</div>
                    <div className="text-orange-300">Odds: {match.odds2}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMatch && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Choose your team:</h3>
              <div className="flex gap-4">
                {(() => {
                  const match = matches.find(m => m.id === selectedMatch);
                  return (
                    <>
                      <button
                        onClick={() => setSelectedTeam('team1')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                          selectedTeam === 'team1' 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-white/20 text-gray-300'
                        }`}
                      >
                        {match.team1}
                        <div className="text-sm">Win: ${(betAmount * match.odds1).toFixed(2)}</div>
                      </button>
                      <button
                        onClick={() => setSelectedTeam('team2')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                          selectedTeam === 'team2' 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-white/20 text-gray-300'
                        }`}
                      >
                        {match.team2}
                        <div className="text-sm">Win: ${(betAmount * match.odds2).toFixed(2)}</div>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-300 mb-4">Bet Amount: ${betAmount}</p>
            <button
              onClick={placeBet}
              disabled={!selectedMatch || !selectedTeam}
              className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Bet
            </button>
          </div>

          {gameComplete && (
            <div className="mt-4 p-4 bg-orange-600/20 border border-orange-400/30 rounded-lg text-center">
              <p className="text-orange-200 font-semibold">Bet Placed!</p>
              <button
                onClick={() => {
                  setSelectedMatch(null);
                  setSelectedTeam(null);
                  setGameComplete(false);
                }}
                className="mt-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
              >
                Place Another Bet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SportsGame;