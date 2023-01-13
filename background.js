class Background{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
    }

    update(){
      
    }

    draw(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/lava_7.png"), this.x-this.game.camera.x, this.y, 1920, 768,);
    }
}