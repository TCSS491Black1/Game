class Background {
    constructor(game, img) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.asset = ASSET_MANAGER.getAsset(img);
    }

    update() {

    }

    draw(ctx) {
        for (var i = 0; i < 7; i++) {
            ctx.drawImage(
                this.asset,
                this.x + (i * 1918) - this.game.camera.x, this.y-this.game.camera.y, 1920, 768
            );
            ctx.drawImage(
                this.asset,
                this.x + (i * 1918) - this.game.camera.x, this.y+768-this.game.camera.y, 1920, 768
            );

        }
    }
}