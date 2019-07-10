class Pacman extends GameActors {
  constructor(ctx, pacmanControlKey, gameMap, initialPosition) {
    super(ctx, gameMap, initialPosition);
    
    this.lives = 5;
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

    //initialize pacman
    this.initPacman();
  }

  setGhosts(ghosts) {
    this.ghosts = ghosts;
  }

  initPacman() {
    // event listeners
    this.addEventListeners();

    //set initial moving of pacman to left
    this.movingDirection = MOVING_DIRECTION.LEFT;
    this.spriteSheet.framePosition = 0; //pacman is on y index 0 on sprite sheet
    this.spriteSheet.frameSets = [[5, 6, 2, 6], [7, 8, 2, 8], [4, 3, 2, 3], [0, 1, 2, 1]];//moving top, moving bottom, moving left, moving right

    //set animation of pacman to left moving
    this.spriteAnimation.change(this.spriteSheet.frameSets[2], 5);
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

    if (xPositionDifference < 10 && yPositionDifference < 10) {
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
      this.gameOver = true;
      console.log('game over');
    } else {
      // pos = new PVector(13 * 16 + 8, 23 * 16 + 8);     //reset positions  

      // blinky = new Blinky();
      // clyde = new Clyde();
      // pinky = new Pinky();
      // inky = new Inky();
      // vel = new PVector(-1, 0);
      // turnTo = new PVector(-1, 0);

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
    this.ctx.drawImage(this.spriteSheet.image, this.spriteAnimation.frame * this.dimensions[0], this.spriteSheet.framePosition * this.dimensions[1], this.dimensions[0], this.dimensions[1], this.position[0], this.position[1]+HEADER_HEIGHT, this.dimensions[0], this.dimensions[1]);
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