const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var gameState;
gameState="START";
var bg, bg1;
var back, lost, lostImg, start, startImg, lasergun, lasergunImg;
var amanda, amandaAni;
var invisible;
var laserGroup, gunGroup, knifeGroup, bulletGroup, bombGroup, villainGroup, taserGroup;
var score, lives, level, gunCount, knifeCount, knife, knifeImage, gun, gunImage, bullet, bulletImage;
var villain, villainImg, bad, badImg, killian, killianImg, bomb, bombImg, taser, taserImg;
var room, roomImg, spy, spyImg, go, yes, no, yesImg, noImg, out, outImg, office, officeImg;
var rand, numb;
score=0;
lives=3;
level=1;
gunCount=0;
knifeCount=0;

function preload() {
  bg1 = loadImage("images/bg.png");
  startImg = loadImage("images/start.png");
  amandaAni = loadAnimation("animation/1.png","animation/2.png","animation/3.png","animation/4.png",
  "animation/5.png","animation/6.png","animation/7.png")
  lasergunImg = loadImage("images/laserGun.png");
  lostImg = loadImage("images/lost.png");
  gunImage = loadImage("images/gun.png");
  knifeImage = loadImage("images/knife.png");
  bulletImage = loadImage("images/bullet.png");
  taserImg = loadImage("images/taserGun.png");
  bombImg = loadImage("images/bomb.png");
  villainImg = loadImage("images/villain.png");
  badImg = loadImage("images/badGuy.png");
  killianImg = loadImage("images/killian.png");
  roomImg = loadImage("images/secretRoom.png");
  spyImg = loadImage("images/spy.png");
  yesImg = loadImage("buttons/yes.png");
  noImg = loadImage("buttons/no.png");
  officeImg = loadImage("buttons/office.png");
  outImg = loadImage("buttons/outside.png");
}
function setup() {
   var canvas=createCanvas(1000,500);
   engine=Engine.create();
   world=engine.world;

   bg = createSprite(1680,height/2);
   bg.addImage(bg1);
   bg.scale=1.8;

   start = createSprite(900,400);
   start.addImage(startImg);

   amanda = createSprite(100,400);
   amanda.addAnimation("running",amandaAni);
   amanda.scale=0.3;

   invisible = createSprite(500,470,1000,20);
   invisible.visible=false;

   lost = createSprite(460,180);
   lost.addImage(lostImg);
   lost.scale=1;
   lost.visible=false;

   laserGroup = createGroup();
   gunGroup = createGroup();
   knifeGroup = createGroup();
   bulletGroup = createGroup();
   bombGroup = createGroup();
   taserGroup = createGroup();
   villainGroup = createGroup();
   
   Engine.run(engine);
}
function draw() {
    if (back) {background(back);} 
    amanda.collide(invisible);
    if (gameState==="START") {
      back="black";
      bg.visible=false;
      amanda.visible=false;
      
      textFont("Papyrus");
      textSize(30);
      fill("yellow");
      text("STORY",400,45);
      text("INFORMATION",360,355);
      fill("white");
      text("Amanda is a spy working for the B.E.A.S.T. (Board of Espionage,",10,90);
      text("Analysis, Security and Technology) who has a mission. The Department of",10,130);
      text("Research and Analysis has been sabotaged and she needs to find out who is",10,170);
      text("the culprit. The B.E.A.S.T. suspects Thomas Rudd. Amanda has to enter",10,210);
      text("the Lair, which is the office of Thomas Rudd. But to do that, she needs to",10,250); 
      text("pass various traps laid in the Lair. Help her get pass all of them and determine",10,290);
      text("the truth.",10,330);
      textSize(25);
      text("1. Press space to shoot and up arrow to jump.",10,395);
      text("2. After every 500 points, you'll be updated to the next level.",10,430);
      text("3. There are 5 levels in total. Plus, the bullets are super powerful and can destroy anything.",10,475);

      if (mousePressedOver(start)) {
        gameState="PLAY";
      }
    }  
    if (gameState==="PLAY") {
      bg.visible=true;
      amanda.visible=true;
      start.visible=false;
      bg.velocityX=-4;

      amanda.velocityY+=0.5;
      if (keyDown(UP_ARROW)&&amanda.y>150) {
        amanda.velocityY=-10;        
      }
      if (bg.x<-700) {
        bg.x=1680;
      }

      if (lives<=0) {
        gameState="END";
      }

      score = score+Math.round(getFrameRate()/60);

      if (score>=500) {
        level++;
        score=0;
      }
console.log(amanda.scale);
      if (keyWentDown(40)&&amanda.scale>0.249) {
        amanda.scale=0.25;
      }
      if (keyWentUp(40)) {
        amanda.scale=0.3;
      }

      spawnGuns();
      if (amanda.isTouching(gunGroup)) {
        gunCount++;
        gunGroup.destroyEach();
      }
      if (amanda.isTouching(knifeGroup)) {
        knifeCount++;
        knifeGroup.destroyEach();
      }
      if (gunCount>0&&keyDown("space")) {
        bullet = createSprite(amanda.x+20,amanda.y,20,20);
        bullet.velocityX=3;
        bullet.addImage(bulletImage);
        bullet.scale=0.3;
        bulletGroup.add(bullet);
        gunCount--;
      }
      if (knifeCount>0&&keyWentDown("k")) {
        knifeCount--;

      }
      if (level===1) {
      spawnLasers();
        if (amanda.isTouching(laserGroup)) {
          laserGroup.destroyEach();
          lives--;
        } 
        
        if (bulletGroup.isTouching(laserGroup)) {
          laserGroup.destroyEach();
          bulletGroup.destroyEach();
        }
      }

      if (level===2) {
        laserGroup.destroyEach();
        spawnTasers();
        if (amanda.isTouching(taserGroup)) {
          taserGroup.destroyEach();
          lives--;
        } 
        if (bulletGroup.isTouching(taserGroup)) {
          taserGroup.destroyEach();
          bulletGroup.destroyEach();
        }
      }

      if (level===3) {
        laserGroup.destroyEach();
        taserGroup.destroyEach();
        spawnBombs();
        if (amanda.isTouching(bombGroup)) {
          bombGroup.destroyEach();
          lives--;
        } 
        if (bulletGroup.isTouching(bombGroup)) {
          bombGroup.destroyEach();
          bulletGroup.destroyEach();
        }
      }

      if (level===4) {
        laserGroup.destroyEach();
        taserGroup.destroyEach();
        bombGroup.destroyEach();
        spawnVillains();
          if (amanda.isTouching(villainGroup)) {
            villainGroup.destroyEach();
            lives--;
          } 
          if (bulletGroup.isTouching(villainGroup)) {
            villainGroup.destroyEach();
            bulletGroup.destroyEach();
          }
        }

      if (level===5) {
        level=5.1;
        gameState="QUESTION";
      }
    }

    if (gameState==="END") {
      bg.visible=false;
      amanda.visible=false;
      back="black";
      lost.visible=true;

      laserGroup.destroyEach();
      taserGroup.destroyEach();
      bombGroup.destroyEach();
      villainGroup.destroyEach();
      knifeGroup.destroyEach();
      gunGroup.destroyEach();
    }
    drawSprites(); 
    if (gameState==="PLAY") {
      fill("white");
      rectMode(CENTER);
      //for score
      rect(65,15,130,30);
      //for lives
      rect(935,15,130,30);
      //for level
      rect(523,15,130,30);

      fill("yellow");
      //for guns
      rect(320,15,130,30);
      //for knives
      rect(726,15,140,30);

      textFont("Candara");
      textSize(30);
      fill(0);
      text("Score: "+score,6,25);
      text("Lives: "+lives,890,25);
      text("Level: "+level,480,25);
      text("Guns: "+gunCount,260,25);
      text("Knives: "+knifeCount,660,25);
    }

    if (gameState==="QUESTION") {

      if (level===5.1) {
        room = createSprite(width/2,height/2,width,height);
        room.addImage(roomImg);

        killian = createSprite(150,250);
        killian.addImage(killianImg);
        killian.scale=0.7;

        spy = createSprite(800,300);
        spy.addImage(spyImg);
        spy.scale=0.7;

        go = createSprite(500,350);
        go.addImage(startImg);

        if (mousePressedOver(go)) {
          level=5.2;
        }

        fill("yellow");
        textSize(25);
        textFont("Tahoma");
        text("Rudd: Aha! So Agent Amanda, you finally reached me.",200,100);
        text("Rudd: And how are you planning to do that?",250,220);
        text("Rudd: Thomas Rudd is never afraid. Yes, I'm ready.",170,310);

        fill("white");
        text("Amanda: Yes, I did. And I know it was you behind",200,130);
        text("the sabotage. All I want is proof. Then you will be",200,160);
        text("exposed.",200,190);
        text("Amanda: Through an interrogation. Are you",250,250);
        text("ready for it?",250,280);
      }

      if (level===5.2) {
        go.visible=false;

        fill("white");
        textSize(30);
        textFont("Lucida Bright");
        text("Q1. Did you know about the sabotage?",200,100);
        yes = createSprite(350,200);
        yes.addImage(yesImg);
        yes.scale=0.5;
        no = createSprite(550,200);
        no.addImage(noImg);
        no.scale=0.5;

        if (mousePressedOver(yes)) {
           level=5.21;
        } else if (mousePressedOver(no)) {
          level=5.3;
        }
      }

      if (level===5.21) {
        yes.visible=false;
        no.visible=false;
        fill("white");
        textSize(30);
        textFont("Lucida Bright");
        text("Q2. Where were you at the time of the sabotage?",200,100);
        office = createSprite(350,200);
        office.addImage(officeImg);
        office.scale=0.5;
        out = createSprite(550,200);
        out.addImage(outImg);
        out.scale=0.5;

        if (mousePressedOver(office)||mousePressedOver(out)) {
          level=5.22;
        }
      }

      if (level===5.22) {
        yes.visible=false;
        no.visible=false;
        office.visible=false;
        out.visible=false;
        fill("white");
        textSize(30);
        textFont("Lucida Bright");
        text("Q3. And what were you doing?",200,100);        
      }
    }
}
function spawnLasers() {
  if (frameCount%130===0) {
    lasergun = createSprite(random(800,1000),random(200,460));
    lasergun.velocityX=-4.5;
    lasergun.addImage(lasergunImg);
    lasergun.scale=0.15;
    lasergun.lifetime=220;
    laserGroup.add(lasergun);
  }
}
function spawnGuns() {
  numb = Math.round(random(1,2));
  if (frameCount%150===0) {
    if (numb===1) {
    gun = createSprite(random(800,1000),random(200,460));
    gun.velocityX=-4.5;
    gun.addImage(gunImage);
    gun.scale=0.3;
    gun.lifetime=200;
    gunGroup.add(gun);
  } else if (numb===2) {
    knife = createSprite(random(800,1000),random(200,460));
    knife.velocityX=-4.5;
    knife.addImage(knifeImage);
    knife.scale=0.2;
    knife.lifetime=200;
    knifeGroup.add(knife);
  }
 }
}

function spawnBombs() {
  if (frameCount%130===0) {
    bomb = createSprite(random(800,1000),random(200,400));
    bomb.velocityX=-4.5;
    bomb.addImage(bombImg);
    bomb.scale=0.35;
    bomb.lifetime=220;
    bombGroup.add(bomb);
  }
}

function spawnTasers() {
  if (frameCount%130===0) {
    taser = createSprite(random(800,1000),random(200,400));
    taser.velocityX=-4.5;
    taser.addImage(taserImg);
    taser.scale=0.2;
    taser.lifetime=220;
    taserGroup.add(taser);
  }
}

function spawnVillains() {
  rand = Math.round(random(1,2));
  if (frameCount%130===0) {
    if (rand===1) {
      villain = createSprite(random(800,1000),random(200,300));
      villain.velocityX=-4;
      villain.addImage(villainImg);
      villain.scale=0.5;
      villain.lifetime=220;
      villainGroup.add(villain);
    } else if (rand===2) {
      bad = createSprite(random(800,1000),random(200,400));
      bad.velocityX=-4;
      bad.addImage(badImg);
      bad.scale=0.3;
      bad.lifetime=220;
      villainGroup.add(bad);
    }
  }
}