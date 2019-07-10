class GameMenu {
  constructor(ctx, gameWorldObject) {
    this.ctx = ctx;
    this.gameWorldObject = gameWorldObject;
    this.currentSelectedMenu = GAME_STATE.SINGLE_PLAYER;

    this.addGameMenuControls();
  }

  draw() {
    this.drawGameOptions();
    this.drawSelectionHighlighter();
  }

  drawSelectionHighlighter() {
    let positionX = 0, positionY = 0;

    switch (this.currentSelectedMenu) {
      case GAME_STATE.SINGLE_PLAYER:
        positionX = 10;
        positionY = 220;
        break;

      case GAME_STATE.PLAYER_VS_PLAYER:
        positionX = 10;
        positionY = 285;
        break;

      case GAME_STATE.TWO_PLAYER_MODE:
        positionX = 10;
        positionY = 350;
        break;

      case GAME_STATE.HIGH_SCORE_DISPLAY:
        positionX = 10;
        positionY = 415;
        break;
    }


    this.ctx.strokeStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.rect(
      positionX,
      positionY,
      400,
      50
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }


  drawGameOptions() {
    //clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //draw logo
    this.ctx.drawImage(
      PACMAN_LOGO_IMAGE,
      0,
      0,
      500,
      227,
      0,
      0,
      CANVAS_WIDTH,
      200
    );

    //write game menu options
    writeTextOnCanvasWithSize(this.ctx, 'Single Player Mode', 15, 'white', 20, 250);
    writeTextOnCanvasWithSize(this.ctx, 'Player VS Player Mode', 15, 'white', 20, 315);
    writeTextOnCanvasWithSize(this.ctx, 'Two Player Mode', 15, 'white', 20, 380);
    writeTextOnCanvasWithSize(this.ctx, 'High Scores', 15, 'white', 20, 445);
  }

  addGameMenuControls() {
    // event listeners
    window.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        this.gameWorldObject.gameState = this.currentSelectedMenu;
        this.gameWorldObject.resetGameComponents();
        window.removeEventListener('keyup', this.controller, true);
      }
      if (e.keyCode === PLAYER1_CONTROL_KEY.UP) {
        if (this.currentSelectedMenu != GAME_STATE.SINGLE_PLAYER) {
          this.currentSelectedMenu = this.currentSelectedMenu - 100;
        }
      }

      if (e.keyCode === PLAYER1_CONTROL_KEY.DOWN) {
        if (this.currentSelectedMenu != GAME_STATE.HIGH_SCORE_DISPLAY) {
          this.currentSelectedMenu = this.currentSelectedMenu + 100;
        }
      }
    }, false);
  }
}
