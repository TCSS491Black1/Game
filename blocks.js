class Ground {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w});
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Environmental_Blocks.png",0,0,16,16);
        this.BB = new BoundingBox(this.x, this.y, 32*w, 32, "orange");
    };

    update() {
        this.BB = new BoundingBox(this.x - this.game.camera.x, this.y, 32*this.w, 32, "orange");
    };

    draw(ctx){
        for (var i = 0; i < this.w; i++) {
            ctx.drawImage(this.spritesheet,
                0, 0,
                16,16,
                /*i*32-this.game.camera.x, params.canvasHeight-32,*/
                this.x + i*32-this.game.camera.x, this.y,
                16*2,16*2);
                
        }
        this.BB.draw(ctx);
    };
}
