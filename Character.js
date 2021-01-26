import { Bullet } from "./Bullet.js";

export class Character {
  bullets = [];
  modifier = 5;
  leftArrow = false;
  rightArrow = false;
  upArrow = false;
  downArrow = false;

  turnLeft = false;
  turnRight = false;
  turnUp = false;
  turnDown = false;

  constructor(player, board) {
    this.board = board;
    this.player = player;
  }

  init() {
    this.setPosition();
    this.eventListeners();
    this.gameLoop();
  }

  setPosition() {
    this.player.classList.add('player');
    this.board.appendChild(this.player);
    this.player.style.top = `${
      window.innerHeight/2}px`;
    this.player.style.left = `${window.innerWidth/2}px`;
  }

  getPositionY() {
    return this.player.offsetTop + this.player.offsetHeight/2;
  }

  getPositionX() {
    return this.player.offsetLeft + this.player.offsetWidth/2;
  }

  eventListeners() {
    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.leftArrow = true;
          this.turnRight = false;
          this.turnUp = false;
          this.turnDown = false;
          this.turnLeft = true;
          break;
        case 39:
          this.rightArrow = true;
          this.turnLeft = false;
          this.turnUp = false;
          this.turnDown = false;
          this.turnRight = true;
          break;
        case 38:
          this.upArrow = true;
          this.turnRight = false;
          this.turnLeft = false;
          this.turnDown = false;
          this.turnUp = true;
          break;
        case 40:
          this.downArrow = true;
          this.turnRight = false;
          this.turnLeft = false;
          this.turnUp = false;
          this.turnDown = true;
          break;
      }

      this.chnagePlayerSprite();
    });

    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 32:
          this.shot();
          break;
        case 37:
          this.leftArrow = false;
          break;
        case 39:
          this.rightArrow = false;
          break;
        case 38:
          this.upArrow = false;
          break;
        case 40:
          this.downArrow = false;
          break;
      }
    });
  }
  gameLoop = () => {
    this.whatKey();
    requestAnimationFrame(this.gameLoop);
  };

  whatKey() {
    if (this.leftArrow && this.getPositionX() > 0 + this.player.offsetWidth/2) {
      this.player.style.left = `${
        parseInt(this.player.style.left, 10) - this.modifier
      }px`;
    }

    if (this.rightArrow && this.getPositionX() < window.innerWidth - this.player.offsetWidth/2) {
      this.player.style.left = `${
        parseInt(this.player.style.left, 10) + this.modifier
      }px`;
    }

    if (this.upArrow && this.getPositionY() > 0 + this.player.offsetHeight/2) {
      this.player.style.top = `${
        parseInt(this.player.style.top, 10) - this.modifier
      }px`;
    }

    if (
      this.downArrow &&
      this.getPositionY() < window.innerHeight - this.player.offsetHeight/2) {
      this.player.style.top= `${
        parseInt(this.player.style.top, 10) + this.modifier
      }px`;
    }
  }

chnagePlayerSprite(){
  if(this.turnUp){
    this.player.style.setProperty('animation-name', 'moveUp')
  } else if
  
  (this.turnDown){
    this.player.style.setProperty('animation-name', 'moveDown')
  } else if(this.turnLeft){
    this.player.style.setProperty('animation-name', 'moveLeft')
  } else if(this.turnRight){
    this.player.style.setProperty('animation-name', 'moveRight')
  }
}

  shot() {
    const bullet = new Bullet(
      this.getPositionX(),
      this.getPositionY(),
      this.board,
      this.turnLeft,
      this.turnRight,
      this.turnUp,
      this.turnDown
    );
    bullet.init();
    this.bullets.push(bullet);
  }
}
