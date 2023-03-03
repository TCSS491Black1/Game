class PowerUp {
    constructor(game, x, y) {        
        Object.assign(this, { game, x, y });
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");
        this.state = "IDLE";
        this.alpha = 1;
        this.animationList = {};
        this.updateBB();
    }
    draw(ctx) {
        ctx.save();
        if(this.state == "COLLECTED") { // we want to fade out on death.
            this.alpha -= this.game.clockTick; // time delay?
        }
        ctx.globalAlpha = Math.abs(this.alpha); // abs because overshooting into negatives causes a flicker.

        this.animationList[this.state].drawFrame(
            this.game.clockTick,
            ctx,
            this.x - this.game.camera.x,
            this.y - this.game.camera.y
        );

        ctx.restore();
        if(this.BB) this.BB.draw(ctx);
        if(this.alpha <= 0) {
            this.removeFromWorld = true;
            console.log(this.name, {x:this.x, y:this.y}, " has been removed.")
            ctx.globalAlpha = 1;
        }
    }
    collisionChecks() {

        /* collision detection and resolution: */
        this.game.entities.forEach((entity) => {
            if (entity.BB && this.BB.collide(entity.BB)) {
                        

                this.onCollision(entity); /* NOTE: Could isolate the despawn perhaps. Okay for now*/
            }
        });
    }

}
//Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop , spriteBorderWidth, xoffset, yoffset, scale, rowCount, rowOffset){

class Charged_Lumafly extends PowerUp {
   
    constructor(game, x, y) {
        super(game, x, y);
        this.animationList["IDLE"] = new Animator(this.asset, 4, 33, 243, 216, 24, 0.075, 1, 3,0,0,1,2,12,220);
        this.animationList["COLLECTED"] = new Animator(this.asset, 4, 1142, 337, 317, 16, 0.05, 1, 3,0,0,1,2,8,321);
        this.updateBB();
    }

    update() {
        if(this.state == "COLLECTED") {
            this.BB = undefined;
            return;
        }

        this.updateBB();
        this.collisionChecks();
    }
    updateBB() {
        this.BB = new BoundingBox(this.game,this.x + 55, this.y + 55, 134, 130, "red");
    }
    onCollision(entity) {
        if (this.state != "COLLECTED" && entity instanceof CharacterController) { 
            entity.HP += 2;
            this.state = "COLLECTED";
            this.game.soundEngine.playSound("./assets/sounds/sfx/stab.wav", 0.5);
        }
       
    }
};

class Gathering_Swarm extends PowerUp {
    constructor(game, x, y) { 
        super(game, x, y);
        this.animationList["IDLE"] = new Animator(this.asset, 4,33, 100, 90, 8, 0.1, 1, 4, 0 , 0 , 1 , 2 , 4 , 100);
        this.animationList["COLLECTED"] = new Animator(this.asset, 4,33, 100, 90, 8, 0.1, 1, 4, 0 , 0 , 1 , 2 , 4 , 100);
        this.updateBB();
    }

    
    update() {
        if(this.state == "COLLECTED") {
            this.BB = undefined;
            return;
        }

        this.updateBB();
        this.collisionChecks();
    }
    updateBB() {
        this.BB = new BoundingBox(this.game , this.x+40 , this.y+30 , 30, 30, "red");
    }
    onCollision(entity) {
        if (this.state != "COLLECTED" && entity instanceof CharacterController) { 
            entity.damage += 1;
            console.log(entity.damage);
            this.state = "COLLECTED";
            this.game.soundEngine.playSound("./assets/sounds/sfx/stab.wav", 0.5);
           

        }
    }
};

class Lightseed extends PowerUp {
    constructor(game, x, y) { 
        super(game, x, y);
        
        this.animationList["IDLE"] = new Animator(this.asset, 139,119, 65, 70, 1, 1, 1, 0, 0, 0, 1);
        this.animationList["RUN"] = new Animator(this.asset, 4, 211, 76, 62, 3, 0.2, 1, 3, 0, 0, 1);
        this.animationList["COLLECTED"] = new Animator(this.asset, 139,119, 65, 70, 1, 1, 1, 0, 0, 0, 1);
        
        this.state = "RUN";
        this.updateBB();
        this.speed = 100;
        this.facingDirection = 1; // TODO: add/abstract mirror code to Animator.
    }

    update() {
        if(this.state == "COLLECTED") {
            this.BB = undefined;
            return;
        } else {
            this.x += this.speed * gameEngine.clockTick;
        }

        this.updateBB();
        this.collisionChecks();
    }
    updateBB() {
        this.BB = new BoundingBox(this.game , this.x+40 , this.y+30 , 30, 30, "red");
    }
    onCollision(entity) {
        if (this.state != "COLLECTED" && entity instanceof CharacterController) { 
            this.state = "COLLECTED";
            this.game.soundEngine.playSound("./assets/sounds/sfx/stab.wav", 0.5);
            entity.jumpsTotal += 1;

        }
    }
}
