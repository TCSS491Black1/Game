class PowerUp {
    constructor(game, x=700, y=1199) {        
        Object.assign(this, { game, x, y });
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");
        
       
        this.alpha = 1;
        this.animationList = {}
        this.updateBB();
    }
    draw(ctx) {
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y-this.game.camera.y)
        if(this.BB) this.BB.draw(ctx);
    };
    collisionChecks() {
        /* collision detection and resolution: */
        this.game.entities.forEach((entity) => {
            if (entity.BB && this.BB.collide(entity.BB)) {
                this.onCollision(entity); /* NOTE: Could isolate the despawn perhaps. Okay for now*/
            }
        });
    }

}

class Charged_Lumafly extends PowerUp {
   
    constructor(game, x, y) {
        super(game, x, y);
        this.animationList["IDLE"] = new Animator(this.asset, 4, 254, 242 , 225 , 12 , 0.1, 1, 4);
        this.animationList["COLLECTED"] = new Animator(this.asset, 4, 656, 252, 238 , 5 , 0.1, 1, 4);

        this.alpha = 1;
        this.updateBB();
        this.state = "IDLE";
    }

    update() {
        if(this.state == "COLLECTED") {  // TODO: sound on collection
            this.BB = undefined;
            return;
        }
  

        this.updateBB();
        this.collisionChecks();
    }
    updateBB() {
        this.BB = new BoundingBox(this.game,this.x + 55, this.y + 55, 134, 130, "red");
    }
    draw(ctx) {
        ctx.save();
        if(this.state == "COLLECTED") { // we want to fade out on death.
            this.alpha -= this.game.clockTick; // time delay?
        }
        ctx.globalAlpha = Math.abs(this.alpha); // abs because overshooting into negatives causes a flicker.
        super.draw(ctx);
        ctx.restore();

        if(this.alpha <= 0) {
            this.removeFromWorld = true;
            console.log(this.name, {x:this.x, y:this.y}, " has been removed.")
            ctx.globalAlpha = 1;
        }
    }
    onCollision(entity) {
        if (this.state != "COLLECTED" && entity instanceof CharacterController) { 
            
            this.state = "COLLECTED";
            console.log(this.name + " collision with Hornet = LOSS");
            this.game.soundEngine.playSound("./assets/sounds/sfx/stab.wav", 0.5);
        }
       
    }
};


class Gathering_Swarm extends PowerUp {

    constructor(game, x, y) { 
        super(game, x, y);
        this.animationList["IDLE"] = new Animator(this.asset, 4, 33, 100 , 90 , 4 , 0.1, 1, 4);
        this.animationList["COLLECTED"] = new Animator(this.asset, 4, 33, 100 , 90 , 4 , 0.1, 1, 4);
         // TODO: change/correct parameters.
        this.alpha = 1;
        this.updateBB();
        this.state = "IDLE";
    }

    update() {
        if(this.state == "COLLECTED") {  // TODO: sound on death?
            this.BB = undefined;
            return;
        }

        this.updateBB();
        this.collisionChecks();
    }
    updateBB() {
        this.BB = new BoundingBox(this.game , this.x+40 , this.y+30 , 30, 30, "red");
    }
    draw(ctx) {
        ctx.save();
        if(this.state == "COLLECTED") { // we want to fade out on death.
            this.alpha -= this.game.clockTick; // time delay?
        }
        ctx.globalAlpha = Math.abs(this.alpha); // abs because overshooting into negatives causes a flicker.
        super.draw(ctx);
        ctx.restore();

        if(this.alpha <= 0) {
            this.removeFromWorld = true;
            console.log(this.name, {x:this.x, y:this.y}, " has been removed.")
            ctx.globalAlpha = 1;
        }
    }
    onCollision(entity) {
        if (this.state != "COLLECTED" && entity instanceof CharacterController) { 
            
            this.state = "COLLECTED";
            console.log(this.name + " collision with Hornet = LOSS");
            this.game.soundEngine.playSound("./assets/sounds/sfx/stab.wav", 0.5);
        }
    }
};