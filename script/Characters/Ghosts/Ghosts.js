/**
 * Parent class of all Ghosts in Pacman - Blinky, Pinky, Inky, Clyde
 *
 * @class Ghosts
 * @extends {GameActors}
 */
class Ghosts extends GameActors {

  /**
   *Creates an instance of Ghosts.
   * @param {*} ctx
   * @param {*} gameObject
   * @param {*} gameMap
   * @param {*} initialPosition
   * @param {*} ghostScatterHomePosition
   * @param {*} ghostSpritePositionObject
   * @param {*} currentlyFollowingGhostImagePosition
   * @memberof Ghosts
   */
  constructor(ctx,
    gameObject,
    gameMap,
    initialPosition,
    ghostScatterHomePosition,
    ghostSpritePositionObject) {
    super(ctx, gameObject, gameMap, initialPosition);

    this.initialPosition = initialPosition;
    this.ghostScatterHomePosition = ghostScatterHomePosition;
    this.ghostSpritePositionObject = ghostSpritePositionObject;

    //currently following pacman
    this.pacman = null;

    this.previousMovingDirection = MOVING_DIRECTION.STOP;

    this.delayMove = getCharacterSpeed('GHOST', this.gameObject.gameLevel, 'normal');

    this.chase = true;//true if the ghost is in chase mode false if in scatter mode
    this.frightened = false;//true if the ghost is in frightened mode
    this.flashCount = 0;//in order to make the ghost flash when frightened this is a counter
    this.chaseCount = 0;//counter for the switch between chase and scatter
    this.returnHome = false;//if eaten return home
    this.frightenedModeEndingReminderCounter = 0;

    //after the ghost returns home it can't leave home for a bit
    //blinky can leave imediately but others take time
    this.deadForABit = false;
    this.deadCount = 0;

    //set ghost images    
    super.setSpritePosition(this.ghostSpritePositionObject);
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
    this.spriteAnimation.updateSprite();
    // draw new frame pacman
    this.ctx.drawImage(
      this.spriteAnimation.image,
      this.spriteAnimation.spriteXPosition * this.dimensions[0],
      this.spriteAnimation.spriteYPosition * this.dimensions[1],
      this.dimensions[0],
      this.dimensions[1],
      this.position[0],
      this.position[1] + HEADER_HEIGHT,
      this.dimensions[0],
      this.dimensions[1]);
  }

  /**
   * Set Ghost game Conditions and apply which flags to set to based on game modes
   *
   * @memberof Ghosts
   */
  setFlagBasedOnGameMode() {

    //if dead mode don't move
    if (this.deadForABit) {
      this.deadCount++;
      // if ghost has been dead for more  than 300 time then start moving ghost out of ghost home
      if (this.deadCount > 300) {
        this.deadForABit = false;
        this.deadCount = 0;
      }
    }
    //move pacman
    else {

      //frightened mode
      if (this.frightened) {
        this.flashCount++;

        super.setSpritePosition(GHOST_SPRITE_POSITION.FRIGHTENED_MODE_BLUE);

        if (this.flashCount > 800) {//after 8 seconds the ghosts are no longer frightened
          this.frightened = false;
          this.flashCount = 0;
          this.frightenedModeEndingReminderCounter = 0;

          //set image to normal
          super.setSpritePosition(this.ghostSpritePositionObject);

          //set pacman and ghost to normal speed
          this.delayMove = getCharacterSpeed('GHOST', this.gameObject.gameLevel, 'NORMAL');
          this.pacman.delayMove = getCharacterSpeed('pacman', this.gameObject.gameLevel, 'NORMAL');
        }
        // make it flash white and blue such that it reminds the frightened timer is going to stop
        if (this.flashCount < 800 && this.flashCount > 600) {
          this.frightenedModeEndingReminderCounter++;

          // as blue ghost is already set in up we don't need to set blue ghost
          //display white ghost for 15 frame
          if (this.frightenedModeEndingReminderCounter >= 15 &&
            this.frightenedModeEndingReminderCounter < 30) {//flash white
            super.setSpritePosition(GHOST_SPRITE_POSITION.FRIGHTENED_MODE_WHITE);
          }

          //reset counter
          if (this.frightenedModeEndingReminderCounter >= 30) {
            this.frightenedModeEndingReminderCounter = 0;
          }
        }
      }
      else {
        //if ghost is returing home when eaten by pacman
        if (this.returnHome) {
          super.setSpritePosition(GHOST_SPRITE_POSITION.GHOST_MODE);
        }

        //if not eaten by pacman ghost will change between chase mode and scatter mode
        else {
          //increments counts
          this.chaseCount++;

          // check if on chase mode or on scatter mode
          if (this.chase) {
            // if the chasing time is greater than 2000 timer move to scatter mode
            if (this.chaseCount > 2000) {
              //set chase mode sprites
              super.setSpritePosition(this.ghostSpritePositionObject);

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
    if (!this.deadForABit) {//dont move if dead - move if not dead
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
      } else if (!this.returnHome) {//sometimes when ghost returning home from being eaten can accidently trigger pacman kill
        //kill Pacman 
        this.pacman.kill();
      }
    }

    // if eaten by pacman we have to move to home for respawn
    // check if reached home yet
    if (this.returnHome) {
      //check if home reached
      if (this.initialPosition[0] < this.position[0] + this.dimensions[0] &&
        this.initialPosition[0] + this.dimensions[0] > this.position[0] &&
        this.initialPosition[1] < this.position[1] + this.dimensions[1] &&
        this.initialPosition[1] + this.dimensions[1] > this.position[1]) {

        console.log('Home Reached::' + this.returnHome);

        //set the ghost as dead for a bit
        this.returnHome = false;
        this.deadForABit = true;
        this.deadCount = 0;

        //set real image position of - blinky, clyde, pinky
        super.setSpritePosition(this.ghostSpritePositionObject);

        // set speed to normal
        this.delayMove = getCharacterSpeed('GHOST', this.gameObject.gameLevel, 'NORMAL');
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
   * Used To get in which position to target pacman
   * this function is to be overiden by child classes of ghost to set different 
   * positions to target pacman
   *
   * @returns
   * @memberof Ghosts
   */
  getPacmanTargetPosition() {
    return this.pacman.tileFrom;//target pacman
  }

  /**
   * Based on Game mode (scatter mode, chase mode, dead mode),
   * get target to follow
   *
   * @returns -Gives which path to follow - pacman, home area or others
   * @memberof Ghosts
   */
  getTargetToFollow() {
    if (this.returnHome) {//if returning home then the target is just above the ghost room or inside ghost box
      return this.initialPosition;
    } else {
      // if on chase mode target pacman
      if (this.chase) {
        return this.getPacmanTargetPosition();
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
