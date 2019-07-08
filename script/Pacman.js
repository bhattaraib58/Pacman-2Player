class Pacman extends GameActors {
  constructor(canvas, ctx, pacmanControlKey, gameMap) {
    super(canvas, ctx, gameMap);

    var position = null,
      direction = null,
      eaten = null,
      due = null,
      lives = null,
      score = 5,
      keyMap = {};

    this.dotsEaten = 0;
    this.energizerEaten = 0;
    this.fruitEaten = 0; //bonus symbols (commonly known as fruit)
    this.score = 0;

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


  initPacman() {
    // event listeners
    this.addEventListeners();

    //set initial moving of pacman to left
    this.movingDirection = MOVING_DIRECTION.LEFT;

    //set animation of pacman to left moving
    this.spriteAnimation.change(this.spriteSheet.frameSets[2], 5);
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

      //get score from points
      if (this.gameMap.getGamePointValueFromXY(this.tileFrom[0], this.tileFrom[1]) == DOT_VALUE) {
        let indexOfDot = this.gameMap.toGameMapIndex(this.tileFrom[0], this.tileFrom[1]);
        this.gameMap.layoutMap.points[indexOfDot] = EMPTY_DOT_EATEN_VALUE;
        this.dotsEaten++;
        this.score += DOT_EATERN_SCORE; //each dot worth 10 points
      }

      this.setPacmanAnimationAndPositionBasedOnKeyInput();
      this.movePacman();

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
    this.ctx.drawImage(this.spriteSheet.image, this.spriteAnimation.frame * this.dimensions[0], 0, this.dimensions[0], this.dimensions[1], this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);
  }


  movePacman() {
    // used to work as tunnel if left and right are empty pacman can easily move in tunnel
    if (this.tileTo[0] < -1) {
      this.tileTo[0] = this.gameMap.layoutMap.column;
    }
    if (this.tileTo[0] > this.gameMap.layoutMap.column) {
      this.tileTo[0] = -1;
    }


    // used to work as tunnel if top and bottom are empty pacman can easily move in tunnel
    if (this.tileTo[1] < -1) {
      this.tileTo[1] = this.gameMap.layoutMap.row;
    }
    if (this.tileTo[1] > this.gameMap.layoutMap.row) {
      this.tileTo[1] = -1;
    }


    // as our pacman needs to move constantly widthout key press,
    //  also pacman should stop when there is obstacle the code has become longer

    // if pacman is moving up check of upper box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.UP) {
      if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] - 1) == MAZE_EMPTY_SPACE_VALUE) {
        this.tileTo[1] -= 1;
      }
      else { this.movingDirection = MOVING_DIRECTION.STOP; }
    }

    // if pacman is moving down check of down box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.DOWN) {
      if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] + 1) == MAZE_EMPTY_SPACE_VALUE) {
        this.tileTo[1] += 1;
      }
      else { this.movingDirection = MOVING_DIRECTION.STOP; }
    }

    // if pacman is moving left check of left box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.LEFT) {
      if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0] - 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE) {
        this.tileTo[0] -= 1;
      }
      else { this.movingDirection = MOVING_DIRECTION.STOP; }
    }

    // if pacman is moving right check of right box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.RIGHT) {
      if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0] + 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE) {
        this.tileTo[0] += 1;
      }
      else { this.movingDirection = MOVING_DIRECTION.STOP; }
    }
  }

  setPacmanAnimationAndPositionBasedOnKeyInput() {
    // if up key is pressed and up space is empty
    // set move up and set animation
    if (this.keyUpPressed &&
      this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] - 1) == MAZE_EMPTY_SPACE_VALUE) {
      this.movingDirection = MOVING_DIRECTION.UP;
      /* To change the animation to pacman moving up, with animation change in 5 sec. */
      this.spriteAnimation.change(this.spriteSheet.frameSets[0], 5);
    }

    // if down key is pressed and down space is empty
    // set move down and set animation
    else if (this.keyDownPressed &&
      this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] + 1) == MAZE_EMPTY_SPACE_VALUE) {
      this.movingDirection = MOVING_DIRECTION.DOWN;
      this.spriteAnimation.change(this.spriteSheet.frameSets[1], 5);
    }

    // if left key is pressed and left space is empty
    // set move left and set animation
    else if (this.keyLeftPressed &&
      this.gameMap.getGameMapValueFromXY(this.tileFrom[0] - 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE) {
      this.movingDirection = MOVING_DIRECTION.LEFT;
      this.spriteAnimation.change(this.spriteSheet.frameSets[2], 5);
    }

    // if right key is pressed and right space is empty
    // set move right and set animation
    else if (this.keyRightPressed &&
      this.gameMap.getGameMapValueFromXY(this.tileFrom[0] + 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE) {
      this.movingDirection = MOVING_DIRECTION.RIGHT;
      this.spriteAnimation.change(this.spriteSheet.frameSets[3], 5);
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
