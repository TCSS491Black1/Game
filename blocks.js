class Ground {
    // holds common collective functionality for ground / platforms.
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Environmental_Blocks.png");
        this.BB = new BoundingBox(this.x, this.y, 32 * w, 32, "orange");
    };

    update() {
        this.lastBB = this.BB
        this.BB = new BoundingBox(this.x - this.game.camera.x, this.y - this.game.camera.y, 32 * this.w, 32, "orange");
    };

    draw(ctx) {
        for (var i = 0; i < this.w; i++) {
            ctx.drawImage(this.spritesheet,
                this.spritex, this.spritey, 16, 16,
                this.x + i * 32 - this.game.camera.x, this.y - this.game.camera.y,
                16 * 2, 16 * 2);
        }
        this.BB.draw(ctx);
    };
}
class GrassGround extends Ground {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:0, spritey:32});
    }
}
class UnderGround extends Ground {
    constructor(game, x, y, w) {
        super(game, x, y, w)
        Object.assign(this, {spritex:32, spritey:96});
    };
}
class IceGround extends Ground {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:112, spritey:224});
    };
}
class HellGround extends Ground {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:368, spritey:192});
    };
}

