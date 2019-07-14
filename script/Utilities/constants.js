const PLAYER1_CONTROL_KEY = {
  //ARROW KEYS
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

const PLAYER2_CONTROL_KEY = {
  //WSAD KEYS
  UP: 87,
  DOWN: 83,
  LEFT: 65,
  RIGHT: 68
};

//moving direction for game objects
const MOVING_DIRECTION = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  STOP: "STOP"
};

const GAME_ANIMATION_SPEED_FPS = 120;

//Game States
const GAME_STATE = {
  MENU: 100,
  SINGLE_PLAYER: 200,
  PLAYER_VS_PLAYER: 300,
  TWO_PLAYER_MODE: 400,
  HIGH_SCORE_DISPLAY: 500
};

const GAME_MODE = {
  GAME_START: 0,
  GAME_BEGIN: 1,
  GAME_PLAYING: 2,
  PACMAN_DEAD: 3,
  GAME_LEVEL_COMPLETED: 4,
  GAME_OVER: 5,
};

const GHOST_POSITION = {
  BLINKY: {
    INITIAL_POSITION: [13, 11],
    SCATTER_HOME_POSITION: [26, 1],
    DEAD_MODE_POSITION: [14, 13],
    DEAD_MODE_TIME: 0
  },
  PINKY: {
    INITIAL_POSITION: [13, 14],
    SCATTER_HOME_POSITION: [1, 1],
    DEAD_MODE_POSITION: [14, 13],
    DEAD_MODE_TIME: 100
  },
  INKY: {
    INITIAL_POSITION: [15, 14],
    SCATTER_HOME_POSITION: [26, 29],
    DEAD_MODE_POSITION: [16, 13],
    DEAD_MODE_TIME: 200
  },
  CLYDE: {
    INITIAL_POSITION: [11, 14],
    SCATTER_HOME_POSITION: [1, 29],
    DEAD_MODE_POSITION: [12, 13],
    DEAD_MODE_TIME: 300
  },
};


//game scores and values
const DOT_EATERN_SCORE = 10;
const ENERGIZER_EATEN_SCORE = 100;
const GHOST_EATEN_SCORE = 200; //per ghost, if eaten on sucession score =*2

const MAZE_EMPTY_SPACE_VALUE = 13;
const MAZE_GHOST_ENTRANCE_VALUE = 34;
const EMPTY_DOT_EATEN_VALUE = 36;

// as our original map has different value for wall and open space, we give new ones here for graph
const GRAPH_NODE_TYPE = { OPEN: 0, WALL: 1 };

const DOT_VALUE = 37;
const ENERZIER_VALUE = 38;
const MAX_DOT_IN_GAME = 242;
const MAX_ENERZIER_IN_GAME = 4;

//game values
const PACMAN_MAX_LIVES = 5;
const PACMAN_INITIAL_LIVES = 2;
const INITIAL_LEVEL = 1;

//ghost modes
const GHOST_EATEN_SCORE_TIME = 20;
const DEAD_MODE_TIME = 100;
const GHOST_MODE_TIME = 400;
const NO_OF_FRAMES_FOR_FLASHING = 15;
const CHASE_MODE_TIME = 2000;
const SCATTER_MODE_TIME = 400;

//maximum full speed of pacman, 
//ghost and pacman use this value to set their speed based on game level and game mode
const PACMAN_MAX_SPEED = 40;

const CHARACTERS_SPEED = {
  //character:{game level:{game mode:speed percentage which later will be taken relative to pacman max speed}}
  PACMAN: {
    1: {
      NORMAL: 80, //when scatter/chase mode
      FRIGHT: 60 //when frightened mode
    },
    2: {
      NORMAL: 70, //when scatter/chase mode
      FRIGHT: 65 //when frightened mode
    },
    5: {
      NORMAL: 60, //when scatter/chase mode
      FRIGHT: 60 //when frightened mode
    },
    21: {
      NORMAL: 70, //when scatter/chase mode
      FRIGHT: 60 //when frightened mode
    }
  },
  GHOST: {
    1: {
      NORMAL: 100, //when scatter/chase mode
      FRIGHT: 150 //when frightened mode
    },
    2: {
      NORMAL: 80, //when scatter/chase mode
      FRIGHT: 140 //when frightened mode
    },
    5: {
      NORMAL: 65, //when scatter/chase mode
      FRIGHT: 130 //when frightened mode
    },
    21: {
      NORMAL: 65, //when scatter/chase mode
      FRIGHT: 60 //when frightened mode
    },
    DEAD: 200
  }
};

//game level- game level corresponding image position
const GAME_LEVEL = {
  1: 3, //cherry
  2: 2, //strawberry
  3: 1,  //peach
  4: 1,  //peach
  5: 0, //apple
  6: 0, //apple
  7: 4, //water melon
  8: 4, //water melon
  9: 5, //falcon
  10: 5, //falcon
  11: 6, //bell
  12: 6,//bell
  13: 7,//key
  14: 7,
  15: 7,
  16: 7,
  17: 7,
  18: 7,
  19: 7,
  20: 7
};

const ROW = 31;
const COLUMN = 28;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 40;
const GAME_HEIGHT = TILE_HEIGHT * ROW + HEADER_HEIGHT;

const CANVAS_WIDTH = TILE_WIDTH * COLUMN;
const CANVAS_HEIGHT = GAME_HEIGHT + FOOTER_HEIGHT;
