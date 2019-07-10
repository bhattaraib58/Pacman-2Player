class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.layoutMap = LAYOUT_MAP_ORIGINAL;
    this.gameLevel = INITIAL_LEVEL;

    // pacman object
    this.pacman1 = null;
    this.pacman2 = null;

    //game ghosts
    this.blinky = null;
    this.pinky = null;

    //gamamap object
    this.gameMap = null;

    // currently which time we are on
    this.currentSecond = 0;

    // how much frame is currently displayed
    this.frameCount = 0;
    // how much frame we are having in this second
    this.framesLastSecond = 0;

    this.scoreDisplayCounter = 0;

    this.init();
  }

  init() {
    //all ghosts in game array
    let ghosts = [];

    let initialPosition = [14, 23];
    this.gameMap = new GameMap(this.ctx, this.layoutMap);
    this.pacman1 = new Pacman(this.ctx, PLAYER1_CONTROL_KEY, this.gameMap, initialPosition);

    this.blinky = new Blinky(this.ctx, this.gameMap, GHOST_POSITION.BLINKY.INITIAL_POSITION, GHOST_POSITION.BLINKY.SCATTER_HOME_POSITION);
    // this.pinky = new Pinky(this.ctx, this.gameMap,GHOST_POSITION.PINKY.INITIAL_POSITION, GHOST_POSITION.PINKY.SCATTER_HOME_POSITION);

    this.blinky.setCurrenltyFollowingPacman(this.pacman1);
    // this.pinky.setCurrenltyFollowingPacman(this.pacman1);
    // this.pacman2 = new Pacman(this.ctx, PLAYER2_CONTROL_KEY, this.gameMap,initialPosition);

    ghosts.push(this.blinky);
    this.pacman1.setGhosts(ghosts);
  }

  draw() {
    this.scoreDisplayCounter++;
    // clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw game map
    this.gameMap.drawMap();

    //draw pacman
    this.pacman1.draw();
    // this.pacman2.draw();

    this.blinky.moveGhosts();
    // this.pinky.moveGhosts();

    this.drawPacmanGameHeader();
    this.drawPacmanGameFooter();

    //reset counter
    if (this.scoreDisplayCounter >= 30) {
      this.scoreDisplayCounter = 0;
    }
  }

  drawPacmanGameHeader() {
    //display top header
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);

    //display 1 UP for 15 frames and dont show for 15 frame
    if (this.scoreDisplayCounter >= 15 && this.scoreDisplayCounter < 30) {
      writeTextOnCanvas(this.ctx, '1UP', LAYOUT_MAP_ORIGINAL.tileWidth * 2, 20);
    }
    writeTextOnCanvas(this.ctx, this.pacman1.score, LAYOUT_MAP_ORIGINAL.tileWidth * 2, 40);

    writeTextOnCanvas(this.ctx, 'HIGH SCORE', LAYOUT_MAP_ORIGINAL.tileWidth * 8, 20);
    writeTextOnCanvas(this.ctx, this.pacman1.score, LAYOUT_MAP_ORIGINAL.tileWidth * 10, 40);

    writeTextOnCanvas(this.ctx, '2UP', LAYOUT_MAP_ORIGINAL.tileWidth * 22, 20);
    writeTextOnCanvas(this.ctx, 0, LAYOUT_MAP_ORIGINAL.tileWidth * 22, 40);
  }

  drawPacmanGameFooter() {
    //display footer
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, GAME_HEIGHT, CANVAS_WIDTH, FOOTER_HEIGHT);

    //pacman live generator
    for (let i = 0; i < this.pacman1.lives && i < PACMAN_MAX_LIVES; i++) {
      // draw pacman lives icon
      //(image source, source x, source y, height, width, destination x, destination y, destination height, width) 
      this.ctx.drawImage(PACMAN_SPRITE_IMAGE, 32 * 3, 32 * 0, 32, 32, (i + 1) * 32, GAME_HEIGHT + 5, 32, 32);
    }

    let startingGameLevelRange, endingGameLevelRange;

    //game level generator
    if (this.gameLevel < 8) {
      startingGameLevelRange = 1;
      endingGameLevelRange = this.gameLevel;
    }
    if (this.gameLevel < 19 && this.gameLevel > 7) {
      startingGameLevelRange = this.gameLevel - 6;
      endingGameLevelRange = this.gameLevel;
    }
    if (this.gameLevel > 20) {
      startingGameLevelRange = 13;
      endingGameLevelRange = 19;
    }

    //game level icon generator
    for (let i = startingGameLevelRange, xaxis = 1; i <= endingGameLevelRange; i++ , xaxis++) {
      this.ctx.drawImage(PACMAN_SPRITE_IMAGE, 32 * GAME_LEVEL[i], 32 * 8, 32, 32, (16 * 28) - ((xaxis + 1) * 32), GAME_HEIGHT + 5, 32, 32);
    }
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
    this.ctx.fillText("FPS: " + this.framesLastSecond, 10, 50);
  }
}
