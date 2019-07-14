/**
 * Game Actros Refers To All Charaters in pacman which are movable
 *
 * @class GameActors
 */
class GameActors {
  /**
   *Creates an instance of GameActors.
   * @param {*} ctx
   * @param {*} gameObject
   * @param {*} gameMap
   * @param {*} initialPosition
   * @memberof GameActors
   */
  constructor(ctx, gameObject, gameMap, initialPosition) {
    this.ctx = ctx;
    this.gameMap = gameMap;
    this.gameObject = gameObject;

    // directions
    //default moving direction STOP position
    this.movingDirection = MOVING_DIRECTION.STOP;

    // the cordinates of tile the player is currently moving from-to

    //slice and generate new non mutating array such that the values don't override
    this.initialPosition = initialPosition;
    this.tileFrom = initialPosition.slice(0);
    //always slice tileTo such that the tilefrom and tile to represent diffrent array locations 
    this.tileTo = initialPosition.slice(0);
    this.previousTile = [0, 0];

    // the time in millisecond at which character began to move
    this.timeMoved = 0;

    // the dimension of character Width, height
    this.dimensions = [32, 32];

    // true position of charater in canvas
    // place of character in canvas in x,y position
    this.position = [2]; //2 items x and y in position
    this.position[0] = (this.tileFrom[0] * this.gameMap.layoutMap.tileWidth) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2);
    this.position[1] = (this.tileFrom[1] * this.gameMap.layoutMap.tileHeight) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2);

    // the time in milliseconds it will take for character to move 1 tile
    this.delayMove = 100;

    /* The sprite sheet object holds the sprite sheet graphic and some animation frame
      sets. An animation frame set is just an array of frame values that correspond to
      each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
    this.spriteXPositions = [];//moving top, moving bottom, moving left, moving right frame set

    //set animation object
    this.spriteAnimation = new Sprite(this.spriteXPositions[0], 5, PACMAN_SPRITES, 0);
  }

  setInitialPosition(initialPosition) {
    this.tileFrom = initialPosition.slice(0);
    this.tileTo = initialPosition.slice(0);
    this.position[0] = (this.tileFrom[0] * this.gameMap.layoutMap.tileWidth) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2);
    this.position[1] = (this.tileFrom[1] * this.gameMap.layoutMap.tileHeight) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2);
  }

  //utility functions
  setSpritePosition(spritePosition) {
    this.spriteXPositions = spritePosition.X;
    this.spriteAnimation.setSpriteXPosition(this.spriteXPositions[0]);
    this.spriteAnimation.setSpriteYPosition(spritePosition.Y);
    this.spriteAnimation.setAnimationDelay(spritePosition.DELAY_SPEED);
  }

  isLocationEmpty() {
    return this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE ? true : false;
  }
  isBlockUpperThanActorEmpty() {
    return this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] - 1) == MAZE_EMPTY_SPACE_VALUE ? true : false;
  }

  isBlockLowerThanActorEmpty() {
    return this.gameMap.getGameMapValueFromXY(this.tileFrom[0], this.tileFrom[1] + 1) == MAZE_EMPTY_SPACE_VALUE ? true : false;
  }

  isBlockLeftThanActorEmpty() {
    return this.gameMap.getGameMapValueFromXY(this.tileFrom[0] - 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE ? true : false;
  }

  isBlockRightThanActorEmpty() {
    return this.gameMap.getGameMapValueFromXY(this.tileFrom[0] + 1, this.tileFrom[1]) == MAZE_EMPTY_SPACE_VALUE ? true : false;
  }

  setMovingUpActorData() {
    this.movingDirection = MOVING_DIRECTION.UP;
    /* To change the animation to pacman moving up*/
    this.spriteAnimation.setSpriteXPosition(this.spriteXPositions[0]);
  }

  setMovingDownActorData() {
    this.movingDirection = MOVING_DIRECTION.DOWN;
    this.spriteAnimation.setSpriteXPosition(this.spriteXPositions[1]);
  }

  setMovingLeftActorData() {
    this.movingDirection = MOVING_DIRECTION.LEFT;
    this.spriteAnimation.setSpriteXPosition(this.spriteXPositions[2]);
  }

  setMovingRightActorData() {
    this.movingDirection = MOVING_DIRECTION.RIGHT;
    this.spriteAnimation.setSpriteXPosition(this.spriteXPositions[3]);
  }

  /**
   * Move actor Based on Direction set 
   * and which tile to move from which tile
   *
   * @memberof GameActors
   */
  moveActor() {
    // used to work as tunnel if left and right are empty pacman/ghosts can easily move in tunnel
    if (this.tileTo[0] < -1) {
      this.tileTo[0] = this.gameMap.layoutMap.column;
    }
    if (this.tileTo[0] > this.gameMap.layoutMap.column) {
      this.tileTo[0] = -1;
    }

    // used to work as tunnel if top and bottom are empty pacman/ghosts can easily move in tunnel
    if (this.tileTo[1] < -1) {
      this.tileTo[1] = this.gameMap.layoutMap.row;
    }
    if (this.tileTo[1] > this.gameMap.layoutMap.row) {
      this.tileTo[1] = -1;
    }

    // as our pacman/ghosts needs to move constantly widthout key press,
    //  also pacman/ghosts should stop when there is obstacle the code has become longer

    // if pacman/ghosts is moving up check of upper box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.UP) {
      if (this.isBlockUpperThanActorEmpty()) {
        this.tileTo[1] -= 1;
      }
    }

    // if pacman/ghosts is moving down check of down box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.DOWN) {
      if (this.isBlockLowerThanActorEmpty()) {
        this.tileTo[1] += 1;
      }
    }

    // if pacman/ghosts is moving left check of left box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.LEFT) {
      if (this.isBlockLeftThanActorEmpty()) {
        this.tileTo[0] -= 1;
      }
    }

    // if pacman/ghosts is moving right check of right box is empty and go otherise stop
    if (this.movingDirection === MOVING_DIRECTION.RIGHT) {
      if (this.isBlockRightThanActorEmpty()) {
        this.tileTo[0] += 1;
      }
    }
  }

  /**
   * Allow us to directly place character on tile we specify
   * It updates tileFrom and tileTo peroperties of new tile cordinates,
   * It also calculates the pixel position of character
   *
   * @param {*} x
   * @param {*} y
   * @memberof GameActors
   */
  placeAt(x, y) {
    this.previousTile = this.tileFrom.slice(0);
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position =
      [
        //x position in tile tile width*x and to keep at center tile width/2
        (this.gameMap.layoutMap.tileWidth * x) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2),

        //y position in tile tile height*y and to keep at center tile height/2
        (this.gameMap.layoutMap.tileHeight * y) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2)
      ];
  }

  /**
   * If our player is moving we need some calculation each frame to find true position
   * and move the pacman/ghosts accordingly
   *
   * @param {*} gameTime -we pass current game time in millisecons
   * @returns
   * @memberof GameActors
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
      this.position[0] = (this.tileFrom[0] * this.gameMap.layoutMap.tileWidth) + ((this.gameMap.layoutMap.tileWidth - this.dimensions[0]) / 2);
      this.position[1] = (this.tileFrom[1] * this.gameMap.layoutMap.tileHeight) + ((this.gameMap.layoutMap.tileHeight - this.dimensions[1]) / 2);


      // checking with axis we see if cheracter is moving on x- axis
      if (this.tileTo[0] !== this.tileFrom[0]) {
        //[distance moved] = ([tile width] / [time to move 1 tile]) x ([current time] - [time movement began])
        let diff = (this.gameMap.layoutMap.tileWidth / this.delayMove) * (gameTime - this.timeMoved);

        // if tile is before or after us we move opposite or positive
        this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
      }

      // checking with axis we see if cheracter is moving on y- axis
      if (this.tileTo[1] !== this.tileFrom[1]) {
        let diff = (this.gameMap.layoutMap.tileHeight / this.delayMove) * (gameTime - this.timeMoved);
        this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
      }

      // we set the position to whole number to smooth out canvas
      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);
    }

    //we let know that player is currently moving
    return true;
  }
}
