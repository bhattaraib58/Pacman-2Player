class Pinky extends Ghosts {
  constructor(ctx, gameObject, gameMap, initialPosition, ghostScatterHomePosition, ghostSpritePositionObject) {
    super(ctx, gameObject, gameMap, initialPosition, ghostScatterHomePosition, ghostSpritePositionObject);

    this.spriteAnimation.spriteXPosition = 3;
    this.setMovingUpActorData();
  }

  getPacmanTargetPosition() {
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


  drawInitialSprite() {
    // draw initail image of pinky
    this.ctx.drawImage(
      this.spriteSheet.image,
      2 * this.dimensions[0],
      3 * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
  }
}
