class SceneManager{

    levels = [levelOne, levelTwo, levelThree, levelFour];

    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.worldSize = 1;
        this.x = 0;
        this.y = 0 ;
        this.score = 0;
        this.gameOver = false;
        this.soundEngine = new SoundEngine(this.game);
        this.player = new CharacterController(this.game,0,0);
        this.levelNum = 0;
        
        this.loadLevel(levelOne,0,0);

        this.marker = 0;
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
            this.soundEngine.pauseBackgroundMusic();
        }.bind(this));
    };

    loadLevel(level , x, y){
        // Setup of level properties here.
        this.level = level;
        this.game.entities = [this] // TODO: this does not clear/unload entities.
        this.x = 0;
        this.y = 0;

        // Hi. I changed this from 'y' to '0' to make it look like the 
        // character just falls out of the sky. More so that they fall 
        // into the ground level 2 from above - Michael
        this.player.jumpInitPosition = null; // on zone-in lets simulate dropping off a ledge.
        this.player.jumpInitTime = null;
        this.player.wasOnGround = true;
        this.player.onGround = true;
        this.player.state = "IDLE";
        
        console.log("zoning in @ ", x, y);

        if(level.music) {
            this.soundEngine.pauseBackgroundMusic();
            this.soundEngine.playBackgroundMusic(level.music);
        }

        //Custom level starting point
        this.player.x = level.spawnPoint[0];
        this.player.y = level.spawnPoint[1];  

        this.game.addEntity(new Background(this.game, level.background));
        this.game.addEntity(new Foreground(this.game, level.foreground)); 
        this.game.addEntity(new Pillars(this.game, level.pillars)); 

        this.worldSize = level.worldSize;
        // TODO: refactor/ generalize to handle more diverse blocks in the level design
        
        for(const entry of level.ground) {
            // generate ground objects based on designated type in levels.js
            this.game.addEntity(new level['groundType'](this.game, entry.x, entry.y, entry.size));
        }
          
        for(const entry of level.wall) {
            // generate ground objects based on designated type in levels.js
            this.game.addEntity(new level['wallType'](this.game, entry.x, entry.y, entry.size));
        }

        
        for(const entry of level.targetblock) {
            this.game.addEntity(new Flag_Block(this.game, entry.x, entry.y,entry.xScale,entry.yScale));
            console.log("added flagblock", [entry.x, entry.y, entry.size]);
        }

        for(const entry of level.pitglow) {
            this.game.addEntity(new Pit_Glow(this.game, entry.x, entry.y, entry.xScale, entry.yScale));
            console.log("added pitglow", [entry.x, entry.y, entry.size]);
        }

        for(const entry of level.enemies) {
            if(entry.name == "Uoma"){
                this.game.addEntity(new Uoma(this.game, entry.x, entry.y));

            }
            if(entry.name == "Heavy_Sentry"){
                this.game.addEntity(new Heavy_Sentry(this.game, entry.x, entry.y));
            }
            if(entry.name == "Hive_Knight") {
                this.game.addEntity(new Hive_Knight(this.game, entry.x, entry.y));
            }

        }
        for(const entry of level.powerUps) {
            if(entry.name == "Charged_Lumafly"){
                this.game.addEntity(new Charged_Lumafly(this.game, entry.x, entry.y));
            }
            if(entry.name == "Gathering_Swarm"){
                this.game.addEntity(new Gathering_Swarm(this.game, entry.x, entry.y));
            }
            if(entry.name == "Lightseed") {
                this.game.addEntity(new Lightseed(this.game, entry.x, entry.y));
            }
            if(entry.name == "Hive_Knight"){
                this.game.addEntity(new Hive_Knight(this.game, entry.x, entry.y));
            }
        }      
        this.game.addEntity(this.player);
        this.game.addEntity(new HUD());
        console.log('Done level: '+level.groundType.name)
    };

    loadNextLevel(x, y) {
        // it wraps for now, but we can change this later if we want.

        this.levelNum = (this.levelNum + 1) % this.levels.length;
        console.log(["loading level", this.levelNum, this.levels[this.levelNum]]);
        this.loadLevel(this.levels[this.levelNum], x, y);

    }

    update() {
        // This code is to ensure that once moving, Hornet maintains center
        let midpoint = params.canvasWidth/2;
        let vertMidpoint = params.canvasHeight/2;

        if( this.player.x < midpoint ){
            this.x = 0;        
        }else{
            this.x = this.player.x - midpoint;
        }
       
        if(this.worldSize>1){
            if(this.player.y < vertMidpoint - this.player.BB.height/2){
                this.y = 0;
            }else if(this.player.y > params.canvasHeight + vertMidpoint- this.player.BB.height/2 ){
                this.y = 768;
            }else{
                this.y = this.player.y - vertMidpoint+this.player.BB.height/2;
            }
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