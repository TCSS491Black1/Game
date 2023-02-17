class SoundEngine {

    constructor(game, x, y, volume = 0.4) {
        Object.assign(this, { game, x, y });
        // this.audioCtx = new (window.audioCtx || window.webkitaudioCtx)();

        // TODO: Use an AudioParamMap to apply effects instead.

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.game.soundEngine = this;

        this.musicGainNode = this.audioCtx.createGain();
        this.musicGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        this.effectsGainNode = this.audioCtx.createGain();
        this.effectsGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        this.parentGainNode = this.audioCtx.createGain();
        this.parentGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

        // AudioBuffer/SourceNode --> gain node --> destination.
        this.musicGainNode.connect(this.audioCtx.destination);
        this.effectsGainNode.connect(this.audioCtx.destination);
        this.parentGainNode.connect(this.audioCtx.destination);

        this.vol = document.querySelector("#volume");
        const mute = document.querySelector("#mute");
        this.bgvol = document.querySelector('#bgvolume');
        this.fxvol = document.querySelector('#fxvolume');
        const bgmute = document.querySelector('#bgmute');
        const fxmute = document.querySelector('#fxmute');

        this.vol.onclick = () => {
            this.parentGainNode.gain.setValueAtTime(vol.value, this.audioCtx.currentTime);
        };
        mute.onclick = () => {
            if (mute.id === "") {
              this.parentGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
              mute.id = "activated";
              mute.textContent = "Unmute";
            } else {
              this.parentGainNode.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
              mute.id = "";
              mute.textContent = "Mute";
            }
        };
        this.bgvol.onclick = () => {
            this.musicGainNode.gain.setValueAtTime(bgvol.value, this.audioCtx.currentTime);
        };
        bgmute.onclick = () => {
            if (bgmute.id === "") {
              this.musicGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
              bgmute.id = "activated";
              bgmute.textContent = "Unmute";
            } else {
              this.musicGainNode.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
              bgmute.id = "";
              bgmute.textContent = "Mute";
            }
        };
        this.fxvol.onclick = () => {
            this.effectsGainNode.gain.setValueAtTime(fxvol.value, this.audioCtx.currentTime);
        };
        fxmute.onclick = () => {
            if (fxmute.id === "") {
              this.effectsGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
              fxmute.id = "activated";
              fxmute.textContent = "Unmute";
            } else {
              this.effectsGainNode.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
              fxmute.id = "";
              fxmute.textContent = "Mute";
            }
        };
    
        this.isPlaying = false;
        this.isTakingDamage = false;
    }

    playSound(assetName, volume = 0.4, x = 0, y = 0) {
        let panner = this.audioCtx.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioCtx.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(assetName);
        source.connect(panner);
        panner.connect(this.effectsGainNode);
        source.start(0);
    }

    playBackgroundMusic(assetName, volume = 0.4) {
        // Create AudioBuffer and set to AudioBufferSourceNode.
        let audioBuffer = ASSET_MANAGER.getAsset(assetName);
        this.backgroundMusicSource = this.audioCtx.createBufferSource();
        this.backgroundMusicSource.buffer = audioBuffer;

        // Connect the AudioBufferSourceNode to the gainNode.
        this.backgroundMusicSource.connect(this.musicGainNode);
        this.backgroundMusicSource.loop = true;
        this.backgroundMusicSource.start(0);
        this.isPlaying = true;
    }

    playStepSound(buffer, volume = 0.4, x = 0, y = 0) {
        let panner = this.audioCtx.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.value = volume;

        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioCtx.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(buffer);
        source.connect(panner);
        panner.connect(this.GainNode);
        this.gainNode.connect(this.audioCtx.destination);

        // This line sets the playback rate based on player's speed
        source.playbackRate.value = this.game.player.speed / 5;
        source.start(0);
    }

    pauseBackgroundMusic() {
        if(this.isPlaying) {
            this.backgroundMusicSource.stop();
            this.isPlaying = false;
        }
    }

    mute() {
        this.audioCtx.suspend();
    }

    unmute() {
        this.audioCtx.resume();
    }

    setVolume(volume) {
        this.parentGainNode.value = volume;
    }
      
}
