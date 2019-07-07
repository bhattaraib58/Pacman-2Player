class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;


    this.layoutMap = LAYOUT_MAP_ORIGINAL;

    // pacman object
    this.pacman1 = null;
    this.pacman2 = null;

    //gamamap object
    this.gameMap = null;

    // currently which time we are on
    this.currentSecond = 0;

    // how much frame is currently displayed
    this.frameCount = 0;
    // how much frame we are having in this second
    this.framesLastSecond = 0;
  }

  init() {
    this.gameMap = new GameMap(this.canvas, this.ctx, this.layoutMap);
    this.pacman1 = new Pacman(this.canvas, this.ctx, PLAYER1_CONTROL_KEY, this.gameMap);
    this.pacman2 = new Pacman(this.canvas, this.ctx, PLAYER2_CONTROL_KEY, this.gameMap);
    this.draw();
  }

  draw() {
    // clear canvas
    this.ctx.fillStyle = '#fffccc';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // set frame of screen
    this.setFrameCount();

    // draw game map
    this.gameMap.drawMap();

    //draw pacman
    this.pacman1.draw();
    this.pacman2.draw();

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
