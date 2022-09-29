class Game {
  constructor() {
    //botão de reset
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    //placar
    this.placar = createElement("h2");
    this.lider1 = createElement("h2");
    this.lider2 = createElement("h2");
    this.andando = false;
    this.setaEsquerda = false;

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
    this.addSprites(gObstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
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
    //chamada da função para saber quantos jogadores cruzaram a linha de chegada
    player.getCarsAtEnd();

    if(allPlayers != undefined){
      image(pistaimg, 0, -height*5, width, height*6);

      //mostrar barra de vida
      this.showLife();
      //mostrar barra combustivel
      this.showComb();
      
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
        //marcando o carro pelo índice
        if(index==player.index){
        fill ("red")
        stroke(10)
        ellipse(x,y,60)
        this.coletarComb(index);
        this.coletarMoedas(index);
        this.colisaoObstaculos(index);
        

        //camera
        camera.position.y=carros[index-1].position.y;

        }
      }
      this.playerControl();

      const linhaChegada = height*6 - 100;
      if(player.positionY > linhaChegada){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
      drawSprites();
    }
  }

  //movimenta os carros
  playerControl(){
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10;
      player.update();
      this.andando = true;
    }
    if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
      player.positionX -= 10;
      player.update();
      this.setaEsquerda = true;
    }
    if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
      player.positionX += 10;
      player.update();
      this.setaEsquerda = false;
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
      carsAtEnd:0,
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
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale,matriz=[]){
    for(var i=0; i<numberOfSprites; i++){
      var x,y;
     if(matriz.length>0){
      x=matriz[i].x
      y=matriz[i].y
      spriteImage=matriz[i].image
     }
     else{
      x = random(width/2 - 150, width/2 + 150);
      y = random(-height*4.5, height - 400);
     }


      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
      
      sprite.scale = scale;

      spriteGroup.add(sprite);
    }
  }

  //coletando cobustiveis
  coletarComb(i){
   carros[i-1].overlap(gFuels,function(collector,collected){
    player.fuel +=185/4;
    collected.remove();
   });
   if(player.fuel>0 && this.andando){
      player.fuel-=0.5;
   }
   if(player.fuel <=0){
   gameState =2;
   //this.gameOver()
   }
  }

  //coletando moedas
  coletarMoedas(i){
    carros[i-1].overlap(gCoins,function(collector,collected){
      player.score += 10;
     collected.remove();
    });
   }

   //barra de vida
   showLife(){
    push();
    image(lifeimg,width/2-150, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width/2-100, height - player.positionY - 400,185,20);
    fill("red");
    rect(width/2-100, height - player.positionY - 400,player.life,20);
    noStroke();
    pop();
   }
   //barra do combustivel
   showComb(){
    push();
    image(fuelimg,width/2-150, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width/2-100, height - player.positionY - 300,185,20);
    fill("brown");
    rect(width/2-100, height - player.positionY - 300,player.fuel,20);
    noStroke();
    pop();
   }

   //colisão com obstáculos
   colisaoObstaculos(index){
    if(carros[index-1].collide(gObstacles)){
      if(this.setaEsquerda){
        player.positionX += 100;
      }else{
        player.positionX -= 100;
      }
      if(player.life > 0){
        player.life -= 185/4;
      }
      player.update();
    }
   }

   //mostrar que o player terminou a corrida
   showRank(){
    swal({
      title: `Incrível! ${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl: 
      "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
   }
    //mostrar que o player não terminou a corrida
    //gameOver(){

   // }
   //"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
}//classe
