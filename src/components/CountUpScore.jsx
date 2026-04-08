import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const CountUpScore = ({ score, color, onComplete }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: score,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayScore(proxy.val);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }, [score]);

  return <span className="score-number" style={{ color }}>{displayScore.toFixed(2)}</span>;
};

export default CountUpScore;
