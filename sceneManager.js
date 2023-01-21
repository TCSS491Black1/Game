class SceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.score = 0;
        this.gameOver = false;
        this.player = new CharacterController(this.game,50,550);
        this.loadLevel(50,550);


        //professor has a method "loadlevel1" that we should make and use instead.
        this.marker = 0;
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    loadLevel(x,y){
        this.game.entities = [];
        this.x = 0;
        this.player.x = x;
        this.player.y = y;
        this.player.velocity = { x: 0, y: 0 };
        
       //this.player = (new CharacterController(gameEngine),50,550)
        this.game.addEntity(new Background(this.game));
        this.game.addEntity(new Flag_Block(this.game))
        this.game.addEntity(new Uoma(this.game));
        this.game.addEntity(this.player);
    };

    update() {
        // This code is to ensure that once moving, Hornet maintains center.
        // However, this breaks with the bounding box. We need a separate class 
        // specifically for Hornet. Then we can make it work. I think. -Michael

        // let midpoint = params.canvasWidth/2;
        // if (this.x < this.player.x - midpoint) {
        //     this.x = this.player.x - midpoint;
        // }
        
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