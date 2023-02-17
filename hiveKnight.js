class HiveKnight extends Enemy {

    constructor(game, x, y) {
        super(game, x, y);
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");

        // ---------------------------------------------------------------
        // new Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth, xoffset, yoffset, scale)
        // ------------ Sprite sheet setup ------------
        this.scale = 0.5;
        this.state = "IDLE";

        this.animationList = {
            "IDLE": new Animator(this.asset, 496, 19, 213, 348, 5, 0.2, 1, 3, 0, 0, this.scale),
            "TELEPORT-IN": new Animator(this.asset, 2083, 6788, 413, 311, 6, 0.1, 1, 3, 0, 0, this.scale),
        },
          
        // ------------ Sprite sheet setup complete. ------------

        // Set up other Hive Knight properties.
        this.alpha = 1;
        this.HP = 10;
        this.runFrameCount = 1;
        this.isHalted = false;
        this.isGrounded = false;
        this.isDead = false;
        this.facingDirection = 1;
        this.movingDirection = 0;
        this.turnTime = 0;
        this.velocity = {x:0, y:0};

        this.updateBB();
    }

    onCollision(entity) {

        // Check if HiveKnight is colliding with a ground entity.
        //      If so, set isGrounded to true and 
        //      set HiveKnight's y position to top of entity.BB.
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
        // Check if HiveKnight is colliding with the player.
        //     If so, deal damage to the player based on state.
        if(entity instanceof CharacterController) {
            entity.HP -= 1;
            console.log("Hornet collided with HiveKnight. Hornet HP: ", entity.HP);
        }
    }

    plotSine(input, amp = 100, freq = 20, scale = 20) {
        const amplitude = amp;
        const frequency = freq;
        const height = scale;
        
        // y = sin(x).
        const y = height/2 + amplitude * Math.sin(input/frequency);
        return y;
    }

    /**
     * Update HiveKnight's bounding box attributes based on current state.
     */
     updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game, 
            this.x+40, this.y, 230*this.scale, 360*this.scale, "red");
    }

    /**
     * Update HiveKnight's state and attributes based on last state.
     * State is updated on the cycle in onCollision().
     */
    update() {

        if(this.state == "DEAD") {
            this.BB = undefined;
            this.y = this.y - 10;
            return;

        } else if(this.state == "IDLE") {
            // Do a floating effect while waiting idling.
            this.velocity.x = 0;
            this.velocity.y = 0;

        } else if(this.state == "WALK") {
            // Walk back and forth.
            this.velocity.x = 0.5 * this.movingDirection;
            this.velocity.y = this.plotSine(this.velocity.y, 20, 20, 20);

        }
        // TODO: check all states here and if on ground/etc. and update 
        // velocities accordingly.

        this.y += (this.speed * this.game.clockTick);    
        this.updateBB();
        this.collisionChecks();
    }

    draw(ctx) {
        ctx.save();
        if(this.state == "DEAD") { // we want to fade out on death.
            this.alpha -= this.game.clockTick; // time delay?
        }
        ctx.globalAlpha = Math.abs(this.alpha); // abs because overshooting into negatives causes a flicker.
        
        // --------------- Sprite drawing. -------------------
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
        ctx.restore();
        // --------------- End of sprite drawing. -------------------

        if(this.alpha <= 0) {
            this.removeFromWorld = true;
            console.log(this.name, {x:this.x, y:this.y}, " has been removed.")
            ctx.globalAlpha = 1;
        }
    }
    
}