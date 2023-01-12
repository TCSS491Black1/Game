class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop });

        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;

    };

    drawFrame(tick, ctx, x, y) {
        this.elapsedTime += tick;
        const frame = this.currentFrame();
        if (this.isDone()) {
            if (this.loop == 1) {
                this.elapsedTime -= this.totalTime;
            } else {
                ctx.drawImage(this.spritesheet,
                    this.xStart + this.width * (this.frameCount - 1), this.yStart,
                    this.width, this.height,
                    x, y,
                    this.width * 2, this.height * 2)
            }
        } else {
            //console.log("animator given:", this.spritesheet);
            ctx.drawImage(this.spritesheet,
                this.xStart + this.width * frame, this.yStart,
                this.width, this.height,
                x, y,
                this.width * 2, this.height * 2)
        }
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};