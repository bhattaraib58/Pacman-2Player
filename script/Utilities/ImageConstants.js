//game images
const PACMAN_TILES = 'image/pacman-tiles.png';
const PACMAN_SPRITES = 'image/sprites32.png';
const PACMAN_LOGO = 'image/pacman-logo.png';

const GAME_IMAGES = [
  PACMAN_TILES,
  PACMAN_SPRITES,
  PACMAN_LOGO
];

const SPRITE_ANIMATION_DELAY = 5;

const PACMAN_SPRITE_IMAGE = new Image();
PACMAN_SPRITE_IMAGE.src = PACMAN_SPRITES;

const PACMAN_LOGO_IMAGE = new Image();
PACMAN_LOGO_IMAGE.src = PACMAN_LOGO;


const GAME_SYMBOLS = {
  ENERGIZER: {
    X: [4, 6],
    Y: 2,
    DELAY_SPEED: 12
  }
};

const PACMAN_SPRITE_POSITION = {
  NORMAL: {
    X: [[5, 6, 2, 6], [7, 8, 2, 8], [4, 3, 2, 3], [0, 1, 2, 1]],
    Y: 0,
    DELAY_SPEED: 5
  }, //moving top, moving bottom, moving left, moving right
  DEAD: {
    X: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
    Y: 1,
    DELAY_SPEED: 8
  },
  INITAL: {
    X: 2,
    Y: 0,
    DELAY_SPEED: 3
  }
};

// GHOST SPRITE POSITIONS
const GHOST_SPRITE_POSITION = {
  CHASE_MODE: {
    BLINKY: {
      X: [[6, 7], [2, 3], [4, 5], [0, 1]],
      Y: 2,
      DELAY_SPEED: 5
    },
    PINKY: {
      X: [[6, 7], [2, 3], [4, 5], [0, 1]],
      Y: 3,
      DELAY_SPEED: 5
    },
    INKY: {
      X: [[6, 7], [2, 3], [4, 5], [0, 1]],
      Y: 4,
      DELAY_SPEED: 5
    },
    CLYDE: {
      X: [[6, 7], [2, 3], [4, 5], [0, 1]],
      Y: 5,
      DELAY_SPEED: 5
    }
  },
  GHOST_MODE: {
    X: [[6], [2], [4], [0]],
    Y: 6,
    DELAY_SPEED: 5
  },
  FRIGHTENED_MODE_BLUE: {
    X: [[0, 1], [0, 1], [0, 1], [0, 1]],
    Y: 7,
    DELAY_SPEED: 5
  },
  FRIGHTENED_MODE_WHITE: {
    X: [[2, 3], [2, 3], [2, 3], [2, 3]],
    Y: 7,
    DELAY_SPEED: 5
  },
};
