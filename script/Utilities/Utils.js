// set request animation frame if not supported in browsers
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
}

// sometimes getting issue, this is the original array index of working but 
// as if browser don't have index of we will provide our own implementation
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (elt /*, from*/) {
    let len = this.length;
    let from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
      from += len;
    }
    for (; from < len; ++from) {
      if (from in this && this[from] === elt) {
        return from;
      }
    }
    return -1;
  };
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function (from, to) {
    let rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
}



/* Make sure everything fits nicely in the window, and redraws on screen resize events. */
function resize(event) {
  display.canvas.width = window.innerWidth || document.documentElement.clientWidth;
  display.canvas.height = window.innerHeight || document.documentElement.clientHeight;
  display.imageSmoothingEnabled = false;// This keeps the image looking sharp.
}

// load multiple images and callback when ALL images have loaded
function loadImages(imageSourceArray, callback) {
  let count = 0;

  for (let i = 0; i < imageSourceArray.length; i++) {
    let image = new Image();
    image.src = imageSourceArray[i];
    image.onload = () => {
      count++;
      if (count >= imageSourceArray.length) {
        callback();
      }
    };
  }
}


/**
 * Write text on canvas on x and y axis given
 * 20PX and white text
 * @param {*} ctx
 * @param {*} text
 * @param {*} x
 * @param {*} y
 */
function writeTextOnCanvas(ctx, text, x, y) {
  ctx.font = '20px PacmanEmu';
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);
}

/**
 * Write text in canvas on x and y axis
 * and based on font size and color
 *
 * @param {*} ctx
 * @param {*} text
 * @param {*} fontSize
 * @param {*} fontColor
 * @param {*} x
 * @param {*} y
 */
function writeTextOnCanvasWithSize(ctx, text, fontSize, fontColor, x, y) {
  fontSize = parseInt(fontSize);
  ctx.font = `${fontSize}px PacmanEmu`;
  ctx.fillStyle = fontColor;
  ctx.fillText(text, x, y);
}


/**
 * Get Character Speed from the CHARACTER_SPEED value in constant
 *
 * @param {*} characterName
 * @param {*} gameLevel
 * @param {*} gameMode
 * @returns
 */
function getCharacterSpeed(characterName, gameLevel, gameMode) {
  characterName = characterName.toUpperCase();
  gameLevel = parseInt(gameLevel);
  gameMode = gameMode.toUpperCase();

  //less than level 1 has same speed
  if (gameLevel <= 1) { gameLevel = 1; }
  //level 2 to 4 has same speed
  if (gameLevel >= 2 && gameLevel <= 4) { gameLevel = 2; }
  //level 5 to 20 has speed
  if (gameLevel >= 5 && gameLevel <= 20) { gameLevel = 5; }
  if (gameLevel >= 21) { gameLevel = 21; }

  let speed = CHARACTERS_SPEED[characterName][gameLevel][gameMode];
  return speed;
}


// 2PHighScore,1PHighScore
//for storing and retrieving from localStorage
let DataStorage = {
  getItem(itemName) {
    let item = localStorage.getItem(itemName);
    return item;
  },

  getLength() {
    let length = localStorage.length;

    return length;
  },

  getItemName(keyValue) {
    let name = localStorage.key(keyValue);
    return name;
  },

  setItem(itemName, itemData) {
    localStorage.setItem(itemName, JSON.stringify(itemData));
  },

  clear() {
    localStorage.clear();
  }
};
