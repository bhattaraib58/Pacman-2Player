class Blinky extends Ghosts {
  constructor(ctx, gameMap, initialPosition, ghostScatterHomePosition) {
    super(ctx, gameMap, initialPosition, ghostScatterHomePosition);

    this.spriteSheet.framePosition = 2;

    this.movingDirection = MOVING_DIRECTION.LEFT;
    /* To change the animation to pacman moving up, with animation change in 5 sec. */
    this.spriteAnimation.change(this.spriteSheet.frameSets[0], 5);
  }
}
