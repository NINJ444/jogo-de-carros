class Game {
  constructor() {
    //botão de reset
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    //placar
    this.placar = createElement("h2");
    this.lider1 = createElement("h2");
    this.lider2 = createElement("h2");

  }

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

    //grupos de sprites
    gFuels = new Group();
    gCoins = new Group();
    gObstacles = new Group();

    //matriz de posições dos obstáculos
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    //chamada da função para criar os sprites
    this.addSprites(gCoins,20,coinimg,0.09);
    this.addSprites(gFuels,10,fuelimg,0.02);
  }

  //transição das telas
  transicaoDeTelas(){
    form.hide();
    //título do jogo
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");
    //título do botão de reset
    this.resetTitle.position(width/2 + 230, 40);
    this.resetTitle.class("resetText");
    this.resetTitle.html("Reiniciar Jogo");
    //botão de reset
    this.resetButton.position(width/2 + 230, 100);
    this.resetButton.class("resetButton");
    //placar
    this.placar.position(width/3 - 40, 40);
    this.placar.class("leadersText");
    this.placar.html("Placar");

    this.lider1.position(width/3 - 40, 80);
    this.lider1.class("leadersText");

    this.lider2.position(width/3 - 40, 130);
    this.lider2.class("leadersText");

  }

  //jogo começou
  play(){
    //muda a tela para a tela do jogo
    this.transicaoDeTelas();
    //chamada da função para resetar o banco de dados
    this.botaoReset();
    //chamada da função estática pela classe
    Player.getPlayersInfo();
    if(allPlayers != undefined){
      image(pistaimg, 0, -height-5, width, height*6);

      //mostrar placar
      this.mostrarPlacar();

      //ver as informações de cada carro (posição)
      var index = 0;
      for(var plr in allPlayers){
        index = index + 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index-1].position.x = x;
        carros[index-1].position.y = y;
        //marcando o carro
        if(index==player.index){
        fill ("red")
        stroke(10)
        ellipse(x,y,60)
        //camera
        camera.position.y=carros[index-1].position.y;
        }
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
    if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
      player.positionX -= 10;
      player.update();
      
    }
    if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
      player.positionX += 10;
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

  botaoReset(){
    //resetar o banco de dados
    this.resetButton.mousePressed(()=>{
    database.ref("/").set({
      gameState:0,
      playerCount:0,
      players:{}
    });
    window.location.reload();
    });   
  }

  //placar
  mostrarPlacar(){
    var lider1, lider2;
    var players = Object.values(allPlayers);
    if((players[0].rank ===0 && players[1].rank === 0) || players[0].rank === 1){
      lider1 = 
      players[0].rank +
      "&emsp;" + 
      players[0].name +
      "&emsp;" + 
      players[0].score;

      lider2 = 
      players[1].rank +
      "&emsp;" + 
      players[1].name +
      "&emsp;" + 
      players[1].score;
    }

    if(players[1].rank === 1){
      lider1 = 
      players[1].rank +
      "&emsp;" + 
      players[1].name +
      "&emsp;" + 
      players[1].score;

      lider2 = 
      players[0].rank +
      "&emsp;" + 
      players[0].name +
      "&emsp;" + 
      players[0].score;
    }

    this.lider1.html(lider1);
    this.lider2.html(lider2);
  }

  //criação dos sprites de moeda, combustível e obstáculos
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale){
    for(var i=0; i<numberOfSprites; i++){
      var x,y;

      x = random(width/2 - 150, width/2 + 150);
      y = random(-height*4.5, height - 400);

      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
      
      sprite.scale = scale;

      spriteGroup.add(sprite);
    }
  }

}//classe
