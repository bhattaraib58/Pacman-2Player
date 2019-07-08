class Ghosts extends GameActors {
  constructor(canvas, ctx, gameMap, initialPosition) {
    super(canvas, ctx, gameMap, initialPosition);

    //currently following pacman
    this.pacman = null;
    this.previousMovingDirection = MOVING_DIRECTION.STOP;

    this.eatable = null;
    this.eaten = null;
    this.due = null;

    this.chase = true;
    this.frightened = false;
    this.scatter = false;
    this.spriteSheet.frameSets = [[6, 7], [2, 3], [4, 5], [0, 1]];
  }


  setCurrenltyFollowingPacman(pacman) {
    this.pacman = pacman;
  }

  getPointToFollow() {
    //set pacman moving path
    return this.pacman.tileFrom;
  }

  moveGhosts() {
    // get current time in milliseconds
    let currentFrameTime = Date.now();

    // if we are currently moving dont set value
    if (!super.processMovement(currentFrameTime)) {

      //chase pacman 
      this.chasePacman();

      //move pacman based on direction set or continuing moving on direction set
      super.moveActor();

      // after setting the values for key press event we set the 
      // time moved (timeMoved= time we started moving the pacman) to current time 
      if (this.tileFrom[0] != this.tileTo[0] ||
        this.tileFrom[1] != this.tileTo[1]) {
        this.timeMoved = currentFrameTime;
      }
    }
    // update animation to next frame
    this.spriteAnimation.update();
    // draw new frame pacman
    this.ctx.drawImage(this.spriteSheet.image, this.spriteAnimation.frame * this.dimensions[0], this.spriteSheet.framePosition * this.dimensions[1], this.dimensions[0], this.dimensions[1], this.position[0], this.position[1], this.dimensions[0], this.dimensions[1]);

  }

  checkJunction() {
    let junctionValue = 0;
    if (super.isBlockUpperThanActorEmpty()) {
      junctionValue++;
    }
    if (super.isBlockLowerThanActorEmpty()) {
      junctionValue++;
    }
    if (super.isBlockLeftThanActorEmpty()) {
      junctionValue++;
    }
    if (super.isBlockRightThanActorEmpty()) {
      junctionValue++;
    }
    return junctionValue;
  }

  chasePacman() {
    //previous moving direction of ghost
    this.previousMovingDirection = this.movingDirection;

    //get which point to follow
    let getPointToFollow = this.getPointToFollow();
    let differenceInXAxis = this.tileFrom[0] - getPointToFollow[0];
    let differenceInYAxis = this.tileFrom[1] - getPointToFollow[1];

    //if there are 2 or more than 2 direction to move then only move ghost otherwise keep ghost going in same direction
    if (this.checkJunction() >= 2) {

      // if difference between y-axis is lower than x-axis favour, y-axis  
      if (differenceInYAxis < differenceInXAxis) {

        // if y-axis is lower move up otherwise if collision detected or other move other side
        if (differenceInYAxis > 0) {
          if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }
        }

        // if y-axis is higher move down otherwise if collision detected or other move other side
        else if (differenceInYAxis < 0) {
          if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }
        }

        // this is case when y=0 (mostly), in this situation favour left or right direction
        else {
          if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }
        }
      }

      // if difference between x-axis is lower than y-axis favour, x-axis  
      else if (differenceInXAxis < differenceInYAxis) {

        // if x-axis is lower move left otherwise if collision detected or other move other side
        if (differenceInXAxis > 0) {
          if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
        }

        // if x-axis is higher move right otherwise if collision detected or other move other side
        else if (differenceInXAxis < 0) {
          if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }
        }

        // this is case when x=0 (mostly), in this situation favour up or direction direction
        else {
          if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
        }
      }

      else {

        if (differenceInXAxis == 0 && differenceInYAxis == 0) {
          console.log('pacman dead');
        }
        else {
          if (this.previousMovingDirection != MOVING_DIRECTION.DOWN && super.isBlockUpperThanActorEmpty()) {
            super.setMovingUpActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.UP && super.isBlockLowerThanActorEmpty()) {
            super.setMovingDownActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.RIGHT && super.isBlockLeftThanActorEmpty()) {
            super.setMovingLeftActorData();
          }

          else if (this.previousMovingDirection != MOVING_DIRECTION.LEFT && super.isBlockRightThanActorEmpty()) {
            super.setMovingRightActorData();
          }
        }

      }
    }
  }




















  isVunerable() {
    return this.frightened;
  }

  isDangerous() {
    return this.chase;
  }

  isHidden() {
    return !this.chase && this.frightened;
  }
}
