class SceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.score = 0;
        this.gameOver = false;
        this.player = new CharacterController(this.game,50,200);

        this.loadLevel(50,200);
        this.player = new CharacterController(this.game,50,550);
        
        this.loadLevel(levelOne,50,550);


        //professor has a method "loadlevel1" that we should make and use instead.
        let uoma = new Uoma(this.game);
        this.game.addEntity(uoma);

    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    loadLevel(level, x, y){
        
        // This code is beginning to refactor loading with level.js due
        // to the current music implementation. Here, the level 
        // property can manage level-specific items. -Griffin
        this.level = level;

        this.game.entities = [];
        this.x = 0;
        this.player.x = x;
        this.player.y = y;
        this.player.velocity = { x: 0, y: 0 };

        // To change based on professor's "title" technique.
        if(level.music) {
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset(level.music);
        }
        if (level.ground) {
            this.game.addEntity(new Ground(this.game, level.ground.x, level.ground.y, level.ground.size));
        }
        
       //this.player = (new CharacterController(gameEngine),50,550)
        this.game.addEntity(new Background(this.game));
        
        
        this.game.addEntity(new Ground(this.game,32,47,736));

        this.game.addEntity(new Flag_Block(this.game))
        this.game.addEntity(new Uoma(this.game));
        this.game.addEntity(new Background(this.game));



    };

    /**
     * Adds audio context to sceneManager.
     */
    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").checked;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }

    update() {
        // This code is to ensure that once moving, Hornet maintains center.
        // However, this breaks with the bounding box. We need a separate class 
        // specifically for Hornet. Then we can make it work. I think. -Michael

        let midpoint = params.canvasWidth/2;
        
        if( this.player.x < midpoint ){
            this.x = 0;        
        }else if (this.player.x > 7672-midpoint){
            this.x = 7672 - params.canvasWidth;
        }else{
            this.x = this.player.x - midpoint;
        }

        
        // else if ((this.game.keys["a"]) && (this.x < this.player.x - (midpoint-1000))) { // -1000 because Hornet keeps sliding past the midpoint. 
        //     this.x = this.player.x - midpoint;
        // }
        
        // spawn some more enemies for troubleshooting/dev purposes.
        const nowTime = this.game.timer.gameTime;
        if(this.game.keys['c'] && 0.5 < (nowTime - this.marker)) {
            this.marker = nowTime;
            this.game.addEntity(new Uoma(this.game));
        }
    };

    draw(ctx){
        //ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x-this.game.camera.x ,this.y, 1920, 768,);
        //ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+1918-this.game.camera.x, this.y, 1920, 768,);
        //ctx.drawImage(ASSET_MANAGER.getAsset("./background.png"),0,0);


        
    };

};