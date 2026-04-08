import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import { playPop } from '../utils/audio';
import { hsbToHslString } from '../utils/colorUtils';
import './SummaryScreen.css';

const SummaryScreen = ({ history, onPlayAgain }) => {
  const containerRef = useRef(null);

  const totalScore = history.reduce((sum, r) => sum + r.score, 0);

  useEffect(() => {
    // Animate the cards staggering in
    gsap.fromTo(".summary-card", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
    );
    
    gsap.fromTo(".total-score-text",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: 0.6, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  return (
    <div className="color-card summary-container" ref={containerRef}>
      <h1 className="summary-title">Final Score</h1>
      
      <div className="cards-grid">
        {history.map((round, index) => {
          const targetCSS = hsbToHslString(round.target.h, round.target.s, round.target.b);
          const guessCSS = hsbToHslString(round.guess.h, round.guess.s, round.guess.b);
          
          return (
            <div key={index} className="summary-card">
              <div 
                className="summary-split"
                style={{
                  background: `linear-gradient(135deg, ${guessCSS} 50%, ${targetCSS} 50%)`
                }}
              />
              <div className="summary-card-score">{round.score.toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      <div className="total-score-container">
        <h2 className="total-score-text">{totalScore.toFixed(2)} <span className="max-score">/ {history.length * 10}</span></h2>
      </div>

      <button 
        className="play-again-btn" 
        onClick={() => {
          playPop();
          onPlayAgain();
        }}
      >
        <RotateCcw size={20} style={{ marginRight: '8px' }} /> Play Again
      </button>
    </div>
  );
};

export default SummaryScreen;
