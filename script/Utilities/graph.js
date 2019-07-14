/**
 * Creates a Graph class used in the astar search algorithm.
 *  Graph is just for representation of 1D array to 2D array with neighbours value and info
 * 
 * @class Graph
 */
class Graph {
  constructor() {
    this.elements = null;
    this.nodes = null;
  }

  /**
   * Takes 2d array and convert to 2D graph array
   *
   * @param {*} grid
   * @memberof Graph
   */
  createGraph(grid) {
    this.elements = grid;
    this.nodes = [];

    let row, rowLength;
    for (let x = 0; x < grid.length; ++x) {
      row = grid[x];
      rowLength = row.length;
      this.nodes[x] = new Array(rowLength); // optimum array with size
      for (let y = 0; y < rowLength; ++y) {
        this.nodes[x][y] = new GraphNode(x, y, row[y]);
      }
    }
  }

  /**
   * Takes 1D array and convert to 2d array
   *
   * @param {*} oneDArray
   * @param {*} row
   * @param {*} column
   * @returns
   * @memberof Graph
   */
  create1DTo2DArray(oneDArray, row, column) {
    let twoDArray = new Array(row);
    for (let i = 0; i < twoDArray.length; i++) {
      twoDArray[i] = new Array(column);
    }

    let val;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        val = oneDArray[j % column + i * column];
        if (val === MAZE_EMPTY_SPACE_VALUE) {
          twoDArray[i][j] = GRAPH_NODE_TYPE.OPEN;
        }
        else if (val === MAZE_GHOST_ENTRANCE_VALUE) {
          twoDArray[i][j] = GRAPH_NODE_TYPE.OPEN;
        }
        else {
          twoDArray[i][j] = GRAPH_NODE_TYPE.WALL;
        }
      }
    }
    return twoDArray;
  }
}


/**
 * Create a node of graph with x,y value and type of node
 *
 * @class GraphNode
 */
class GraphNode {
  constructor(x, y, type) {
    this.data = {};
    this.x = x;
    this.y = y;
    this.pos = { x: x, y: y };
    this.type = type;
  }
  isWall() {
    return this.type == GRAPH_NODE_TYPE.WALL;
  }
}
