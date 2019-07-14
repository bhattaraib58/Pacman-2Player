// when all scripts and window loded start laoding game assets and start game on completion
window.addEventListener("load", function () {
  // get canvas element
  let canvas = document.getElementById('main-canvas');
  //create game world
  const gameWorld = new GameWorld(canvas, 120);
  //load game assets and start game
  loadImages(GAME_IMAGES, gameWorld.init.bind(gameWorld));
});

