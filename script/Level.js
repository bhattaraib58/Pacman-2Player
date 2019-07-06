class Level {
  constructor() {
    var state = WAITING,
      audio = null,
      ghosts = [],
      ghostSpecs = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"],
      eatenCount = 0,
      level = 0,
      tick = 0,
      ghostPos, userPos,
      stateChanged = true,
      timerStart = null,
      lastTime = 0,
      ctx = null,
      timer = null,
      map = null,
      user = null,
      stored = null;


      
  Pacman.WALL    = 0;
  Pacman.BISCUIT = 1;
  Pacman.EMPTY   = 2;
  Pacman.BLOCK   = 3;
  Pacman.PILL    = 4;
  
  Pacman.MAP = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  
  }

  keyDown(e) {
    if (e.keyCode === KEY.N) {
      startNewGame();
    } else if (e.keyCode === KEY.S) {
      audio.disableSound();
      localStorage["soundDisabled"] = !soundDisabled();
    } else if (e.keyCode === KEY.P && state === PAUSE) {
      audio.resume();
      map.draw(ctx);
      setState(stored);
    } else if (e.keyCode === KEY.P) {
      stored = state;
      setState(PAUSE);
      audio.pause();
      map.draw(ctx);
      dialog("Paused");
    } else if (state !== PAUSE) {
      return user.keyDown(e);
    }
    return true;
  }
  gameAudio() {
    var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3';

    var audio_files = [
      ["start", root + "audio/opening_song." + extension],
      ["die", root + "audio/die." + extension],
      ["eatghost", root + "audio/eatghost." + extension],
      ["eatpill", root + "audio/eatpill." + extension],
      ["eating", root + "audio/eating.short." + extension],
      ["eating2", root + "audio/eating.short." + extension]
    ];

    load(audio_files, function () { loaded(); });
  };
}
