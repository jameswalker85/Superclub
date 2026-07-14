let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Highly realistic synthesized referee's whistle
 * Simulates a physical whistle with detuned beating, a vibrating pea (LFO FM), and blowing air noise.
 */
function createWhistleTone(ctx: AudioContext, time: number, duration: number): void {
  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    // LFO to simulate the "pea rattle" vibrato inside the chamber
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // Dual high-pitch core frequencies (creates physical beating interference)
    osc1.frequency.setValueAtTime(2280, time);
    osc2.frequency.setValueAtTime(2320, time);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(36, time); // 36Hz pea rattle
    lfoGain.gain.setValueAtTime(150, time);  // 150Hz vibrato depth

    // Connect LFO to modulate both oscillator frequencies
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Bandpass filter to concentrate the energy and simulate resonance chamber
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2300, time);
    filter.Q.setValueAtTime(3.5, time);

    // Generate white noise for the air blow friction sound
    const bufferSize = Math.max(256, Math.floor(ctx.sampleRate * duration));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, time); // Subtle, natural blowing sound

    // Main envelope generator (Attack, Sustain, Decay)
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, time);
    mainGain.gain.linearRampToValueAtTime(0.25, time + 0.04); // Fast attack
    mainGain.gain.setValueAtTime(0.25, time + duration - 0.08);
    mainGain.gain.exponentialRampToValueAtTime(0.001, time + duration); // Exponential decay

    // Interconnect nodes
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.gain.setValueAtTime(0.22, time);

    oscGain.connect(filter);
    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);

    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    // Begin playback
    lfo.start(time);
    osc1.start(time);
    osc2.start(time);
    noiseSource.start(time);

    // Terminate sound generators
    lfo.stop(time + duration);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
    noiseSource.stop(time + duration);
  } catch (e) {
    console.warn('Failed to play whistle sound:', e);
  }
}

/**
 * Plays a single long, sharp blast signalling kick-off
 */
export function playKickOffWhistle(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  // Doubled from 0.7 to 1.4 seconds
  createWhistleTone(ctx, now, 1.4);
}

/**
 * Plays the classic full-time whistle sequence: Short, Short, Long!
 * Doubled in duration and intervals.
 */
export function playFullTimeWhistle(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  
  // Three blasts: Short (0.36), Short (0.36), very Long (1.90)!
  // All timings (gaps and durations) doubled.
  createWhistleTone(ctx, now, 0.36);
  createWhistleTone(ctx, now + 0.70, 0.36);
  createWhistleTone(ctx, now + 1.40, 1.90);
}

function playNote(ctx: AudioContext, time: number, freq: number, dur: number): void {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.linearRampToValueAtTime(0, time + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
  } catch (e) {
    console.warn('Failed to play note:', e);
  }
}

/**
 * Plays a victory sound effect. Currently a silent placeholder.
 */
export function playVictorySound(): void {
  // Silent placeholder as requested.
}
