class Game {
  constructor(canvas, ctx, gameWorldObject, audioLoader, gameData) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameWorldObject = gameWorldObject;
    this.audioLoader = audioLoader;

    this.gamedata = JSON.parse(JSON.stringify(gameData));
    this.gameLevel = gameData.initialLevel;
    this.layoutMap = gameData.layoutMap;
    this.gameMode = GAME_MODE.GAME_START;
    this.highScore = 0;
    this.highestScore = 0;
    this.highScorerName = 0;

    // pacman object
    this.players = [];
    this.ghosts = null;

    //game pause state refers to when pacman dead or ghost dead, game end etc
    this.gamePauseState = false;
    this.ghostKilledScoreMultiplier = 0;
    this.gameModeCounter = 0;
    this.scoreDisplayCounter = 0;
    this.isNewGameCreated = false;
    this.hasPlayed = false;

    //gamamap object
    this.gameMap = null;

    // currently which time we are on
    this.currentSecond = 0;
    // how much frame is currently displayed
    this.frameCount = 0;
    // how much frame we are having in this second
    this.framesLastSecond = 0;

    this.init();
  }

  init() {
    this.createGameMap();

    //initualize pacman class with given data in gamedata
    for (let [key, playerData] of Object.entries(this.gamedata.player)) {
      let player = new Pacman(
        this.ctx,
        this,
        playerData.control,
        this.gameMap,
        this.audioLoader,
        playerData.initialPosition);

      //add pacman to array
      this.players.push(player);
    }
  }

  createGameMap() {
    let layoutMapPLaying = JSON.parse(JSON.stringify(this.layoutMap));
    this.gameMap = new GameMap(this.ctx, layoutMapPLaying);
  }

  createNewGame() {

    //game pause state refers to when pacman dead or ghost dead, game end etc
    this.gamePauseState = false;
    this.ghostKilledScoreMultiplier = 0;
    this.gameModeCounter = 0;
    this.scoreDisplayCounter = 0;
    this.isNewGameCreated = false;
    this.hasPlayed = false;

    if (this.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
      this.highScore = DataStorage.getItem('1PHighScore') || 0;
    }
    else {
      this.highScore = DataStorage.getItem('2PHighScore') || 0;
    }

    //initialize ghosts with given ghost data in gamedata
    for (let [playerId, playerData] of Object.entries(this.gamedata.player)) {
      let ghosts = [];
      //reinitialize initial position
      this.players[playerId].initPacman(playerData.initialPosition);
      this.players[playerId].setGameMap(this.gameMap);

      for (let [ghostId, ghostData] of Object.entries(playerData.targetGhosts)) {
        let ghost;

        if (ghostData.ghostName == 'BLINKY') {
          ghost = new Blinky(this.ctx,
            this,
            this.gameMap,
            this.audioLoader,
            ghostData.ghostPosition,
            ghostData.ghostSpritePosition
          );
        }

        else if (ghostData.ghostName == 'PINKY') {
          ghost = new Pinky(
            this.ctx,
            this,
            this.gameMap,
            this.audioLoader,
            ghostData.ghostPosition,
            ghostData.ghostSpritePosition
          );
        }

        else if (ghostData.ghostName == 'INKY') {
          ghost = new Inky(
            this.ctx,
            this,
            this.gameMap,
            this.audioLoader,
            ghostData.ghostPosition,
            ghostData.ghostSpritePosition
          );
        }
        else if (ghostData.ghostName == 'CLYDE') {
          ghost = new Clyde(
            this.ctx,
            this,
            this.gameMap,
            this.audioLoader,
            ghostData.ghostPosition,
            ghostData.ghostSpritePosition
          );
        }
        else {
          console.log('Please check you have typed other ghost name or data');
        }

        ghost.setCurrenltyFollowingPacman(this.players[playerId]);
        ghosts.push(ghost);
      }
      //after all data have been saved to array set ghosts
      this.players[playerId].setGhosts(ghosts);
    }
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

        //move pacman and ghosts
        for (let i = 0; i < this.players.length; i++) {
          if (!this.players[i].pacDead) {
            this.players[i].draw();
            for (let j = 0; j < this.players[i].ghosts.length; j++) {
              this.players[i].ghosts[j].moveGhosts();
            }
          }
          else {
            this.players[i].setDeadPosition();
          }
        }
        break;

      case GAME_MODE.GAME_START:
        if (!this.hasPlayed) {
          this.audioLoader.play('opening_song');
          this.hasPlayed = true;
        }
        this.drawGameStartingScreen();
        break;

      case GAME_MODE.GAME_BEGIN:
        this.drawGameBeginingScreen();
        break;

      case GAME_MODE.PACMAN_DEAD:
        if (!this.hasPlayed) {
          this.audioLoader.play('die');
          this.hasPlayed = true;
        }
        //draw pacman dead, if animation not completed to show dead pacman start new game
        if (this.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
          if (!this.players[0].drawPacmanDead()) {
            this.gameMode = GAME_MODE.GAME_BEGIN;
            this.isNewGameCreated = false;
            this.hasPlayed = false;
          }
        }
        break;

      case GAME_MODE.GAME_LEVEL_COMPLETED:
        if (this.drawLevelCompleted()) {
          this.gameLevel++;
          this.createGameMap();
          this.createNewGame();
          this.gameMode = GAME_MODE.GAME_START;
        }
        break;

      case GAME_MODE.GAME_OVER:
        if (!this.hasPlayed) {
          this.audioLoader.play('die');
          this.hasPlayed = true;
        }
        //draw pacman dead, if animation not completed to show dead pacman dont show game over
        if (this.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
          if (!this.players[0].drawPacmanDead()) {
            this.gameModeCounter++;
            this.drawGameover();
            if (this.gameModeCounter > 100) {

              if (this.players[0].score > this.highScore) {
                DataStorage.setItem('1PHighScore', this.players[0].score);
              }
              this.gameWorldObject.gameState = GAME_STATE.MENU;
              this.hasPlayed = false;
            }
          }
        }
        else {
          this.drawTwoPlayerPacmanDead();
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
      this.hasPlayed = false;
    }
  }

  drawGameBeginingScreen() {
    if (!this.isNewGameCreated) {
      this.createNewGame();
      this.isNewGameCreated = true;
    }

    this.gameModeCounter++;

    //draw pacman and ghost initail sprite
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawInitialSprite();
      for (let j = 0; j < this.players[i].ghosts.length; j++) {
        this.players[i].ghosts[j].drawInitialSprite();
      }
    }

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

  drawTwoPlayerPacmanDead() {
    this.gameModeCounter++;
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].drawPacmanDead();
      if (this.players[i].score > this.highestScore) {
        this.highestScore = this.players[i].score;
        this.highScorerName = i;
      }
    }
    if (this.gameModeCounter > 20) {
      this.drawGameover();
      writeTextOnCanvasWithSize(this.ctx,
        'Player ' + this.highScorerName + 1 + ' Wins',
        14,
        '#ffff00',
        (8 * 16),
        HEADER_HEIGHT + (12 * 16)
      );
    }
    if (this.gameModeCounter > 100) {
      if (this.highestScore > this.highScore) {
        DataStorage.setItem('2PHighScore', this.highestScore);
      }
      this.gameWorldObject.gameState = GAME_STATE.MENU;
      this.hasPlayed = false;
    }
  }

  drawLevelCompleted() {
    this.gameModeCounter++;
    this.gamePauseState = true;

    //display 1 UP for 15 frames and dont show for 15 frame
    if (this.scoreDisplayCounter >= 15 && this.scoreDisplayCounter < 30) {
      // clear canvas
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    //draw pacman initial sprite
    for (let i = 0; i < this.players.lenth; i++) {
      this.players[i].drawInitialSprite();
    }

    //reset counter
    if (this.scoreDisplayCounter >= 30) {
      this.scoreDisplayCounter = 0;
    }

    if (this.gameModeCounter >= 150) {
      this.gameModeCounter = 0;
      this.gameMode = GAME_MODE.GAME_PLAYING;
      return true;
    }

    return false;
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
    writeTextOnCanvas(this.ctx, this.players[0].score, LAYOUT_MAP_ORIGINAL.tileWidth * 2, 40);

    writeTextOnCanvas(this.ctx, 'HIGH SCORE', LAYOUT_MAP_ORIGINAL.tileWidth * 8, 20);
    writeTextOnCanvas(this.ctx, this.highScore, LAYOUT_MAP_ORIGINAL.tileWidth * 10, 40);

    if (this.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
      writeTextOnCanvas(this.ctx, '2UP', LAYOUT_MAP_ORIGINAL.tileWidth * 22, 20);
    }
    else {
      if (this.scoreDisplayCounter >= 15 && this.scoreDisplayCounter < 30) {
        writeTextOnCanvas(this.ctx, '2UP', LAYOUT_MAP_ORIGINAL.tileWidth * 22, 20);
      }
    }
    let twoPlayerScore = this.players[1] && this.players[1].score || 0;
    writeTextOnCanvas(this.ctx, twoPlayerScore, LAYOUT_MAP_ORIGINAL.tileWidth * 22, 40);

    //reset counter
    if (this.scoreDisplayCounter >= 30) {
      this.scoreDisplayCounter = 0;
    }
  }

  drawPacmanGameFooter() {
    //display footer
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, GAME_HEIGHT, CANVAS_WIDTH, FOOTER_HEIGHT);

    //pacman lives icon generator
    for (let i = 0; i < this.players[0].lives && i < PACMAN_MAX_LIVES; i++) {
      // draw pacman lives icon
      this.ctx.drawImage(
        PACMAN_SPRITE_IMAGE,
        32 * 3,
        32 * 0,
        32,
        32,
        (i + 1) * 32,
        GAME_HEIGHT + 5,
        32,
        32);
    }

    if (this.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
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
    else {
      for (let i = 0, xaxis = 1; i < this.players[1].lives && i < PACMAN_MAX_LIVES; i++ , xaxis++) {
        this.ctx.drawImage(
          PACMAN_SPRITE_IMAGE,
          32 * 3,
          32 * 0,
          32,
          32,
          (16 * 28) - ((xaxis + 1) * 32),
          GAME_HEIGHT + 5,
          32,
          32);
      }
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
