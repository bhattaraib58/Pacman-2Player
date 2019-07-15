/**
 * Game Governing body where all game modes are executes from
 *
 * @class GameWorld
 */
class GameWorld {
  /**
   *Creates an instance of GameWorld.
   * @param {*} canvasElement
   * @memberof GameWorld
   */
  constructor(canvasElement, fps) {
    this.canvasElement = canvasElement;
    this.canvasElement.width = CANVAS_WIDTH;
    this.canvasElement.height = CANVAS_HEIGHT;

    this.ctx = this.canvasElement.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;// This keeps the image looking sharp.

    // this.gameState = GAME_STATE.MENU;
    this.gameState = GAME_STATE.MENU;
    this.gameMenu = new GameMenu(this.ctx, this);
    this.singlePlayerGame = null;
    this.playerVsPlayerGame = null;
    this.audioLoader = null;


    fps = fps || GAME_ANIMATION_SPEED_FPS;
    this.start = 0;
    this.frameDuration = 1000 / fps;

    this.gameEngine = 0;  //request animation frame value needed for stopping game
  }

  init() {
    this.audioLoader = new AudioLoader();
    let intervalId = setInterval(() => {
      if (this.audioLoader.hasAllAudiosLoaded()) {
        clearInterval(intervalId);
        this.resetGameComponents();
        this.runEngine();
      }
    });
  }

  runEngine(timestamp) {
    // for limiting fps
    if (timestamp >= this.start) {
      switch (this.gameState) {
        case GAME_STATE.MENU:
          this.gameMenu.addMenuControlEvent();
          this.gameMenu.draw();
          break;

        case GAME_STATE.SINGLE_PLAYER:
          this.singlePlayerGame.draw();
          break;

        case GAME_STATE.PLAYER_VS_PLAYER:
          this.playerVsPlayerGame.draw();
          break;
      }
      //for fps limitation
      this.start = timestamp + this.frameDuration;
    }
    this.gameEngine = window.requestAnimationFrame(this.runEngine.bind(this));
  }

  resetGameComponents() {
    this.singlePlayerGame = new Game(this.canvasElement, this.ctx, this, this.audioLoader, SINGLE_PLAYER_MODE);
    this.playerVsPlayerGame = new Game(this.canvasElement, this.ctx, this, this.audioLoader, PLAYER_VS_PLAYER_MODE);
  }
}
