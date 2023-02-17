class SoundEngine {

    constructor(game, x = 0, y = 0, volume = 0.4) {
        Object.assign(this, { game, x, y });
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.game.soundEngine = this;

        /*  Create an outputNode that is the AudioDestination.
        *   The mixerNode has different AudioNodes connected to
        *   it for sound effects, and it connects */
        // this.outputNode = new AudioDestinationNode(this.audioCtx);
        this.pannerNode = this.audioCtx.createPanner();
        this.backgroundMusicSource = this.audioCtx.createBufferSource();
        this.parentGainNode = this.audioCtx.createGain();

        this.pannerNode.panningModel = "equalpower";
        this.pannerNode.distanceModel = "inverse";
        this.pannerNode.refDistance = 1;
        this.pannerNode.maxDistance = 10000;
        this.pannerNode.rolloffFactor = 1;
        this.pannerNode.setPosition(x, y, 0);
        this.parentGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

        // AudioBuffer/SourceNode --> gain node --> destination.
        this.backgroundMusicSource.connect(this.parentGainNode);
        this.pannerNode.connect(this.parentGainNode);
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

    init() {
        
    }

    playSound(assetName, volume = 0.4, x = 0, y = 0) {
        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioCtx.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(assetName);

        source.connect(this.pannerNode);
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
        this.backgroundMusicSource.buffer = audioBuffer;

        // Connect the AudioBufferSourceNode to the gainNode.
        // this.backgroundMusicSource.connect(this.parentGainNode);
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
