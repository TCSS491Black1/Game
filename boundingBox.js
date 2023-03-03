class BoundingBox {
    constructor(game,x, y, width, height, color="black") {
        Object.assign(this, {game, x, y, width, height, color })
        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    collide(other) {
        if(other.radius != null && other.left == null){
            //Other == Circle
            console.log(other.y-other.radius+"  < "+this.bottom)
            return (other.x > this.left-other.radius && other.x < this.right+other.radius &&
                other.y-other.radius < this.bottom && other.y+other.radius > this.top);
        }
        
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

class BoundingCircle {
    constructor(game, x, y, radius,color) {
        Object.assign(this, { game, x, y, radius, color });
    };

    //for debugging purposes
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        if(this.game.options.debugging){
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x-this.game.camera.x, this.y-this.game.camera.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    update() {
    
    }

    collide(other) {
        console.log("in circle collision")
        if(other.radius == null && other.left != null){
            return (this.x > other.left-this.radius && this.x < other.right+this.radius &&
                this.y-this.radius < other.bottom && this.y+this.radius > other.top);
        }
        return false;
        //compare the distance to combined radii
     
        
    }
};