class SceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.score = 0;
        this.gameOver = false;
        this.player = new CharacterController(this.game,50,550);
  

        
        this.loadLevel(levelOne,50,200); 
        //this.loadLevel(levelTwo,50,550); 
        //this.loadLevel(levelThree,50,550)
        //this.loadLevel(levelFour,50,550)

        //professor has a method "loadlevel1" that we should make and use instead.
        //Professor eventually changed it to  "loadLevel()" which is on his github now. https://youtu.be/pdjvFlVs-7o?t=65 -Michael

        //let uoma = new Uoma(this.game);
        //this.game.addEntity(uoma);
        this.marker = 0;
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;

        });
    };

    loadLevel(level , x, y){
        
        // This code is beginning to refactor loading with level.js due
        // to the current music implementation. Here, the level 
        // property can manage level-specific items. -Griffin
        this.level = level;

        this.game.entities = [];
        this.x = 0;
        this.player.x = x;
        this.player.y = 0; 
        // Hi. I changed this from 'y' to '0' to make it look like the 
        // character just falls out of the sky. More so that they fall 
        // into the ground level 2 from above - Michael
        this.player.velocity = { x: 0, y: 0 };
        

        // To change based on professor's "title" technique.
        if(level.music) {
            ASSET_MANAGER.pauseBackgroundMusic();
           // ASSET_MANAGER.playAsset(level.music);
        }


        for(const entry of level.background) {
            console.log(entry);
            if(level == levelOne){
                this.game.addEntity(new BackgroundLevel1(this.game));
            }
            if(level == levelTwo) {
                this.game.addEntity(new BackgroundLevel2(this.game));
            }
            if(level == levelThree) {
                this.game.addEntity(new BackgroundLevel3(this.game));
            }
            if(level == levelFour) {
                this.game.addEntity(new BackgroundLevel4(this.game));
            }
        }

        // TODO: refactor/ generalize to handle more diverse blocks in the level design
        //if (level.ground) {
            //this.game.addEntity(new Ground(this.game, level.ground.x, level.ground.y, level.ground.size));
        for(const entry of level.ground) {
            console.log(entry);
            if(level == levelOne){
                this.game.addEntity(new Ground(this.game, entry.x, entry.y, entry.size));
            }
            if(level == levelTwo) {
                this.game.addEntity(new UnderGround(this.game, entry.x, entry.y, entry.size));
            }
            if(level == levelThree) {
                this.game.addEntity(new IceGround(this.game, entry.x, entry.y, entry.size));
            }
            if(level == levelFour) {
                this.game.addEntity(new HellGround(this.game, entry.x, entry.y, entry.size));
            }
        }
        //}
        for(const entry of level.targetblock) {
            this.game.addEntity(new Flag_Block(this.game, entry.x, entry.y));
            console.log("added flagblock", [entry.x, entry.y, entry.size]);
        }
        for(const entry of level.targetblock2) {
            this.game.addEntity(new Flag_Block2(this.game, entry.x, entry.y));
            console.log("added flagblock2", [entry.x, entry.y, entry.size]);
        }
        for(const entry of level.targetblock3) {
            this.game.addEntity(new Flag_Block3(this.game, entry.x, entry.y));
            console.log("added flagblock3", [entry.x, entry.y, entry.size]);
        }
        for(const entry of level.targetblock4) {
            this.game.addEntity(new Flag_Block4(this.game, entry.x, entry.y));
            console.log("added flagblock4", [entry.x, entry.y, entry.size]);
        }
        for(const entry of level.enemies) {
            this.game.addEntity(new Uoma(this.game, entry.x, entry.y));
        }      
        this.game.addEntity(this.player);
        console.log('Done lwvel 1')
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
        //}else if (this.player.x > 7672-midpoint){
        //else if()
        //    this.x = 7672 - params.canvasWidth;
        }else{
            this.x = this.player.x - midpoint;
        }

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