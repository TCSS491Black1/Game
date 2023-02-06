class CharacterController {
    CHARACTER_SPRITESHEET = "./assets/hornet.png";
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        console.log(x+" "+y)

        this.game.player = this;

        this.viewWidth = 1024;
        this.viewHeight = 768;
        this.x = 0;
        this.y = 0;

        this.jumpInitPosition = null;
        this.jumpInitTime = null;
        this.v_0 = 0;

        this.speed = 300;
        this.velocity = { x: 0, y: 0 };

        this.gravity = 500;

        this.facingDirection = 1; // 1 is right, 0 is left? sprites happen to face left by default.
        this.state = "WALK";

        this.dead = false;
        this.updateBB();

        this.animationList = {};

        //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth, xoffset, yoffset){
        //(Idle)
        this.animationList["IDLE"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 954, 184, 214, 6, 0.1, 1, 3);
        //Walk/run
        this.animationList["WALK"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1191, 159, 191, 8, 0.1, 1, 3);
        //Jump
        this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1626, 188, 214, 9, 0.3, 0, 3);
        //Attack
        this.animationList["ATTACK"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 827, 8270, 349, 368, 1, 1, 0, 0, 0, 100);
        //Death
        this.animationList["DEATH"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 9922, 300, 225, 5, 0.1, 0, 3, 0, -10);
        //Dead.
        this.animationList["DEAD"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 1216, 9922, 300, 225, 1, 0.5, 1, 3, 0, -10);

        this.onGround = true;
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game,this.x + 40, this.y, 80, 215, "lime");
    };

    updateAttackBB() {
        this.lastAttackBB = this.attackBB;
        if (this.facingDirection == 0) {
            this.attackBB = new BoundingBox(this.game,this.x - 200, this.y- 80, 339, 300, "yellow");
        } else {
            this.attackBB = new BoundingBox(this.game,this.x, this.y - 80, 339, 300, "yellow");
        }
    }

    update() {
      
        const MAXRUN = 600;
        // some constants for jumping & falling physics:
        const h = this.animationList["IDLE"].height; // desired height of jump (in pixels)
        const t_h = 0.25;                           // time to apex of jump in seconds. jump duration = 0.5    
        const g = 2*h/(t_h**2);                     // acceleration due to gravity.

        //Small Jump
        if (this.game.keys["w"] && this.state != "JUMP") {
            console.log("small jump");
            this.state = "JUMP";
            this.v_0 = -2*h/t_h;                // initial velocity in the y axis
            this.jumpInitTime = new Date();
            this.jumpInitPosition = { x: this.x, y: this.y };
        }

        const gravY = (t, v_0) => {
            // determines correct position given time, initial velocity, and initial position in the y axis
            // credit for jump formulae https://www.youtube.com/watch?v=hG9SzQxaCm8
            // note: video assumes different coordinate system than canvas.    
            return Math.floor(0.5*g*t**2 + v_0*t + this.jumpInitPosition?.y);
        }
        if(!this.onGround && this.wasOnGround && this.jumpInitTime == null && this.jumpInitPosition == null) {
            // did not jump, but still falling:
            this.jumpInitTime = new Date();
            this.jumpInitPosition = {x:this.x, y:this.y};
        }
        if(this.jumpInitTime !== null && this.jumpInitPosition !== null) {
            const t = (new Date() - this.jumpInitTime)/1000; // current air time(seconds)
            this.y = gravY(t, this.v_0);
        }

        if (this.game.keys["d"]) {                                    // Move/accelerate character right
            if (this.state != "JUMP") this.state = "WALK";             // walk if not mid-air
            this.facingDirection = 1;                                 // facing the right
            this.velocity.x = Math.min(this.velocity.x + 10, MAXRUN); // increase velocity by 10, up to MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        }
        else if (this.game.keys["a"]) {                               // Move/accelerate character left
            if (this.state != "JUMP") this.state = "WALK";             // walk if not mid-air
            this.facingDirection = 0;                                 // face left
            this.velocity.x = Math.max(this.velocity.x - 10, -MAXRUN);// decrease velocity by 10 until -MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        }

        // IDLE: if no game keys are being pressed, and we aren't mid-air, we stop and IDLE:
        // game keys: a, d, w, r
        if (!['a', 'd', 'w', 'r'].some(key => this.game.keys[key]) && this.state != "JUMP") {
           //console.log("Stopping.");
            this.state = "IDLE";
            this.velocity.x = 0;
        }

        // we were jumping/falling, but collision w/ ground detected:
        if (this.onGround && !this.wasOnGround){
            this.jumpInitTime = null;      // cleaning up jump data on landing
            this.jumpInitPosition = null;
            this.v_0 = 0;

            if (this.game.keys["a"] || this.game.keys["d"]) // change animation after landing:
                this.state = "WALK";
            else {
                this.state = "IDLE";
                this.velocity.x = 0;
            }
        }

        if (this.game.keys["g"]) { // cheat/reset character location/state
            this.velocity = { x: 0, y: 0 };
            this.state = "IDLE";
            this.x = 0;
            this.y = 200;
        }
        this.y += 9;

        if (this.game.keys["r"]) { // attack key                                                        
            console.log("attacking");
            this.state = "ATTACK";
            if (this.facingDirection == 0) {
                this.animationList["ATTACK"].xoffset = 200;
            } else {
                this.animationList["ATTACK"].xoffset = 0;
            }
            this.updateAttackBB();
        }

        if (this.y >= 2000) {
            this.dead = true;
        } // fall off the map and die

        if (this.dead === true) { // death state makes Hornet stay dead. Should we keep Hornet on screen during reset popup? timer before reset?
            this.state = "DEAD";
            console.log("dead");
            this.velocity = { x: null, y: null };
            this.y = 580; //ground - ish
        }

        

        this.updateBB();
       

        //Collisions
        this.wasOnGround = this.onGround;
        this.onGround = false; // assume not on ground until we detect collision w/ Ground block
        this.game.entities.forEach((entity) => {
            if (this != entity && entity.BB && this.BB.collide(entity.BB)) {
                if (entity instanceof Uoma) {
                    this.dead = true;
                    console.log("Hornet collided with Uoma");
                    this.state = "DEATH";
                    this.velocity.x = 0;
                    this.dead = true;
                }

                if (entity instanceof Ground && (this.lastBB.bottom <= entity.BB.top)) {

                    this.y = entity.BB.top-this.BB.height - 2;
                    this.velocity.y = 0 ;
                    this.onGround = true;
            
                    
                    
                    this.updateBB(); // updating BB only required because we moved
                }
                //These will be for moving to the next level later.
                if (entity instanceof Flag_Block && (this.lastBB.collide(entity.BB))) {
                 
                    this.state = "IDLE";
                    this.game.camera.loadNextLevel(50, 0);

                }
            }
        
        
            // tried figuring out collision with attacking Uoma entity, not working. -Michael
        if (this.state=="ATTACK" && this != entity && entity.BB && this.attackBB.collide(entity.BB)) {             
            if (entity instanceof Enemy) {
                console.log("Hornet killed " + entity.constructor.name);
                entity.state="DEAD";
            }
        }
    });
        //that.updateBB(); // updating BB due to collision-based movement
    };

    draw(ctx) {
        ctx.save();
        // draw the character's bounding box:
        if (this.state == 'ATTACK') {
            this.attackBB.draw(ctx);
        } else {
            this.BB.draw(ctx);
        }

        // draw character sprite, based on camera and facing direction:
       
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

        if (this.dead === true) { // respawn character on death?

            this.game.camera.clearEntities();
            this.game.addEntity(new ReplayScreen(this.game));
        }
    };
}