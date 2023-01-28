class Background{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;

    }

    update(){
              
    }

    draw(ctx){
        // for (var i = 0; i < 7; i++) {
        //     ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+(i*1918)-this.game.camera.x, this.y, 1920, 768,);
        // }
    }
}
class BackgroundLevel1{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;

    }
    update(){
              
    }
    draw(ctx){
        for (var i = 0; i < 7; i++) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), this.x+(i*1918)-this.game.camera.x, this.y, 1920, 768,);
        }
    }
}
class BackgroundLevel2{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;

    }
    update(){        
    }

    draw(ctx){
        for (var i = 0; i < 7; i++) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Underground_Level_2.png"), this.x+(i*1918)-this.game.camera.x, this.y, 1920, 768,);
        }
    }
}
class BackgroundLevel3{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
    }
    update(){    
    }
    draw(ctx){
        for (var i = 0; i < 7; i++) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./assets/IceLevel3.png"), this.x+(i*1918)-this.game.camera.x, this.y, 1920, 768,);
        }
    }
}
class BackgroundLevel4{
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
    }
    update(){       
    }
    draw(ctx){
        for (var i = 0; i < 7; i++) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./assets/HellLevel4.png"), this.x+(i*1918)-this.game.camera.x, this.y, 1920, 768,);
        }
    }
}