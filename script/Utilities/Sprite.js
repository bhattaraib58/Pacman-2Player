/**
 * Sprite Class Helps to Deal with sprite animation and buffering for next frame image
 *
 * @class Sprite
 */
class Sprite {

  /**
   *Creates an instance of Sprite.
   * @param {*} frameSet
   * @param {*} delay
   * @memberof Sprite
   */
  constructor(frameSet, delay) {

    /* The Sprite class manages frames within an animation frame set. The frame
    set is an array of values that correspond to the location of sprite images in
    the sprite sheet. For example, a frame value of 0 would correspond to the first
    sprite image / tile in the sprite sheet. By arranging these values in a frame set
    array, you can create a sequence of frames that make an animation when played in
    quick succession. */

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frameIndex = 0;// The frame's index in the current animation frame set.
    this.frameSet = frameSet;// The current animation frame set [array of frames] that holds sprite tile values.
  }


  /**
   * Change frame set, new set of frames
   * This changes the current animation frame set. For example, if the current
   * set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
   * sets the delay.
   *
   * @param {*} frameSet
   * @param {number} [delay=15] //default 15 ms
   * @memberof Sprite
   */
  change(frameSet, delay = 15) {
    if (this.frameSet != frameSet)// If the frame set is different:
    {
      this.count = 0;// Reset the count.
      this.delay = delay;// Set the delay.
      this.frameIndex = 0;// Start at the first frame in the new frame set.
      this.frameSet = frameSet;// Set the new frame set.
      this.frame = this.frameSet[this.frameIndex];// Set the new frame value.
    }
  }


  /**
   * Updates Sprite to new sprite
   * (Set the sprite to new frame image)
   *
   * @memberof Sprite
   */
  update() {
    this.count++;// Keep track of how many cycles have passed since the last frame change.
    if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

      this.count = 0;// Reset the count.

      /* If the frame index is on the last value in the frame set, reset to 0.
      If the frame index is not on the last value, just add 1 to it. */
      this.frameIndex = (this.frameIndex == this.frameSet.length - 1) ? 0 : this.frameIndex + 1;
      this.frame = this.frameSet[this.frameIndex];// Change the current frame value.
    }
  }
}
