class Background {
    constructor(game, img) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.speed = 0;
        this.images=[];
        //Loop down the background images and make them into an array of assets
        for( var j=0 ; j < img.length;j++ ){
            this.images[j] = ASSET_MANAGER.getAsset(img[j]);
        }

    }

    update() {
        this.x = (0.8)*this.game.camera.x;
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

class Foreground {
    constructor(game, img) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.speed = 0;
        this.images=[];
        console.log(img[0]);
        for( var j=0 ; j < img.length;j++ ){
            this.images[j] = ASSET_MANAGER.getAsset(img[j]);
        }

    }

    update() {
        //this.x = (0.8)*this.game.camera.x;
    }

    draw(ctx) {
        //Starting from top background image drawn right then down one layer at a time
        // j for vertical position
        // i for horizontal position 
        for( var j=0 ; j < this.images.length;j++ ){
            let image =this.images[j];
            for (var i = 0; i < 9; i++) {
                ctx.drawImage(
                    image,
                    this.x + (i * 1022) - this.game.camera.x, this.y+(530*2)-this.game.camera.y, 1022, 448
                );

            }
        }
    }
}

class Pillars {
    constructor(game, img) {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.images=[];
        console.log(img[0]);
        for( var j=0 ; j < img.length;j++ ){
            this.images[j] = ASSET_MANAGER.getAsset(img[j]);
        }

    }

    update() {
        this.x = (0.6)*this.game.camera.x;
    }

    draw(ctx) {
        for( var j=0 ; j < this.images.length;j++ ){
            let image =this.images[j];
            for (var i = 0; i < 15; i++) {
                ctx.drawImage(
                    image,
                    this.x + (i * 1918) - this.game.camera.x, this.y+(768*j)-this.game.camera.y, 1920, 768
                );

            }
        }
    }
}