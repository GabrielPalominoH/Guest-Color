let audioContext = null;

/**
 * Initializes the AudioContext on first use.
 * Browsers require a user gesture to start audio.
 */
const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

/**
 * Procedural "Pop" Sound Generator
 * Generates a short frequency-modulated sine wave.
 * Zero-latency and zero-dependency.
 */
export const playPop = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;

    // Create components
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Configure Oscillator (Sine wave for a smooth pop)
    osc.type = 'sine';
    
    // Frequency Sweep: Starts high and drops quickly
    // This creates the "pop" / "bubble" characteristic
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    // Amplitude Envelope: Sharp attack, fast decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); // Fast decay

    // Connections
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Lifecycle
    osc.start(now);
    osc.stop(now + 0.15);

    // Cleanup: Disconnect after sound finishes
    setTimeout(() => {
      osc.disconnect();
      gain.disconnect();
    }, 200);

  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};
