class TitleScreen {

    constructor(game, x, y) {
        Object.assign(this, { game});
        this.game = game;
        // coords: offsetX,offsetY, params.canvasWidth-500, params.canvasHeight-300

        const startBtn = document.getElementById('start-btn');
        startBtn.onclick = () => {

            document.getElementById('title').remove();
            this.removeFromWorld = true;
            this.game.addEntity(new SceneManager(this.game));
            this.game.addEntity(new HUD());
        }
    }

    update() {

    }
    
    draw(ctx) { 
        ctx.drawImage(ASSET_MANAGER.getAsset("./assets/Overworld_Level_1.png"), 0,0, 1920, 768,);

        /* TODO: Create an Animator object or something for some scrolling extra
        * title-screen sort of background thing for the start menu. 
        */
    }
}