class Pacman extends GameActors {
  constructor(ctx, gameObject, pacmanControlKey, gameMap, initialPosition) {
    super(ctx, gameMap, initialPosition);

    this.gameObject = gameObject;
    this.lives = 3;
    this.gameOver = false;
    this.dotsEaten = 0;
    this.energizerEaten = 0;
    this.fruitEaten = 0; //bonus symbols (commonly known as fruit)
    this.score = 0;


    this.ghosts = null;

    //pacman key controls for moving
    this.pacmanControlKey = pacmanControlKey;

    // keypresses
    this.keyUpPressed = false;
    this.keyDownPressed = false;
    this.keyLeftPressed = false;
    this.keyRightPressed = false;

    // the time in milliseconds it will take for character to move 1 tile
    this.delayMove = 100;

    // event listeners
    this.addEventListeners();

    //initialize pacman
    this.initPacman(initialPosition);
  }

  setGhosts(ghosts) {
    this.ghosts = ghosts;
  }

  initPacman(initialPosition) {
    //set initial moving of pacman to left
    this.movingDirection = MOVING_DIRECTION.LEFT;
    this.spriteSheet.framePosition = 0; //pacman is on y index 0 on sprite sheet
    this.spriteSheet.frameSets = [[5, 6, 2, 6], [7, 8, 2, 8], [4, 3, 2, 3], [0, 1, 2, 1]];//moving top, moving bottom, moving left, moving right

    //set animation of pacman to left moving
    this.spriteAnimation.change(this.spriteSheet.frameSets[2], 5);

    //slice and generate new non mutating array such that the values don't override
    this.tileFrom = initialPosition.slice(0);
    //always slice tileTo such that the tilefrom and tile to represent diffrent array locations 
    this.tileTo = initialPosition.slice(0);

    this.position = [2]; //2 items x and y in position
    this.position[0] = (this.tileFrom[0] * this.gameMap.layoutMap.tileWidth) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2);
    this.position[1] = (this.tileFrom[1] * this.gameMap.layoutMap.tileHeight) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2);
  }

  /**
   * returns whether the Ghost Hits pacman
   *
   * @param {*} ghostPosition
   * @returns
   * @memberof Pacman
   */
  hitPacman(ghostPosition) {
    let xPositionDifference = Math.abs(this.position[0] - ghostPosition[0]);
    let yPositionDifference = Math.abs(this.position[1] - ghostPosition[1]);

    if (xPositionDifference < 5 && yPositionDifference < 5) {
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
      this.gameObject.gameMode = GAME_MODE.GAME_OVER;
    } else {
      this.gameObject.gameMode = GAME_MODE.PACMAN_DEAD;
      console.log('new game');
    }
  }


  /**
   * Draw and Move Pacman
   *
   * @memberof Pacman
   */
  draw() {
    // get current time in milliseconds
    let currentFrameTime = Date.now();

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
    this.spriteAnimation.update();
    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteSheet.image,
      this.spriteAnimation.frame * this.dimensions[0],
      this.spriteSheet.framePosition * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
  }

  drawInitialSprite() {
    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteSheet.image,
      2 * this.dimensions[0],
      0 * this.dimensions[1],
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
    if (this.spriteAnimation.frame >= 10) {
      return false;
    }
    this.removeEventListeners();
    this.setDeadSpriteOfPacman();
    // update animation to next frame
    this.spriteAnimation.update();
    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteSheet.image,
      this.spriteAnimation.frame * this.dimensions[0],
      this.spriteSheet.framePosition * this.dimensions[1],
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
    if (this.spriteSheet.framePosition == 1) {
      return;
    }
    // set sprite to dead
    this.spriteSheet.framePosition = 1;
    this.spriteSheet.frameSets = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
    this.spriteAnimation.change(this.spriteSheet.frameSets[0], 10);
    this.spriteAnimation.frame = 0;
  }

  setPointsIfEaten() {
    //get score from Dot eaten
    if (this.gameMap.getGamePointValueFromXY(this.tileFrom[0], this.tileFrom[1]) == DOT_VALUE) {
      let indexOfDot = this.gameMap.toGameMapIndex(this.tileFrom[0], this.tileFrom[1]);
      this.gameMap.layoutMap.points[indexOfDot] = EMPTY_DOT_EATEN_VALUE;
      this.dotsEaten++;
      this.score += DOT_EATERN_SCORE; //each dot worth 10 points
    }

    //big dot - energizer eaten
    if (this.gameMap.getGamePointValueFromXY(this.tileFrom[0], this.tileFrom[1]) == ENERZIER_VALUE) {
      let indexOfEnerzier = this.gameMap.toGameMapIndex(this.tileFrom[0], this.tileFrom[1]);
      this.gameMap.layoutMap.points[indexOfEnerzier] = EMPTY_DOT_EATEN_VALUE;
      this.energizerEaten++;
      this.score += ENERGIZER_EATEN_SCORE; //each dot worth 100 points

      //set all ghosts in game to frightened
      for (let i = 0; i < this.ghosts.length; i++) {
        this.ghosts[i].frightened = true;
        this.ghosts[i].flashCount = 0;
      }
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



  addScore(nScore) {
    score += nScore;
    if (score >= 10000 && score - nScore < 10000) {
      lives += 1;
    }
  };

  theScore() {
    return score;
  };

  loseLife() {
    lives -= 1;
  };

  getLives() {
    return lives;
  };

  initUser() {
    score = 0;
    lives = 3;
    newLevel();
  }

  newLevel() {
    resetPosition();
    eaten = 0;
  };
}
