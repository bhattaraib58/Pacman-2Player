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
  let count = imageSourceArray.length;

  for (let i = 0; i < imageSourceArray.length; i++) {
    let image = new Image();
    image.src = imageSourceArray[i];
    image.onload = () => {
      count--;
      if (count <= 0)
        callback();
    };
  }
}
