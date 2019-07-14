class Clyde extends Ghosts {

  constructor(ctx, gameObject, gameMap, audioLoader, ghostPosition, ghostSpritePositionObject) {
    super(ctx, gameObject, gameMap, audioLoader, ghostPosition, ghostSpritePositionObject);

    this.spriteAnimation.spriteXPosition = 3;
    this.setMovingUpActorData();
    this.lookAhead = 8;
  }


  // Clyde targets position of pacman but as soon as it is 8 tiles near pacman it targets its home positions
  getPacmanTargetPosition() {
    let currentPacmanLocation = this.pacman.tileFrom.slice(0);
    let clydeLocation = this.tileFrom.slice(0);

    if (Math.abs(currentPacmanLocation[0] - clydeLocation[0]) < 8 &&
      Math.abs(currentPacmanLocation[1] - clydeLocation[1]) < 8) {
      return this.ghostPosition.SCATTER_HOME_POSITION;
    }

    return currentPacmanLocation;
  }

  drawInitialSprite() {
    this.ctx.drawImage(
      this.spriteAnimation.image,
      6 * this.dimensions[0],
      5 * this.dimensions[1],
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
