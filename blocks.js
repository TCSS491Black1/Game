class Ground {
    // holds common collective functionality for ground / platforms.
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Environmental_Blocks.png");
        this.BB = new BoundingBox(this.game,this.x, this.y, 32 * w, 32, "orange");
      
    };

    update() {
       
        this.BB = new BoundingBox(this.game,this.x ,this.y, 32 * this.w, 32, "orange");
        
    };

    draw(ctx) {
        for (var i = 0; i < this.w; i++) {
            ctx.drawImage(this.spritesheet,
                this.spritex, this.spritey, 16, 16,
                this.x + i * 32 - this.game.camera.x, this.y-this.game.camera.y,
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

class Wall {
    // Holds common collective functionality for Walls.
    // Walls are build from top down IE (x:0 y:0 size: 10)
    //                                  This starts top right corner and goes 10 blocks down

    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Environmental_Blocks.png");
        this.BB = new BoundingBox(this.game,this.x, this.y, 32, 32*w, "orange");
      
    };

    update() {
        this.BB = new BoundingBox(this.game,this.x ,this.y, 32 , 32*this.w, "orange"); 
    };

    draw(ctx) {
        for (var i = 0; i < this.w; i++) {
            ctx.drawImage(this.spritesheet,
                this.spritex, this.spritey, 16, 16,
                this.x- this.game.camera.x, this.y + i*32 - this.game.camera.y,
                16 * 2, 16 * 2);
        }
        this.BB.draw(ctx);
    };
}
class GrassWall extends Wall {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:0, spritey:32});
    }
}
class UnderWall extends Wall {
    constructor(game, x, y, w) {
        super(game, x, y, w)
        Object.assign(this, {spritex:32, spritey:96});
    };
}
class IceWall extends Wall {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:112, spritey:224});
    };
}
class HellWall extends Wall {
    constructor(game, x, y, w) {
        super(game, x, y, w);
        Object.assign(this, {spritex:368, spritey:192});
    };
}