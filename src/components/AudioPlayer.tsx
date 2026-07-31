import { useEffect, useState } from 'react';

// Web Audio API Synthesizer for PS5-like ambient drones and interactive chimes
class WebAudioSynth {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isHumming = false;

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startAmbientHum() {
    try {
      this.initContext();
      if (!this.ctx || this.isHumming) return;

      this.isHumming = true;

      // Deep ambient low-pass filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(150, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Deep ambient hum oscillator 1 (55Hz, triangle)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'triangle';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Deep ambient hum oscillator 2 (110Hz, sine)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(110, this.ctx.currentTime);

      // Gain master for hum
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      // Fade in slowly to be gentle
      this.droneGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3);

      // Connections
      this.droneOsc1.connect(this.filterNode);
      this.droneOsc2.connect(this.filterNode);
      this.filterNode.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // Slow LFO to modulate the filter frequency (breathing effect)
      this.modulateFilter();
    } catch (e) {
      console.warn('Failed to start ambient hum:', e);
    }
  }

  private modulateFilter() {
    if (!this.ctx || !this.filterNode || !this.isHumming) return;
    const time = this.ctx.currentTime;
    // Modulate filter frequency between 110Hz and 170Hz every 8 seconds
    this.filterNode.frequency.cancelScheduledValues(time);
    this.filterNode.frequency.setValueAtTime(this.filterNode.frequency.value, time);
    this.filterNode.frequency.linearRampToValueAtTime(160, time + 4);
    this.filterNode.frequency.linearRampToValueAtTime(110, time + 8);

    setTimeout(() => this.modulateFilter(), 8000);
  }

  public stopAmbientHum() {
    if (!this.isHumming) return;
    this.isHumming = false;

    if (this.droneGain && this.ctx) {
      const time = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(time);
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, time);
      this.droneGain.gain.linearRampToValueAtTime(0, time + 0.5);

      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.filterNode?.disconnect();
          this.droneGain?.disconnect();
        } catch (err) {
          console.debug('Drone cleanup warning:', err);
        }
      }, 600);
    }
  }

  public playNavigate() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Low crisp tone
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (err) {
      console.debug('Navigate tone warning:', err);
    }
  }

  public playSelect() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Double note: classic clean high confirmation
      const now = this.ctx.currentTime;
      
      const playNote = (freq: number, delay: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0.08, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + duration);
      };

      playNote(523.25, 0, 0.15); // C5
      playNote(659.25, 0.05, 0.25); // E5
    } catch (err) {
      console.debug('Select tone warning:', err);
    }
  }

  public playClose() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4
      osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.25); // A3

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (err) {
      console.debug('Close tone warning:', err);
    }
  }

  public playTrophy() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High sweet chime (C6 -> G6 -> C7)
      const notes = [
        { freq: 1046.50, delay: 0, dur: 0.2 }, // C6
        { freq: 1568.00, delay: 0.08, dur: 0.25 }, // G6
        { freq: 2093.00, delay: 0.16, dur: 0.5 }, // C7
      ];

      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        gain.gain.setValueAtTime(0.04, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.dur);
      });
    } catch (err) {
      console.debug('Trophy chime warning:', err);
    }
  }
}

export const audioSynth = new WebAudioSynth();

export function useAudio() {
  const [isMuted, setIsMutedState] = useState(() => {
    const saved = localStorage.getItem('ps5_muted');
    return saved ? JSON.parse(saved) : true; // Default to muted due to browser policy
  });

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    localStorage.setItem('ps5_muted', JSON.stringify(isMuted));
    if (!isMuted && hasInteracted) {
      audioSynth.startAmbientHum();
    } else {
      audioSynth.stopAmbientHum();
    }
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    setHasInteracted(true);
    setIsMutedState((prev: boolean) => !prev);
    // Play sound immediately to feedback
    if (isMuted) {
      setTimeout(() => audioSynth.playSelect(), 100);
    } else {
      audioSynth.playClose();
    }
  };

  const playNav = () => {
    if (!isMuted) audioSynth.playNavigate();
  };

  const playSelect = () => {
    if (!isMuted) audioSynth.playSelect();
  };

  const playClose = () => {
    if (!isMuted) audioSynth.playClose();
  };

  const playTrophy = () => {
    if (!isMuted) audioSynth.playTrophy();
  };

  return {
    isMuted,
    toggleMute,
    playNav,
    playSelect,
    playClose,
    playTrophy,
    interact: () => setHasInteracted(true),
  };
}
