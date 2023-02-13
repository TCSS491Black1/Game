class Enemy {
    // Enemy exists to be subclassed; holds common code to be inherited by all enemies,
    // as well as possibly checking if(entity instanceof Enemy) later
    constructor(game, x=0, y=0) {        
        Object.assign(this, { game, x, y });
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");
        //console.log(this.asset);
        //console.log("./assets/" + this.name + ".png")
        // default values, probably overwritten for different subclasses
        this.facingDirection = 0;
        this.HP = 10; 
        this.speed = 100;
        this.state = "WALK";
        this.animationList = {}
        this.alpha = 1;
        this.updateBB();
    }
    draw(ctx) {
        let destX = (this.x - this.game.camera.x);
        let destY = (this.y- this.game.camera.y);

        if (this.facingDirection) {// if facing right
            ctx.scale(-1, 1);
            destX *= -1;
            destX -= this.animationList[this.state].width;
        }
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx,
            destX,
            destY);
        ctx.restore();
        //ctx.drawImage(this.spritesheet, this.x ,this.y, 50, 50);
        if(this.BB) this.BB.draw(ctx);
        if(this.ledgeCheckBox) this.ledgeCheckBox.draw(ctx);
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
        return this.HP <= 0;
    }
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game,this.x + 45, this.y + 35, 70, 90, "red");
    }
    // Check for if player is close enough to focus on
    withinRange(){
        if(Math.abs(this.game.player.x + this.game.player.BB.width/2 - this.x + this.BB.width/2) < 1000 &&
           Math.abs(this.game.player.y + this.game.player.BB.height/2 - this.y + this.BB.height/2) < 600){
            return true;
        }
        return false;
    }
    //Fix work in progress
    /*
    movingBB(animationType, offsets,frameCount){
            this.BB = new BoundingBox(this.game,this.x+frameOffsets[0],this.y+frameOffsets[1],frameOffsets[2],frameOffsets[3],"red");
    }
    */

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



    update() {
        // mechanics for how / where the enemy moves:
        if(this.state == "DEAD") {  // TODO: sound on death?
            // we don't move on death, and can't do any damage, so no BB.
            this.BB = undefined;
            return;
        }
        this.x -= (this.speed * this.game.clockTick);
        // if (this.x < -200) this.x = 1500, this.y = 300;
        // if (this.x < -150 && this.y > 299) this.x = 1500, this.y = 100; // spawning allocated in levels.js now
        // end of movement code

        this.updateBB();
        this.collisionChecks();
    }
    draw(ctx) {
        ctx.save();
        if(this.state == "DEAD") { // we want to fade out on death.
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
        if (this.state != "DEAD" && entity instanceof CharacterController) { // TODO: check for instanceof CharacterWeapon?
            //entity.dead = true;
            //this.state = "DEAD";
            //console.log(this.name + " collision with Hornet = LOSS");
        }
        // Need to handle collision with walls?
    }
};
class Heavy_Sentry extends Enemy {
    constructor(game, x, y) {
        super(game, x, y);

        // TODO: adjust Animator arguments for sprite sheet
        //this.animator = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
         //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration,loop, spriteBorderWidth){
       // console.log(this.asset  )
        this.animationList["IDLE"] = new Animator(this.asset, 4, 325, 208, 263, 6, 0.1, 1, 3 );
        this.animationList["WALK"] = new Animator(this.asset, 4, 610, 226, 259, 8, 0.15, 1, 3);
        this.animationList["DEAD"] = new Animator(this.asset, 371, 3600, 154, 164, 3, 0.2, 0, 3);
        this.animationList["RUN"] = new Animator(this.asset, 4, 1191, 264, 246, 8, 0.1 , 1, 3);
        this.animationList["TURN"] = new Animator(this.asset, 6, 902, 242, 230, 2, 0.1 , 0, 3);

        // ATTACK
        // JUMP

        this.runFrameCount = 1;
        this.halt = false;
        this.isGrounded = false;
        this.movingDirection = 0;
        this.turnTime = 0;
        this.state = "RUN";
        this.updateBB();
        //this.updateLedgeCheck();
    }
    onCollision(entity) {
        
        if(entity instanceof Ground && (this.lastBB.bottom-14 <= entity.BB.top)){
            this.isGrounded = true;
            //Keep enemy on surface
            this.y = entity.BB.top-this.BB.height-14;

            //Keep from falling off ledges if not in follow character mode
            //Left side stop or turn
            if(entity.BB.x - this.BB.x > 0 && this.movingDirection == 0){
                if(super.withinRange()){
                    this.halt = true;
                    this.state = "IDLE";
                }else{
                    this.halt = false;
                    this.state = "TURN"
                    this.movingDirection = 1;
                    this.x += 10
                }
            //Right side stop or turn
            }else if(entity.BB.x+entity.BB.width - this.BB.x < 200 && this.movingDirection == 1){
                if(super.withinRange()){
                    this.halt = true;
                    this.state = "IDLE";

                }else{
                    this.halt = false;
                    this.state = "TURN"
                    this.movingDirection = 0;
                    this.x -= 10
                }
            }
            
        }
        if (entity instanceof CharacterController) {
            entity.dead = true;
            //this.state = "DEAD";
            console.log(this.name + " collision with Hornet = LOSS");
        }
    }
    
    update() {
   
        // Mechanics for how / where the enemy moves:
        if(this.state == "DEAD") {  // TODO: sound on death?
            this.BB = undefined;
            this.y = this.y+3;
            return;
        //Stand wating at end of platform is player is within sight    
        }else if(this.state == "IDLE" && !super.withinRange()){
            this.state = "TURN";
        //Turn and go other way
        }else if(this.state == "TURN"){
            if(this.game.timer.gameTime-this.turnTime > 0.25){
                this.animationList["TURN"] = new Animator(this.asset, 6, 902, 242, 230, 2, 0.1 , 0, 3);
                this.state = "RUN";
            }
        //Follow player if within sight else pace back and forth
        }else if(this.state == "RUN" && this.isGrounded){
            
                //Movement Left
                if(this.movingDirection == 0){
                    this.facingDirection = 0;
                    if(!this.halt){
                        this.x -= (this.speed * this.game.clockTick);
                    }
                    //To far left turn and go right
                    if(super.withinRange()&&this.game.player.x-(this.x+this.BB.width) > 100){
                        this.state="TURN"
                        this.turnTime = this.game.timer.gameTime;
                        this.movingDirection =1;
                    }
                //Movement Right    
                }else if(this.movingDirection==1){
                    this.facingDirection = 1;
                    if(!this.halt){
                        this.x += (this.speed * this.game.clockTick);
                    }
                    //To far right turn and go left
                    if(super.withinRange() && this.game.player.x-(this.x) < -100){
                        this.state="TURN"
                        this.turnTime = this.game.timer.gameTime;
                        this.movingDirection = 0;
                    }
                    
                }
            

        }
        this.y += (this.speed * this.game.clockTick);    
        this.updateBB();
        this.collisionChecks();
    }

 
    updateBB(){
        this.lastBB = this.BB;
        //For potential refactoring
        this.runRight = [[50,20,180,240],
                         [50,20,180,240],
                         [50,20,180,240],
                         [30,20,200,240],
                         [20,20,210,240],
                         [15,20,215,240],
                         [20,20,210,240],
                         [30,20,200,240]];

        if(this.state == "IDLE" || this.state == "WALK" || this.state == "TURN"){
            this.BB = new BoundingBox(this.game,this.x+40, this.y+20, 140,240, "red");
        }else if(this.state == "RUN"){
            
            //TODO refactoring adjustable bounding boxes; current fix attempt failed
            //Left
            if(this.facingDirection==0){
                //super.movingBB("RUN",this.runRight,8);             
                if(this.animationList["RUN"].currentFrame()<1){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<2){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<3){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<4){
                    this.BB = new BoundingBox(this.game,this.x+30, this.y+20, 200,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<5){
                    this.BB = new BoundingBox(this.game,this.x+20, this.y+20, 210,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<6){
                    this.BB = new BoundingBox(this.game,this.x+15, this.y+20, 215,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<7){
                    this.BB = new BoundingBox(this.game,this.x+20, this.y+20, 210,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<8){
                    this.BB = new BoundingBox(this.game,this.x+30, this.y+20, 200,240, "red");
                }
            //Right 
            }else {
                if(this.animationList["RUN"].currentFrame()<1){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<2){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<3){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 180,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<4){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 200,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<5){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 210,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<6){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 215,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<7){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 210,240, "red");
                }else if(this.animationList["RUN"].currentFrame()<8){
                    this.BB = new BoundingBox(this.game,this.x+50, this.y+20, 200,240, "red");
                }
            }
        }
    }


    draw(ctx) {
        ctx.save();
        if(this.state == "DEAD") { // we want to fade out on death.
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
}
class Hive_Knight extends Enemy {
    constructor(game, x, y) {
        super(game, x, y);
        // TODO: adjust Animator arguments for sprite sheet
        this.animator = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
    }

    onCollision(entity) {

        if (entity instanceof CharacterController) {
            entity.dead = true;
            console.log(this.name + " collision with Hornet = LOSS");
        }
    }
    update() {

        // mechanics for how / where the enemy moves:
        if(this.state == "DEAD") {  // TODO: sound on death?
            // we don't move on death, and can't do any damage, so no BB.
            this.BB = undefined;
            return;
        }
        this.updateBB();
        this.collisionChecks();
    }
    draw(ctx) {
        ctx.save();
        if(this.state == "DEAD") { // we want to fade out on death.
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
}
class Flag_Block {
    //Scalling added to allow single block to span any gap size
    constructor(game, x, y, xScale, yScale) {
        Object.assign(this, { game, x, y, xScale, yScale});
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Dirt_Block.png"),
            2, 2, 62, 62, 1, 1, 1, 1)

        this.speed = 0;
        this.updateBB();
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game,this.x, this.y, 64*this.xScale, 64*this.yScale, "blue");
    }

    update() {
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController) {

                    console.log("Block collision with Hornet = WIN")
                }
            }
        });
    }

    draw(ctx) {
        this.updateBB(); // race condition because camera moves fast enough to cause drift
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y-this.game.camera.y)
        this.BB.draw(ctx);
    };
}