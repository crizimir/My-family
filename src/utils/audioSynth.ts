/**
 * Web Audio Synthesizer for Cuares Family Sanctuary
 * Procedurally generates gentle acoustic, pop, and R&B melodic arrangements for:
 * 1. "Rock Bottom" - Hailee Steinfeld ft. DNCE
 * 2. "Best Part of Me" - Ed Sheeran ft. YEBBA
 * 3. "The Way" - Ariana Grande ft. Mac Miller
 */

class CozySynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private currentKey: string = 'rock-bottom';
  private masterGain: GainNode | null = null;
  private volume: number = 0.65;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public play(key: string) {
    this.initContext();
    this.currentKey = key;
    this.stopSequence();
    this.isPlaying = true;
    this.startSequence();
  }

  public stop() {
    this.isPlaying = false;
    this.stopSequence();
  }

  private stopSequence() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private playTone(
    freq: number,
    duration: number = 2.2,
    type: OscillatorType = 'sine',
    detune: number = 0,
    volumeMul: number = 1.0
  ) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(detune, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const peakVol = 0.16 * volumeMul;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // AudioContext safe catch
    }
  }

  private startSequence() {
    let step = 0;

    // 1. Rock Bottom - Hailee Steinfeld ft. DNCE (Em - C - G - D progression, upbeat pop ballad)
    const rockBottomChords = [
      [164.81, 196.0, 246.94, 329.63], // Em (E3, G3, B3, E4)
      [130.81, 196.0, 261.63, 329.63], // C  (C3, G3, C4, E4)
      [196.0, 246.94, 293.66, 392.0],  // G  (G3, B3, D4, G4)
      [146.83, 220.0, 293.66, 369.99], // D  (D3, A3, D4, F#4)
    ];
    const rockBottomRiff = [392.0, 440.0, 493.88, 440.0, 392.0, 329.63];

    // 2. Best Part of Me - Ed Sheeran ft. YEBBA (D - G - Bm - A tender acoustic picking)
    const bestPartOfMeChords = [
      [146.83, 220.0, 293.66, 369.99, 440.0], // Dmaj (D3, A3, D4, F#4, A4)
      [98.0, 196.0, 246.94, 293.66, 392.0],   // Gmaj (G2, G3, B3, D4, G4)
      [123.47, 185.0, 246.94, 293.66, 369.99], // Bm7  (B2, F#3, B3, D4, F#4)
      [110.0, 164.81, 220.0, 277.18, 329.63],  // A7   (A2, E3, A3, C#4, E4)
    ];
    const bestPartMelody = [440.0, 369.99, 293.66, 329.63, 293.66];

    // 3. The Way - Ariana Grande ft. Mac Miller (Bbmaj7 - Gm7 - Cm7 - F9 bouncy R&B piano)
    const theWayChords = [
      [116.54, 174.61, 233.08, 293.66, 349.23, 440.0], // Bbmaj7
      [98.0, 146.83, 196.0, 233.08, 293.66, 349.23],   // Gm7
      [130.81, 196.0, 261.63, 311.13, 392.0],           // Cm7
      [87.31, 174.61, 220.0, 261.63, 311.13, 349.23],   // F9
    ];
    const theWayBounceRiff = [587.33, 523.25, 466.16, 523.25, 587.33];

    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;

      if (this.currentKey === 'best-part-of-me') {
        // Intimate Ed Sheeran acoustic fingerpicking
        const chord = bestPartOfMeChords[step % bestPartOfMeChords.length];
        // Rolling fingerpick
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            this.playTone(freq, 2.8, idx === 0 ? 'sine' : 'triangle', idx % 2 === 0 ? 3 : -3, 0.9);
          }, idx * 110);
        });

        // Soft melody note on alternate beats
        if (step % 2 === 0) {
          const lead = bestPartMelody[(step / 2) % bestPartMelody.length];
          setTimeout(() => {
            this.playTone(lead, 1.8, 'sine', 0, 0.7);
          }, 450);
        }
      } else if (this.currentKey === 'the-way') {
        // Bouncy Ariana Grande 90s R&B Rhodes chords & playful bounce
        const chord = theWayChords[step % theWayChords.length];
        // Punchy keyboard attack
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            this.playTone(freq, 2.0, idx < 2 ? 'triangle' : 'sine', (idx % 2 === 0 ? 5 : -5), 1.0);
          }, idx * 60);
        });

        // Bouncy syncopated upper hook
        const hook = theWayBounceRiff[step % theWayBounceRiff.length];
        setTimeout(() => {
          this.playTone(hook, 1.2, 'sine', 0, 0.85);
        }, 320);
      } else {
        // 'rock-bottom' (Hailee Steinfeld ft. DNCE) - vibrant energetic pop chords & lead
        const chord = rockBottomChords[step % rockBottomChords.length];
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            this.playTone(freq, 2.4, idx === 0 ? 'triangle' : 'sine', (idx % 2 === 0 ? 4 : -4), 1.0);
          }, idx * 90);
        });

        // Catchy pop vocal synth motif
        const lead = rockBottomRiff[step % rockBottomRiff.length];
        setTimeout(() => {
          this.playTone(lead, 1.5, 'triangle', 2, 0.8);
        }, 380);
      }

      step++;
    };

    // Trigger initial beat
    playNext();
    // Loop interval based on track tempo
    const intervalMs = this.currentKey === 'the-way' ? 2400 : this.currentKey === 'best-part-of-me' ? 2800 : 2500;
    this.timer = window.setInterval(playNext, intervalMs);
  }
}

export const cozyAudio = new CozySynthEngine();

