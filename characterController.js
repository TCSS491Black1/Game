class CharacterController {
    CHARACTER_SPRITESHEET = "./assets/hornet.png";
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.player = this;

        this.viewWidth = 1024;
        this.viewHeight = 768;
        this.x = 0;
        this.y = 0;

        this.speed = 300;

        this.facingDirection = 1; // 1 is right, 0 is left? sprites happen to face left by default.
        this.state = "WALK";

        this.HP = 10;
        this.dead = false;
        this.updateBB();
        this.attackBeginTime = undefined;

        this.scale = 0.5;
        this.animationList = {};

        const spritesheet = ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET);
        //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth, xoffset, yoffset){
        this.animationList["IDLE"] = new Animator(spritesheet, 4, 954, 184, 214, 6, 0.1, 1, 3, 0, 0, this.scale);
        this.animationList["WALK"] = new Animator(spritesheet, 4, 1191, 159, 191, 8, 0.1, 1, 3, 0, 0, this.scale);
        this.animationList["JUMP"] = new Animator(spritesheet, 4, 1626, 188, 214, 9, 0.3, 0, 3, 0, 0, this.scale);
        this.animationList["ATTACK"] = new Animator(spritesheet, 827, 8270, 349, 368, 1, 1, 0, 0, 0, 100 * this.scale, this.scale);
        this.animationList["DEATH"] = new Animator(spritesheet, 4, 9922, 300, 225, 5, 0.1, 0, 3, 0, -10, this.scale);
        this.animationList["DEAD"] = new Animator(spritesheet, 1216, 9922, 300, 225, 1, 0.5, 1, 3, 0, -10, this.scale);

        //******************** */
        // jump/gravity math variables:
        // credit for gravity formulae https://www.youtube.com/watch?v=hG9SzQxaCm8
        const h = this.animationList["IDLE"].height; // desired height of jump (in pixels)
        const t_h = 0.25;                           // time to apex of jump in seconds. jump duration = 0.5    
        this.g = 2 * h / (t_h ** 2);                     // acceleration due to gravity.
        this.v_0 = -2 * h / t_h;                        // initial velocity(on jump) in the y axis
        this.velocity = { x: 0, y: 0 };
        this.terminalVelocity = 50;                 // maximum rate of descent(pixels/second)

        this.phase = false;                         //For falling through platforms
        this.onGround = true;
        // end of gravity maths
        //******************* */

    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.game, this.x + 25, this.y, 80 * this.scale, 215 * this.scale, "lime");
    };

    updateAttackBB() {
        this.lastAttackBB = this.attackBB;
        const attackBBheight = this.animationList["ATTACK"].height * this.scale;
        const attackBBwidth = this.animationList["ATTACK"].width * this.scale * 0.5;

        if (this.facingDirection == 0) {
            this.attackBB = new BoundingBox(this.game, this.x - 200 * this.scale, this.y - 80 * this.scale,
                attackBBwidth, attackBBheight /*300*/, "yellow");
        } else {
            this.attackBB = new BoundingBox(this.game, this.x + attackBBwidth, this.y - 80 * this.scale,
                attackBBwidth, attackBBheight, "yellow");
            //this.attackBB = new BoundingBox(this.x - this.game.camera.x, this.y - 80, 339, 300, "yellow");
        }
    }
    changeState(newState, msg) {
        const oldState = this.state;
        this.state = newState;
        if (this.game.options.debugging && this.state != oldState)
            console.log("State changed to ", this.state, " from ", oldState, msg);
    }
    update() {
        const MAXRUN = 600;

        // Jump trigger
        if (this.game.keys["w"] && this.onGround && this.state != "JUMP" && this.state != "ATTACK") {
            this.changeState("JUMP", 84);
            this.velocity.y = this.v_0; // add upwards velocity 'cause that's what jumps are.

            this.game.soundEngine.playSound("./assets/sounds/sfx/jump.wav");
        }

        const t = this.game.clockTick;                // time elapsed since last frame
        this.velocity.y = this.velocity.y + this.g * t; // accelerate due to gravity.
        this.y += this.velocity.y * t;                // calculate new Y position from velocity.

        if (this.game.keys["d"]) {                                    // Move/accelerate character right
            if(this.state != "ATTACK")
                this.facingDirection = 1;                             // facing the right
            if (this.onGround) this.changeState("WALK", 91);          // walk if not mid-air
            this.velocity.x = Math.min(this.velocity.x + 10, MAXRUN); // increase velocity by 10, up to MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        }
        else if (this.game.keys["a"]) {                               // Move/accelerate character left
            if(this.state != "ATTACK")
                this.facingDirection = 0;                             // face left
            if (this.onGround) this.changeState("WALK", 99);          // walk if not mid-air
            
            this.velocity.x = Math.max(this.velocity.x - 10, -MAXRUN);// decrease velocity by 10 until -MAXRUN
            this.x += this.velocity.x * this.game.clockTick;          // increase position by appropriate speed
        } else if (this.onGround && this.state != "ATTACK") {
            this.changeState("IDLE", 104);
            this.velocity.x = 0;
        }

        //Phasing through current platform to land below
        if (this.game.keys["s"] && this.y + this.BB.height < this.game.camera.worldSize * params.canvasHeight - 32) {
            this.phase = true;
        } else {
            this.phase = false;
        }

        //****************** */
        // attack animation code.
        // This section is responsible for going into and leaving "ATTACK" state.
        if (this.game.click && this.attackBeginTime === undefined) { // begin attacking now on click.
            this.attackBeginTime = this.game.timer.gameTime;
            this.game.click = undefined;
        }
        const attackTimeElapsed = this.game.timer.gameTime - this.attackBeginTime;
        if (attackTimeElapsed < 0.3) { // attacks should last 0.3s                                                        
            this.game.click == undefined;
            this.changeState("ATTACK", 141);
            if(this.onGround) this.velocity.x = 0;

            if (this.facingDirection == 0) {
                this.animationList["ATTACK"].xoffset = 200 * this.scale;
            } else {
                this.animationList["ATTACK"].xoffset = 0;
            }
            this.updateAttackBB();
            for (const entity of this.game.entities.filter(e => e instanceof Enemy && e.BB !== undefined)) {
                // TODO: some of this logic should(?) probably be in the Enemy class
                if (this.attackBB.collide(entity.BB)) {
                    entity.HP--;
                    if (entity.HP <= 0) entity.state = "DEAD";
                }
            }
        } else if (attackTimeElapsed >= 0.4) { // cleanup after attack + internal cooldown of 0.1s
            this.attackBeginTime = undefined;
            if (!this.onGround)
                this.changeState("JUMP", 159);
            else {
                this.changeState("IDLE", 162);
            }
        }
        // end of attack code
        // ****************

        if (this.game.keys["g"]) { // cheat/reset character location/state
            this.velocity = { x: 0, y: 0 };
            this.changeState("IDLE", 164);
            this.x = 0;
            this.y = -params.canvasHeight * 6;
        }

        if (this.y >= 4000) { // fell off the map and died
            this.dead = true;
        }
        // death state makes Hornet stay dead. Should we keep Hornet on screen during reset popup?
        // timer before reset?
        if (this.dead === true) { 
            this.changeState("DEAD");
            console.log("dead");
            this.velocity = { x: 0, y: 0 };
            this.y = 580; //ground - ish
        }

        this.updateBB();

        //Collisions
        this.wasOnGround = this.onGround;
        this.onGround = false; // assume not on ground until we detect collision w/ Ground block
        this.game.entities.forEach((entity) => {
            if (this != entity && entity.BB && this.BB.collide(entity.BB)) {
                if (entity instanceof Enemy) {
                    console.log("Hornet collided with " + entity.constructor.name);
                    this.HP--;
                    if (this.HP <= 0) {
                        this.changeState("DEATH")
                        this.dead = true;
                    }
                    if(this.lastBB.bottom <= entity.BB.top) { // if hit enemy from above, bounce.
                        this.y = entity.BB.top - this.BB.height;
                        this.velocity.y = -this.velocity.y;
                    } else if(this.lastBB.left < entity.BB.right && this.lastBB.right > entity.BB.right) {
                        // hit enemy from the right
                        this.x = entity.BB.left + entity.BB.width;
                        this.velocity.x = -this.velocity.x;
                    } else if (this.lastBB.right < entity.BB.right) { 
                        // hit enemy from the left
                        this.x = entity.BB.left - this.BB.width;
                        this.velocity.x = -this.velocity.x;
                    }
                }
                else if (entity instanceof Ground && (this.lastBB.bottom <= entity.BB.top) && !this.phase) {
                    this.y = entity.BB.top - this.BB.height;
                    this.velocity.y = 0;
                    this.onGround = true;
                    this.updateBB();
                } else if (entity instanceof Wall) {
                    //Land on top of wall
                    if (this.lastBB.bottom <= entity.BB.top) {
                        this.y = entity.BB.top - this.BB.height;
                        this.velocity.y = 0;
                        this.onGround = true;
                        this.updateBB();
                        //Hold to right of wall    
                    } else if (this.lastBB.left < entity.BB.right && this.lastBB.right > entity.BB.right) {
                        console.log("Move right");
                        this.velocity.x = 0;
                        this.x = entity.BB.right - 25;
                        //Hold to left of wall
                    } else if (this.lastBB.right < entity.BB.right) {
                        console.log("Move left");
                        this.velocity.x = 0;
                        this.x = entity.BB.left - this.BB.width - 25;

                    }
                }
                else if (entity instanceof Flag_Block && (this.lastBB.collide(entity.BB))) {
                    this.changeState("IDLE", 226);
                    this.game.camera.loadNextLevel(0, 0);
                }
            }

            // deal damage if attack hits enemy:
            if (this.state == "ATTACK" && this != entity && entity.BB && this.attackBB.collide(entity.BB)) {
                if (entity instanceof Enemy) {
                    entity.HP--;
                }
            }
        });
        this.updateBB(); // updating BB due to collision-based movement
    };

    draw(ctx) {
        ctx.save();
        // draw the character's bounding box:
        if (this.state == 'ATTACK') {
            this.attackBB.draw(ctx);
        }
        this.BB.draw(ctx);

        // draw character sprite, based on camera and facing direction:
        let destX = (this.x - this.game.camera.x);
        let destY = (this.y - this.game.camera.y);

        if (this.facingDirection) {// if facing right
            ctx.scale(-1, 1);
            destX *= -1;
            destX -= this.animationList[this.state].width * this.scale;
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