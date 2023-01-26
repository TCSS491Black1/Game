class CharacterController {
    CHARACTER_SPRITESHEET = "./assets/hornet.png";
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.player = this;

        this.viewWidth = 1024;
        this.viewHeight = 768;
        this.x = 0;
        this.y = 500;

        this.jumpInitPosition = null;
        this.jumpInitTime = null;
        
        this.speed = 300;
        this.velocity = { x: 0, y: 0 };

        this.gravity = 500;

        this.facingDirection = 0; // 1 is right, 0 is left? sprites happen to face left by default.
        this.state = "WALK";

        this.dead = false;
        
        this.animationList = {};

        //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth){
        //(Idle)
        this.animationList["IDLE"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 954, 184, 214, 6, 0.1, 1, 3);
        //Walk/run
        this.animationList["WALK"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1191, 159, 191, 8, 0.1, 1, 3);
        //Jump
        this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1626, 188, 214, 9, 0.3, 0, 3);
        //Attack
        this.animationList["ATTACK"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 827, 8280, 349, 368, 1, 1, 0, 0, -400, 100);
        //Death
        this.animationList["DEATH"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 9922, 300, 225, 5, 0.1, 0, 3, 0,-10);
        //Dead.
        this.animationList["DEAD"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 1216, 9922, 300, 225, 1, 0.5, 1, 3,0,-10);

        this.game.addEntity(new Background(this.game));
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 40, this.y, 80, 215);  
    };

    updateAttackBB(){
        this.lastAttackBB = this.attackBB;                                                                    
        this.attackBB = new BoundingBox(this.x, this.y - 80, 339, 300);
    }

    update() {
        const MAXRUN = 600;
        
        //Small Jump
        if (this.game.keys["w"] && this.state != "JUMP") {
            console.log("small jump");
            this.state = "JUMP";
            this.jumpInitTime = new Date();
            this.jumpInitPosition = {x:this.x, y:this.y};
        }

        if(this.jumpInitTime !== null && this.jumpInitPosition !== null) {
            // credit for jump formulae https://www.youtube.com/watch?v=hG9SzQxaCm8
            // note: video assumes different coordinate system than canvas. 
            const t = (new Date() - this.jumpInitTime)/1000; // current air time(seconds)
            const t_h = 0.25;       // time to apex of jump in seconds.
            const h = 200;          // desired height of jump (in pixels)
            const v_0 = -2*h/t_h;   // initial velocity in the y axis
            const g = 2*h/(t_h**2); // acceleration due to gravity.
            
            this.y = 0.5*g*t**2 + v_0*t + this.jumpInitPosition.y;
        }

        if (this.game.keys["d"]) {                                    // Move/accelerate character right
            if(this.state != "JUMP") this.state = "WALK";             // walk if not mid-air
            this.facingDirection = 1;                                 // facing the right
            this.velocity.x = Math.min(this.velocity.x + 10, MAXRUN); // increase velocity by 10, up to MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        }
        else if (this.game.keys["a"]) {                               // Move/accelerate character left
            if(this.state != "JUMP") this.state = "WALK";             // walk if not mid-air
            this.facingDirection = 0;                                 // face left
            this.velocity.x = Math.max(this.velocity.x - 10, -MAXRUN);// decrease velocity by 10 until -MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        }

        // IDLE: if no game keys are being pressed, and we aren't mid-air, we stop and IDLE:
        // game keys: a, d, w, r
        if (!['a','d','w','r'].some(key => this.game.keys[key]) && this.state != "JUMP") {                              
            console.log("Stopping.");
            this.state = "IDLE";
            this.velocity.x = 0;
        }
        
        // bottom out on the floor. TODO: use bounding boxes w/ floor tiles instead
        this.y = Math.min(this.y, 500);  
        // we were jumping/falling, but collision w/ ground detected:
        // TODO: find solution to this race condition. If state == "JUMP" and y == 500 @ jump start
        //          then we abort before we begin.
        if (this.y >= 500 && this.state == "JUMP" && (new Date() - this.jumpInitTime)/1000 > 0.01) {
            this.jumpInitTime = null;      // cleaning up jump data on landing
            this.jumpInitPosition = null; 

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

        if (this.game.keys["r"]) { // attack key                                                        
            console.log("attacking");
            this.state = "ATTACK";
            // if(this.facingDirection == 1){
            //     this.x-this.xoffset = -400;
            // }
            this.updateAttackBB();
        }

        if(this.dead === true) { // death state stays. timer before reset?
            this.state = "DEAD";
            console.log("dead");
            this.velocity = { x: null, y: null };
            this.y = 580; //ground - ish
        }


        
        this.updateBB();

        //Collisions
        var that = this;
        that.game.entities.forEach(function (entity) {
            if (that != entity && entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof Uoma) {
                    console.log("Hornet collided with Uoma");
                    that.state = "DEATH";
                    that.velocity.x = 0;
                }
            } 
            // else if (that != entity && entity.BB && that.attackBB.collide(entity.BB)) {             // tried figuring out collision with attacking Uoma entity, not working. -Michael
            //     if (entity instanceof Uoma) {
            //         console.log("Hornet killed Uoma");
            //         //entity.dead = true;
            //     }
            // }
        }
        );
    };

    draw(ctx) {
        ctx.save();
        // draw the character's bounding box:
        ctx.strokeStyle = 'Lime';
        ctx.lineWidth = 3;
        if(this.state == 'ATTACK') {
            ctx.strokeRect(this.attackBB.x, this.attackBB.y, this.attackBB.width, this.attackBB.height);
        } else {
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        // </boundingbox>
        }
        

        // draw character sprite, based on camera and facing direction:
        let destX = (this.x - this.game.camera.x);
        if (this.facingDirection) {// if facing right
            ctx.scale(-1, 1);
            destX *= -1;
            destX -= this.animationList[this.state].width;
        }
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx,
            destX,
            this.y);
        ctx.restore();

        // if (this.dead === true) { // respawn character on death?                     // commented out so that you can actually see the death animation. comment back in to fix
        //     this.game.addEntity(new SceneManager(gameEngine));
        // }

    };
}