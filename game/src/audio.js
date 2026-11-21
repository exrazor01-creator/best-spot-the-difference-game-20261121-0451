// Tiny synthesised sound effects with WebAudio: no audio files, no network.
// Every effect is a short oscillator phrase, so the game stays silent until
// the player's first click creates the audio context.
export class SoundEngine {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  /** Create (or resume) the context on a user gesture. */
  unlock() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') void this.context.resume();
  }

  tone(freq, startAt, duration, type, volume) {
    if (!this.context || this.muted) return;
    const now = this.context.currentTime + startAt;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /** A bright two-note ding when a difference is found. */
  playFound() {
    this.tone(880, 0, 0.16, 'sine', 0.22);
    this.tone(1318, 0.09, 0.22, 'sine', 0.2);
  }

  /** A low buzz for a wrong click. */
  playWrong() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.1);
    this.tone(120, 0.05, 0.18, 'sawtooth', 0.08);
  }

  /** A soft shimmer when a hint fires. */
  playHint() {
    this.tone(1046, 0, 0.12, 'triangle', 0.14);
    this.tone(1568, 0.08, 0.16, 'triangle', 0.12);
  }

  /** A little fanfare for finishing a scene. */
  playWin() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => this.tone(freq, i * 0.11, 0.22, 'triangle', 0.18));
  }

  /** A quiet click for buttons. */
  playClick() {
    this.tone(660, 0, 0.06, 'sine', 0.1);
  }
}
