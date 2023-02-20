class BoundingBox {
    constructor(game,x, y, width, height, color="black") {
        Object.assign(this, {game, x, y, width, height, color })
        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    collide(other) {
        return (this.right > other.left
            && this.left < other.right
            && this.top < other.bottom
            && this.bottom > other.top);
    }
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        if(this.game.options.debugging)
            ctx.strokeRect(this.x-this.game.camera.x, this.y-this.game.camera.y, this.width, this.height);
    }
}