class Blinky extends Ghosts {
  constructor(canvas, ctx, gameMap, initialPosition, ghostHomePosition) {
    super(canvas, ctx, gameMap, initialPosition, ghostHomePosition);

    this.spriteSheet.framePosition = 2;

    this.movingDirection = MOVING_DIRECTION.LEFT;
    /* To change the animation to pacman moving up, with animation change in 5 sec. */
    this.spriteAnimation.change(this.spriteSheet.frameSets[0], 5);
  }
}
