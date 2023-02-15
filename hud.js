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
        const MAXHP = 10;
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

        // display clocktime
        const time = Math.floor(gameEngine.timer.gameTime);
        const mins = Math.floor(time / 60);
        const secs = String(time % 60).padStart(2,'0');

        ctx.fillStyle = "white";
        ctx.font = "bold 20px serif";
        ctx.fillText(`${mins}:${secs}`, params.canvasWidth -100, 50);
        ctx.restore();
    }
    
}