/**
 *
 *
 * @class GameMap
 */
class GameMap {

  /**
   *Creates an instance of GameMap.
   * @param {*} canvas
   * @param {*} ctx
   * @param {*} layoutMap
   * @memberof GameMap
   */
  constructor(canvas, ctx, layoutMap) {
    this.canvas = canvas;
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
    this.layoutMap.layoutImage.src = GAME_IMAGES[0];
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
      this.ctx.drawImage(this.layoutMap.layoutImage, sourceX, sourceY, this.layoutMap.tileWidth, this.layoutMap.tileHeight, Math.floor(destinationX), Math.floor(destinationY), this.layoutMap.tileWidth, this.layoutMap.tileHeight);
    }

    /* Looping through the tile map. */
    for (let index = this.layoutMap.points.length - 1; index > -1; --index) {
      let value = this.layoutMap.points[index];
      let sourceX = (value % this.layoutMap.tileWidth) * this.layoutMap.tileWidth;
      let sourceY = Math.floor(value / this.layoutMap.tileHeight) * this.layoutMap.tileHeight;
      let destinationX = (index % this.layoutMap.column) * this.layoutMap.tileWidth;
      let destinationY = Math.floor(index / this.layoutMap.column) * this.layoutMap.tileHeight;
      this.ctx.drawImage(this.layoutMap.layoutImage, sourceX, sourceY, this.layoutMap.tileWidth, this.layoutMap.tileHeight, destinationX, destinationY, this.layoutMap.tileWidth, this.layoutMap.tileHeight);
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
    let mapPosition = this.toGameMapIndex(x, y);
    return this.layoutMap.map[mapPosition];
  }
}
