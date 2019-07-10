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