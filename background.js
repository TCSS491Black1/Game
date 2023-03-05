class ParallaxLayer {
    constructor(img, speed, yOffset) {
        this.x = 0;
        this.y = 0;
        this.speed = speed;
        this.yOffset = yOffset;
        this.game = gameEngine;

        this.images = [];
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
            for (var i = 0; i < 9; i++) {
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

class Background extends ParallaxLayer {
    constructor(game, img) {
        super(img, 0.8, 0);
    }

    draw(ctx) { // Backgrounds tile differently, so it needs it's own draw()
        //Starting from top background image drawn right then down one layer at a time
        // j for vertical position
        // i for horizontal position 
        for (var j = 0; j < this.images.length; j++) {
            let image = this.images[j];
            for (var i = 0; i < 7; i++) {
                ctx.drawImage(
                    image,
                    this.x + (i * 1920) - this.game.camera.x,
                    this.y + (768 * j) - this.game.camera.y,
                    1920, 768
                );

            }
        }
    }
}

class Foreground extends ParallaxLayer {
    constructor(game, img) {
        super(img, 0, 1060);
    }
    draw(ctx) {
        for (var j = 0; j < this.images.length; j++) {
            let image = this.images[j];
            for (var i = 0; i < 5; i++) {
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

class Pillars extends ParallaxLayer {
    constructor(game, img) {
        super(img, 0.6, 655);
    }
}