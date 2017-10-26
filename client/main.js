let canvas;
let ctx;
let walkImage; //spritesheet for character
let slashImage; //image for attack
//our websocket connection 
let socket; 
let hash; //user's unique character id (from the server)
let animationFrame; //our next animation frame function

let squares = {}; //character list
let attacks = []; //attacks to draw on screen
let jump = {
  canJump: false,
  isJumping: false,
  jumpHeight: 180,
  distTravelled: 0,
  speed: 3
}

//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    //square.moveUp = true;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    square.moveLeft = true;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    //square.moveDown = true;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    square.moveRight = true;
  } 
  if(keyPressed === 32) {
    startJump();
    e.preventDefault();
  }
};

//handler for key up events
const keyUpHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    //square.moveUp = false;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    square.moveLeft = false;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    //square.moveDown = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    square.moveRight = false;
  }
  //Space key was lifted
  else if(keyPressed === 32) {
    //sendAttack(); //call to invoke an attack
    //startJump();
  }
};



const init = () => {
  walkImage = document.querySelector('#walk');
  slashImage = document.querySelector('#slash');
  
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser); //when user joins
  socket.on('updatedMovement', update); //when players move
  socket.on('addGravity', addGravity); //when players move
  socket.on('attackHit', playerDeath); //when a player dies
  socket.on('attackUpdate', receiveAttack); //when an attack is sent
  socket.on('left', removeUser); //when a user leaves
  socket.on('disconnected', disconnect);
  
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
  
  const disconnect = () => {
    cancelAnimationFrame(animationFrame);
    socket.disconnect();
    socket.close();
    
    console.log('server disconnected, trying to reset...');
    hash = undefined;
    squares = {};
    attacks = [];
    jump = {
      canJump: false,
      isJumping: false,
      origin: undefined,
      jumpHeight: 80,
    }
    socket = io.connect();
  };
};

window.onload = init;