class SceneManager{

    levels = [levelOne, levelTwo, levelThree, levelFour];

    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0 ;
        this.score = 0;
        this.gameOver = false;
        this.player = new CharacterController(this.game,50,550);
        this.levelNum = 0;
        
        this.loadLevel(levelOne,50,550); 
        //professor has a method "loadlevel1" that we should make and use instead.
        //Professor eventually changed it to  "loadLevel()" which is on his github now. https://youtu.be/pdjvFlVs-7o?t=65 -Michael

        this.marker = 0;
        this.updateAudio();
        document.getElementById('volume').addEventListener('input', this.updateAudio);
        document.getElementById('mute').addEventListener('input', this.updateAudio);
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
            ASSET_MANAGER.pauseBackgroundMusic();
        });
    };

    loadLevel(level , x, y){
        // This code is beginning to refactor loading with level.js due
        // to the current music implementation. Here, the level 
        // property can manage level-specific items. -Griffin

        this.level = level;
        this.game.entities = [this] // TODO: this does not clear/unload entities.
        this.x = 0;
        this.y =0;
        this.player.x = x;
        this.player.y = y; 
        // Hi. I changed this from 'y' to '0' to make it look like the 
        // character just falls out of the sky. More so that they fall 
        // into the ground level 2 from above - Michael
        this.player.velocity = { x: 0, y: 0 };
        

        // To change based on professor's "title" technique.
        if(level.music) {
            ASSET_MANAGER.pauseBackgroundMusic(); // stop previous bg music.
            ASSET_MANAGER.playAsset(level.music);
        }

        console.log({bg:level.background})
        this.game.addEntity(new Background(this.game, level.background));

        // TODO: refactor/ generalize to handle more diverse blocks in the level design
        
        for(const entry of level.ground) {
            // generate ground objects based on designated type in levels.js
            this.game.addEntity(new level['groundType'](this.game, entry.x, entry.y, entry.size));
        }
        
        for(const entry of level.targetblock) {
            this.game.addEntity(new Flag_Block(this.game, entry.x, entry.y));
            console.log("added flagblock", [entry.x, entry.y, entry.size]);
        }

        for(const entry of level.enemies) {
            this.game.addEntity(new Uoma(this.game, entry.x, entry.y));
        }      
        this.game.addEntity(this.player);
        console.log('Done lwvel 1')
    };

    loadNextLevel(x, y) {
        // it wraps for now, but we can change this later if we want.
        this.levelNum = (this.levelNum + 1) % this.levels.length;
        console.log(["loading level", this.levelNum, this.levels[this.levelNum]]);
        this.loadLevel(this.levels[this.levelNum], x, y);
    }

    /**
     * Adds audio context to sceneManager.
     */
    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }

    update() {
        // This code is to ensure that once moving, Hornet maintains center -Michael
        let midpoint = params.canvasWidth/2;
        let vertMidpoint = params.canvasHeight/2;

        if( this.player.x < midpoint ){
            this.x = 0;        
        }else{
            this.x = this.player.x - midpoint;
        }
       
        this.y = vertMidpoint*2;

        if(this.player.y < vertMidpoint){
            this.y = 0;
        }else if(this.player.y > params.canvasHeight + vertMidpoint ){
            this.y = 768;
        }else{
            this.y = this.player.y - vertMidpoint;
        }

        console.log("camera x:"+this.y);
        /*
        if(this.player.y > 768 + vertMidpoint ){
            
        }else{
            this.y = this.player.y - vertMidpoint;
        }
        */
        // spawn some more enemies for troubleshooting/dev purposes.
        const nowTime = this.game.timer.gameTime;
        if(this.game.keys['c'] && 0.5 > (nowTime - this.marker)) {
            this.marker = nowTime;
            this.game.addEntity(new Uoma(this.game));
        }
    };

    draw(ctx){
       
    };

};