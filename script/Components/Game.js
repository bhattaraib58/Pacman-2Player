class Game {
  constructor(canvas, ctx, gameWorldObject, layoutMap) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameWorldObject = gameWorldObject;

    this.layoutMap = JSON.parse(JSON.stringify(layoutMap));
    this.gameLevel = INITIAL_LEVEL;
    this.gameMode = GAME_MODE.GAME_START;

      //game pause state refers to when pacman dead or ghost dead, game end etc
      this.gamePauseState = false;
    this.ghostKilledScoreMultiplier = 0;
    this.gameMode = GAME_MODE.GAME_START;
    this.gameModeCounter = 0;
    this.scoreDisplayCounter = 0;
    this.isNewGameCreated = false;

    //gamamap object
    this.gameMap = null;

    // pacman object
    this.pacman1 = null;
    this.pacman2 = null;

    //game ghosts
    this.blinky = null;
    this.pinky = null;

    // currently which time we are on
    this.currentSecond = 0;
    // how much frame is currently displayed
    this.frameCount = 0;
    // how much frame we are having in this second
    this.framesLastSecond = 0;

    this.init();
  }

  init() {
    let initialPosition = [14, 23];
    this.createGameMap();
    this.pacman1 = new Pacman(this.ctx, this, PLAYER1_CONTROL_KEY, this.gameMap, initialPosition);
  }

  createGameMap() {
    let layoutMapPLaying = JSON.parse(JSON.stringify(this.layoutMap));
    this.gameMap = new GameMap(this.ctx, layoutMapPLaying);
  }

  createNewGame() {
    //all ghosts in game array
    let ghosts = [];

    //game pause state refers to when pacman dead or ghost dead, game end etc
    this.gamePauseState = false;
    this.ghostKilledScoreMultiplier = 0;
    this.gameModeCounter = 0;
    this.scoreDisplayCounter = 0;
    this.isNewGameCreated = false;

    let initialPosition = [14, 23].slice(0);
    this.pacman1.initPacman(initialPosition);

    this.blinky = new Blinky(this.ctx,
      this,
      this.gameMap,
      GHOST_POSITION.BLINKY.INITIAL_POSITION,
      GHOST_POSITION.BLINKY.SCATTER_HOME_POSITION,
      GHOST_SPRITE_POSITION.CHASE_MODE.BLINKY
    );

    this.pinky = new Pinky(
      this.ctx,
      this,
      this.gameMap,
      GHOST_POSITION.PINKY.INITIAL_POSITION,
      GHOST_POSITION.PINKY.SCATTER_HOME_POSITION,
      GHOST_SPRITE_POSITION.CHASE_MODE.PINKY
    );

    this.blinky.setCurrenltyFollowingPacman(this.pacman1);
    this.pinky.setCurrenltyFollowingPacman(this.pacman1);

    ghosts.push(this.blinky);
    ghosts.push(this.pinky);
    this.pacman1.setGhosts(ghosts);

    this.pacman1.setGameMap(this.gameMap);
  }


  getScoreForGhostKilled() {
    return GHOST_EATEN_SCORE * this.ghostKilledScoreMultiplier;
  }

  setGhostKilledMultiplier() {
    // get current time in seconds
    let sec = Math.floor(Date.now() / 1000);

    // if current time is not equal to previous sec (1 sec has passed) 
    if (sec >= this.currentSecond + 5) {
      // set current sec to new time
      this.currentSecond = sec;
      this.ghostKilledScoreMultiplier = 0;
    }
    if (sec < this.currentSecond + 5) {
      this.ghostKilledScoreMultiplier++;
    }
  }

  draw() {
    // clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // draw game map
    this.gameMap.drawMap();

    switch (this.gameMode) {
      case GAME_MODE.GAME_PLAYING:

        //draw pacman
        this.pacman1.draw();
        // this.pacman2.draw();

        this.blinky.moveGhosts();
        this.pinky.moveGhosts();
        break;

      case GAME_MODE.GAME_START:
        this.drawGameStartingScreen();
        break;

      case GAME_MODE.GAME_BEGIN:
        this.drawGameBeginingScreen();
        break;

      case GAME_MODE.PACMAN_DEAD:
        //draw pacman dead, if animation not completed to show dead pacman start new game
        if (!this.pacman1.drawPacmanDead()) {
          this.gameMode = GAME_MODE.GAME_BEGIN;
          this.isNewGameCreated = false;
        }
        break;

      case GAME_MODE.GAME_LEVEL_COMPLETED:
        this.gameLevel++;
        this.createGameMap();
        this.createNewGame();
        this.gameMode = GAME_MODE.GAME_START;
        break;

      case GAME_MODE.GAME_OVER:
        //draw pacman dead, if animation not completed to show dead pacman dont show game over
        if (!this.pacman1.drawPacmanDead()) {
          this.gameModeCounter++;
          this.drawGameover();
          if (this.gameModeCounter > 100) {
            this.gameWorldObject.gameState = GAME_STATE.MENU;
          }
        }
        break;
    }
    this.drawPacmanGameHeader();
    this.drawPacmanGameFooter();
  }

  drawGameStartingScreen() {
    this.gameModeCounter++;

    writeTextOnCanvasWithSize(this.ctx,
      'PLAYER ONE',
      16,
      '#00ffde',
      (9 * 16),
      HEADER_HEIGHT + (12 * 16)
    );

    writeTextOnCanvasWithSize(this.ctx,
      'READY!',
      16,
      '#ffff00',
      (11 * 16),
      HEADER_HEIGHT + (18 * 16)
    );

    if (this.gameModeCounter >= 100) {
      this.gameMode = GAME_MODE.GAME_BEGIN;
    }
  }

  drawGameBeginingScreen() {
    if (!this.isNewGameCreated) {
      this.createNewGame();
      this.isNewGameCreated = true;
    }

    this.gameModeCounter++;

    this.blinky.drawInitialSprite();
    this.pacman1.drawInitialSprite();

    writeTextOnCanvasWithSize(this.ctx,
      'READY!',
      16,
      '#ffff00',
      (11 * 16),
      HEADER_HEIGHT + (18 * 16)
    );

    if (this.gameModeCounter >= 200) {
      this.gameModeCounter = 0;
      this.gameMode = GAME_MODE.GAME_PLAYING;
    }
  }

  drawGameover() {
    writeTextOnCanvasWithSize(this.ctx,
      'GAME  OVER',
      16,
      '#ff0000',
      (11 * 13),
      HEADER_HEIGHT + (18 * 16)
    );
  }

  drawPacmanGameHeader() {
    this.scoreDisplayCounter++;

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

    //reset counter
    if (this.scoreDisplayCounter >= 30) {
      this.scoreDisplayCounter = 0;
    }
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
