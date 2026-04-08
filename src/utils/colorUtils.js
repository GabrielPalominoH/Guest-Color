/**
 * Converts HSB to an RGB string for CSS.
 * @param h Hue 0-360
 * @param s Saturation 0-100
 * @param b Brightness 0-100
 */
export const hsbToHslString = (h, s, b) => {
  // Convert HSB to HSL for native CSS support
  const l = (b / 100) * ( 1 - (s / 100) / 2 ) * 100;
  const sl = (l === 0 || l === 100) ? 0 : ((b / 100) - (l / 100)) / Math.min(l / 100, 1 - (l / 100)) * 100;
  return `hsl(${h}, ${sl}%, ${l}%)`;
};

export const hsbToRgb = (h, s, b) => {
  const sNorm = s / 100;
  const bNorm = b / 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => bNorm * (1 - sNorm * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

export const getContrastColor = (h, s, b) => {
  const [r, g, bVal] = hsbToRgb(h, s, b);
  const yiq = ((r * 299) + (g * 587) + (bVal * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

/**
 * Calculates a score from 0.0 to 10.0 based on how close the guess is to the target.
 * @param target {h, s, b}
 * @param guess {h, s, b}
 * @returns number
 */
export const calculateScore = (target, guess) => {
  // Normalize hue distance (shortest path around the cylinder)
  let hueDiff = Math.abs(target.h - guess.h);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  
  // Normalize all differences to a 0-1 scale
  const normHz = hueDiff / 180;
  const normS = Math.abs(target.s - guess.s) / 100;
  const normB = Math.abs(target.b - guess.b) / 100;

  // Weight the differences. Hue is often more perceptible but 
  // saturation and brightness matter too.
  const distance = Math.sqrt(
    Math.pow(normHz * 1.5, 2) + 
    Math.pow(normS, 2) + 
    Math.pow(normB, 2)
  );

  // Maximum possible distance in our weighted space is roughly 2.06
  // We map distance to a nice score curve.
  const maxExpectedDist = 2.0; 
  
  let scoreText;
  if (distance === 0) {
    return 10.0;
  }
  
  // Exponential decay or linear map depending on feeling
  let score = 10 * (1 - (distance / maxExpectedDist));
  
  // Ensure score stays in 0-10 range
  score = Math.max(0, Math.min(10, score));
  
  // Round to 2 decimal places
  return Number(score.toFixed(2));
};

export const generateRandomColor = () => ({
  h: Math.floor(Math.random() * 360),
  s: Math.floor(Math.random() * 80) + 20, // avoid too gray
  b: Math.floor(Math.random() * 80) + 20  // avoid too dark or too white
});
