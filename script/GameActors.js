/**
 * Game Actros Refers To All Charaters in pacman which are movable
 *
 * @class GameActors
 */
class GameActors {

  /**
   *Creates an instance of GameActors.
   * @param {*} canvas
   * @param {*} ctx
   * @param {*} gameMap //game map class object
   * @memberof GameActors
   */
  constructor(canvas, ctx, gameMap) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameMap = gameMap;

    // directions
    //default moving direction STOP position
    this.movingDirection =MOVING_DIRECTION.STOP; 

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

    //set animation objeect
    this.spriteAnimation = new Sprite();

    /* The sprite sheet object holds the sprite sheet graphic and some animation frame
      sets. An animation frame set is just an array of frame values that correspond to
      each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
    this.spriteSheet = {
      frameSets: [[5, 6, 2, 6], [7, 8, 2, 8], [4, 3, 2, 3], [0, 1, 2, 1]],//moving top, moving bottom, moving left, moving right
      image: new Image()
    };

    //set Game sprites
    this.spriteSheet.image.src = PACMAN_SPRITES;
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
   * and move the pacman accordingly
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
