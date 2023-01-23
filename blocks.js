class Ground {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w});

        this.spritesheet = ASSET_MANAGER.getAsset("./assets/Environmental_Blocks.png",0,0,16,16);


        this.BB = new BoundingBox(0, params.canvasHeight-32, 32*w, 32);

    };

    update() {
    
    };

    draw(ctx){
        for (var i = 0; i < this.w; i++) {
            ctx.drawImage(this.spritesheet,
                0, 0,
                16,16,
                i*32, params.canvasHeight-32,
                16*2,16*2);
        
        }





        //ctx.drawImage(this.spritesheet,this.x,this.y, 16,16);
        for(let i = 0; i  <= 47; i++ ){


        }

        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
    };
}
