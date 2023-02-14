class SoundEngine {
    constructor(game, x, y, volume = 0.4) {
        Object.assign(this, { game, x, y });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.game.soundEngine = this;
        this.backgroundMusicSource = this.audioContext.createBufferSource();
        // this.attackSoundSource = this.audioContext.createBufferSource();
        
        this.isPlaying = false;
        this.isTakingDamage = false;
    }

    update() {
        // TODO: Refactor some things into this update() method 
        //       to make the code more readable.

        // TODO: Add a random utility for enemy collision sounds.
        //       It would be nice to have a random sound play when an enemy is hit.
        //       This would make the current death sound possibly very pretty!
        
        // TODO: Recrack Ableton Live to make those sounds.

        // TODO: Implement the playStepSound() method in characterController.js

        // FIXME: Implement this.game.x and this.game.y context to this the PannerNode objects.
    }

    playSound(assetName, volume = 0.4, x = 0, y = 0) {
        let panner = this.audioContext.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        this.gainNode = this.audioContext.createGain();
        this.gainNode.value = volume;

        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioContext.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(assetName);
        source.connect(panner);
        panner.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        source.start(0);
    }

    playStepSound(buffer, volume = 0.5, x = 0, y = 0) {
        let panner = this.audioContext.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        this.gainNode = this.audioContext.createGain();
        this.gainNode.value = volume;

        // Retrieve asset and set to AudioBuffer node.
        let source = this.audioContext.createBufferSource();
        source.buffer = ASSET_MANAGER.getAsset(buffer);
        source.connect(panner);
        panner.connect(this.GainNode);
        this.gainNode.connect(this.audioContext.destination);

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
        this.audioContext.volume = volume;
    }

    playBackgroundMusic(assetName, volume = 0.1) {
        let gainNode = this.audioContext.createGain();
        gainNode.value = volume;
      
        let audioBuffer = ASSET_MANAGER.getAsset(assetName);
        this.backgroundMusicSource = this.audioContext.createBufferSource();
        this.backgroundMusicSource.buffer = audioBuffer;
        this.backgroundMusicSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
      
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
        this.audioContext.suspend();
    }

    unmute() {
        this.audioContext.resume();
    }

    setVolume(volume) {
        this.gainNode.value = volume;
    }
      
}
