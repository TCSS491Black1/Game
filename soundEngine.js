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

        this.channelMerger = this.audioCtx.createChannelMerger();
        this.musicGainNode.connect(this.channelMerger, 0, 1);
        this.effectsGainNode.connect(this.channelMerger, 0, 2);

        this.parentGainNode = this.audioCtx.createGain();
        this.parentGainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

        // AudioBuffer/SourceNode --> gain node --> destination.
        // this.musicGainNode.connect(this.audioCtx.destination);
        // this.effectsGainNode.connect(this.audioCtx.destination);
        this.channelMerger.connect(this.parentGainNode);
        this.parentGainNode.connect(this.audioCtx.destination);

        const mute = document.querySelector("#mute");
        const bgmute = document.querySelector('#bgmute');
        const fxmute = document.querySelector('#fxmute');

        const vol = document.querySelector("#volume");
        const bgvol = document.querySelector('#bgvolume');
        const fxvol = document.querySelector('#fxvolume');

        // volume controls event handlers
        vol.onclick = () => {
          mute.checked = false;
          this.setVolumes();
        };
        bgvol.onclick = () => {
          bgmute.checked = false;
          this.setVolumes();
        };
        fxvol.onclick = () => {
          fxmute.checked = false;
          this.setVolumes();
        };
    
        // mute controls event handlers.
        mute.onclick = this.setVolumes.bind(this);
        bgmute.onclick = this.setVolumes.bind(this);
        fxmute.onclick = this.setVolumes.bind(this);
    
        // this.isPlaying = false;
        // this.isTakingDamage = false;
      }  
      setVolumes() {
        // configure all volumes to reflect current configuration state.
        const mute = document.querySelector("#mute");
        const bgmute = document.querySelector('#bgmute');
        const fxmute = document.querySelector('#fxmute');

        const vol = document.querySelector("#volume");
        const bgvol = document.querySelector('#bgvolume');
        const fxvol = document.querySelector('#fxvolume');

        // each category is either muted(0), or the value stored in the slider.
        const mainLevel = mute.checked ? 0 : vol.value;
        const bgLevel = bgmute.checked ? 0 : bgvol.value;
        const fxLevel = fxmute.checked ? 0 : fxvol.value;

        this.parentGainNode.gain.setValueAtTime(mainLevel, this.audioCtx.currentTime);
        this.musicGainNode.gain.setValueAtTime(bgLevel, this.audioCtx.currentTime);
        this.effectsGainNode.gain.setValueAtTime(fxLevel, this.audioCtx.currentTime);
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
