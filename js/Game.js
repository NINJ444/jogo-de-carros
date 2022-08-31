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
    //matriz  0       1
  }

  //transição das telas
  transicaoDeTelas(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  //jogo começou
  play(){
    //muda a tela para a tela do jogo
    this.transicaoDeTelas();
    //chamada da função estática pela classe
    Player.getPlayersInfo();
    if(allPlayers != undefined){
      image(pistaimg, 0, -height-5, width, height*6);

      //ver as informações de cada carro (posição)
      var index = 0;
      for(var plr in allPlayers){
        index = index + 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index-1].position.x = x;
        carros[index-1].position.y = y;
      }
      this.playerControl();
      drawSprites();
    }
  }

  //movimenta os carros
  playerControl(){
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10;
      player.update();
    }
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
