class GameWorld {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.canvasElement.width = CANVAS_WIDTH;
    this.canvasElement.height = CANVAS_HEIGHT;

    this.ctx = this.canvasElement.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;// This keeps the image looking sharp.

    this.gameState = GAME_STATE.MENU;
    this.gameMenu = null;
    this.singlePlayerGame = null;

    this.gameEngine = 0;  //request animation frame value needed for stopping game
  }

  init() {
    this.resetGameComponents();
    this.runEngine();
  }

  runEngine() {
    switch (this.gameState) {
      case GAME_STATE.MENU:
        this.gameMenu.draw();
        break;

      case GAME_STATE.SINGLE_PLAYER:
        this.singlePlayerGame.draw();
        break;

      case GAME_STATE.PLAYER_VS_PLAYER:
        console.log('p2p');
        break;

      case GAME_STATE.TWO_PLAYER_MODE:
        console.log('2p');
        break;

      case GAME_STATE.HIGH_SCORE_DISPLAY:
        console.log('hs');
        break;
    }
    this.gameEngine = window.requestAnimationFrame(this.runEngine.bind(this));
  }

  resetGameComponents() {
    this.gameMenu = new GameMenu(this.ctx, this);
    this.singlePlayerGame = new Game(this.canvasElement, this.ctx);
  }
}
