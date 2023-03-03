class CharacterController {
    CHARACTER_SPRITESHEET = "./assets/hornet.png";
    CHARACTER_ATTACK_SPRITESHEET = "./assets/hornetattack.png";

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
        
        this.damage = 1;
        this.damageBuffTime = 0;


        this.HP = 10;
        this.maxHP = 10;
        this.timeOfLastDamage = 0;
        this.invulnLength = 2;
        this.dead = false;
        this.updateBB();

        this.scale = 0.5;
        this.animationList = {};

        const spritesheet = ASSET_MANAGER.getAsset(this.CHARACTER_SPRITESHEET);
        this.attacksheet = ASSET_MANAGER.getAsset(this.CHARACTER_ATTACK_SPRITESHEET);

        //Animator(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth, xoffset, yoffset){
        this.animationList["IDLE"] = new Animator(spritesheet, 4, 954, 184, 214, 6, 0.1, 1, 3, 0, 0, this.scale);
        this.animationList["WALK"] = new Animator(spritesheet, 4, 1191, 159, 191, 8, 0.1, 1, 3, 0, -10, this.scale);
        this.animationList["JUMP"] = new Animator(spritesheet, 4, 1626, 188, 214, 9, 0.1, 0, 3, 0, 0, this.scale);

        this.animationList["ATTACK"] = new Animator(this.attacksheet, 0, 0, 378, 371, 4, 0.04, 0, 0, 0, 120 * this.scale, this.scale);
        this.animationList["DASH"] = new Animator(spritesheet, 0, 2780, 257, 135, 2, 0.2, 0, 3, 0, 0, this.scale); 
        
        this.animationList["DEATH"] = new Animator(spritesheet, 4, 9922, 300, 225, 5, 0.1, 0, 3, 0, -10, this.scale);
        this.animationList["DEAD"] = new Animator(spritesheet, 1216, 9922, 300, 225, 1, 0.5, 1, 3, 0, -10, this.scale);
        
        this.busy = false; // toggles for in the midst of a non-cancelable animation(ATTACK / DASH / ...)
        this.BUSY_STATES = ["ATTACK", "DASH", "DEATH", "DEAD"]; // states which cannot be inturrupted
        // if we're busy, we are:
        // * not IDLE, by definition.
        // * cannot change direction.
        // * cannot change state until the current animation completes.
        // * unlimited x velocity allows dashing to be a thing

        //******************** */
        // jump/gravity math variables:
        // credit for gravity formulae https://www.youtube.com/watch?v=hG9SzQxaCm8
        this.jumps = 0;     // number of jumps counted mid-air.
        this.jumpsTotal = 1; // number of jumps possible mid-air

        const h = this.animationList["IDLE"].height; // desired height of jump (in pixels)
        const t_h = 0.25;                            // time to apex of jump in seconds. jump duration = 0.5    
        this.g = 2 * h / (t_h ** 2);                 // acceleration due to gravity.
        this.v_0 = -2 * h / t_h;                     // initial velocity(on jump) in the y axis
        this.velocity = { x: 0, y: 0 };
        this.terminalVelocity = 50;                  // maximum rate of descent(pixels/second)

        this.phase = false;                           //For falling through platforms
        this.onGround = false;
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
        }
    }
    changeState(newState, msg) {
        const oldState = this.state;
        this.state = newState;
        if(this.BUSY_STATES.includes(newState)) this.busy = true;
        if (this.game.options.debugging && this.state != oldState)
            console.log("State changed to ", this.state, " from ", oldState, msg);
    }
    defaultState() {
        // calculates the common logic for returning to a reasonable state, when leaving another.
        if (this.onGround) {
            if(this.game.keys['a'] || this.game.keys['d'])
                this.changeState("WALK", 98);          // walk if not mid-air
            else
                this.changeState("IDLE", 100);
        } else 
            this.changeState("JUMP", 99);
    }


    update() {

        if(this.damageBuffTime > 0){
            console.log("Damage increased")

            this.damage = 2;
            this.damageBuffTime -= 0.05;
        }else{
           // console.log("Damaged ended")
            this.damage = 1;
        }


        const MAXRUN = 600;
        
        // check if current animation is a Busy State, and clean up if necessary.
        if(this.BUSY_STATES.includes(this.state) && this.animationList[this.state].isDone()) {
            // no longer busy, as animation has completed.
            this.busy = false;
            this.animationList[this.state].reset();
            this.defaultState();
        }

        // Jump trigger
        if (this.game.keys["w"] && !this.busy && this.jumps < this.jumpsTotal ) {
            this.game.keys["w"] = false;

            this.changeState("JUMP", 84);
            this.jumps += 1;
            this.velocity.y = this.v_0; // add upwards velocity 'cause that's what jumps are.
            this.game.soundEngine.playSound("./assets/sounds/sfx/attack.wav");
        }

        //***************** */
        // gravity calculations
        const clockTick = this.game.clockTick;                 // time elapsed since last frame
        this.velocity.y = this.velocity.y + this.g * clockTick; // accelerate due to gravity.

        //****************** */
        // attack animation code.
        // This section is responsible for management of attack collision and damage application.
        
        if (this.game.click !== undefined) {
            this.game.click = undefined;

            this.game.soundEngine.playSound("./assets/sounds/sfx/attack.wav");
            this.changeState("ATTACK", 141);

            if (this.facingDirection == 0) {
                this.animationList["ATTACK"].xoffset = 200 * this.scale;
            } else {
                this.animationList["ATTACK"].xoffset = 0;
            }

            this.updateAttackBB();
            for (const entity of this.game.entities.filter(e => e instanceof Enemy && e.BB !== undefined)) {
                // tell enemy class how much damage to take
                if (this.attackBB.collide(entity.BB)) {
                    entity.takeDamage(this.damage);
                    if (entity.HP <= 0) entity.state = "DEAD";
                }
            }
        } 
        // end of attack code
        // ****************

        if (this.game.keys["d"]) {                                    // Move/accelerate character right
            if(!this.busy) {
                this.facingDirection = 1;                             // facing the right
                this.velocity.x = Math.min(this.velocity.x + 10, MAXRUN);
                this.defaultState();
            }
        }
        else if (this.game.keys["a"]) {                               // Move/accelerate character left
            if(!this.busy) {
                this.facingDirection = 0;                             // face left
                this.velocity.x = Math.max(this.velocity.x - 10, -MAXRUN);// decrease velocity by 10 until -MAXRUN
                this.defaultState();
            }
        } else if (!this.busy && this.onGround) { // not pressing any buttons, on ground, nothing's going on
            this.velocity.x = 0;
        } 

        //*************** */
        // Dash code

        if (this.game.keys[" "] && !this.busy && this.jumps < this.jumpsTotal) {
            this.game.keys[" "] = false;

            this.changeState("DASH", 84);
            this.jumps += 1;
            if(this.facingDirection == 1){
                this.velocity.x = 1000;
            }else if (this.facingDirection == 0){
                this.velocity.x = -1000;
            }
            this.game.soundEngine.playSound("./assets/sounds/sfx/attack.wav");
        }
        if(this.state == "DASH") {
            this.velocity.y = 0; // we want dash to be very horizontally mobile.
        }
        // end of dash code
        // ****************
        this.x += this.velocity.x * clockTick;   // move horizontally as appropriate.
        this.y += this.velocity.y * clockTick;   // calculate new Y position from velocity.
        //Phasing through current platform to land below
        if (this.game.keys["s"] && this.y + this.BB.height < this.game.camera.worldSize * params.canvasHeight - 32) {
            this.phase = true;
        } else {
            this.phase = false;
        }

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
            if (entity instanceof Wheel && this.BB.collide(entity.BC)) {
                console.log("Hornet collided with " + entity.constructor.name);
                const t = this.game.timer.gameTime;
                if(t - this.timeOfLastDamage > this.invulnLength) { // multi-second invulnerability
                    console.log("taking ", entity.damage, " damage ", t - this.timeOfLastDamage);
                    this.HP -= entity.damage;
                    
                    this.timeOfLastDamage = t;
                    this.game.soundEngine.playSound("./assets/sounds/sfx/laser.wav");

                    // floating combat text:
                    this.game.addEntity(new FloatingText("-" + entity.damage, this.x, this.y, "red", 1));
                    
                    if (this.HP <= 0) {
                        this.changeState("DEATH")
                        this.dead = true;
                    }
                } else if(t - this.timeOfLastDamage <= this.invulnLength) {
                    // no enemy collision if we're invulnerable
                    return;
                }
            }
            if (this != entity && entity.BB && this.BB.collide(entity.BB)) {
               if (entity instanceof Enemy) {
                    console.log("Hornet collided with " + entity.constructor.name);
                    const t = this.game.timer.gameTime;
                    if(t - this.timeOfLastDamage > this.invulnLength) { // multi-second invulnerability
                        console.log("taking ", entity.damage, " damage ", t - this.timeOfLastDamage);
                        this.HP -= entity.damage;
                        
                        this.timeOfLastDamage = t;
                        this.game.soundEngine.playSound("./assets/sounds/sfx/laser.wav");

                        // floating combat text:
                        this.game.addEntity(new FloatingText("-" + entity.damage, this.x, this.y, "red", 1));
                        
                        if (this.HP <= 0) {
                            this.changeState("DEATH")
                            this.dead = true;
                        }
                    } else if(t - this.timeOfLastDamage <= this.invulnLength) {
                        // no enemy collision if we're invulnerable
                        return;
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
               
                }else if (entity instanceof Ground && (this.lastBB.bottom <= entity.BB.top) && !this.phase) {
                    this.y = entity.BB.top - this.BB.height;
                    this.velocity.y = 0;
                    this.jumps = 0;
                    this.onGround = true;
                    if(!this.busy) this.defaultState();
                    this.updateBB();
                } else if (entity instanceof Wall) {
                    //Land on top of wall
                    if (this.lastBB.bottom <= entity.BB.top) {
                        this.y = entity.BB.top - this.BB.height;
                        this.velocity.y = 0;
                        this.onGround = true;
                        if(!this.busy) this.defaultState();
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
                }else if (entity instanceof Flag_Block && (this.lastBB.collide(entity.BB))) {
                    this.changeState("IDLE", 226);
                    this.game.soundEngine.playSound("./assets/sounds/sfx/flag.wav");
                    this.game.camera.loadNextLevel(0, 0);
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
        const t = this.game.timer.gameTime;
        if(t - this.timeOfLastDamage > this.invulnLength) {
            this.BB.draw(ctx); // no BB if we're invuln.
        } else {
            ctx.globalAlpha = 0.5;
        }

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