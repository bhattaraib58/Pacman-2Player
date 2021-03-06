class Inky extends Ghosts {

  constructor(ctx, gameObject, gameMap, audioLoader, ghostPosition, ghostSpritePositionObject) {
    super(ctx, gameObject, gameMap, audioLoader, ghostPosition, ghostSpritePositionObject);

    this.spriteAnimation.spriteXPosition = 3;
    this.setMovingUpActorData();
    this.lookAhead = 6;

    this.blinky = null;
  }

  setBlinky(blinky) {
    this.blinky = blinky;
  }

  //inky target 2 tiles ahead of pacman
  getPacmanTargetPosition() {
    let currentPacmanLocation = this.pacman.tileFrom.slice(0);
    let pacmanMovingDirection = this.pacman.movingDirection;

    if (pacmanMovingDirection === MOVING_DIRECTION.DOWN && currentPacmanLocation[1] > 0 + this.lookAhead) {
      currentPacmanLocation[1] = currentPacmanLocation[1] - this.lookAhead;
    }

    else if (pacmanMovingDirection === MOVING_DIRECTION.UP && currentPacmanLocation[1] < 31 - this.lookAhead) {
      currentPacmanLocation[1] = currentPacmanLocation[1] + this.lookAhead;
    }

    else if (pacmanMovingDirection === MOVING_DIRECTION.RIGHT && currentPacmanLocation[0] > 0 + this.lookAhead) {
      currentPacmanLocation[0] = currentPacmanLocation[0] - this.lookAhead;
    }

    else if (pacmanMovingDirection === MOVING_DIRECTION.LEFT && currentPacmanLocation[0] < 28 - this.lookAhead) {
      currentPacmanLocation[0] = currentPacmanLocation[0] + this.lookAhead;
    }

    //set pacman moving path
    return currentPacmanLocation;

  }

  drawInitialSprite() {
    // draw initail image of blinky
    this.ctx.drawImage(
      this.spriteAnimation.image,
      6 * this.dimensions[0],
      4 * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
    this.setInitialPosition(this.initialPosition);
  }
}
