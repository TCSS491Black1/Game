class SoundEngine {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(buffer, volume = 1.0, x = 0, y = 0) {
        let panner = this.audioContext.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        this.gainNode = this.audioContext.createGain();
        this. GainNode.value = volume;

        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(panner);
        panner.connect(this.GainNode);
        this.GainNode.connect(this.audioContext.destination);
        source.start(0);
    }

    playStepSound(buffer, volume = 1.0, x = 0, y = 0) {
        let panner = this.audioContext.createPanner();
        panner.panningModel = "equalpower";
        panner.distanceModel = "inverse";
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.setPosition(x, y, 0);

        this.gainNode = this.audioContext.createGain();
        this.gainNode.value = volume;

        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(panner);
        panner.connect(this.GainNode);
        this.GainNode.connect(this.audioContext.destination);

        // This line sets the playback rate based on player's speed
        source.playbackRate.value = this.game.player.speed / 5;
        source.start(0);
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

    updateAudio() {
        let volume = document.getElementById("volume").value;
        let mute = document.getElementById("mute").checked;
        if (mute) {
            volume = 0;
        }
        this.setVolume(volume);
    }

    playBackgroundMusic(assetName, volume = 0.4) {
        let gainNode = this.audioContext.createGain();
        gainNode.value = volume;
      
        let audioBuffer = ASSET_MANAGER.getAsset(assetName);
              
        let source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
      
        source.loop = true;
        source.start(0);
    }
      
}
