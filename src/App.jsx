import React, { useState, useEffect } from 'react';
import { useGameLoop, GAME_STATES } from './hooks/useGameLoop';
import ColorCard from './components/ColorCard';
import SummaryScreen from './components/SummaryScreen';
import { Sun, Moon } from 'lucide-react';
import './App.css';

function App() {
  const {
    gameState,
    round,
    targetColor,
    guessColor,
    setGuessColor,
    history,
    memoryTimeLeft,
    startGame,
    submitGuess,
    nextRound,
    MAX_ROUNDS
  } = useGameLoop();

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePlayAgain = () => {
    startGame();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="logo">ColorGuest V1.</h1>
      </header>

      <main className="app-main">
        {(gameState !== GAME_STATES.SUMMARY) && (
          <ColorCard
            gameState={gameState}
            round={round}
            maxRounds={MAX_ROUNDS}
            targetColor={targetColor}
            guessColor={guessColor}
            memoryTimeLeft={memoryTimeLeft}
            onGuessChange={setGuessColor}
            onSubmit={gameState === GAME_STATES.RESULT ? nextRound : submitGuess}
            onStartGame={startGame}
            latestHistory={history[history.length - 1]}
          />
        )}

        {gameState === GAME_STATES.SUMMARY && (
          <SummaryScreen history={history} onPlayAgain={handlePlayAgain} />
        )}
      </main>

      {!isMobile && (
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      )}
    </div>
  );
}

export default App;
