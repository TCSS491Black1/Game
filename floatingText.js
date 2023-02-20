class FloatingText {
    constructor(text, x=100, y=100, color="red", duration=1) {
        Object.assign(this, {text, x, y, color, duration});
        this.initTime = gameEngine.timer.gameTime;
        this.game = gameEngine;
        this.speed = 100;
    }
    draw(ctx) {
        let destX = (this.x - this.game.camera.x);
        let destY = (this.y - this.game.camera.y);
        ctx.save();
        // ctx.font = "50px Baskerville";
        ctx.fillStyle = "black"
        ctx.fillText(this.text,destX+2,destY+2);
        ctx.fillStyle = this.color;
        ctx.fillText(this.text,destX,destY);

        ctx.fillStyle = this.color;
        ctx.fillText(this.text, destX, destY);
        ctx.restore();
    }
    update() {
        const t = gameEngine.timer.gameTime;
        if(t - this.initTime > this.duration) {
            this.removeFromWorld = true;
        }
        this.y -= this.speed * this.game.clockTick;
    }
}