class CharacterController {
    constructor(game,x,y){
        Object.assign(this,{game,x,y});
        
        this.game.player = this;
        
        this.viewWidth = 1024;
        this.viewHeight = 768;


        this.x=0;
        this.y=500;

        this.speed = 100;
        this.velocity = { x: 0, y: 0 };

        this.gravity = 98;





        this.facingDirection = 0;
        this.state = 0;
        this.animationList = [];
        this.animationWidth = 96.75;
        this.animationHeight = 100;

        //(Idle)
        this.animationList[0] = new Animator(ASSET_MANAGER.getAsset(""),0,0,72,72,6,0.4,1);  
        //Walk
        this.animationList[1] = new Animator(ASSET_MANAGER.getAsset(""),0,145,72,72,8,0.4,1);
        //Jump
        this.animationList[2] = new Animator(ASSET_MANAGER.getAsset(""),0,290,72,70,6,0.27,0);
        

        this.game.addEntity(new Background(this.game));

    };



    update(){   
        const MAXRUN = 200;
        
        //Bottom border for testing.
        if(this.y > 600) {
            this.y=600;
            this.velocity.y = 0;
            this.animationList[2] = new Animator(ASSET_MANAGER.getAsset(""),0,290,72,70,6,0.27,0);
            this.state = 1;
        };

        //Small Jump
        if(this.game.keys["w"] && this.state != 2){
                this.state = 2;
                this.velocity.x += 75;
                this.velocity.y -= 75;
       
        };
        //Big Jump
        if(this.game.keys["s"] && this.state != 2){
            this.state = 2;
            this.velocity.x += 75;
            this.velocity.y -= 150;
            this.animationList[2] = new Animator(ASSET_MANAGER.getAsset(""),0,290,72,70,6,0.27,0);

            
   
    };
        //Right
        if(this.game.keys["d"] && this.state != 2){
            this.state = 1;
            if(this.velocity.x > MAXRUN){
                this.velocity.x = MAXRUN;
            }else{
            this.velocity.x += 100*this.game.clockTick};
        };

        //Left
        if(this.game.keys["a"] && this.state != 2){
            this.state = 0;
            if(this.velocity.x < (-1)*MAXRUN){
                this.velocity.x = (-1)*MAXRUN;
            }else{
            this.velocity.x -= 100*this.game.clockTick};    
            this.velocity.x = 0;
        }  

        this.velocity.y += this.gravity*this.game.clockTick;
        
        this.x += this.velocity.x*this.game.clockTick;
        this.y += this.velocity.y*this.game.clockTick;
        
    };


    draw(ctx) {
        this.animationList[this.state].drawFrame(this.game.clockTick, ctx, this.x-this.game.camera.x, this.y);

    };
}