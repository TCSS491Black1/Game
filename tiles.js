/**
 * tile.js - Class to handle tile and tileset properties.
 * (ref: https://github.com/algorithm0r/SuperMarioBros/blob/master/bricks.js)
 */
class Ground {
    constructor(game, x, y, w){
        Object.assign(this, {game, x, y, w});
        
        // Dirt Block (single tile) as placeholder ground.
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/block.png");

        // Set the BoundingBox for single tile.
        this.BB = new BoundingBox(this.x, this.y, this.w, params.TILEWIDTH);
        this.leftBB = new BoundingBox(this.x, this.y, params.TILEWIDTH, params.TILEWIDTH * 2)
        this.rightBB = new BoundingBox(this.x + this.w - params.TILEWIDTH, this.y, params.TILEWIDTH, params.TILEWIDTH * 2)
    };

    update() {
    };

    draw(ctx) {
        // Draw single tile.
        // ctx.drawImage(this.spritesheet, 0, 0, params.TILEWIDTH, params.TILEWIDTH, this.x - this.game.camera.x, this.y, this.w, params.TILEWIDTH);
        let brickCount = this.w / params.TILEWIDTH;
        for (var i = 0; i < brickCount; i++) {
            ctx.drawImage(this.spritesheet,0,0, 16,16, this.x + i * params.TILEWIDTH - this.game.camera.x, this.y, params.TILEWIDTH, params.TILEWIDTH);
            ctx.drawImage(this.spritesheet, 0,0,16,16, this.x + i * params.TILEWIDTH - this.game.camera.x, this.y + params.TILEWIDTH, params.TILEWIDTH, params.TILEWIDTH);
        }
    };
};