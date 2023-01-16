class CharacterController {
    CHARACTER_SPRITESHEET = "./assets/hornet.png";
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.player = this;

        this.viewWidth = 1024;
        this.viewHeight = 768;
        this.x = 0;
        this.y = 500;

        this.speed = 100;
        this.velocity = { x: 0, y: 0 };

        this.gravity = 98;

        this.facingDirection = 0; // 1 is right, 0 is left? sprites happen to face left by default.
        this.state = "WALK";
        this.animationList = {};

        //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration,loop, spriteBorderWidth){
        //(Idle)
        this.animationList["IDLE"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 954, 184, 214, 6, 0.1, 1, 3);
        //Walk/run
        this.animationList["WALK"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1191, 159, 191, 8, 0.1, 1, 3);
        //Jump
        this.animationList["JUMP"] = new Animator(ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET), 4, 1626, 188, 214, 9, 0.3, 0, 3);
        this.game.addEntity(new Background(this.game));
    };

    update() {
        const MAXRUN = 200;
        if (this.game.keys["d"]) {
            this.facingDirection = 1;
        }
        else if (this.game.keys["a"]) {
            this.facingDirection = 0;
        }
        //Small Jump
        if (this.game.keys["w"] && this.state != "JUMP") {
            console.log("small jump");
            this.state = "JUMP";
            //this.velocity.x += 75 * (this.facingDirection?-1:1);
            this.velocity.y -= 75;
        }

        //Big Jump
        else if (this.game.keys["s"] && this.state != "JUMP") {
            console.log("big jump");
            this.state = "JUMP";
            //this.velocity.x += 75 * (this.facingDirection?-1:1);
            this.velocity.y -= 150;
        }

        /* TODO: why not be able to move left/right mid-air? */
        //Right
        else if (this.game.keys["d"]/* && this.state != "JUMP"*/) {
            if(this.state == "IDLE") this.state = "WALK";
    
            if (this.velocity.x > MAXRUN) {
                this.velocity.x = MAXRUN;
            } else {
                this.velocity.x += 100 * this.game.clockTick
            };
        }

        //Left
        else if (this.game.keys["a"]/* && this.state != "JUMP"*/) {
            if(this.state == "IDLE") this.state = "WALK";
            if (this.velocity.x < (-1) * MAXRUN) {
                this.velocity.x = (-1) * MAXRUN;
            } else {
                this.velocity.x -= 100 * this.game.clockTick
            };
            //this.velocity.x = 0;
        }
        
        // IDLE: if no keys are being pressed, and we aren't mid-air, we stop and IDLE:
        if (!Object.keys(this.game.keys).some(key => this.game.keys[key]) && this.state != "JUMP") {
            this.state = "IDLE";
            this.velocity.x = 0;
        } 
        this.velocity.y += this.gravity * this.game.clockTick;

        this.x += this.velocity.x * this.game.clockTick;
        this.y = Math.min(this.velocity.y, 500); // bottom out on the floor. TODO: bounding box collisions.
        if (this.y >= 500 && this.state == "JUMP") {// were jumping/falling, but collision w/ ground detected.
            if(this.game.keys["a"] || this.game.keys["d"])
                this.state = "WALK";
            else{
                this.state = "IDLE";
                this.velocity.x = 0;
            }
        }
        if(this.game.keys["g"]) { // cheat/reset character location/state
            this.velocity={x:0,y:0};
            this.state = "IDLE";
            this.x = 0
            this.y = 200;
        }
    };

    draw(ctx) {
        ctx.save();
        let destX = (this.x - this.game.camera.x);
        if(this.facingDirection) {// if facing right
            ctx.scale(-1,1);
            destX *= -1;
            destX -= this.animationList[this.state].width;
        }
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx, 
            destX, 
            this.y);
        ctx.restore();
    };
}