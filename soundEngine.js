class SoundEngine {

    constructor(game, x, y, volume = 0.4) {
        Object.assign(this, { game, x, y });
        // this.audioCtx = new (window.audioCtx || window.webkitaudioCtx)();

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.game.soundEngine = this;

        this.parentGainNode = this.audioCtx.createGain();
        this.parentGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

        // AudioBuffer/SourceNode --> gain node --> destination.
        this.parentGainNode.connect(this.audioCtx.destination);

        const vol = document.querySelector("#volume");
        const mute = document.querySelector("#mute");
        vol.onclick = () => {
            this.parentGainNode.gain.setValueAtTime(vol.value, this.audioCtx.currentTime);
        };
        mute.onclick = () => {
            if (mute.id === "") {
              this.parentGainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
              mute.id = "activated";
              mute.textContent = "Unmute";
            } else {
              this.parentGainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
              mute.id = "";
              mute.textContent = "Mute";
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

        // Gain node for single sound.
        //const gainNode = this.audioCtx.createGain();
        //gainNode.value = volume;

        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioCtx.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(assetName);
        source.connect(panner);
        panner.connect(this.parentGainNode);
        // this.gainNode.connect(this.audioCtx.destination);
        source.start(0);
    }

    playStepSound(buffer, volume = 0.5, x = 0, y = 0) {
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

    playBackgroundMusic(assetName, volume = 0.1) {
        // Create AudioBuffer and set to AudioBufferSourceNode.
        let audioBuffer = ASSET_MANAGER.getAsset(assetName);
        this.backgroundMusicSource = this.audioCtx.createBufferSource();
        this.backgroundMusicSource.buffer = audioBuffer;

        // Connect the AudioBufferSourceNode to the gainNode.
        this.backgroundMusicSource.connect(this.parentGainNode);
      
        this.backgroundMusicSource.loop = true;
        this.backgroundMusicSource.start(0);
        this.isPlaying = true;
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
        this.gainNode.value = volume;
    }
      
}
