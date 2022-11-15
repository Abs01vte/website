"use strict";

let frameCount = 0;
let desiredFPS = 20;
// For controlling the frame rate.
let fpsInterval, startTime, now, then, elapsed;

let canvas;
let context;

// Rows and columns of the board.
let rows = 150;
let cols = 75;

// Divisor for likelyhood the cell starts out as alive.
// For example: 4 means 1/4 chance.
let chance = 4;

// Enum of alive and dead states.
const lifeState = Object.freeze({"alive":1, "dead":2});

let frameTime = 1 / desiredFPS;
// False to not show the FPS, true to show it.
let showFPS = false;
// Number of milliseconds since the start of the program.
let msTimer = Date.now();
// Increment for each frame per second.
let frames = 0;
// The framerate.
let fps = 0;


// 2D array of cells.
// TODO presets like Gaspar gun
let cells = (_ => {
  let retVal = [[]];
  for(let i = 0; i < rows; i++) {
    retVal[i] = [];
    for(let j = 0; j < cols; j++) {
      retVal[i][j] = ((Math.floor((Math.random() * chance) + 1) == 1) ? lifeState.alive : lifeState.dead);
    }
  }

  return retVal;
})();

let tmpCanvas;
let tmpContext;

// Init function.
(_ => {
  let newCanvas = document.createElement('canvas');
  newCanvas.setAttribute("id", 'bkg-canvas');
  newCanvas.style['position'] = 'fixed';
  newCanvas.style['left'] = 0;
  newCanvas.style['right'] = 0;
  newCanvas.style['top'] = 0;
  newCanvas.style['z-index'] = -1;
  newCanvas.width  = window.innerWidth;
  newCanvas.height = window.innerHeight;
  document.body.style.backgroundColor = "black";

  tmpCanvas = document.createElement('canvas');
  tmpContext = tmpCanvas.getContext('2d');
  tmpCanvas.width  = window.innerWidth;
  tmpCanvas.height = window.innerHeight;
  document.body.style.backgroundColor = "black";


  document.body.appendChild(newCanvas);


  canvas = document.getElementById('bkg-canvas');
  context = canvas.getContext('2d');
})();


// get the total number of neighboring cells that are alive.
function totalAliveNeighbors(x, y)
{
  let numAlive=0;
  for(let i=x-1; i <= (x+1);i++){
    for(let j=y-1; j<=(y+1);j++){
      let newX=(i+rows)%rows;
      let newY=(j+cols)%cols;
      if(cells[newX][newY] = lifeState.alive){
        numAlive++;
      }
    }
  }
  //if it's alive, then it counts itself
  if(cells[x][y] == lifeState.alive){
    return numAlive-1;
  }
  return numAlive;

}

//drawing function.
function draw() {
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;
  let drawCell = { 'x' : 0, 'y' : 0, 'width' : wWidth / rows, 'height' : wHeight / cols};

  tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);

  tmpContext.beginPath();
  tmpContext.fillStyle = '#FFFFFF';
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      drawCell.x = i * drawCell.width;
      drawCell.y = j * drawCell.height;

      if(cells[i][j] === lifeState.alive)
        tmpContext.rect(drawCell.x, drawCell.y, drawCell.width, drawCell.height);
    }
  }
  tmpContext.fill();
  tmpContext.closePath();

  context.drawImage(tmpCanvas, 0, 0, wWidth, wHeight);
}

// Update the cells.
let printTimes = rows*cols*3;
let timesHasPrint=0;
function updateCells()
{
  let oldCells = JSON.parse(JSON.stringify(cells))
  for(let i=0; i < rows; i++){
    for(let j=0; j<cols;j++){
      let neighbors = totalAliveNeighbors(i, j);
      let isAlive = cells[i][j]==lifeState.alive;
      if(!isAlive && neighbors == 3){
        cells[i][j]=lifeState.alive;
      }
      else if (isAlive && neighbors>3) {
        cells[i][j]=lifeState.dead;
      }
      else if(isAlive && neighbors<2){
        cells[i][j]=lifeState.dead;
      }
      if (timesHasPrint++ <= printTimes){
        console.log(isAlive ? "alive":"dead");
      }

    }

  }

}

function gameLoop() {
  updateCells();

  // request another frame
  requestAnimationFrame(gameLoop);

  // calc elapsed time since last loop

  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    then = now - (elapsed % fpsInterval);
    draw();
    frames++;


    if(showFPS) {
      if(now - msTimer >= 1000) {
        fps = frames;
        frames = 0;
        msTimer += 1000;
      }

      context.fillStyle = 'white';
      context.fillRect(0, 0, 200, 100);
      context.font = '25px Arial';
      context.fillStyle = 'black';
      context.fillText("FPS: " + fps, 10, 30);
    }
  }
}


(_ => {
  fpsInterval = 1000 / desiredFPS;
  then = Date.now();
  startTime = then;
  console.log("Starting on Unix timestamp: " + startTime);
  gameLoop();
})();


window.addEventListener('resize', _ => {
  tmpCanvas.width = window.innerWidth;
  tmpCanvas.height = window.innerHeight;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
