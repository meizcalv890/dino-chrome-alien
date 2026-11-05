export class AudioManager {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.context = null;
    this.master = null;
    this.musicNodes = [];
    this.musicTimer = null;
    this.noteIndex = 0;

    this.notes = [55, 65.41, 73.42, 82.41, 73.42, 65.41, 49, 58.27];
  }

  async initialize() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!this.context) {
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = this.enabled ? 0.35 : 0;
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;

    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(
        enabled ? 0.35 : 0,
        this.context.currentTime,
        0.04,
      );
    }
  }

  playTone(frequency, duration, type = "sine", volume = 0.12) {
    if (!this.enabled || !this.context || !this.master) return;

    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gain);
    gain.connect(this.master);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  jump() {
    this.playTone(420, 0.12, "square", 0.07);
    this.playTone(620, 0.1, "sine", 0.04);
  }

  collision() {
    this.playTone(150, 0.35, "sawtooth", 0.14);
    this.playTone(90, 0.45, "triangle", 0.1);
  }

  score() {
    this.playTone(760, 0.08, "sine", 0.045);
  }

  startMusic() {
    if (!this.enabled || !this.context || this.musicTimer) return;

    const playNote = () => {
      if (!this.enabled || !this.context) return;

      const base = this.notes[this.noteIndex % this.notes.length];
      this.noteIndex++;

      this.playTone(base, 0.8, "sine", 0.035);
      this.playTone(base * 2, 0.45, "triangle", 0.012);
    };

    playNote();
    this.musicTimer = window.setInterval(playNote, 850);
  }

  stopMusic() {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  destroy() {
    this.stopMusic();

    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}
