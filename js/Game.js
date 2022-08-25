class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    carro1 = createSprite(width/2-50,height-100);
    carro1.addImage("carro1",carro1img);
    carro1.scale=0.07;
    carro2 = createSprite(width/2+100,height-100);
    carro2.addImage("carro2",carro2img);
    carro2.scale=0.07;
    carros=[carro1,carro2];

  }
  //jogo começou
  play(){
    drawSprites()
  }

  //pegar o estado do jogo do BD
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }
  //atualizar o gameState no banco de dados
  updateState(state){
    database.ref("/").update({
      gameState: state,
    })
  }

}//classe
