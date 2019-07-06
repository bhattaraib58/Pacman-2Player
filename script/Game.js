class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;


    this.gameMap = null;
    this.pacman = null;

    // currently which time we are on
    this.currentSecond = 0;

    // how much frame is currently displayed
    this.frameCount = 0;
    // how much frame we are having in this second
    this.framesLastSecond = 0;

  }

  init() {
    this.gameMap = new GameMap(this.canvas, this.ctx, LAYOUT_MAP);
    this.pacman = new Pacman();

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = '#fffccc';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameMap.drawMap();

    // get current time in milliseconds
    let currentFrameTime = Date.now();

    // amount of time passed since last frame
    let timeElapsed = currentFrameTime - this.currentSecond;

    // this.setFrameCount();

    // if we are currently moving dont set value
    if (!this.pacman.processMovement(currentFrameTime)) {

      //on key press up, if tile is greater than 0 (within boundary) 
      // and get game map value for upper box, if upper box is 13 (empty movable place)
      //then move up
      if (this.pacman.keyUpPressed && this.pacman.tileFrom[1] >= 0 &&
        this.gameMap.getGameMapValueFromXY(this.pacman.tileFrom[0], this.pacman.tileFrom[1] - 1) == 13) {
        this.pacman.tileTo[1] -= 1;

        /* To change the animation, all you have to do is call animation.change. */
        this.pacman.animation.change(this.pacman.spriteSheet.frameSets[0], 5);
      }
      else if (this.pacman.keyDownPressed && this.pacman.tileFrom[1] < (this.gameMap.layoutMap.row - 1) &&
        this.gameMap.getGameMapValueFromXY(this.pacman.tileFrom[0], this.pacman.tileFrom[1] + 1) == 13) {
        this.pacman.tileTo[1] += 1;
        /* To change the animation, all you have to do is call animation.change. */
        this.pacman.animation.change(this.pacman.spriteSheet.frameSets[1], 5);
      }
      else if (this.pacman.keyLeftPressed && this.pacman.tileFrom[0] >= 0 &&
        this.gameMap.getGameMapValueFromXY(this.pacman.tileFrom[0] - 1, this.pacman.tileFrom[1]) == 13) {
        this.pacman.tileTo[0] -= 1;
        /* To change the animation, all you have to do is call animation.change. */
        this.pacman.animation.change(this.pacman.spriteSheet.frameSets[2], 5);
      }
      else if (this.pacman.keyRightPressed && this.pacman.tileFrom[0] < (this.gameMap.layoutMap.column - 1) &&
        this.gameMap.getGameMapValueFromXY(this.pacman.tileFrom[0] + 1, this.pacman.tileFrom[1]) == 13) {
        this.pacman.tileTo[0] += 1;
        /* To change the animation, all you have to do is call animation.change. */
        this.pacman.animation.change(this.pacman.spriteSheet.frameSets[3], 5);
      }

      // after setting the values for key press event we set the 
      // time moved (timeMoved= time we started moving the pacman) to current time 
      if (this.pacman.tileFrom[0] != this.pacman.tileTo[0] ||
        this.pacman.tileFrom[1] != this.pacman.tileTo[1]) {
        this.pacman.timeMoved = currentFrameTime;
      }
    }

    this.pacman.animation.update();
    // this.ctx.fillStyle = "#ffffff";
    // this.ctx.fillRect(this.pacman.position[0], this.pacman.position[1],
    // this.pacman.dimensions[0], this.pacman.dimensions[1]);
    this.ctx.drawImage(this.pacman.spriteSheet.image, this.pacman.animation.frame * this.pacman.dimensions[0], 0, this.pacman.dimensions[0], this.pacman.dimensions[1], Math.floor(this.pacman.position[0]), Math.floor(this.pacman.position[1]), this.pacman.dimensions[0], this.pacman.dimensions[1]);

    window.requestAnimationFrame(this.draw.bind(this));
  }

  setFrameCount() {
    // get current time in seconds
    let sec = Math.floor(Date.now() / 1000);

    // if current time is not equal to previous sec (1 sec has passed) 
    if (sec != this.currentSecond) {
      // set current sec to new time
      this.currentSecond = sec;
      // set frame count per second
      this.framesLastSecond = this.frameCount;
      // set count to zero
      this.frameCount = 1;
    }
    else { this.frameCount++; }
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillText("FPS: " + this.framesLastSecond, 10, 10);
  }

}
