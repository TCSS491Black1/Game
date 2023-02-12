class ParallaxLayer {
    constructor(img, speed, yOffset) {
        this.x = 0;
        this.y = 0;
        this.speed = speed;
        this.yOffset = yOffset;
        this.images = [];
        this.game = gameEngine;
        for (const image of img) {
            this.images.push(ASSET_MANAGER.getAsset(image));
        }
    }

    update() {
        this.x = this.speed * this.game.camera.x;
    }

    draw(ctx) {
        //Starting from top background image drawn right then down one layer at a time
        // j for vertical position
        // i for horizontal position 
        for (var j = 0; j < this.images.length; j++) {
            let image = this.images[j];
            for (var i = 0; i < 15; i++) {
                ctx.drawImage(
                    image,
                    this.x + i * image.width - this.game.camera.x,
                    this.y + this.yOffset - this.game.camera.y,
                    image.width, image.height
                );
            }
        }
    }
}
class Background  {
    constructor(game, img) {
        //super(img, 0, 0);
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
        this.x = this.speed * this.game.camera.x;
    }
    draw(ctx) { // backgrounds have a custom draw(), because they tile differently.
        //Starting from top background image drawn right then down one layer at a time
        // j for vertical position
        // i for horizontal position 
        for( var j=0 ; j < this.images.length;j++ ){
            let image =this.images[j];
            for (var i = 0; i < 9; i++) {
                ctx.drawImage(
                    image,
                    this.x + (i * 1028) - this.game.camera.x, this.y+(530*2)-this.game.camera.y, 1028, 448
                );

            }
        }
    }
}

class Foreground extends ParallaxLayer {
    constructor(game, img) {
        super(img, 0, 1060);
    }
}

class Pillars extends ParallaxLayer {
    constructor(game, img) {
        super(img, 0.6, 655);
    }
}