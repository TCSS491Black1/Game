class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop, spriteBorderWidth=0, xoffset=0, yoffset=0, scale=1) {
        Object.assign(this, { spritesheet, xStart, yStart, width, height, frameCount, frameDuration, loop , spriteBorderWidth, xoffset, yoffset, scale}); //offset = {x:0, y:0} is another option.

        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
        this.frameIndex = 0;
        this.frameSwappedTime = 0;
    };

    drawFrame(tick, ctx, x, y) {
        this.elapsedTime += tick;
    
        if (this.isDone() && this.loop) { // animation loops, so reset time.
            this.elapsedTime = this.frameSwappedTime = this.frameIndex = 0;
        };
        
        // not done yet, get next frame:
        let frame;
        if( (this.isDone() && this.loop) || (!this.isDone())) {
            frame = this.currentFrame();
        } else { // is done & doesn't loop: freeze on last frame.
            frame = this.frameCount - 1;
        }
        ctx.drawImage(this.spritesheet,
            this.xStart + (this.width+this.spriteBorderWidth)  * frame, this.yStart,
            this.width-this.spriteBorderWidth, this.height,
            x-this.xoffset, y-this.yoffset,
            this.width*this.scale, this.height*this.scale);
    };
    
    currentFrame() {
        // progress frames based on time passed rather than modulus or division(avoids skipping frames)
        if((this.elapsedTime - this.frameSwappedTime) >= this.frameDuration) {
            this.frameSwappedTime = this.elapsedTime;
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        }
        return this.frameIndex;
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};