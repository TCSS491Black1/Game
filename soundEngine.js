class SoundEngine {
    constructor(game, x, y, volume = 0.4) {
        Object.assign(this, { game, x, y });
        // this.audioCtx = new (window.audioCtx || window.webkitaudioCtx)();

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.game.soundEngine = this;

        this.parentGainNode = this.audioCtx.createGain();
        this.parentGainNode.volume = volume;

        // AudioBuffer/SourceNode --> gain node --> destination.
        this.parentGainNode.connect(this.audioCtx.destination);
        
        this.isPlaying = false;
        this.isTakingDamage = false;
    }

    update() {
        // FIXME: mute and vol sliders.

        // TODO: Refactor some things into this update() method 
        //       to make the code more readable.

        // TODO: Add a random utility for enemy collision sounds.
        //       It would be nice to have a random sound play when an enemy is hit.
        //       This would make the current death sound possibly very pretty!

        // TODO: Export 2 more trill.wav in different chord progressions from
        //       Ableton Live 11 Suite (or remake 3 new ones in Live 10).
        
        // TODO: Implement the playStepSound() method in characterController.js

        // FIXME: Implement this.game.x and this.game.y context to the PannerNode objects.
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

    updateAudio() {
        let volume = document.getElementById("volume").value;
        let mute = document.getElementById("mute").checked;
        if (mute) {
            volume = 0;
        }
        this.parentGainNode.value = volume;
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
