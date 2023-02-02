class HUD {
    // displays relevant information about the game state to the player
    // ✔ player's current HP
    // - any permanent powerups which are unlocked ( and indicates cooldowns )
    // - any temporary buffs which are present
    // - current clock time ( for speed run purposes )
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
        ctx.fillText("ψ",20,45);
        // draw me a wire frame cross
        ctx.beginPath();
        ctx.moveTo(75,50); 
        ctx.lineTo(75, 100); // vertical line
        
        ctx.moveTo(50,75); // horizontal line
        ctx.lineTo(300,75);
        ctx.stroke();
        
        // draw the HP bar above the frame
        ctx.fillStyle = "red";
        const startx = 85;
        const starty = 55;
        const MAXHP = 10;
        const playerHP = gameEngine.player.HP;
        const pipWidth = 15;
        const barHeight = 10;
        ctx.moveTo(startx, starty);

        for(let HP=0; HP < MAXHP; HP++ ) {
            if(HP <= playerHP) { 
                ctx.fillRect(startx + HP*20, starty, pipWidth, barHeight);
            } else {
                ctx.strokeRect(startx + HP*20, starty, pipWidth, barHeight);
            }
        }

        // display of upgrades
    }
    
}