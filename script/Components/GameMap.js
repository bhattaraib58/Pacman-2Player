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
    this.layoutMap = layoutMap;
    this.mapImage = new Image();
    this.mapImage.src = this.layoutMap.image;

    this.dotsRemaining = layoutMap.totaldots;
    this.enerzierRemaining = layoutMap.totalEnerzier;

    //for enerzier
    this.spriteAnimation = new Sprite(GAME_SYMBOLS.ENERGIZER.X,
      GAME_SYMBOLS.ENERGIZER.DELAY_SPEED,
      PACMAN_TILES,
      GAME_SYMBOLS.ENERGIZER.Y);

    this.createLayoutMapGraph(this.layoutMap);
  }

  /**
   * Creates Layout map graph to be used, to be called only once in creation of game map object
   * high memory task
   *
   * @param {*} layoutMap
   * @memberof GameMap
   */
  createLayoutMapGraph(layoutMap) {
    this.graph = new Graph();
    let array = this.graph.create1DTo2DArray(layoutMap.map, layoutMap.row, layoutMap.column);
    this.graph.createGraph(array);
  }


  /**
   *
   *
   * @param {*} startNode
   * @param {*} endNode
   * @memberof GameMap
   */
  findMapPath(previousNode, startNode, endNode) {
    // this.createLayoutMapGraph(this.layoutMap);
    // as the nodes may have different place as its graph now so we should compute once again for fail safe
    //as our tile 0 represent x(column) in game 
    // and y represent (column) in map so we have to reverse it

    // as we dont want pacman to goto previous direction we set previous to already visited
    let prev = {
      x: previousNode[1],
      y: previousNode[0],
      closed: true,
      visited: true
    };

    let start = this.graph.nodes[startNode[1]][startNode[0]];
    let end = this.graph.nodes[endNode[1]][endNode[0]];
    let result = Astar.search(this.graph.nodes, prev, start, end);
    return result;
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
    this.spriteAnimation.updateSprite();

    /* Looping through the tile map. */
    for (let index = this.layoutMap.map.length - 1; index > -1; --index) {

      /* We get the value of each tile in the map which corresponds to the tile
      graphic index in the tileSheet.image. */
      let value = this.layoutMap.map[index];
      let pointsValue = this.layoutMap.points[index];

      /* This is the x and y location at which to cut the tile image out of the
      tileSheet.image. */
      let sourceX = (value % this.layoutMap.tileWidth) * this.layoutMap.tileWidth;
      let sourceY = Math.floor(value / this.layoutMap.tileHeight) * this.layoutMap.tileHeight;

      let pointSourceX = (pointsValue % this.layoutMap.tileWidth) * this.layoutMap.tileWidth;
      let pointSourceY = Math.floor(pointsValue / this.layoutMap.tileHeight) * this.layoutMap.tileHeight;

      /* This is the x and y location at which to draw the tile image we are cutting
      from the layoutMap.layoutImage to the ctx canvas. */
      let destinationX = (index % this.layoutMap.column) * this.layoutMap.tileWidth;
      let destinationY = Math.floor(index / this.layoutMap.column) * this.layoutMap.tileHeight;

      /* Draw the tile image to the ctx. The width and height of the tile is taken from the tileSheet object. */
      this.ctx.drawImage(this.mapImage,
        sourceX,
        sourceY,
        this.layoutMap.tileWidth,
        this.layoutMap.tileHeight,
        destinationX,
        destinationY + HEADER_HEIGHT,
        this.layoutMap.tileWidth,
        this.layoutMap.tileHeight);

      // if point is not enerzier we set the value as dot or empty based on value
      if (pointsValue !== ENERZIER_VALUE) {
        this.ctx.drawImage(this.mapImage,
          pointSourceX,
          pointSourceY,
          this.layoutMap.tileWidth,
          this.layoutMap.tileHeight,
          destinationX,
          destinationY + HEADER_HEIGHT,
          this.layoutMap.tileWidth,
          this.layoutMap.tileHeight);
      }
      if (pointsValue === ENERZIER_VALUE) {
        this.ctx.drawImage(this.spriteAnimation.image,
          this.spriteAnimation.spriteXPosition * this.layoutMap.tileWidth,
          this.spriteAnimation.spriteYPosition * this.layoutMap.tileHeight,
          this.layoutMap.tileWidth,
          this.layoutMap.tileHeight,
          destinationX,
          destinationY + HEADER_HEIGHT,
          this.layoutMap.tileWidth,
          this.layoutMap.tileHeight);
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
