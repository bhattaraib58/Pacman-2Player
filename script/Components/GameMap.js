/**
 * @class GameMap
 */
class GameMap {

  /**
   *Creates an instance of GameMap.
   * @param {*} ctx
   * @param {*} layoutMap
   * @memberof GameMap
   */
  constructor(ctx, layoutMap) {
    this.ctx = ctx;
    this.layoutMap = layoutMap ||
      {
        map: [],
        points: [],
        row: 31,
        column: 28,
        layoutImage: new Image(),// The actual graphic will be loaded into this.
        tileWidth: 16,
        tileHeight: 16,
      };
    this.layoutMap.layoutImage.src = PACMAN_TILES;

    //for enerzier
    this.animation = new Sprite();
    let energizerFrameSet = [4, 6];
    this.animation.change(energizerFrameSet, 12);
  }

  /**
   * This function draws the tile graphics from the tileSheet to the ctx
   * one by one according to the layoutMap. 
   * It then draws the ctx to the display canvas and takes care of scaling the ctx 
   * image up to the display canvas size.
   *
   * @memberof GameMap
   */
  drawMap() {

    // update enerzier animation to next frame
    this.animation.update();

    /* Looping through the tile map. */
    for (let index = this.layoutMap.map.length - 1; index > -1; --index) {

      /* We get the value of each tile in the map which corresponds to the tile
      graphic index in the tileSheet.image. */
      let value = this.layoutMap.map[index];

      /* This is the x and y location at which to cut the tile image out of the
      tileSheet.image. */
      let sourceX = (value % this.layoutMap.tileWidth) * this.layoutMap.tileWidth;
      let sourceY = Math.floor(value / this.layoutMap.tileHeight) * this.layoutMap.tileHeight;

      /* This is the x and y location at which to draw the tile image we are cutting
      from the layoutMap.layoutImage to the ctx canvas. */
      let destinationX = (index % this.layoutMap.column) * this.layoutMap.tileWidth;
      let destinationY = Math.floor(index / this.layoutMap.column) * this.layoutMap.tileHeight;

      /* Draw the tile image to the ctx. The width and height of the tile is taken from the tileSheet object. */
      this.ctx.drawImage(this.layoutMap.layoutImage, sourceX, sourceY, this.layoutMap.tileWidth, this.layoutMap.tileHeight, Math.floor(destinationX), Math.floor(destinationY)+HEADER_HEIGHT, this.layoutMap.tileWidth, this.layoutMap.tileHeight);
    }

    /* Looping through the tile map. */
    for (let index = this.layoutMap.points.length - 1; index > -1; --index) {
      let value = this.layoutMap.points[index];
      let sourceX = (value % this.layoutMap.tileWidth) * this.layoutMap.tileWidth;
      let sourceY = Math.floor(value / this.layoutMap.tileHeight) * this.layoutMap.tileHeight;
      let destinationX = (index % this.layoutMap.column) * this.layoutMap.tileWidth;
      let destinationY = Math.floor(index / this.layoutMap.column) * this.layoutMap.tileHeight;
      if (value !== 38) {
        this.ctx.drawImage(this.layoutMap.layoutImage, sourceX, sourceY, this.layoutMap.tileWidth, this.layoutMap.tileHeight, destinationX, destinationY+HEADER_HEIGHT, this.layoutMap.tileWidth, this.layoutMap.tileHeight);
      }
      if (value === 38) {
        this.ctx.drawImage(this.layoutMap.layoutImage, this.animation.frame * this.layoutMap.tileWidth, sourceY, this.layoutMap.tileWidth, this.layoutMap.tileHeight, destinationX, destinationY+HEADER_HEIGHT, this.layoutMap.tileWidth, this.layoutMap.tileHeight);
      }
    }
  }

  /**
   * convert a coordinate (x, y) to the corresponding index in the gameMap array
   *
   * @param {*} x
   * @param {*} y
   * @returns
   * @memberof GameMap
   */
  toGameMapIndex(x, y) {
    return (y * this.layoutMap.column) + x;
  }


  /**
   * Get value of x,y cordinate value from game map
   *
   * @param {*} x
   * @param {*} y
   * @returns
   * @memberof GameMap
   */
  getGameMapValueFromXY(x, y) {
    // here tunnelling refers to pacman going in tunnel 
    // as gamemap doesn't have value for less than 0 or more than column value so we have to set explicitly

    // set x as last column for tunnelling in left right
    if (x < 0) {
      x = this.layoutMap.column - 1;
    }

    if (x >= this.layoutMap.column) {
      x = 0;
    }

    // set y as last row for tunnelling in up down    
    if (y < 0) {
      y = this.layoutMap.row - 1;
    }

    if (y >= this.layoutMap.row) {
      y = 0;
    }

    let mapPosition = this.toGameMapIndex(x, y);
    return this.layoutMap.map[mapPosition];
  }

  getGamePointValueFromXY(x, y) {
    let pointPosition = this.toGameMapIndex(x, y);
    return this.layoutMap.points[pointPosition];
  }
}
