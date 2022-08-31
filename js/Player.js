class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
  }


//pegar o playerCount do BD
getCount(){
  var playerCountRef = database.ref("playerCount");
  playerCountRef.on("value", function(data){
    playerCount = data.val();
  });
}

//atualizar o playerCount do BD
updateCount(count){
  database.ref("/").update({
    playerCount: count,
  })
}

//adicionar esse player no BD
addPlayer(){
  var playerIndex = "players/player" + this.index;
  if(this.index === 1){
    this.positionX = width/2 - 100;
  } else{
    this.positionX = width/2 + 100;
  }

  database.ref(playerIndex).set({
    name: this.name,
    positionX: this.positionX,
    positionY: this.positionY,
  });
}

//traz as informações dos dois players do banco de dados
static getPlayersInfo(){
  var playerInfoRef = database.ref("players");
  playerInfoRef.on("value", data => {
    allPlayers = data.val();
  });
}

//atualizar a posição do player no banco de dados
update(){
  var playerIndex = "players/player" + this.index;
  database.ref(playerIndex).update({
    positionX: this.positionX,
    positionY: this.positionY,
  });
}
//pegar a distancia dos carros do banco de dados
distancia(){
var playerDistanceRef = database.ref("players/player"+ this.index);
playerDistanceRef.on("value",data => {
  var data = data.val();
  this.positionX=data.positionX;
  this.positionY=data.positionY;
});
}
  

}//classe
