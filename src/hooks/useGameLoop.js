import { useState, useCallback } from 'react';
import { generateRandomColor, calculateScore } from '../utils/colorUtils';

export const GAME_STATES = {
  MENU: 'MENU',
  READY: 'READY',
  MEMORY: 'MEMORY',
  GUESS: 'GUESS',
  RESULT: 'RESULT',
  SUMMARY: 'SUMMARY'
};

const MAX_ROUNDS = 5;
const MEMORY_TIME = 5; // seconds

export const useGameLoop = () => {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [round, setRound] = useState(1);
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [guessColor, setGuessColor] = useState({ h: 180, s: 50, b: 50 });
  const [history, setHistory] = useState([]); // {target, guess, score}
  const [memoryTimeLeft, setMemoryTimeLeft] = useState(MEMORY_TIME);

  const startGame = useCallback(() => {
    setRound(1);
    setHistory([]);
    startRound();
  }, []);

  const startRound = useCallback(() => {
    setTargetColor(generateRandomColor());
    setGuessColor({ 
      h: Math.floor(Math.random() * 360), 
      s: Math.floor(Math.random() * 100), 
      b: Math.floor(Math.random() * 100) 
    });
    setGameState(GAME_STATES.READY);
    setMemoryTimeLeft(MEMORY_TIME); // useful if needed, though ColorCard handles decimals

    // READY phase (3 seconds: Ready... Set... Go!)
    setTimeout(() => {
      setGameState(GAME_STATES.MEMORY);
      
      // MEMORY phase with decimal precision using a faster interval
      const startTime = Date.now();
      const duration = MEMORY_TIME * 1000;
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const left = Math.max(0, (duration - elapsed) / 1000);
        setMemoryTimeLeft(left);
        
        if (left <= 0) {
          clearInterval(interval);
          setGameState(GAME_STATES.GUESS);
        }
      }, 10); // 10ms for smooth 2 decimal places display
    }, 2400); // 2.4 seconds for Ready, Set, Go

  }, []);

  const submitGuess = useCallback(() => {
    const score = calculateScore(targetColor, guessColor);
    setHistory(prev => [...prev, { target: targetColor, guess: guessColor, score }]);
    setGameState(GAME_STATES.RESULT);
  }, [targetColor, guessColor]);

  const nextRound = useCallback(() => {
    if (round >= MAX_ROUNDS) {
      setGameState(GAME_STATES.SUMMARY);
    } else {
      setRound(prev => prev + 1);
      startRound();
    }
  }, [round, startRound]);

  return {
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
  };
};
