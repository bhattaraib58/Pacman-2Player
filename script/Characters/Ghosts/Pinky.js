class Pinky extends Ghosts {
  constructor(ctx, gameMap, initialPosition, ghostScatterHomePosition) {
    super(ctx, gameMap, initialPosition, ghostScatterHomePosition);

    this.spriteSheet.framePosition = 3;

    this.movingDirection = MOVING_DIRECTION.RIGHT;
    /* To change the animation to pacman moving up, with animation change in 5 sec. */
    this.spriteAnimation.change(this.spriteSheet.frameSets[0], 5);
  }

  getTargetToFollow() {
    //get new non-mutated array such that original don't change
    let currentPacmanLocation = this.pacman.tileFrom.slice(0);
    let pacmanMovingDirection = this.pacman.movingDirection;

    // location to tap on
    let newXAxisLocation = currentPacmanLocation[0];
    let newYAxisLocation = currentPacmanLocation[1];

    let pinkyDistnceFromPacmanInXAxis = this.tileTo[0] - newXAxisLocation;
    let pinkyDistnceFromPacmanInYAxis = this.tileTo[1] - newYAxisLocation;

    if (!(Math.abs(pinkyDistnceFromPacmanInYAxis) < 4)) {
      if (pacmanMovingDirection === MOVING_DIRECTION.UP) {
        newYAxisLocation = currentPacmanLocation[1] - 4;
      }
      else if (pacmanMovingDirection === MOVING_DIRECTION.DOWN) {
        newYAxisLocation = currentPacmanLocation[1] + 4;
      }
    }

    else if (!(Math.abs(pinkyDistnceFromPacmanInXAxis) < 4)) {
      if (pacmanMovingDirection === MOVING_DIRECTION.LEFT) {
        newXAxisLocation = currentPacmanLocation[0] - 4;
      }
      else if (pacmanMovingDirection === MOVING_DIRECTION.RIGHT) {
        newXAxisLocation = currentPacmanLocation[0] + 4;
      }
    }
    //set pacman moving path
    return [newXAxisLocation, newYAxisLocation];
  }
}
