class Background{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
    }

    update(){
              
    }

    draw(ctx){
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x-this.game.camera.x ,this.y, 1920, 768,);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+1918-this.game.camera.x, this.y, 1920, 768,);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+(2*1918)-this.game.camera.x, this.y, 1920, 768,);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+(3*1918)-this.game.camera.x, this.y, 1920, 768,);
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+(4*1918)-this.game.camera.x, this.y, 1920, 768,); // loooong background
    }
}