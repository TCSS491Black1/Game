/**
 * tile.js - Class to handle tile and tileset properties.
 * (ref: https://github.com/algorithm0r/SuperMarioBros/blob/master/bricks.js)
 */
class Ground {
    constructor(game, x, y, w){
        Object.assign(this, {game, x, y, w});
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/ice-block.png"), 0, 0, 32, 32, 6, 0.2, 1, 4);

        this.x = x;
        this.y = y;
        this.w = w;
        this.speed = 0;
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 64, 64, "red");
    }

    collisionChecks() {
        /* collision detection and resolution: */
        this.game.entities.forEach((entity) => {
            if (entity.BB && this.BB.collide(entity.BB)) {
                this.onCollision(entity); /* NOTE: Enemy requires onCollision() */
            }
        });
    }

    onCollision(entity) {
        if (entity instanceof CharacterController) {
            console.log("Platform collision with Hornet = GROUND/TILE")
        }
    }

    update() {
        // Check for collision with player.
        this.updateBB();
        this.collisionChecks();
        /*
        if (this.game.player.BB.collide(this.BB)) {
            if (this.game.player.BB.collide(this.leftBB)) {
                this.game.player.x = this.x + params.TILESIZE;
                console.log("Player touched a tile.");
            } else if (this.game.player.BB.collide(this.rightBB)) {
                this.game.player.x = this.x + this.w - params.TILESIZE;
                console.log("Player touched a tile.");
            } else {
                this.game.player.y = this.y - params.TILESIZE;
                console.log("Player touched a tile.");
            }
        }   */
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        this.BB.draw(ctx);
    }
};