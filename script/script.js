let canvas = document.getElementById('main-canvas');

let ctx = canvas.getContext("2d");

let canvasWidth = window.innerWidth || document.documentElement.clientWidth || WIDTH;
let canvasHeight = window.innerHeight || document.documentElement.clientHeight || HEIGHT;


canvas.imageSmoothingEnabled = false;// This keeps the image looking sharp.

canvas.clientHeight = canvasHeight;
canvas.clientWidth = canvasWidth;
canvas.height = canvasHeight;
canvas.width = canvasWidth;

const game = new Game(canvas, ctx);

loadImages(GAME_IMAGES, () => { game.init(); });
