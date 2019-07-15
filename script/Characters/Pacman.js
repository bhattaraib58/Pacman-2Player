class Pacman extends GameActors {
  constructor(ctx, gameObject, pacmanControlKey, gameMap, audioLoader, initialPosition) {
    super(ctx, gameObject, gameMap, initialPosition);

    this.audioLoader = audioLoader;
    this.lives = 2;
    this.pacDead = false;
    this.gameOver = false;
    this.dotsEaten = 0;
    this.energizerEaten = 0;
    this.fruitEaten = 0; //bonus symbols (commonly known as fruit)
    this.score = 0;

    this.ghosts = null;
    this.deadDisplayCounter = 0;

    //pacman key controls for moving
    this.pacmanControlKey = pacmanControlKey;

    // keypresses
    this.keyUpPressed = false;
    this.keyDownPressed = false;
    this.keyLeftPressed = false;
    this.keyRightPressed = false;

    // event listeners
    this.addEventListeners();

    //initialize pacman
    this.initPacman(initialPosition);
  }

  setGhosts(ghosts) {
    this.ghosts = ghosts;
  }

  setGameMap(gameMap) {
    this.gameMap = gameMap;
  }

  initPacman(initialPosition) {
    // the time in milliseconds it will take for character to move 1 tile
    // pacman game speed/ delay move is largerly dependedny on game mode and game level also
    this.delayMove = getCharacterSpeed('pacman', this.gameObject.gameLevel, 'normal');

    //this flag is used for hiding the ctx draw of ghost when pacman hits them
    this.hideDrawImage = false;

    initialPosition = initialPosition || this.initialPosition;

    //set animation of pacman to left moving
    super.setSpritePosition(PACMAN_SPRITE_POSITION.NORMAL);

    this.spriteAnimation.spriteXPosition = 2;
    this.setMovingLeftActorData();

    //slice and generate new non mutating array such that the values don't override
    this.tileFrom = initialPosition.slice(0);
    //always slice tileTo such that the tilefrom and tile to represent diffrent array locations 
    this.tileTo = initialPosition.slice(0);

    this.position = [2]; //2 items x and y in position
    this.position[0] = (this.tileFrom[0] * this.gameMap.layoutMap.tileWidth) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2);
    this.position[1] = (this.tileFrom[1] * this.gameMap.layoutMap.tileHeight) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2);
  }

  /**
   * Draw and Move Pacman
   *
   * @memberof Pacman
   */
  draw() {
    // get current time in milliseconds
    let currentFrameTime = Date.now();

    //game pause state refers to when pacman dead or ghost dead, game end etc
    if (!this.gameObject.gamePauseState) {
      // if we are currently moving dont set value
      if (!super.processMovement(currentFrameTime)) {
        //set points if pacman eat point
        this.setPointsIfEaten();

        //set pacman position and animation base on input
        this.setPacmanAnimationAndPositionBasedOnKeyInput();

        //move pacman based on direction set or continuing moving on direction set
        super.moveActor();

        // after setting the values for key press event we set the 
        // time moved (timeMoved= time we started moving the pacman) to current time 
        if (this.tileFrom[0] != this.tileTo[0] ||
          this.tileFrom[1] != this.tileTo[1]) {
          this.timeMoved = currentFrameTime;
        }
      }
      // update animation to next frame
      this.spriteAnimation.updateSprite();
    }

    if (!this.hideDrawImage) {
      // draw new frame pacman
      this.ctx.drawImage(
        this.spriteAnimation.image,
        this.spriteAnimation.spriteXPosition * this.dimensions[0],
        this.spriteAnimation.spriteYPosition * this.dimensions[1],
        this.dimensions[0],
        this.dimensions[1],
        this.position[0],
        this.position[1] + HEADER_HEIGHT,
        this.dimensions[0],
        this.dimensions[1]
      );
    }
  }

  setDeadPosition() {
    if (!this.drawPacmanDead()) {
      this.setInitialPosition(this.initialPosition);
      this.drawInitialSprite();
      for (let j = 0; j < this.ghosts.length; j++) {
        this.ghosts[j].drawInitialSprite();
      }
      this.deadDisplayCounter++;
      if (this.deadDisplayCounter > 100) {
        this.initPacman();
        this.pacDead = false;
        this.deadDisplayCounter = 0;
      }
    }
  }

  drawInitialSprite() {
    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteAnimation.image,
      PACMAN_SPRITE_POSITION.INITAL.X * this.dimensions[0],
      PACMAN_SPRITE_POSITION.INITAL.Y * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
  }

  drawPacmanDead() {
    // if all being dead sprite shown return as false to indicate to move on
    if (this.spriteAnimation.spriteXPosition >= 11) {
      return false;
    }
    this.removeEventListeners();
    this.setDeadSpriteOfPacman();

    // update animation to next frame
    this.spriteAnimation.updateSprite();

    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteAnimation.image,
      this.spriteAnimation.spriteXPosition * this.dimensions[0],
      this.spriteAnimation.spriteYPosition * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
    return true;
  }

  setDeadSpriteOfPacman() {
    // return if dead sprite already set
    if (this.spriteAnimation.spriteYPosition == PACMAN_SPRITE_POSITION.DEAD.Y) {
      return;
    }
    // set sprite to dead
    super.setSpritePosition(PACMAN_SPRITE_POSITION.DEAD);
    this.spriteAnimation.spriteXPosition = 0;
  }


  /**
   * returns whether the Ghost Hits pacman
   *
   * @param {*} ghostPosition
   * @returns
   * @memberof Pacman
   */
  hitPacman(ghostPosition) {
    if (ghostPosition[0] < this.position[0] + this.dimensions[0] - 8 &&
      ghostPosition[0] + this.dimensions[0] - 8 > this.position[0] &&
      ghostPosition[1] < this.position[1] + this.dimensions[1] - 8 &&
      ghostPosition[1] + this.dimensions[1] - 8 > this.position[1]) {
      // collision detected!
      return true;
    }
    return false;
  }

  /**
   * called when a ghost hits pacman
   *
   * @memberof Pacman
   */
  kill() {
    this.lives -= 1;
    if (this.lives < 0) {//game over if no lives left
      this.movingDirection = MOVING_DIRECTION.STOP;
      this.gameObject.gameMode = GAME_MODE.GAME_OVER;
    } else {
      //start new game
      this.movingDirection = MOVING_DIRECTION.STOP;

      if (this.gameObject.gamedata.gameState == GAME_STATE.SINGLE_PLAYER) {
        this.gameObject.gameMode = GAME_MODE.PACMAN_DEAD;
      }
      else {
        this.pacDead = true;
      }
    }
  }

  setPointsIfEaten() {
    //get score from Dot eaten
    if (this.gameMap.getGamePointValueFromXY(this.tileFrom[0], this.tileFrom[1]) == DOT_VALUE) {
      let indexOfDot = this.gameMap.toGameMapIndex(this.tileFrom[0], this.tileFrom[1]);
      this.gameMap.layoutMap.points[indexOfDot] = EMPTY_DOT_EATEN_VALUE;
      this.dotsEaten++;
      this.gameMap.dotsRemaining--;
      this.audioLoader.play('eating', 1.2);

      // this.score += DOT_EATERN_SCORE; //each dot worth 10 points
      this.addScore(DOT_EATERN_SCORE);

      if (this.gameMap.dotsRemaining <= 0) {
        this.gameObject.gameMode = GAME_MODE.GAME_LEVEL_COMPLETED;
      }
    }

    //big dot - energizer eaten
    if (this.gameMap.getGamePointValueFromXY(this.tileFrom[0], this.tileFrom[1]) == ENERZIER_VALUE) {
      let indexOfEnerzier = this.gameMap.toGameMapIndex(this.tileFrom[0], this.tileFrom[1]);
      this.gameMap.layoutMap.points[indexOfEnerzier] = EMPTY_DOT_EATEN_VALUE;
      this.energizerEaten++;
      this.gameMap.enerzierRemaining--;
      this.audioLoader.play('eatpill');


      // this.score += ENERGIZER_EATEN_SCORE; //each dot worth 100 points
      this.addScore(ENERGIZER_EATEN_SCORE);

      //set pacman frightened speed
      this.delayMove = getCharacterSpeed('pacman', this.gameObject.gameLevel, 'FRIGHT');

      //set all ghosts in game to frightened
      for (let i = 0; i < this.ghosts.length; i++) {

        //if ghost is returing home don't set it to frightened mode
        if (!this.ghosts[i].returnHome && !this.ghosts[i].deadForABit) {
          this.ghosts[i].frightened = true;
          this.ghosts[i].flashCount = 0;
          this.ghosts[i].delayMove = getCharacterSpeed('GHOST', this.gameObject.gameLevel, 'FRIGHT');
        }
      }
    }
  }

  addScore(nScore) {
    this.score += nScore;
    // add extra life after getting 10,000 points
    if (this.score >= 10000 && this.score - nScore < 10000) {
      this.lives += 1;
      this.audioLoader.play('extralives');
    }
  }

  setPacmanAnimationAndPositionBasedOnKeyInput() {
    // if up key is pressed and up space is empty
    // set move up and set animation
    if (this.keyUpPressed && super.isBlockUpperThanActorEmpty()) {
      super.setMovingUpActorData();
    }

    // if down key is pressed and down space is empty
    // set move down and set animation
    else if (this.keyDownPressed && super.isBlockLowerThanActorEmpty()) {
      super.setMovingDownActorData();
    }

    // if left key is pressed and left space is empty
    // set move left and set animation
    else if (this.keyLeftPressed && super.isBlockLeftThanActorEmpty()) {
      super.setMovingLeftActorData();
    }

    // if right key is pressed and right space is empty
    // set move right and set animation
    else if (this.keyRightPressed && super.isBlockRightThanActorEmpty()) {
      super.setMovingRightActorData();
    }
  }


  // event listeners
  addEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === this.pacmanControlKey.UP) { this.keyUpPressed = true; }

      if (e.keyCode === this.pacmanControlKey.DOWN) { this.keyDownPressed = true; }

      if (e.keyCode === this.pacmanControlKey.LEFT) { this.keyLeftPressed = true; }

      if (e.keyCode === this.pacmanControlKey.RIGHT) { this.keyRightPressed = true; }
    }, false);

    window.addEventListener('keyup', (e) => {
      if (e.keyCode === this.pacmanControlKey.UP) { this.keyUpPressed = false; }

      if (e.keyCode === this.pacmanControlKey.DOWN) { this.keyDownPressed = false; }

      if (e.keyCode === this.pacmanControlKey.LEFT) { this.keyLeftPressed = false; }

      if (e.keyCode === this.pacmanControlKey.RIGHT) { this.keyRightPressed = false; }
    }, false);
  }

  removeEventListeners() {
    window.removeEventListener('keydown', this.keyDownHandler, false);
    window.removeEventListener('keyup', this.keyUpHandler, false);
  }
}
