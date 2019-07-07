const PLAYER1_CONTROL_KEY={
  //ARROW KEYS
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

const PLAYER2_CONTROL_KEY={
  //WSAD KEYS
  UP: 87,
  DOWN: 83,
  LEFT: 65,
  RIGHT: 68
};


const PACMAN_TILES = 'image/pacman-tiles.png';
const PACMAN_SPRITES = 'image/sprites32.png';

const GAME_IMAGES = [
  PACMAN_TILES,
  PACMAN_SPRITES
];

const LAYOUT_MAP_ORIGINAL = {
  map:
    [
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
      5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9,
      5, 13, 10, 11, 11, 12, 13, 10, 11, 11, 11, 12, 13, 7, 8, 13, 10, 11, 11, 11, 12, 13, 10, 11, 11, 12, 13, 9,
      5, 13, 7, 13, 13, 8, 13, 7, 13, 13, 13, 8, 13, 7, 8, 13, 7, 13, 13, 13, 8, 13, 7, 13, 13, 8, 13, 9,
      5, 13, 14, 15, 15, 16, 13, 14, 15, 15, 15, 16, 13, 14, 16, 13, 14, 15, 15, 15, 16, 13, 14, 15, 15, 16, 13, 9,
      5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9,
      5, 13, 10, 11, 11, 12, 13, 10, 12, 13, 10, 11, 11, 11, 11, 11, 11, 12, 13, 10, 12, 13, 10, 11, 11, 12, 13, 9,
      5, 13, 14, 15, 15, 16, 13, 7, 8, 13, 14, 15, 15, 17, 18, 15, 15, 16, 13, 7, 8, 13, 14, 15, 15, 16, 13, 9,
      5, 13, 13, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 13, 13, 9,
      19, 20, 20, 20, 20, 12, 13, 7, 21, 11, 11, 12, 13, 7, 8, 13, 10, 11, 11, 22, 8, 13, 10, 20, 20, 20, 20, 23,
      13, 13, 13, 13, 13, 5, 13, 7, 18, 15, 15, 16, 13, 14, 16, 13, 14, 15, 15, 17, 8, 13, 9, 13, 13, 13, 13, 13,
      13, 13, 13, 13, 13, 5, 13, 7, 8, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 8, 13, 9, 13, 13, 13, 13, 13,
      13, 13, 13, 13, 13, 5, 13, 7, 8, 13, 24, 20, 25, 34, 35, 26, 20, 27, 13, 7, 8, 13, 9, 13, 13, 13, 13, 13,
      1, 1, 1, 1, 1, 16, 13, 14, 16, 13, 9, 13, 13, 13, 13, 13, 13, 5, 13, 14, 16, 13, 14, 1, 1, 1, 1, 1,
      13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9, 13, 13, 13, 13, 13, 13, 5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
      20, 20, 20, 20, 20, 12, 13, 10, 12, 13, 9, 13, 13, 13, 13, 13, 13, 5, 13, 10, 12, 13, 10, 20, 20, 20, 20, 20,
      13, 13, 13, 13, 13, 5, 13, 7, 8, 13, 28, 1, 1, 1, 1, 1, 1, 29, 13, 7, 8, 13, 9, 13, 13, 13, 13, 13,
      13, 13, 13, 13, 13, 5, 13, 7, 8, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 8, 13, 9, 13, 13, 13, 13, 13,
      13, 13, 13, 13, 13, 5, 13, 7, 8, 13, 10, 11, 11, 11, 11, 11, 11, 12, 13, 7, 8, 13, 9, 13, 13, 13, 13, 13,
      0, 1, 1, 1, 1, 16, 13, 14, 16, 13, 14, 15, 15, 17, 18, 15, 15, 16, 13, 14, 16, 13, 14, 1, 1, 1, 1, 4,
      5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9,
      5, 13, 10, 11, 11, 12, 13, 10, 11, 11, 11, 12, 13, 7, 8, 13, 10, 11, 11, 11, 12, 13, 10, 11, 11, 12, 13, 9,
      5, 13, 14, 15, 17, 8, 13, 14, 15, 15, 15, 16, 13, 14, 16, 13, 14, 15, 15, 15, 16, 13, 7, 18, 15, 16, 13, 9,
      5, 13, 13, 13, 7, 8, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 7, 8, 13, 13, 13, 9,
      30, 11, 12, 13, 7, 8, 13, 10, 12, 13, 10, 11, 11, 11, 11, 11, 11, 12, 13, 10, 12, 13, 7, 8, 13, 10, 11, 31,
      32, 15, 16, 13, 14, 16, 13, 7, 8, 13, 14, 15, 15, 17, 18, 15, 15, 16, 13, 7, 8, 13, 14, 16, 13, 14, 15, 33,
      5, 13, 13, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 7, 8, 13, 13, 13, 13, 13, 13, 9,
      5, 13, 10, 11, 11, 11, 11, 22, 21, 11, 11, 12, 13, 7, 8, 13, 10, 11, 11, 22, 21, 11, 11, 11, 11, 12, 13, 9,
      5, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 16, 13, 14, 16, 13, 14, 15, 15, 15, 15, 15, 15, 15, 15, 16, 13, 9,
      5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9,
      19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23
    ],
  points:
    [
      36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36,
      36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 38, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 38, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 37, 37, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 37, 37, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 36,
      36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 37, 36, 36, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 37, 36, 36, 36, 36, 37, 36,
      36, 38, 37, 37, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36, 36, 37, 37, 38, 36,
      36, 36, 36, 37, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 37, 36, 36, 36,
      36, 36, 36, 37, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 37, 36, 36, 36,
      36, 37, 37, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 36, 36, 37, 37, 37, 37, 37, 37, 36,
      36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36,
      36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36, 36, 37, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 37, 36,
      36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 36,
      36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36
    ],
  row: 31,
  column: 28,
  layoutImage: new Image(),// the tiles image/The actual graphic will be loaded into this.
  tileWidth: 16,
  tileHeight: 16
};
LAYOUT_MAP_ORIGINAL.layoutImage.src = PACMAN_TILES; //set the tile image
