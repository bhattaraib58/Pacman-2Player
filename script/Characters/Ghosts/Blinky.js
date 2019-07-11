class Blinky extends Ghosts {
  constructor(ctx, gameObject, gameMap, initialPosition, ghostScatterHomePosition, ghostSpritePositionObject) {
    super(ctx, gameObject, gameMap, initialPosition, ghostScatterHomePosition, ghostSpritePositionObject);

    this.spriteAnimation.spriteXPosition = 2;
    this.setMovingLeftActorData();
  }

  drawInitialSprite() {
    // draw initail image of blinky
    this.ctx.drawImage(
      this.spriteAnimation.image,
      4 * this.dimensions[0],
      2 * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]
    );
  }
}
