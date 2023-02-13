class SoundEngine {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
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

        let gainNode = this.audioContext.createGain();
        gainNode.value = volume;

        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
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

        let gainNode = this.audioContext.createGain();
        gainNode.value = volume;

        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

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
        this.audioContext.gainNode.value = volume;
    }

    updateAudio() {
        let volume = document.getElementById("volume").value;
        let mute = document.getElementById("mute").checked;
        if (mute) {
            volume = 0;
        }
        this.setVolume(volume);
    };
}
