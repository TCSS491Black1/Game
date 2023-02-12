class Background {
    constructor(game, img) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.images=[];
        //Loop down the background images and make them into an array of assets
        for( var j=0 ; j < img.length;j++ ){
            this.images[j] = ASSET_MANAGER.getAsset(img[j]);
        }

    }

    update() {

    }

    draw(ctx) {
        //Starting from top background image drawn right then down one layer at a time
        // j for vertical position
        // i for horizontal position 
        for( var j=0 ; j < this.images.length;j++ ){
            let image =this.images[j];
            for (var i = 0; i < 7; i++) {
                ctx.drawImage(
                    image,
                    this.x + (i * 1920) - this.game.camera.x, this.y+(768*j)-this.game.camera.y, 1920, 768
                );

            }
        }
    }
}