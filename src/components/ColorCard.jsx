import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Target, ArrowRight } from 'lucide-react';
import { hsbToHslString, calculateScore, getContrastColor } from '../utils/colorUtils';
import HSBSliders from './HSBSliders';
import CountUpScore from './CountUpScore';
import { GAME_STATES } from '../hooks/useGameLoop';
import { COLOR_FACTS, getFeedbackForScore } from '../utils/gameContent';
import { Play } from 'lucide-react';
import { playPop } from '../utils/audio';
import './ColorCard.css';

const ColorCard = ({
  gameState,
  round,
  maxRounds,
  targetColor,
  guessColor,
  memoryTimeLeft,
  onGuessChange,
  onSubmit,
  onStartGame,
  latestHistory
}) => {
  const cardRef = useRef(null);
  const memIntRef = useRef(null);
  const slidersRef = useRef(null);
  const [readyText, setReadyText] = useState('Ready');
  const [lastMemInt, setLastMemInt] = useState(5);
  const [activeParam, setActiveParam] = useState(null);
  const [currentFact] = useState(() => COLOR_FACTS[Math.floor(Math.random() * COLOR_FACTS.length)]);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const prevGameState = useRef(gameState);
  
  // Audio is now pre-initialized in utils/audio for instant performance

  // Animate on state transition
  useEffect(() => {
    if (gameState === GAME_STATES.READY) {
      setReadyText('Ready');
      const t1 = setTimeout(() => setReadyText('Set'), 800);
      const t2 = setTimeout(() => setReadyText('Go'), 1600);

      // Reset feedback states for the new round
      setFeedback('');
      setShowFeedback(false);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (gameState === GAME_STATES.GUESS) {
      // Entry animation for sliders
      if (slidersRef.current) {
        gsap.fromTo(slidersRef.current, 
          { x: -40, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    } else if (gameState === GAME_STATES.RESULT) {
      // Get feedback message but don't show yet
      const score = latestHistory ? latestHistory.score : 0;
      setFeedback(getFeedbackForScore(score));

      // Smooth 3D snap for result reveal
      gsap.fromTo(cardRef.current,
        { rotationX: -10, scale: 0.98 },
        { rotationX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" }
      );
    }

    prevGameState.current = gameState;
  }, [gameState, latestHistory]);

  // Handle the slot-machine fall effect for the countdown integer
  useEffect(() => {
    if (gameState === GAME_STATES.MEMORY) {
      const currentInt = Math.floor(memoryTimeLeft);
      if (currentInt !== lastMemInt && currentInt >= 0) {
        setLastMemInt(currentInt);
        if (memIntRef.current) {
          // Slide down mechanically when the integer drops
          gsap.fromTo(memIntRef.current, 
            { y: -30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.25, ease: "power2.out", overwrite: true }
          );
        }
      }
    }
  }, [memoryTimeLeft, gameState, lastMemInt]);

  const targetCSS = hsbToHslString(targetColor.h, targetColor.s, targetColor.b);
  const guessCSS = hsbToHslString(guessColor.h, guessColor.s, guessColor.b);

  const renderContent = () => {
    switch (gameState) {
      case GAME_STATES.MENU: {
        return (
          <div className="card-menu">
            <div className="menu-top-left">
              <h1 className="menu-title-text">Color</h1>
              <p className="menu-fact-text">{currentFact}</p>
            </div>
            <div className="menu-bottom-center">
              <button 
                className="play-btn-main" 
                onClick={() => {
                  playPop();
                  onStartGame();
                }}
              >
                <Play size={40} fill="currentColor" />
              </button>
            </div>
          </div>
        );
      }

      case GAME_STATES.READY: {
        const isGo = readyText === 'Go';
        const readyBg = isGo ? targetCSS : '#000';
        const readyColor = isGo ? getContrastColor(targetColor.h, targetColor.s, targetColor.b) : '#fff';
        
        return (
          <div className="card-full" style={{ backgroundColor: readyBg, transition: 'background-color 0.15s ease' }}>
            <div className="top-right-overlay">
              <h2 key={readyText} className="countdown-decimal countdown-ready" style={{ color: readyColor }}>{readyText}</h2>
            </div>
          </div>
        );
      }

      case GAME_STATES.MEMORY: {
        const textColor = getContrastColor(targetColor.h, targetColor.s, targetColor.b);
        const timeString = memoryTimeLeft.toFixed(2);
        const [intPart, decPart] = timeString.split('.');
        
        return (
          <div className="card-full" style={{ backgroundColor: targetCSS }}>
            <div className="top-right-overlay">
              <h2 className="countdown-decimal" style={{ color: textColor, display: 'flex' }}>
                <span ref={memIntRef} style={{ display: 'inline-block' }}>{intPart}</span>
                <span style={{ opacity: 0.6 }}>.{decPart}</span>
              </h2>
            </div>
          </div>
        );
      }

      case GAME_STATES.GUESS: {
        const guessTextColor = getContrastColor(guessColor.h, guessColor.s, guessColor.b);
        return (
          <div className="card-full guess-layout" style={{ backgroundColor: guessCSS }}>
            <div className="sliders-section" ref={slidersRef}>
              <HSBSliders 
                color={guessColor} 
                onChange={onGuessChange} 
                onInteractStart={setActiveParam}
                onInteractEnd={() => setActiveParam(null)}
              />
            </div>
            <div className="info-section">
              <div className="top-row right">
                <span className="round-indicator" style={{ color: guessTextColor }}>{round} / {maxRounds}</span>
              </div>
              <div className="bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                <div style={{ color: guessTextColor, fontWeight: '700', fontSize: '1.2rem', textTransform: 'uppercase', opacity: activeParam ? 1 : 0, transition: 'opacity 0.2s', letterSpacing: '1px' }}>
                  {activeParam || 'HUE'}
                </div>
                <button className="submit-btn" onClick={onSubmit} aria-label="Submit Guess">
                  <Target size={24} />
                </button>
              </div>
            </div>
          </div>
        );
      }

      case GAME_STATES.RESULT: {
        const score = latestHistory ? latestHistory.score : 0;
        const guessContrast = getContrastColor(guessColor.h, guessColor.s, guessColor.b);
        const targetContrast = getContrastColor(targetColor.h, targetColor.s, targetColor.b);

        return (
          <div className="card-split">
            <div className="split-top" style={{ backgroundColor: guessCSS }}>
              <div className="split-top-content">
                <span className="round-indicator-dark" style={{ color: guessContrast }}>{round} / {maxRounds}</span>
                <div className="score-display">
                  <CountUpScore score={score} color={guessContrast} onComplete={() => setShowFeedback(true)} />
                </div>
                {showFeedback && (
                  <div className="feedback-message-container">
                    <p className="feedback-text" style={{ color: guessContrast }}>{feedback}</p>
                  </div>
                )}
                <div className="color-info">
                  <span className="info-label" style={{ color: guessContrast, opacity: 0.7 }}>Your selection</span>
                  <span className="info-val" style={{ color: guessContrast }}>H{guessColor.h} S{guessColor.s} B{guessColor.b}</span>
                </div>
              </div>
            </div>
            <div className="split-bottom" style={{ backgroundColor: targetCSS }}>
              <div className="split-bottom-content">
                <div className="color-info bottom-info">
                  <span className="info-label" style={{ color: targetContrast, opacity: 0.7 }}>Original</span>
                  <span className="info-val" style={{ color: targetContrast }}>H{targetColor.h} S{targetColor.s} B{targetColor.b}</span>
                </div>
                <button className="next-btn" onClick={onSubmit}>
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      default:
        return null;
    }
  };

  return (
    <div className="color-card" ref={cardRef}>
      {renderContent()}
    </div>
  );
};

export default ColorCard;
