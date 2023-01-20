//TODO: add other entities
class Enemy {
    // Enemy exists to be subclassed; holds common code to be inherited by all enemies,
    // as well as possibly checking if(entity instanceof Enemy) later
    constructor(game, x=700, y=550) {        
        Object.assign(this, { game, x, y });
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");
        // default values, probably overwritten for different subclasses
        this.health = 10; 
        this.speed = 100;
        this.state = "WALK";
        this.animationList = {}
    }
    draw(ctx) {
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y)
        //ctx.drawImage(this.spritesheet, this.x ,this.y, 50, 50);
        if(this.BB) this.BB.draw(ctx);
    };
    collisionChecks() {
        /* collision detection and resolution: */
        this.game.entities.forEach((entity) => {
            if (entity.BB && this.BB.collide(entity.BB)) {
                this.onCollision(entity); /* NOTE: Enemy requires onCollision() */
            }
        });
    }
    isDead() {
        return this.health <= 0;
    }
}
class Uoma extends Enemy {
    /*****
     * TODO: Death animation.
     * TODO: Attack animation.
     */
    constructor(game, x, y) { // NOTE: why do we have "game" here, when that's always gameEngine in global scope?
        super(game, x, y);
        this.animationList["WALK"] = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
        this.animationList["DEAD"] = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4); // TODO: change/correct parameters.
        this.alpha = 1;
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + 45, this.y + 35, 70, 90, "red");
    }

    update() {
        // mechanics for how / where the enemy moves:
        if(this.state == "DEAD") {  // TODO: sound on death?
            // we don't move on death, but after death animation, we need to set this.removeFromWorld
            this.BB = undefined;
            return;
        }
        this.x -= (this.speed * this.game.clockTick);
        if (this.x < -200) this.x = 1500, this.y = 300;
        if (this.x < -150 && this.y > 299) this.x = 1500, this.y = 100;
        // end of movement code

        this.updateBB();
        this.collisionChecks();
    }
    draw(ctx) {
        if(this.state == "DEAD") { // we want to fade out on death.
            ctx.save();
            this.alpha -= 0.01; // time delay?
            ctx.globalAlpha = this.alpha;
            console.log(this.name + " alpha @ ", {ctx: ctx.globalAlpha, this:this.alpha})
        }
        super.draw(ctx);
        if(this.state == "DEAD") {
            ctx.restore();
        }
        if(this.alpha <= 0) {
            this.removeFromWorld = true;
            console.log(this.name + " has been removed.")
        }
    }
    onCollision(entity) {
        if (entity instanceof CharacterController) {
            //entity.dead = true;
            this.state = "DEAD";
            console.log(this.name + " collision with Hornet = LOSS");
        }
        // Need to handle collision with walls?
    }
};

class Heavy_Sentry extends Enemy {
    constructor(game, x, y) {
        super();
        Object.assign(this, { game, x, y });
        // TODO: adjust Animator arguments for sprite sheet
        this.animator = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
    }
    onCollision(entity) {
        if (entity instanceof CharacterController) {
            entity.dead = true;
            console.log(this.name + " collision with Hornet = LOSS");
        }
    }
}

class Hive_Knight extends Enemy {
    constructor(game, x, y) {
        super();
        Object.assign(this, { game, x, y });
        // TODO: adjust Animator arguments for sprite sheet
        this.animator = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
    }

    onCollision(entity) {
        if (entity instanceof CharacterController) {
            entity.dead = true;
            console.log(this.name + " collision with Hornet = LOSS");
        }
    }
}

class Flag_Block {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Dirt_Block.png"),
            2, 2, 62, 62, 1, 1, 1, 1)

        this.x = 1400;
        this.y = 600;
        this.speed = 0;
        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y, 64, 64, "blue");
    }

    update() {
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController) {
                    //entity.dead = false;
                    console.log("Block collision with Hornet = WIN")
                }
            }
        });
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        this.BB.draw(ctx);
    };
}

