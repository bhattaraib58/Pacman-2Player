/**
 * Sprite Class Helps to Deal with sprite animation and buffering for next frame image
 *
 * @class Sprite
 */
class Sprite {

  /**
   *Creates an instance of Sprite.
   * @param {*} spriteXPositionArray
   * @param {*} delay
   * @param {*} imageSource
   * @param {*} spriteYPosition
   * @memberof Sprite
   */
  constructor(spriteXPositionArray, delay, imageSource, spriteYPosition) {
    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.spriteXPosition = 0;// The value in the sprite x position array of the sprite image / tile to display.
    this.spriteArrayCurrentIndex = 0;// The sprite's index in the current sprite X position array.
    this.spriteXPositionArray = spriteXPositionArray;// The current animation frame set [array of frames] that holds sprite tile values.

    this.image = new Image();     //sprite Image
    this.image.src = imageSource;

    this.spriteYPosition = spriteYPosition;  //refers to image y position on image
  }

  setNewImage(imageSource) {
    this.image.src = imageSource;
  }

  setAnimationDelay(delay) {
    this.delay = delay;// Set the delay.
  }

  setSpriteYPosition(spriteYPosition) {
    this.spriteYPosition = spriteYPosition;
  }

  setSpritePosition(spriteXPositionArray, spriteYPosition, delay) {
    this.setSpriteXPosition(spriteXPositionArray);
    this.setSpriteYPosition(spriteYPosition);
    this.setAnimationDelay(delay);
  }

  /**
   * Change sprite x position frames set
   * 
   * This changes the current animation frame set. For example, if the current
   * set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3].
   *
   * @param {*} spriteXPositionArray
   * @memberof Sprite
   */
  setSpriteXPosition(spriteXPositionArray) {
    if (this.spriteXPositionArray != spriteXPositionArray)// If the frame set is different:
    {
      this.count = 0;// Reset the count.
      this.spriteArrayCurrentIndex = 0;// Start at the first frame in the new frame set.
      this.spriteXPositionArray = spriteXPositionArray;// Set the new frame set.
      this.spriteXPosition = this.spriteXPositionArray[this.spriteArrayCurrentIndex];// Set the new frame value.
    }
  }

  /**
   * Updates Sprite to new sprite
   * (Set the sprite to new frame image)
   *
   * @memberof Sprite
   */
  updateSprite() {
    this.count++;// Keep track of how many cycles have passed since the last frame change.
    if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

      this.count = 0;// Reset the count.

      /* If the frame index is on the last value in the frame set, reset to 0.
      If the frame index is not on the last value, just add 1 to it. */
      this.spriteArrayCurrentIndex = (this.spriteArrayCurrentIndex == this.spriteXPositionArray.length - 1) ? 0 : this.spriteArrayCurrentIndex + 1;
      this.spriteXPosition = this.spriteXPositionArray[this.spriteArrayCurrentIndex];// Change the current frame value.
    }
  }
}
