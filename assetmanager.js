class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    };

    queueDownload(path) {
        console.log("Queueing '" + path + "'");
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        console.log("queue: ", this.downloadQueue);

        for (let i = 0; i < this.downloadQueue.length; i++) {
            var that = this;
            
            const path = this.downloadQueue[i];
            console.log(path);
            var extension = path.substring(path.length - 3);

            // Switch statement to determine asset to load.
            switch(extension) {
                case 'jpeg':
                case 'jpg':
                case 'png':
                    const img = new Image();

                    img.addEventListener("load", () => {
                        console.log("Loaded " + img.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });
        
                    img.addEventListener("error", () => {
                        console.log("Error loading " + img.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                
                case 'wav':
                case 'mp3':
                    fetch(path)
                        .then(response => response.arrayBuffer())
                        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                        .then(audioBuffer => {
                            this.cache[path] = audioBuffer;
                            console.log("Loaded " + path);
                            this.successCount++;
                            if (this.isDone()) callback();
                        })
                        .catch(error => {
                            console.error('Error decoding audio data:', error);
                            this.errorCount++;
                            if (this.isDone()) callback();
                        });
                    break;
            }
        }
    };

    getAsset(path) {
        return this.cache[path];
    };

    // muteAudio(mute) {
    //     for (var key in this.cache) {
    //         let asset = this.cache[key];
    //         if (asset instanceof AudioBuffer) {
    //             asset.muted = mute;
    //         }
    //     }
    // };

    // adjustVolume(volume) {
    //     for (var key in this.cache) {
    //         let asset = this.cache[key];
    //         if (asset instanceof AudioBuffer) {
    //             asset.volume = volume;
    //         }
    //     }
    // };

    pauseBackgroundMusic() {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof AudioBuffer) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

};
