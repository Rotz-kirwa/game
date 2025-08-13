import { useState } from 'react';

const BlackjackGame = ({ betAmount, onGameResult, onBack }) => {
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState('betting'); // betting, playing, dealer, finished
  const [gameComplete, setGameComplete] = useState(false);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getCardValue = (card) => {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
  };

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    });
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const drawCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
  };

  const startGame = () => {
    const playerHand = [drawCard(), drawCard()];
    const dealerHand = [drawCard(), drawCard()];
    
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore(dealerHand));
    setGameState('playing');
    setGameComplete(false);
  };

  const hit = () => {
    const newCard = drawCard();
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      endGame(false, 'Player Bust!');
    }
  };

  const stand = () => {
    setGameState('dealer');
    let currentDealerCards = [...dealerCards];
    let currentDealerScore = dealerScore;
    
    while (currentDealerScore < 17) {
      const newCard = drawCard();
      currentDealerCards.push(newCard);
      currentDealerScore = calculateScore(currentDealerCards);
    }
    
    setDealerCards(currentDealerCards);
    setDealerScore(currentDealerScore);
    
    setTimeout(() => {
      if (currentDealerScore > 21) {
        endGame(true, 'Dealer Bust!');
      } else if (currentDealerScore > playerScore) {
        endGame(false, 'Dealer Wins!');
      } else if (playerScore > currentDealerScore) {
        endGame(true, 'Player Wins!');
      } else {
        endGame(false, 'Push!');
      }
    }, 1000);
  };

  const endGame = (win, message) => {
    const winAmount = win ? betAmount * 1.5 : -betAmount;
    setGameState('finished');
    setGameComplete(true);
    onGameResult('Blackjack', win, winAmount, message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-red-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-green-300">
          ← Back to Games
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🃏 Blackjack</h2>
          
          {gameState === 'betting' && (
            <div className="text-center">
              <p className="text-white mb-4">Bet: ${betAmount} | Win: ${betAmount * 1.5}</p>
              <button
                onClick={startGame}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700"
              >
                Deal Cards
              </button>
            </div>
          )}

          {gameState !== 'betting' && (
            <>
              {/* Dealer Cards */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Dealer ({dealerScore})</h3>
                <div className="flex gap-2 justify-center">
                  {dealerCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-2xl font-bold text-center min-w-[60px]">
                      {gameState === 'playing' && index === 1 ? '🂠' : `${card.value}${card.suit}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Cards */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Player ({playerScore})</h3>
                <div className="flex gap-2 justify-center">
                  {playerCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-2xl font-bold text-center min-w-[60px]">
                      {card.value}{card.suit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Controls */}
              {gameState === 'playing' && (
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={hit}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Hit
                  </button>
                  <button
                    onClick={stand}
                    className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700"
                  >
                    Stand
                  </button>
                </div>
              )}

              {gameState === 'dealer' && (
                <div className="text-center">
                  <p className="text-yellow-300 font-semibold">Dealer playing...</p>
                </div>
              )}

              {gameComplete && (
                <div className="mt-4 p-4 bg-green-600/20 border border-green-400/30 rounded-lg text-center">
                  <p className="text-green-200 font-semibold">Game Complete!</p>
                  <button
                    onClick={() => {
                      setGameState('betting');
                      setPlayerCards([]);
                      setDealerCards([]);
                      setGameComplete(false);
                    }}
                    className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;