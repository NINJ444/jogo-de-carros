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

}//classe
