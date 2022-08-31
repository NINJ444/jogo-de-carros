var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var carro1,carro2,carro1img,carro2img;
var pistaimg;
var carros;
var allPlayers;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carro1img = loadImage("./assets/car1.png");
  carro2img = loadImage("./assets/car2.png");
  pistaimg = loadImage("./assets/track.jpg");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState(); //verifica no BD o estado do jogo antes de começar
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount == 2){
    game.updateState(1)
  }
  if(gameState == 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
