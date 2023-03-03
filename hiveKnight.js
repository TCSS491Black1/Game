class Hive_Knight extends Enemy {

    constructor(game, x, y) {
        super(game, x, y);
        this.name = this.constructor.name;
        this.asset = ASSET_MANAGER.getAsset("./assets/" + this.name + ".png");

        // ---------------------------------------------------------------
        // new Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth, xoffset, yoffset, scale)
        // ------------------------- Sprite sheet setup -------------------------
        this.scale = 0.5;
        this.state = "IDLE";

        this.animationList = {
            "INTRO": new Animator(this.asset, 0, 19, 235, 522, 2, 0.4, true, 3, 0, 0, this.scale),
            "TURN": new Animator(this.asset, 1608, 19, 228, 350, 1, 0.6, false, 3, 0, 0, this.scale),
            "IDLE": new Animator(this.asset, 496, 19, 213, 348, 5, 0.1, true, 3, 0, 0, this.scale),
            "DEAD": new Animator(this.asset, 0, 6502, 369, 281, 4, 0.1, true, 3, 0, 0, this.scale),
            "WALK": new Animator(this.asset, 4, 22, 172, 148, 6, 0.09, 1, 4),

            "TELEPORTOUT1": new Animator(this.asset, 815, 557, 236, 454, 2, 0.1, true, 3, 0, 0, this.scale),
            // FIXME: Needs TP2 to be fixed.
            "TELEPORTOUT2": new Animator(this.asset, 2083, 6788, 413, 311, 6, 0.1, true, 3, 0, 0, this.scale),
            
            "AIR": new Animator(this.asset, 1, 3373, 300, 407, 5, 0.1, true, 3, 0, 0, this.scale),
            "TELEPORTIN1": new Animator(this.asset, 1325, 557, 328, 204, 2.2, 5, false, 3, 0, 0, this.scale),
            "TELEPORTIN2": new Animator(this.asset, 0, 1033, 413, 311, 0.1, 1, true, 3, 0, 0, this.scale),
            // FIXME: Needs fixing.
            "TELEPORTSLASH": new Animator(this.asset, 0, 1366, 1102, 245, 1, 2.2, false, 3, 0, 0, this.scale),
            "TELEPORTSLASHRECOVERY": new Animator(this.asset, 1137, 1366, 260, 326, 2, 0.1, true, 3, 0, 0, this.scale),
            "JUMP": new Animator(this.asset, 0, 1713, 346, 290, 3, 0.12, true, 3, 0, 0, this.scale),

            "STABANTICIPATE": new Animator(this.asset, 0, 2026, 487, 356, 4, 0.12, true, 3, 0, 0, this.scale),
            "GSTABANTICIPATE1": new Animator(this.asset, 0, 3802, 254, 520, 2, 0.2, true, 3, 0, 0, this.scale),
            // FIXME: Needs fixing.
            "GSTABANTICIPATE2": new Animator(this.asset, 2083, 6788, 559, 235, 4, 0.2, true, 3, 0, 0, this.scale),
            "GSTAB": new Animator(this.asset, 0, 4344, 279, 408, 7, 0.08, true, 3, 0, 0, this.scale),
            
            "ROARANTICIPATE": new Animator(this.asset, 0, 4935, 272, 353, 2, 0.2, true, 3, 0, 0, this.scale),
            "ROAR": new Animator(this.asset, 582, 4935, 272, 353, 2, 0.1, true, 3, 0, 0, this.scale),
            "ROAR2": new Animator(this.asset, 582, 4935, 303, 366, 4, 0.1, true, 3, 0, 0, this.scale),
            // FIXME: Needs fixing.
            "STUNAIR": null,
            "STUNLAND": null,
            "DEATHAIR": null,
            "DEATHLAND": null,
            "DEATHIN": null,
            "GLOBUP": null,
            "GLOBFORM1": null,
            "GLOBFORM2": null,
            "GLOBBURST": null
        },
        // ------------ Sprite sheet setup complete. ------------
        
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

        if(entity instanceof Ground && (this.lastBB.bottom-14 <= entity.BB.top)){
            this.isGrounded = true;
            //Keep enemy on surface
            this.y = entity.BB.top-this.BB.height;
        }

        if(entity instanceof CharacterController) {
            if(entity.state == "ATTACK"){
                this.HP -= 10;
            } else {
                entity.HP -=1;
                // this.state = "TELEPORTSLASHRECOVERY"
                this.state = "JUMP"
            }

            console.log("Hornet collided with HiveKnight. Hornet HP: ", entity.HP);
        } else {
            // Set state to in-air.
            // this.state = "TELEPORTSLASHRECOVERY"
            this.state = "AIR";
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
            return;

        } else if(this.state == "IDLE") {
            // Do a floating effect while waiting idling.
            this.velocity.x = this.plotSine(100, 1000, 200, 50);
            this.velocity.y = this.plotSine(15, 20, 20, 20);

        } else if(this.state == "WALK") {
            // Walk back and forth.
            this.velocity.x = 0.5 * this.movingDirection;
            this.velocity.y = this.plotSine(this.velocity.y, 20, 20, 20);

        }

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
        
        // need a longer delay so that the death animation of the boss plays and THEN the credits screen pops up like 4 seconds later. 
        // comment out this if statement if we need to debug it so that it doesn't get in the way - michael
        if (this.removeFromWorld) { 
            this.game.camera.clearEntities();
            this.game.addEntity(new EndCreditsScreen(this.game));
        }
    }
    
}