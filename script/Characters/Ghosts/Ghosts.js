/**
 * Parent class of all Ghosts in Pacman - Blinky, Pinky, Inky, Clyde
 *
 * @class Ghosts
 * @extends {GameActors}
 */
class Ghosts extends GameActors {
  constructor(ctx, gameMap, initialPosition, ghostScatterHomePosition) {
    super(ctx, gameMap, initialPosition);

    //currently following pacman
    this.pacman = null;
    this.previousMovingDirection = MOVING_DIRECTION.STOP;

    this.initialPosition = initialPosition;
    this.ghostScatterHomePosition = ghostScatterHomePosition;
    this.ghostRealImagePosition = null;

    this.chase = true;//true if the ghost is in chase mode false if in scatter mode
    this.frightened = false;//true if the ghost is in frightened mode
    this.flashCount = 0;//in order to make the ghost flash when frightened this is a counter
    this.chaseCount = 0;//counter for the switch between chase and scatter
    this.returnHome = false;//if eaten return home

    //after the ghost returns home it can't leave home for a bit
    //blinky can leave imediately but others take time
    this.deadForABit = false;
    this.deadCount = 0;

    this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.CHASE_MODE.BLINKY.FRAME_POSITION;
    this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.CHASE_MODE.FRAME_SETS;
  }

  moveGhosts() {
    // get current time in milliseconds
    let currentFrameTime = Date.now();

    this.setFlagBasedOnGameMode();

    // if we are currently moving dont set value
    if (!super.processMovement(currentFrameTime)) {

      this.moveGhostBasedOnGameMode();

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
    this.ctx.drawImage(this.spriteSheet.image, this.spriteAnimation.frame * this.dimensions[0], this.spriteSheet.framePosition * this.dimensions[1], this.dimensions[0], this.dimensions[1], this.position[0], this.position[1]+HEADER_HEIGHT, this.dimensions[0], this.dimensions[1]);

  }

  /**
   * Set Ghost game Conditions and apply which flags to set to based on game modes
   *
   * @memberof Ghosts
   */
  setFlagBasedOnGameMode() {
    //increments counts
    this.chaseCount++;

    // check if on chase mode or on scatter mode
    if (this.chase) {
      // if the chasing time is greater than 2000 timer move to scatter mode
      if (this.chaseCount > 200) {
        //set chase mode sprites
        this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.CHASE_MODE.BLINKY.FRAME_POSITION;
        this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.CHASE_MODE.FRAME_SETS;
        this.chase = false;
        this.chaseCount = 0;
      }
    } else {
      // if on scatter mode for mode than 700 timer move to chase mode
      if (this.chaseCount > 700) {
        this.chase = true;
        this.chaseCount = 0;
      }
    }

    // if ghost has returned home check if ghost is dead and if the time ghost 
    // has been in dead mode more than 300 timer
    if (this.deadForABit) {
      this.deadCount++;
      // if ghost has been dead for more  than 300 time then start moving ghost out of ghost home
      if (this.deadCount > 300) {
        this.deadForABit = false;
      }
    } else {//if not deadforabit then show the ghost
      if (!this.frightened) {
        if (this.returnHome) {//have the ghost be transparent if on its way home
          //set ghost with eye only sprite
          this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.GHOST_MODE.FRAME_POSITION;
          // set eye only sprite with top, down, left, right positions
          this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.GHOST_MODE.FRAME_SETS;

        } else {
          //set real image position of - blinky, clyde, pinky
          // this.spriteSheet.framePosition = this.ghostRealImagePosition;
          this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.CHASE_MODE.BLINKY.FRAME_POSITION;
          this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.CHASE_MODE.FRAME_SETS;
        }
      } else {//if frightened
        this.flashCount++;

        //set frightened sprite and set image position
        this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_BLUE.FRAME_POSITION;
        this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_BLUE.FRAME_SETS;

        if (this.flashCount > 800) {//after 8 seconds the ghosts are no longer frightened
          this.frightened = false;
          this.flashCount = 0;
        }
        //make it flash white and blue such that it reminds the frightened timer is going to stop
        if (this.flashCount < 800 && this.flashCount > 600) {
          if (Math.floor(this.flashCount / 30) % 2 == 0) {//make it flash white and blue every 30 frames
            // flash blue
            this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_BLUE.FRAME_POSITION;
            this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_BLUE.FRAME_SETS;

          } else {//flash white
            this.spriteSheet.framePosition = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_WHITE.FRAME_POSITION;
            this.spriteSheet.frameSets = GHOST_IMAGE_POSITIONS.FRIGHTENED_MODE_WHITE.FRAME_SETS;
          }
        }
      }
    }
  }


  /**
   * Moves the ghost along the path based on game mode
   *
   * @memberof Ghosts
   */
  moveGhostBasedOnGameMode() {
    if (!this.deadForABit) {//dont move if dead
      // pos.add(vel);
      if (this.frightened) {
        this.frightenedMode();
      }
      else {
        this.moveGhostBasedOnPointToFollow();
      }
      this.checkGhostEatenOrPacmanEaten();//check if need to change direction next move
    }
  }

  /**
   * Check based on game mode (Chase mode or Frightened),
   * which to kill ghost or pacman if they collide
   *
   * @memberof Ghosts
   */
  checkGhostEatenOrPacmanEaten() {
    if (this.pacman.hitPacman(this.position)) {//if hit pacman
      if (this.frightened) {//eaten by pacman
        this.returnHome = true;
        this.frightened = false;
      } else if (!this.returnHome) {
        //killPacman and sometimes when ghost returning home from being eaten can accidently trigger pacman kill
        this.pacman.kill();
      }
    }

    // if eaten by pacman we have to move to home for respawn
    // check if reached home yet
    if (this.returnHome) {
      let xPositionDifference = Math.abs(this.position[0] - this.initialPosition[0]);
      let yPositionDifference = Math.abs(this.position[1] - this.initialPosition[1]);

      if (xPositionDifference < 10 && yPositionDifference < 10) {
        //set the ghost as dead for a bit
        this.returnHome = false;
        this.deadForABit = true;
        this.deadCount = 0;
      }
    }
  }

  /**
   * Checks if junction (road with 2+ way to go) 
   *
   * @returns no of Direction Ghost can move into
   * @memberof Ghosts
   */
  checkJunction() {
    //if previous direction is null set to new direction
    this.previousMovingDirection = this.previousMovingDirection || this.movingDirection;

    let junctionValue = 0;
    if ((this.previousMovingDirection != MOVING_DIRECTION.UP) && super.isBlockUpperThanActorEmpty()) {
      junctionValue++;
    }
    if ((this.previousMovingDirection != MOVING_DIRECTION.DOWN) && super.isBlockLowerThanActorEmpty()) {
      junctionValue++;
    }
    if ((this.previousMovingDirection != MOVING_DIRECTION.LEFT) && super.isBlockLeftThanActorEmpty()) {
      junctionValue++;
    }
    if ((this.previousMovingDirection != MOVING_DIRECTION.RIGHT) && super.isBlockRightThanActorEmpty()) {
      junctionValue++;
    }
    return junctionValue;
  }

  /**
   * Set Pacman which to follow, later if more than 2 pacman we can prioritize and set
   *
   * @param {*} pacman
   * @memberof Ghosts
   */
  setCurrenltyFollowingPacman(pacman) {
    this.pacman = pacman;
  }

  /**
   * Based on Game mode (scatter mode, chase mode, dead mode),
   * get target to follow
   *
   * @returns -Gives which path to follow - pacman, home area or others
   * @memberof Ghosts
   */
  getTargetToFollow() {
    if (this.returnHome) {//if returning home then the target is just above the ghost room
      return this.initialPosition;
    } else {
      // if on chase mode target pacman
      if (this.chase) {
        return this.pacman.tileFrom;//target pacman
      } else {//if on scatter mode target respective corner
        return this.ghostScatterHomePosition; //scatter to corner
      }
    }
  }

  /**
   * Ghost Frightened Mode in which ghost move randomly in any direction but not on same direction
   * which it came from
   *
   * @memberof Ghosts
   */
  frightenedMode() {
    //previous moving direction of ghost
    this.previousMovingDirection = this.movingDirection;
    //if there are 2 or more than 2 direction to move then only move ghost otherwise keep ghost going in same direction
    if (this.checkJunction() >= 2) {

      let randomNumber, randomDirection;
      while (true) {
        randomNumber = Math.floor(Math.random() * (Object.keys(MOVING_DIRECTION).length - 1));
        randomDirection = MOVING_DIRECTION[Object.keys(MOVING_DIRECTION)[randomNumber]];

        if ((randomDirection == MOVING_DIRECTION.UP) && (this.previousMovingDirection != MOVING_DIRECTION.DOWN) && super.isBlockUpperThanActorEmpty()) {
          super.setMovingUpActorData();
          break;
        }
        if ((randomDirection == MOVING_DIRECTION.LEFT) && (this.previousMovingDirection != MOVING_DIRECTION.RIGHT) && super.isBlockLeftThanActorEmpty()) {
          super.setMovingLeftActorData();
          break;
        }
        if ((randomDirection == MOVING_DIRECTION.RIGHT) && (this.previousMovingDirection != MOVING_DIRECTION.LEFT) && super.isBlockRightThanActorEmpty()) {
          super.setMovingRightActorData();
          break;
        }
        if ((randomDirection == MOVING_DIRECTION.DOWN) && (this.previousMovingDirection != MOVING_DIRECTION.UP) && super.isBlockLowerThanActorEmpty()) {
          super.setMovingDownActorData();
          break;
        }
      }
    }
  }

  /**
   * Based on Game Mode (scatter mode, chase mode, dead mode- returning ghost prision),
   *   move ghost to desired place
   *
   * @memberof Ghosts
   */
  moveGhostBasedOnPointToFollow() {
    //previous moving direction of ghost
    this.previousMovingDirection = this.movingDirection;

    //get which point to follow
    let getTargetToFollow = this.getTargetToFollow();
    let differenceInXAxis = this.tileFrom[0] - getTargetToFollow[0];
    let differenceInYAxis = this.tileFrom[1] - getTargetToFollow[1];

    //if there are 2 or more than 2 direction to move then only move ghost otherwise keep ghost going in same direction
    if (this.checkJunction() >= 2) {

      // if difference between y-axis is lower than x-axis favour, y-axis  
      if (differenceInYAxis < differenceInXAxis) {
        if (differenceInYAxis > 0) {
          if (this.isBlockUpperThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.DOWN) {
            this.setMovingUpActorData();
          }
          else if (differenceInXAxis >= 0) {
            if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
              this.setMovingLeftActorData();
            }
            else if (this.isBlockRightThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
              this.setMovingRightActorData();
            }
          }
          else if (differenceInXAxis < 0) {
            if (this.setMovingRightActorData() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
              this.setMovingRightActorData();
            }
            else if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
              this.setMovingLeftActorData();
            }
          }
          else {
            this.setMovingDownActorData();
          }
        }
        else if (differenceInYAxis < 0) {
          if (this.isBlockLowerThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.UP) {
            this.setMovingDownActorData();
          }
          else if (differenceInXAxis >= 0) {
            if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
              this.setMovingLeftActorData();
            }
            else if (this.isBlockRightThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
              this.setMovingRightActorData();
            }
          }
          else if (differenceInXAxis < 0) {
            if (this.setMovingRightActorData() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
              this.setMovingRightActorData();
            }
            else if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
              this.setMovingLeftActorData();
            }
          }
          else {
            this.setMovingUpActorData();
          }
        }
        //y==0
        else {
          if (differenceInXAxis > 0 && this.isBlockLeftThanActorEmpty()) {
            this.setMovingLeftActorData();
          }
          else if (differenceInXAxis < 0 && this.isBlockRightThanActorEmpty()) {
            this.setMovingRightActorData();
          }
          else if (this.isBlockLowerThanActorEmpty()) {
            this.setMovingDownActorData();
          }
          else if (this.isBlockUpperThanActorEmpty()) {
            this.setMovingUpActorData();
          }
        }
      }

      else if (differenceInXAxis < differenceInYAxis) {
        if (differenceInXAxis < 0) {
          if (this.isBlockRightThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
            this.setMovingRightActorData();
          }
          else if (differenceInYAxis >= 0) {
            if (this.isBlockUpperThanActorEmpty()) {
              this.setMovingUpActorData();
            }
            else if (this.isBlockLowerThanActorEmpty()) {
              this.setMovingDownActorData();
            }
          }
          else if (differenceInYAxis < 0) {
            if (this.isBlockLowerThanActorEmpty()) {
              this.setMovingDownActorData();
            }
            else if (this.isBlockUpperThanActorEmpty()) {
              this.setMovingUpActorData();
            }
          }
          else {
            this.setMovingLeftActorData();
          }
        }

        else if (differenceInXAxis > 0) {
          if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
            this.setMovingLeftActorData();
          }
          else if (differenceInYAxis >= 0) {
            if (this.isBlockUpperThanActorEmpty()) {
              this.setMovingUpActorData();
            }
            else if (this.isBlockLowerThanActorEmpty()) {
              this.setMovingDownActorData();
            }
          }
          else if (differenceInYAxis < 0) {
            if (this.isBlockLowerThanActorEmpty()) {
              this.setMovingDownActorData();
            }
            else if (this.isBlockUpperThanActorEmpty()) {
              this.setMovingUpActorData();
            }
          }
          else {
            this.setMovingRightActorData();
          }
        }

        else {
          if (differenceInYAxis > 0 && this.isBlockUpperThanActorEmpty()) {
            this.setMovingUpActorData();
          }
          else if (differenceInYAxis < 0 && this.isBlockLowerThanActorEmpty()) {
            this.setMovingDownActorData();
          }
          else if (this.isBlockRightThanActorEmpty()) {
            this.setMovingRightActorData();
          }
          else if (this.isBlockLeftThanActorEmpty()) {
            this.setMovingLeftActorData();
          }
        }
      }

      else {
        if (differenceInXAxis > 0) {
          if (this.isBlockLeftThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.LEFT) {
            this.setMovingLeftActorData();
          }
          else if (this.isBlockRightThanActorEmpty()) {
            this.setMovingRightActorData();
          }
        }
        else if (differenceInXAxis < 0) {
          if (this.setMovingRightActorData() && this.previousMovingDirection != MOVING_DIRECTION.RIGHT) {
            this.setMovingRightActorData();
          }
          else {
            this.setMovingLeftActorData();
          }
        }
        else if (differenceInYAxis >= 0) {
          if (this.isBlockUpperThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.DOWN) {
            this.setMovingUpActorData();
          }
          else {
            this.setMovingDownActorData();
          }
        }
        else if (differenceInYAxis < 0) {
          if (this.isBlockLowerThanActorEmpty() && this.previousMovingDirection != MOVING_DIRECTION.UP) {
            this.setMovingDownActorData();
          }
          else {
            this.setMovingDownActorData();
          }
        }
      }
    }
  }
}
