class Pacman {
  constructor(canvas, ctx, pacmanControlKey, gameMap) {

    var position = null,
      direction = null,
      eaten = null,
      due = null,
      lives = null,
      score = 5,
      keyMap = {};

    this.canvas = canvas;
    this.ctx = ctx;
    this.gameMap = gameMap;
    this.pacmanControlKey = pacmanControlKey;

    // the cordinates of tile the player is currently moving from-to
    this.tileFrom = [13, 23];
    this.tileTo = [13, 23];
    // the time in millisecond at which character began to move
    this.timeMoved = 0;

    // the dimension of character Width, height
    this.dimensions = [32, 32];

    // true position of charater in canvas
    this.position = [208, 360];

    // the time in milliseconds it will take for character to move 1 tile
    this.delayMove = 100;

    this.tileWidth = 16;
    this.tileHeight = 16;

    // keypresses
    this.keyUpPressed = false;
    this.keyDownPressed = false;
    this.keyLeftPressed = false;
    this.keyRightPressed = false;

    // directions
    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.animation = new Sprite();
    // event listeners
    this.addEventListeners();


    /* The sprite sheet object holds the sprite sheet graphic and some animation frame
      sets. An animation frame set is just an array of frame values that correspond to
      each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
    this.spriteSheet = {
      frameSets: [[5, 6, 2, 6], [7, 8, 2, 8], [4, 3, 2, 3], [0, 1, 2, 1]],//moving top, moving bottom, moving left, moving right
      image: new Image()
    };

    this.spriteSheet.image.src = PACMAN_SPRITES;
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
    if (!this.processMovement(currentFrameTime)) {

      // if up key is pressed and up space is empty
      if (this.keyUpPressed && this.tileFrom[1] >= 0 &&
        this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] - 1) == 13) {

        this.movingUp = true;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;

        /* To change the animation to pacman moving up, with animation change in 5 sec. */
        this.animation.change(this.spriteSheet.frameSets[0], 5);
      }

      // if down key is pressed and down space is empty
      else if (this.keyDownPressed && this.tileFrom[1] < (this.gameMap.layoutMap.row - 1) &&
        this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] + 1) == 13) {

        this.movingUp = false;
        this.movingDown = true;
        this.movingLeft = false;
        this.movingRight = false;

        this.animation.change(this.spriteSheet.frameSets[1], 5);
      }

      // if left key is pressed and left space is empty
      else if (this.keyLeftPressed && this.tileFrom[0] >= 0 &&
        this.gameMap.getGameMapValueFromXY(this.tileFrom[0] - 1, this.tileFrom[1]) == 13) {

        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = true;
        this.movingRight = false;

        this.animation.change(this.spriteSheet.frameSets[2], 5);
      }
      
      // if right key is pressed and right space is empty
      else if (this.keyRightPressed && this.tileFrom[0] < (this.gameMap.layoutMap.column - 1) &&
        this.gameMap.getGameMapValueFromXY(this.tileFrom[0] + 1, this.tileFrom[1]) == 13) {

        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = true;

        this.animation.change(this.spriteSheet.frameSets[3], 5);
      }


      // as our pacman needs to move constantly widthout key press,
      //  also pacman should stop when there is obstacle the code has become longer

      // if pacman is moving up check of upper box is empty and go otherise stop
      if (this.movingUp == true && this.movingDown == false && this.movingLeft == false && this.movingRight == false) {
        if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] - 1) == 13) {
          this.tileTo[1] -= 1;
        }
        else {
          this.movingUp = false;
        }
      }
      
      // if pacman is moving down check of down box is empty and go otherise stop
      if (this.movingUp == false && this.movingDown == true && this.movingLeft == false && this.movingRight == false) {
        if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] + 1) == 13) {
          this.tileTo[1] += 1;
        }
        else {
          this.movingDown = false;
        }
      }
      
      // if pacman is moving left check of left box is empty and go otherise stop
      if (this.movingUp == false && this.movingDown == false && this.movingLeft == true && this.movingRight == false) {
        if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0] - 1, this.tileFrom[1]) == 13) {
          this.tileTo[0] -= 1;
        }
        else {
          this.movingLeft = false;
        }
      }

      // if pacman is moving right check of right box is empty and go otherise stop
      if (this.movingUp == false && this.movingDown == false && this.movingLeft == false && this.movingRight == true) {
        if (this.gameMap.getGameMapValueFromXY(this.tileFrom[0] + 1, this.tileFrom[1]) == 13) {
          this.tileTo[0] += 1;
        }
        else {
          this.movingRight = false;
        }
      }

      // after setting the values for key press event we set the 
      // time moved (timeMoved= time we started moving the pacman) to current time 
      if (this.tileFrom[0] != this.tileTo[0] ||
        this.tileFrom[1] != this.tileTo[1]) {
        this.timeMoved = currentFrameTime;
      }
    }

    this.animation.update();
    this.ctx.drawImage(this.spriteSheet.image, this.animation.frame * this.dimensions[0], 0, this.dimensions[0], this.dimensions[1], this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);
  }


  /**
   * Allow us to directly place character on tile we specify
   * It updates tileFrom and tileTo peroperties of new tile cordinates,
   * It also calculates the pixel position of character
   *
   * @param {*} x
   * @param {*} y
   * @memberof Pacman
   */
  placeAt(x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position =
      [
        //x position in tile tile width*x and to keep at center tile width/2
        (this.tileWidth * x) + ((this.tileWidth - this.dimensions[0]) / 2),

        //y position in tile tile height*y and to keep at center tile height/2
        (this.tileHeight * y) + ((this.tileHeight - this.dimensions[1]) / 2)
      ];
  }


  /**
   * If our player is moving we need some calculation each frame to find true position
   * and move the pacman accordingly
   *
   * @param {*} gameTime -we pass current game time in millisecons
   * @returns
   * @memberof Pacman
   */
  processMovement(gameTime) {

    // we check if tileTo is same as tileFrom 
    // if this is case we know character is not currently moving
    // we leave function and code know that we are free to receive instructions
    if ((this.tileFrom[0] == this.tileTo[0]) && (this.tileFrom[1] == this.tileTo[1])) {
      return false;
    }

    // we check amount of time in game has passed since character started moving
    // if timeMoved (the time character started moving) is grater than delayMove (time taken by character to move)
    // we put charater in final position
    if ((gameTime - this.timeMoved) >= this.delayMove) {
      this.placeAt(this.tileTo[0], this.tileTo[1]);
    }


    // if above checks know that character is infact moving
    else {

      // we need to accurately calculate its position on Canvas, 
      // we calculate the position of character where it is on canvas
      this.position[0] = (this.tileFrom[0] * this.tileWidth) + ((this.tileWidth - this.dimensions[0]) / 2);
      this.position[1] = (this.tileFrom[1] * this.tileHeight) + ((this.tileHeight - this.dimensions[1]) / 2);


      // checking with axis we see if cheracter is moving on x- axis
      if (this.tileTo[0] !== this.tileFrom[0]) {
        //[distance moved] = ([tile width] / [time to move 1 tile]) x ([current time] - [time movement began])
        let diff = (this.tileWidth / this.delayMove) * (gameTime - this.timeMoved);

        // if tile is before or after us we move opposite or positive
        this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
      }

      // checking with axis we see if cheracter is moving on y- axis
      if (this.tileTo[1] !== this.tileFrom[1]) {
        let diff = (this.tileHeight / this.delayMove) * (gameTime - this.timeMoved);
        this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
      }

      // we set the position to whole number to smooth out canvas
      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);


      // console.log(this.tileFrom);
      // console.log(this.tileTo);
      // console.log(this.position);
    }

    //we let know that player is currently moving
    return true;
  }

  // event listeners
  addEventListeners() {

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === this.pacmanControlKey.UP) {
        this.keyUpPressed = true;
      }

      if (e.keyCode === this.pacmanControlKey.DOWN) {
        this.keyDownPressed = true;
      }

      if (e.keyCode === this.pacmanControlKey.LEFT) {
        this.keyLeftPressed = true;
      }

      if (e.keyCode === this.pacmanControlKey.RIGHT) {
        this.keyRightPressed = true;
      }
    }, false);

    window.addEventListener('keyup', (e) => {

      if (e.keyCode === this.pacmanControlKey.UP) {
        this.keyUpPressed = false;
      }

      if (e.keyCode === this.pacmanControlKey.DOWN) {
        this.keyDownPressed = false;
      }

      if (e.keyCode === this.pacmanControlKey.LEFT) {
        this.keyLeftPressed = false;
      }

      if (e.keyCode === this.pacmanControlKey.RIGHT) {
        this.keyRightPressed = false;
      }
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
