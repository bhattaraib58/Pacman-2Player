let Astar = {
  /**
   * Initialize the grid 
   *
   * @param {*} grid
   * @memberof Astar
   */
  initializeGrid(grid) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        grid[x][y].f = 0;
        grid[x][y].g = 0;
        grid[x][y].h = 0;
        grid[x][y].visited = false;
        grid[x][y].closed = false;
        grid[x][y].debug = "";
        grid[x][y].parent = null;
      }
    }
  },

  findManhattanDistance(pos0, pos1) {
    let d1 = Math.abs(pos1.x - pos0.x);
    let d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },

  findNodeNeighbors(grid, node) {
    let ret = [];
    let x = node.x;
    let y = node.y;

    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }
    if (grid[x][y - 1] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }
    if (grid[x][y + 1] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }
    return ret;
  },


  /**
   * Searches and give closest distance path in grid
   *
   * @param {*} grid -from which we need to find path from
   * @param {*} previous -- previous node of ghost
   * @param {*} start --starting node
   * @param {*} end --ending node
   * @param {*} heuristic --if need to find A* from new heuristic function //optional
   * @returns
   * @memberof Astar
   */
  search(grid, previous, start, end, heuristic) {
    Astar.initializeGrid(grid);
    heuristic = heuristic || Astar.findManhattanDistance;
    grid[previous.x][previous.y].closed = previous.closed;
    grid[previous.x][previous.y].visited = previous.visited;

    let openList = [];
    openList.push(start);

    while (openList.length > 0) {

      // Grab the lowest f(x) to process next
      let lowInd = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[lowInd].f) { lowInd = i; }
      }
      let currentNode = openList[lowInd];

      // End case -- result has been found, return the traced path
      if (currentNode == end) {
        let curr = currentNode;
        let ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors
      openList.remove(lowInd);
      currentNode.closed = true;

      let neighbors = Astar.findNodeNeighbors(grid, currentNode);
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        let gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
        let gScoreIsBest = false;

        if (!neighbor.visited) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.h = heuristic(neighbor.pos, end.pos);
          neighbor.visited = true;
          openList.push(neighbor);
        }
        else if (gScore < neighbor.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.  Store info on how we got here and
          //  just how good it really is...
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
        }
      }
    }

    // No result was found -- empty array signifies failure to find path
    return [];
  }
};
