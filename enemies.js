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
        this.HP = this.MAXHP = 1;
        this.damage = 1;
        this.timeDamageLastTaken = 0;
        this.damageTakenCooldown = 0.25; // only take damage once per 0.25 seconds

        this.speed = 100;
        this.state = "WALK";
        this.animationList = {}
        this.alpha = 1;
        this.healthbar = new Healthbar(this);//this.HP, this.HP, this.width, this.x, this.y);
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

        this.healthbar.draw(ctx);
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
    takeDamage(amount) {
        const t = this.game.timer.gameTime;
        if(t - this.timeDamageLastTaken > this.damageTakenCooldown) {
            this.timeDamageLastTaken = t;
            this.HP -= amount;
            if(this.game.options.debugging) {
                console.log("enemy:", this.constructor.name, " taking " + amount + " dmg ", this.HP);
            }
            this.game.addEntity(new FloatingText(amount, this.x, this.y, "white", 1));
        }
    }
    isDead() {
        return this.HP <= 0;
    }
    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game,this.x + 45, this.y + 35, 70, 90, "red");
    }
    // Check for if player is close enough to focus on must be facing each other.
    withinRange(){
        //Check for distance between player and enemy 
        if(Math.abs(this.game.player.x + this.game.player.BB.width/2 - this.x + this.BB.width/2) < 1000 &&
           Math.abs(this.game.player.y + this.game.player.BB.height/2 - this.y + this.BB.height/2) < 400 ){

            //Check for if enemy is facing player if so we can focus on player
           // if((this.game.player.x > this.x && this.facingDirection == 1)||(this.game.player.x <= this.x && this.facingDirection == 0)){
                return true;
          //  }
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
        this.animationList["WALK"] = this.animationList["IDLE"] = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4);
        this.animationList["DEAD"] = new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4); // TODO: change/correct parameters.
        this.alpha = 1;
        this.updateBB();
        this.HP = this.MAXHP = 1;
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
         //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop , spriteBorderWidth, xoffset, yoffset, scale, rowCount, rowOffset){
       // console.log(this.asset  )
        this.animationList["IDLE"] = new Animator(this.asset, 4, 325, 208, 263, 6, 0.1, 1, 3 );
        this.animationList["WALK"] = new Animator(this.asset, 4, 610, 226, 259, 8, 0.15, 1, 3);
        this.animationList["DEAD"] = new Animator(this.asset, 371, 3600, 154, 164, 3, 0.2, 0, 3);
        this.animationList["RUN"] = new Animator(this.asset, 4, 1192, 264, 245, 8, 0.1 , 1, 3);
        this.animationList["TURN"] = new Animator(this.asset, 6, 902, 242, 230, 2, 0.1 , 0, 3);
        this.animationList["STARTLE"] = new Animator(this.asset, 532, 903, 250, 266, 4, 0.2, 0, 3.2);
        this.animationList["ATTACK"] = new Animator(this.asset, 4, 1460, 406, 331, 12, 0.1, 0, 3,0,0,1,2,6,335);
        this.animationList["CHARGE"] = new Animator(this.asset, 4, 3065, 352, 200, 6, 1, 1, 3);
        this.animationList["CHARGE_END"] = new Animator(this.asset, 4, 3290, 341, 287, 5, 1, 1, 3);

        // ATTACK
        // JUMP
        this.focused = false;
        this.HP = this.MAXHP = 5;
        this.runFrameCount = 1;
        this.halt = false;
        this.onGround = false;
        this.movingDirection = 0;
        this.turnTime = 0;
        this.attackTime = 0;
        this.startleTime = 0;
        this.state = "WALK";
        this.damage = 3;
        this.updateBB();
        //this.updateLedgeCheck();
    }

    attackRange(){
        if(super.withinRange()){
            if(this.game.player.onGround == this.onGround &&  ((this.facingDirection == 1 && this.game.player.x - this.x < 300))){
                // console.log("true")
                return true;
            }else if(this.game.player.onGround == this.onGround && ((this.facingDirection == 0 && this.x - this.game.player.x < 75))){
                // console.log("true")
                return true;
            }
        }
        return false;

    }

    attack(){
        this.state = "ATTACK";
        this.halt = true;
        this.attackTime = this.game.timer.gameTime;
    }

    chargeRange(){
        if(super.withinRange()){
            if(this.game.player.onGround == this.onGround &&  ((this.facingDirection == 1 && this.game.player.x - this.x < 600))){
                console.log("true")
                return true;
            }else if(this.game.player.onGround == this.onGround && ((this.facingDirection == 0 && this.x - this.game.player.x < 375))){
                console.log("true")
                return true;
            }
        }
        return false;
    }

    charge(){
        this.state = "CHARGE";
        this.attackTime = this.game.timer.gameTime;
    }


    onCollision(entity) {
        
        if(entity instanceof Ground && (this.lastBB.bottom-14 <= entity.BB.top)){
            this.onGround = true;
            //Keep enemy on surface
            

            //Keep from falling off ledges if not in follow character mode
            //Left side stop or turn
            if(this.state != "ATTACK"){
                
                this.y = entity.BB.top-this.BB.height-14;
                if(entity.BB.x - this.BB.x > 0 && this.movingDirection == 0){
                    if(super.withinRange()){
                        this.halt = true;
                        console.log("halted here")
                        this.state = "IDLE";
                    }else{
                        this.halt = false;
                        this.state = "TURN";                      
                        this.movingDirection = 1;
                        this.x += 10;
                    }
                //Right side stop or turn
                }else if(entity.BB.x+entity.BB.width - this.BB.x < 200 && this.movingDirection == 1){
                    if(super.withinRange()){
                        console.log("halted here")
                        this.halt = true;
                        this.state = "IDLE";

                    }else{
                        this.halt = false;
                        this.state = "TURN";
                        this.movingDirection = 0;
                        this.x -= 10;
                    }
                }
            }else if (this.state == "ATTACK"){
                const frame = this.animationList["ATTACK"].currentFrame();
                const deltay = entity.BB.top-this.BB.height;
                const yOffsets =  [ 75, 75, 75, 75, 75, 75, 75, 20, 75, 155, 155, 155];
                this.y = deltay - yOffsets[frame];
            }
        }

        if (entity instanceof CharacterController) {
            //entity.dead = true;
            //entity.HP -= this.damage;
            //this.state = "DEAD";
            //console.log(this.name + " collision with Hornet = LOSS");
        }
    }
    
    update() {
        //console.log(this.focused+" "+this.attackTime+" "+super.withinRange());
        if(this.state == "DEAD") {  // TODO: sound on death?
            this.BB = undefined;
            this.y = this.y+3;
            return;
        //Stand wating at end of platform if player is within sight    
        }
        //console.log(this.attackTime);

        if(this.attackTime == 0){
            this.focused = super.withinRange();
        }
        //Focused on Player
        if(this.focused){
            //Found player so run now
            if(this.state == "WALK"){
                this.state = "STARTLE";
                this.startleTime = this.game.timer.gameTime;
            }
            else if(this.state == "STARTLE" && this.game.timer.gameTime - this.startleTime >  1.2   ){
                this.animationList["STARTLE"] = new Animator(this.asset, 532, 903, 250, 266, 4, 0.2, 0, 3.2);
                this.halt = false;
                this.state = "RUN";
            }
            //Turn to follow and resume running
            else if(this.state == "TURN"){
                this.attackTime =0;
                this.startleTime =0;
                if(this.game.timer.gameTime-this.turnTime > 0.25){
                    this.animationList["TURN"] = new Animator(this.asset, 6, 902, 242, 230, 2, 0.1 , 0, 3);
                    this.halt = false;
                    this.state = "RUN";
                }
            //Follow player if within sight
            }else if(this.state == "RUN" && this.onGround){
                //Movement Left
                this.startleTime = 0;
                if(this.movingDirection == 0){
                    this.facingDirection = 0;
                    if(!this.halt){
                        this.x -= (this.speed*1.5 * this.game.clockTick);
                    }
                   
                    if(this.attackRange()){
                        this.attack();
                        this.x -= 100;
                    }

                    //To far left turn and go right
                    if(this.game.player.x-(this.x+this.BB.width) > 100){
                        this.state="TURN"
                        this.x +=50;
                        this.turnTime = this.game.timer.gameTime;
                        this.movingDirection =1;
                    }

                //Movement Right    
                }else if(this.movingDirection == 1){
                    this.facingDirection = 1;
                    if(!this.halt){
                        this.x += (this.speed*1.5 * this.game.clockTick);
                    }

                    if(this.attackRange()){
                        //console.log(this.attackRange());
                        this.attack();
                    }

                    //To far right turn and go left
                    if(this.game.player.x-(this.x) < -100){
                        this.state="TURN"
                        this.turnTime = this.game.timer.gameTime;
                        this.movingDirection = 0;
                    }



                }
            }else if(this.state == "ATTACK"){
                //console.log("In update attack")

                if(this.game.timer.gameTime-this.attackTime > 1.3){
                    this.animationList["ATTACK"] = new Animator(this.asset, 4, 1462, 406, 330, 12, 0.1, 0, 3,0,0,1,2,6,335);
                    if(this.attackRange()){
                        this.state = "ATTACK";
                        this.attackTime = this.game.timer.gameTime;

                    }else{
                        console.log("EndedAttack");
                        this.attackTime = 0;
                        this.state = "RUN";
                        this.y += 60;
                        this.halt = false;
                    }
                }

            }
        //Not focused movements    
        }else{
            this.attackTime = 0;
            this.startleTime = 0;
            this.state = "WALK";
            if(this.state == "IDLE"){
                this.state = "TURN";
            }else if(this.state == "TURN"){
                if(this.game.timer.gameTime-this.turnTime > 0.25){
                    this.animationList["TURN"] = new Animator(this.asset, 6, 902, 242, 230, 2, 0.1 , 0, 3);
                    this.state = "WALK";
                }
            //Follow player if within sight else pace back and forth
            }else if(this.state == "WALK" && this.onGround){
                //Movement Left
                if(this.movingDirection == 0){
                    this.facingDirection = 0;
                    this.x -= (this.speed * this.game.clockTick);
                    
                //Movement Right    
                }else if(this.movingDirection==1){
                    this.facingDirection = 1;
                    this.x += (this.speed * this.game.clockTick);
            
                }
            }
        }

        this.y += (this.speed * this.game.clockTick);    
        this.updateBB();
        this.collisionChecks();
    }

 
    updateBB(){
        this.lastBB = this.BB;

        const moveBB = (deltaX, deltaY, w, h) => { // moves the BB by given deltas, width and height
            this.BB = new BoundingBox(this.game, this.x + deltaX, this.y + deltaY, w, h, "red");
        }
        if(this.state == "IDLE" || this.state == "WALK" || this.state == "TURN" || this.state == "STARTLE"){
            moveBB(40, 20, 140, 240);
        }else if(this.state == "CHARGE"){
            moveBB(25, 20, 195, 160);
        }else if(this.state == "CHARGE_END"){
            moveBB(110, 40, 140, 240);
        }else if(this.state == "RUN"){
            const frame = this.animationList["RUN"].currentFrame();
            //Left
            if (this.facingDirection == 0) {
                const runLeft = [
                    [50, 20, 180, 240],
                    [50, 20, 180, 240],
                    [50, 20, 180, 240],
                    [30, 20, 200, 240],
                    [20, 20, 210, 240],
                    [15, 20, 215, 240],
                    [20, 20, 210, 240],
                    [30, 20, 200, 240]];
                moveBB(...runLeft[frame]);
                
            } else { //Right 
                const runRight = [
                    [50, 20, 180, 240],
                    [50, 20, 180, 240],
                    [50, 20, 180, 240],
                    [30, 20, 200, 240],
                    [20, 20, 210, 240],
                    [15, 20, 215, 240],
                    [20, 20, 210, 240],
                    [30, 20, 200, 240]];

                moveBB(...runRight[frame]);
            }
        }else if(this.state == "ATTACK"){
            //Left
            const frame = this.animationList["ATTACK"].currentFrame();
            if(this.facingDirection==0){
                const leftAttacks = [
                    [180, 80, 140, 240],
                    [200, 80, 160, 240],
                    [200, 80, 160, 240],
                    [200, 80, 160, 240],
                    [200, 80, 160, 240],
                    [200, 80, 180, 240],
                    [200, 80, 160, 240],
                    [120, 20, 240, 300],
                    [10, 80, 310, 240],
                    [10, 160, 310, 160],
                    [10, 160, 310, 160],
                    [30, 160, 290, 160],
                ];
                moveBB(...leftAttacks[frame]);
            //Right
            }else{
                const rightAttacks = [
                    [90, 80, 140, 240],
                    [60, 80, 160, 240],
                    [50, 80, 160, 240],
                    [40, 80, 160, 240],
                    [40, 80, 160, 240],
                    [20, 80, 180, 240],
                    [40, 80, 160, 240],
                    [70, 20, 240, 300],
                    [100, 80, 310, 240],
                    [100, 160, 310, 160],
                    [100, 160, 310, 160],
                    [100, 160, 290, 160]];
                moveBB(...rightAttacks[frame]);
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
            //entity.dead = true;
            //entity.HP -= this.damage;
            //console.log(this.name + " collision with Hornet = LOSS");
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
class Pit_Glow {
    //An animation to signal the appropriate pit to jump into in order to descend to the next level.
    constructor(game, x, y, xScale, yScale) {
        Object.assign(this, { game, x, y, xScale, yScale});
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Pit_Glow.png"),
            0, 0, 129, 130, 64, 0.04, 1, 0)
        this.speed = 0;
    }

    update() {
        
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y-this.game.camera.y)
    };
}

class Healthbar {
    constructor(owner, width) {
        this.owner = owner;
        this.game = gameEngine;
        //this.max = owner.HP; // should start with max HP (assumptions made.)
        this.width = width;
    }
    update() {
           
    }
    draw(ctx) {
        ctx.save();  
        const max = this.owner.MAXHP;
        const HP = this.owner.HP;
        const width = this.width | 20*max; // provide a default/standardized bar size.
        const ratio = HP / max;
        ctx.fillStyle="black"; // black background for empty health.
        // fillRect(startx, starty, width, height)
        ctx.fillRect(this.owner.x - this.game.camera.x, this.owner.y-this.game.camera.y, width, 3);

        ctx.fillStyle="#66161c"; // dark red for full health.
        console.log(this.owner.constructor.name, ratio*width, width);
        ctx.fillRect(this.owner.x - this.game.camera.x, this.owner.y-this.game.camera.y, Math.ceil(ratio*width), 3);
        ctx.restore();
    }
    
}