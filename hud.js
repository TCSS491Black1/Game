class HUD {
    // displays relevant information about the game state to the player
    // ✔ player's current HP
    // ✔ current clock time ( for speed run purposes )
    // - any permanent powerups which are unlocked ( and indicates cooldowns )
    // - any temporary buffs which are present
    // - current mouse location(if in debug mode)
    constructor() {
        this.powerups = {
            "doubleJump": 0,
            "dash": 0,
        }
        this.spriteSheet = ASSET_MANAGER.getAsset("./assets/sword.png");
    }
    update() {
           
    }
    draw(ctx) {
        ctx.save();
        // draw game symbol, upper left.
        ctx.font = "50px Baskerville";
        ctx.fillStyle = "black"
        ctx.fillText("ψ",24,49);
        ctx.fillStyle = "red";
        ctx.fillText("ψ",20,45);
    
        //draw me a wire frame cross    
        ctx.fillStyle="#66161c";
        ctx.fillRect(70, 50, 3, 75); // vertical line
        ctx.fillRect(50, 75, 300, 3); // horizontal line
        
        // draw the HP bar above the frame
        const startx = 85;
        const starty = 55;
        const MAXHP = gameEngine.player.maxHP;
        const playerHP = gameEngine.player.HP;
        const pipWidth = 15;
        const barHeight = 10;
        ctx.moveTo(startx, starty);
        ctx.fillStyle = "black";
        ctx.fillRect(startx-1, starty-1, (MAXHP*20)-1, barHeight+2) // background

        ctx.fillStyle = "red";
        for(let HP=0; HP < MAXHP; HP++ ) {
            if(HP < playerHP) { 
                ctx.fillRect(startx + HP*20, starty, pipWidth, barHeight);
            } else {
                ctx.strokeRect(startx + HP*20, starty, pipWidth, barHeight);
            }
        }

        // display pips for double jumps available
        ctx.fillStyle = "white";
        ctx.font = "bold 30px serif";
        
        const activePips = gameEngine.player.jumpsTotal - gameEngine.player.jumps;
        ctx.fillStyle = "white";
        for(let pip=0; pip < activePips; pip++ ) {
            ctx.fillText("^", startx + 20*pip, 75 + 30);
        }
        // inactive pips
        ctx.fillStyle = "grey";
        for(let pip = activePips; pip < gameEngine.player.jumpsTotal; pip++) {
            ctx.fillText("^", startx + 20*pip, 75 + 30);
        }

        for(let i = 0 ; i < gameEngine.player.damage ; i++){
            ctx.drawImage(this.spriteSheet,0,0,436,280,80+48*i,95,48,48)
        }

        // display clocktime
        ctx.fillStyle = "white";
        ctx.font = "bold 20px serif";
        
        const time = Math.floor(gameEngine.timer.gameTime);
        const mins = Math.floor(time / 60);
        const secs = String(time % 60).padStart(2,'0');

        ctx.fillText(`${mins}:${secs}`, params.canvasWidth -100, 50);
        ctx.restore();
    }
    
}