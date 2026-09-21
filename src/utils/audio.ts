// Complete Web Audio API Procedural Synthesizer for Civic Guardians
// Includes world-specific BGM themes, boss battle music, jingles, and rich sound effects

import { WorldId } from '../types/game';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.55;

  // BGM playback state
  private currentWorldBgm: WorldId | 'boss' | null = null;
  private bgmIntervalId: any = null;
  private isBgmPlaying: boolean = false;
  private audioUnlocked: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.audioUnlocked = true;
  }

  // Auto-unlock audio on any user interaction
  public unlockAudio() {
    this.initCtx();
  }

  public isAudioUnlocked(): boolean {
    return this.audioUnlocked && this.ctx?.state === 'running';
  }

  // Volume & Mute Controls
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  // Helper to play a quick synthesized note
  private playTone(
    freq: number,
    type: OscillatorType,
    duration: number,
    gainLevel: number,
    startTimeOffset: number = 0,
    endFreq?: number
  ) {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + startTimeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), now + duration);
      }

      const effectiveGain = gainLevel * this.sfxVolume;
      gain.gain.setValueAtTime(effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // ignore
    }
  }

  // ==========================================
  // SOUND EFFECTS
  // ==========================================

  // 1. Button click: crisp cartoon pop
  public playButton() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playTone(480, 'sine', 0.08, 0.15, 0, 780);
  }

  // 2. Correct answer: triumphant double ding / star burst chime
  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.35, 0.2, idx * 0.07);
    });
    // High shimmer
    this.playTone(1318.51, 'sine', 0.45, 0.15, 0.25);
  }

  // 3. Wrong answer: gentle cartoon wobble (no harsh buzz)
  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Gentle boing
    this.playTone(280, 'sine', 0.2, 0.2, 0, 180);
    this.playTone(190, 'triangle', 0.25, 0.18, 0.12, 140);
  }

  // 4. Defender placement: energetic whoosh + solid thud
  public playDeploy() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(180, 'triangle', 0.12, 0.25, 0, 420);
    this.playTone(520, 'sine', 0.22, 0.2, 0.08, 650);
  }

  // 5. Enemy defeat: cartoon pop / whoosh
  public playEnemyDefeated() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(360, 'sine', 0.12, 0.18, 0, 120);
    this.playTone(600, 'triangle', 0.15, 0.12, 0.04, 200);
  }

  // 6. Wave start: bugle / whistle announcement
  public playWaveStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.22, 0.22, idx * 0.1);
    });
  }

  // 7. Boss arrival: dramatic low rumble & alarm siren
  public playBossArrival() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Low dramatic roar
    this.playTone(90, 'sawtooth', 0.7, 0.35, 0, 50);
    // Urgent siren pings
    [0.15, 0.35, 0.55].forEach((offset) => {
      this.playTone(880, 'sawtooth', 0.16, 0.25, offset, 440);
    });
  }

  // 8. Level completion: glorious celebration fanfare
  public playLevelCompletion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
      { f: 880.0, d: 0.15 },  // A5
      { f: 1046.5, d: 0.55 }, // C6
    ];

    let delay = 0;
    notes.forEach((n) => {
      this.playTone(n.f, 'triangle', n.d, 0.28, delay);
      delay += n.d * 0.85;
    });
  }

  // 9. Achievement unlock: shimmering sparkle cascade
  public playAchievementUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const sparkles = [659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98];
    sparkles.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.18, idx * 0.06);
    });
  }

  // 10. Defeat: soft retry comforting sound
  public playDefeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [392.0, 369.99, 349.23, 329.63]; // Gentle descending
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.32, 0.18, idx * 0.2);
    });
  }

  // 11. Projectile shoot sounds
  public playAttack(type: string = 'normal') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (type === 'soap_bubble' || type === 'clean') {
      this.playTone(750, 'sine', 0.12, 0.12, 0, 350);
    } else if (type === 'respect_wave') {
      this.playTone(440, 'triangle', 0.18, 0.15, 0, 660);
    } else {
      this.playTone(400, 'square', 0.08, 0.09, 0, 150);
    }
  }

  // 12. Hit impact
  public playHit() {
    if (this.isMuted) return;
    this.playTone(150, 'sawtooth', 0.09, 0.12, 0, 60);
  }

  // 13. Collect Harmony
  public playCollect() {
    if (this.isMuted) return;
    this.playTone(650, 'sine', 0.14, 0.2, 0, 1150);
    this.playTone(980, 'sine', 0.18, 0.15, 0.06, 1300);
  }

  // 14. Special Stun (Queue Master)
  public playSpecial() {
    if (this.isMuted) return;
    this.playTone(260, 'triangle', 0.3, 0.22, 0, 780);
  }

  // Legacy aliases
  public playVictory() {
    this.playLevelCompletion();
  }
  public playAlarm() {
    this.playBossArrival();
  }
  public playBossRoar() {
    this.playBossArrival();
  }

  // ==========================================
  // BACKGROUND MUSIC (BGM) PROCEDURAL SYSTEM
  // ==========================================

  public startWorldBgm(worldId: WorldId, isBoss: boolean = false) {
    const targetTheme = isBoss ? 'boss' : worldId;
    if (this.isBgmPlaying && this.currentWorldBgm === targetTheme) {
      return;
    }

    this.stopBgm();
    this.currentWorldBgm = targetTheme;
    this.isBgmPlaying = true;
    this.initCtx();

    if (!this.ctx) return;

    let step = 0;

    // Melodic patterns per world:
    // World 1 (Home Territory): Calm cheerful family music (warm pentatonic, music box vibe)
    const homeMelody = [
      { f: 261.63, d: 0.35 }, // C4
      { f: 329.63, d: 0.35 }, // E4
      { f: 392.0, d: 0.35 },  // G4
      { f: 523.25, d: 0.45 }, // C5
      { f: 440.0, d: 0.35 },  // A4
      { f: 392.0, d: 0.35 },  // G4
      { f: 329.63, d: 0.45 }, // E4
      { f: 293.66, d: 0.45 }, // D4
    ];

    // World 2 (School Defense): Energetic school adventure (bouncy upbeat tempo, bright bells)
    const schoolMelody = [
      { f: 349.23, d: 0.22 }, // F4
      { f: 440.0, d: 0.22 },  // A4
      { f: 523.25, d: 0.25 }, // C5
      { f: 587.33, d: 0.22 }, // D5
      { f: 523.25, d: 0.22 }, // C5
      { f: 440.0, d: 0.25 },  // A4
      { f: 392.0, d: 0.22 },  // G4
      { f: 440.0, d: 0.35 },  // A4
    ];

    // World 3 (Community Protector): Neighborhood exploration (playful walking flute / marimba melody)
    const communityMelody = [
      { f: 392.0, d: 0.28 },  // G4
      { f: 493.88, d: 0.28 }, // B4
      { f: 587.33, d: 0.32 }, // D5
      { f: 659.25, d: 0.35 }, // E5
      { f: 587.33, d: 0.28 }, // D5
      { f: 493.88, d: 0.28 }, // B4
      { f: 440.0, d: 0.32 },  // A4
      { f: 392.0, d: 0.45 },  // G4
    ];

    // Boss Battle: Epic driving battle music (fast dramatic tempo, heavy bassline & staccato)
    const bossMelody = [
      { f: 146.83, d: 0.16 }, // D3
      { f: 220.0, d: 0.16 },  // A3
      { f: 293.66, d: 0.18 }, // D4
      { f: 349.23, d: 0.18 }, // F4
      { f: 329.63, d: 0.16 }, // E4
      { f: 293.66, d: 0.16 }, // D4
      { f: 277.18, d: 0.18 }, // C#4
      { f: 293.66, d: 0.25 }, // D4
    ];

    // World 4 (Public Space): City road rhythm
    const publicMelody = [
      { f: 329.63, d: 0.25 }, // E4
      { f: 392.0, d: 0.25 },  // G4
      { f: 440.0, d: 0.28 },  // A4
      { f: 523.25, d: 0.35 }, // C5
      { f: 493.88, d: 0.25 }, // B4
      { f: 440.0, d: 0.25 },  // A4
      { f: 392.0, d: 0.3 },   // G4
      { f: 329.63, d: 0.4 },  // E4
    ];

    const getPattern = () => {
      if (isBoss) return { notes: bossMelody, tempo: 220, oscType: 'sawtooth' as OscillatorType, baseGain: 0.05 };
      switch (worldId) {
        case 'world1':
          return { notes: homeMelody, tempo: 420, oscType: 'sine' as OscillatorType, baseGain: 0.04 };
        case 'world2':
          return { notes: schoolMelody, tempo: 320, oscType: 'triangle' as OscillatorType, baseGain: 0.045 };
        case 'world3':
          return { notes: communityMelody, tempo: 360, oscType: 'sine' as OscillatorType, baseGain: 0.04 };
        case 'world4':
        default:
          return { notes: publicMelody, tempo: 340, oscType: 'triangle' as OscillatorType, baseGain: 0.04 };
      }
    };

    const config = getPattern();

    const loop = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      if (!this.isMuted && this.musicVolume > 0) {
        try {
          const now = this.ctx.currentTime;
          const note = config.notes[step % config.notes.length];

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = config.oscType;
          osc.frequency.setValueAtTime(note.f, now);

          const vol = config.baseGain * this.musicVolume;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + note.d + 0.05);

          // Subtle bass accompaniment every 2 steps
          if (step % 2 === 0) {
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();
            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(note.f / 2, now);
            bassGain.gain.setValueAtTime(vol * 0.7, now);
            bassGain.gain.exponentialRampToValueAtTime(0.0001, now + note.d * 1.5);
            bassOsc.connect(bassGain);
            bassGain.connect(this.ctx.destination);
            bassOsc.start(now);
            bassOsc.stop(now + note.d * 1.5 + 0.05);
          }
        } catch {
          // ignore
        }
      }

      step++;
      this.bgmIntervalId = setTimeout(loop, config.tempo);
    };

    loop();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    this.currentWorldBgm = null;
    if (this.bgmIntervalId) {
      clearTimeout(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // Legacy BGM start
  public startBgm() {
    this.startWorldBgm('world1');
  }
}

export const soundManager = new SoundManager();
