//TODO: add bounding box on Uoma
//TODO: add other entities

class Uoma {
    constructor(game , x, y) {
        Object.assign(this, {game, x, y});
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Uoma.png"),
        4, 22, 172, 148, 6, 0.09,1,4)
        // this.paused = true;
        // this.dead = false;
        this.x = 700;
        this.y = 550;
        this.speed = 100;
        this.gameOver = false;
        //this.velocity = { x:0, y:0};
        this.updateBB();
    }
   
    updateBB(){
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x + 45, this.y + 35, 70, 90);
    }

    update(){
        this.x -= (this.speed * this.game.clockTick);
        if(this.x < -200) this.x = 1500 , this.y = 300;
        if(this.x < -150 && this.y > 299) this.x = 1500, this.y = 100; 
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController) {
                    entity.dead = true;
                    console.log("Uoma collision with Hornet = LOSS");
                    

                
                }
    
            }
            
        });
    }

    draw(ctx){

        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        //ctx.drawImage(this.spritesheet, this.x ,this.y, 50, 50);
        ctx.strokeStyle = 'Red';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);

    };

};

class Heavy_Sentry {

}

class Hive_Knight{
    
}

class Flag_Block{
    constructor(game , x, y) {
        Object.assign(this, {game, x, y});
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Dirt_Block.png"),
        2, 2, 62, 62, 1, 1,1,1)

        this.x = 1400;
        this.y = 600;
        this.speed = 0;  
        this.updateBB();
    }
   
    updateBB(){
        this.lastBB = this.BB;

        this.BB = new BoundingBox(this.x, this.y, 64, 64);

    }

    update(){
        
        this.updateBB();

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity.BB && that.BB.collide(entity.BB)) {
                if (entity instanceof CharacterController) {
                    entity.dead = false;
                    console.log("Block collision with Hornet = WIN")
                }
            }
        });
    }

    draw(ctx){
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        ctx.strokeStyle = 'Blue';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);


    };

}

