class Pinky extends Ghosts {
  constructor(canvas, ctx, gameMap, initialPosition) {
    super(canvas, ctx, gameMap, initialPosition);

    this.spriteSheet.framePosition = 3;

    this.movingDirection = MOVING_DIRECTION.UP;
    /* To change the animation to pacman moving up, with animation change in 5 sec. */
    this.spriteAnimation.change(this.spriteSheet.frameSets[0], 5);
  }

  getPointToFollow() {
    let currentPacmanLocation = this.pacman.tileFrom;

    if (currentPacmanLocation[0] < 0) {
      // choose left
      currentPacmanLocation = [0, 0];
    }

    if (currentPacmanLocation[0] > this.gameMap.layoutMap.column) {
      //choose left
      currentPacmanLocation = [this.gameMap.layoutMap.column - 2, this.gameMap.layoutMap.row - 2];
    }

    if (currentPacmanLocation[1] < 0) {
      // choose down
      currentPacmanLocation = [0, 0];
    }

    if (currentPacmanLocation[1] > this.gameMap.layoutMap.row) {
      //choose up
      currentPacmanLocation = [this.gameMap.layoutMap.column - 2, this.gameMap.layoutMap.row - 2];
    }

    // location to tap on
    let newXAxisLocation = currentPacmanLocation[0] + 1;
    let newYAxisLocation = currentPacmanLocation[1] + 1;

    while (!this.isLocationEmpty(newXAxisLocation, newYAxisLocation)) {
      newXAxisLocation += 1;
      newYAxisLocation -= 1;
    }
    //set pacman moving path
    return [newXAxisLocation, newYAxisLocation];
  }
}
