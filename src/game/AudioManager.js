import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.isLoaded = false;
  }

  async init() {
    if (this.isLoaded) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      this.sounds = {
        slash: new Audio.Sound(),
        hit: new Audio.Sound(),
        ui: new Audio.Sound(),
        win: new Audio.Sound(),
      };

      await Promise.all([
        this.sounds.slash.loadAsync(require('../../assets/audio/slash.wav')),
        this.sounds.hit.loadAsync(require('../../assets/audio/hit.wav')),
        this.sounds.ui.loadAsync(require('../../assets/audio/ui.wav')),
        this.sounds.win.loadAsync(require('../../assets/audio/win.wav')),
      ]);

      this.isLoaded = true;
    } catch (e) {
      console.warn('Failed to initialize audio', e);
    }
  }

  async play(soundName) {
    if (!this.isLoaded || !this.sounds[soundName]) return;
    try {
      // Replay asynchronously from start
      await this.sounds[soundName].replayAsync();
    } catch (e) {
      console.warn(`Failed to play ${soundName}`, e);
    }
  }
}

export default new AudioManager();
