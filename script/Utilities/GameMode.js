let SINGLE_PLAYER_MODE = {
  initialLevel: 1,
  layoutMap: LAYOUT_MAP_ORIGINAL,
  gameState: GAME_STATE.SINGLE_PLAYER,
  player: {
    0: {
      control: PLAYER1_CONTROL_KEY,
      initialPosition: [14, 23],
      targetGhosts: {
        0: {
          ghostName: 'BLINKY',
          ghostPosition: {
            INITIAL_POSITION: [13, 11],
            SCATTER_HOME_POSITION: [26, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 0
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.BLINKY
        },
        1: {
          ghostName: 'PINKY',
          ghostPosition: {
            INITIAL_POSITION: [13, 14],
            SCATTER_HOME_POSITION: [1, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 100
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.PINKY
        },
        2: {
          ghostName: 'INKY',
          ghostPosition: {
            INITIAL_POSITION: [15, 14],
            SCATTER_HOME_POSITION: [26, 29],
            DEAD_MODE_POSITION: [16, 13],
            DEAD_MODE_TIME: 200
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.INKY
        },
        3: {
          ghostName: 'CLYDE',
          ghostPosition: {
            INITIAL_POSITION: [11, 14],
            SCATTER_HOME_POSITION: [1, 29],
            DEAD_MODE_POSITION: [12, 13],
            DEAD_MODE_TIME: 300
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.CLYDE
        },
      }
    }
  }
};


let PLAYER_VS_PLAYER_MODE = {
  initialLevel: 1,
  layoutMap: LAYOUT_MAP_PLAYER_VS_PLAYER,
  gameState: GAME_STATE.PLAYER_VS_PLAYER,
  player: {
    0: {
      control: PLAYER1_CONTROL_KEY,
      initialPosition: [18, 26],
      targetGhosts: {
        0: {
          ghostName: 'BLINKY',
          ghostPosition: {
            INITIAL_POSITION: [9, 11],
            SCATTER_HOME_POSITION: [26, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 0
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.BLINKY
        },
        1: {
          ghostName: 'PINKY',
          ghostPosition: {
            INITIAL_POSITION: [15, 14],
            SCATTER_HOME_POSITION: [1, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 100
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.PINKY
        },
        2:{
          ghostName: 'CLYDE',
          ghostPosition: {
            INITIAL_POSITION: [13, 14],
            SCATTER_HOME_POSITION: [1, 29],
            DEAD_MODE_POSITION: [12, 13],
            DEAD_MODE_TIME: 300
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.CLYDE
        },
      }
    },
    1:{
      control: PLAYER2_CONTROL_KEY,
      initialPosition: [18, 1],
      targetGhosts: {
        0: {
          ghostName: 'BLINKY',
          ghostPosition: {
            INITIAL_POSITION: [18, 11],
            SCATTER_HOME_POSITION: [26, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 0
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.BLINKY
        },
        1: {
          ghostName: 'PINKY',
          ghostPosition: {
            INITIAL_POSITION: [14, 14],
            SCATTER_HOME_POSITION: [1, 1],
            DEAD_MODE_POSITION: [14, 13],
            DEAD_MODE_TIME: 100
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.PINKY
        },
        2:{
          ghostName: 'CLYDE',
          ghostPosition: {
            INITIAL_POSITION: [12, 14],
            SCATTER_HOME_POSITION: [1, 29],
            DEAD_MODE_POSITION: [12, 13],
            DEAD_MODE_TIME: 300
          },
          ghostSpritePosition: GHOST_SPRITE_POSITION.CHASE_MODE.CLYDE
        },
      }
    }
  }
};
