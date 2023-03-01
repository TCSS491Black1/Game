class EndCreditsScreen{
    constructor(game, x, y) {
        Object.assign(this, { game });
    };

    update(){
        if(this.game.click && this.game.click.y > 210 && this.game.click.y < 255){
            this.game.click.y = 0;
            this.removeFromWorld = true;
            this.game.timer.reset();
            this.game.addEntity(new SceneManager(this.game));
            this.game.addEntity(new HUD());
        } else if ((this.game.click && this.game.click.y > 255 && this.game.click.y < 430)) {
            this.game.click = undefined;
            this.game.toggleConfigs();
        }
    };
    
    draw(ctx){ 
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/HellLevel4.png"), 0,0, 1920, 768,);

        const offsetX = 250;
        const offsetY = 100
        
        ctx.strokeStyle = 'RED';
        ctx.lineWidth = 3;
        ctx.strokeRect(offsetX,offsetY, params.canvasWidth-500, params.canvasHeight-300);
        ctx.strokeStyle = 'Black'
        ctx.fillRect(offsetX+2,offsetY+2,params.canvasWidth-504,params.canvasHeight-304)

        ctx.font =  '60px ""'
        ctx.fillStyle = 'Red';
        ctx.fillText("THANK YOU FOR PLAYING!",370,150);

        ctx.strokeStyle = 'RED';
        ctx.font =  '48px ""'
        ctx.fillText("START OVER?", 625,250);
        ctx.fillText("SETTINGS", 625,350);

        ctx.font =  '24px ""'
        ctx.fillText("This game was designed by:", 255,450);
        ctx.fillText("Peter Iriarte", 255,475);
        ctx.fillText("Griffin Ryan", 255,500);
        ctx.fillText("Patrick Tibbals", 255,525);
        ctx.fillText("Michael Theisen", 255,550);

        


        ctx.fillStyle = 'LIME';
        ctx.font =  '64px ""'
        if ((this.game.mouse && this.game.mouse.y > 210 && this.game.mouse.y < 255)) {
            ctx.fillText("ψ", 585, 240);
        } 
        if ((this.game.mouse && this.game.mouse.y > 255 && this.game.mouse.y < 430)) {
            ctx.fillText("ψ", 585, 340);
        }
        ctx.fillStyle = 'Black';
    };
}