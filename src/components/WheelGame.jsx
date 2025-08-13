import { useState } from 'react';

const WheelGame = ({ betAmount, onGameResult, onBack }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const segments = [
    { label: '0.1x', multiplier: 0.1, color: 'bg-red-600' },
    { label: '2x', multiplier: 2, color: 'bg-green-600' },
    { label: '0.5x', multiplier: 0.5, color: 'bg-yellow-600' },
    { label: '5x', multiplier: 5, color: 'bg-purple-600' },
    { label: '0.2x', multiplier: 0.2, color: 'bg-red-600' },
    { label: '3x', multiplier: 3, color: 'bg-blue-600' },
    { label: '0.1x', multiplier: 0.1, color: 'bg-red-600' },
    { label: '10x', multiplier: 10, color: 'bg-pink-600' }
  ];

  const spinWheel = () => {
    setIsSpinning(true);
    setResult(null);
    
    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + (spins * 360) + Math.random() * 360;
    setRotation(finalRotation);
    
    setTimeout(() => {
      const segmentAngle = 360 / segments.length;
      const normalizedRotation = finalRotation % 360;
      const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length;
      const selectedSegment = segments[segmentIndex];
      
      setResult(selectedSegment);
      setIsSpinning(false);
      
      const win = selectedSegment.multiplier >= 1;
      const winAmount = win ? betAmount * selectedSegment.multiplier : -betAmount;
      
      setTimeout(() => {
        onGameResult('Wheel Spin', win, winAmount, `${selectedSegment.label} segment!`);
      }, 1000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-indigo-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎡 Wheel Spin</h2>
          
          <div className="relative flex justify-center mb-8">
            {/* Wheel */}
            <div className="relative">
              <div
                className={`w-64 h-64 rounded-full border-4 border-white transition-transform duration-3000 ease-out ${
                  isSpinning ? 'animate-spin' : ''
                }`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${segment.color} opacity-80`}
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos((index * 45 - 22.5) * Math.PI / 180)}% ${50 + 40 * Math.sin((index * 45 - 22.5) * Math.PI / 180)}%, ${50 + 40 * Math.cos(((index + 1) * 45 - 22.5) * Math.PI / 180)}% ${50 + 40 * Math.sin(((index + 1) * 45 - 22.5) * Math.PI / 180)}%)`
                    }}
                  >
                    <div
                      className="absolute text-white font-bold text-sm"
                      style={{
                        top: '30%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${index * 45}deg)`
                      }}
                    >
                      {segment.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white mb-4">Bet: KSh{betAmount.toLocaleString()}</p>
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSpinning ? 'Spinning...' : 'Spin Wheel'}
            </button>
            
            {result && (
              <div className="mt-4 p-4 bg-indigo-600/20 border border-indigo-400/30 rounded-lg">
                <p className="text-indigo-200 font-semibold">
                  {result.multiplier >= 1 ? '🎉 Win!' : '😔 Loss'} - {result.label}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-indigo-600/20 border border-indigo-400/30 rounded-lg p-4">
            <h4 className="text-indigo-300 font-semibold mb-2">Multipliers:</h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {segments.map((seg, i) => (
                <div key={i} className={`${seg.color} text-white p-2 rounded text-center`}>
                  {seg.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelGame;