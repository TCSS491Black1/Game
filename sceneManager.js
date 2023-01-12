class SceneManager{
    constructor(game){
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.score = 0;

        this.player = new CharacterController(this.game,50,550);




        this.loadLevel(50,550);

    };


    loadLevel(x,y){
        this.game.entities = [];
        this.x =0;
        this.player.x = x;
        this.player.y = y;
        this.player.velocity = { x: 0, y: 0 };
   




       //this.player = (new CharacterController(gameEngine),50,550)

       this.game.addEntity(this.player);
       this.game.addEntity(new Background(this.game));




    };

    update() {
        let midpoint = params.canvasWidth/2;

        // if (this.x < this.player.x - midpoint) this.x = this.player.x  - midpoint;
        // or
        // this.x = this.player.x  - midpoint;


    };

    draw(ctx){
        //ctx.drawImage(ASSET_MANAGER.getAsset("./background.png"),0,0);
    };

};