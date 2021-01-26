import { Character } from "./Character.js";

export class Bullet {
  constructor(x, y, board, turnLeft, turnRight, turnUp, turnDown) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.turnLeft = turnLeft;
    this.turnRight = turnRight;
    this.turnUp = turnUp;
    this.turnDown = turnDown;
    this.elementBullet = document.createElement("div");
    this.interval = null;
  }

  init() {
    this.elementBullet.classList.add("bullet");
    this.board.appendChild(this.elementBullet);
    this.elementBullet.style.left = `${
      this.x - this.elementBullet.offsetWidth / 2
    }px`;
    this.elementBullet.style.top = `${
      this.y - this.elementBullet.offsetHeight
    }px`;
    this.interval = setInterval(() => {
      this.bulletPosition();
    }, 5);
  }

  bulletPosition() {
    if (this.turnRight) {
      this.elementBullet.style.left = `${this.elementBullet.offsetLeft + 5}px`;
    } else if (this.turnLeft) {
      this.elementBullet.style.left = `${this.elementBullet.offsetLeft - 5}px`;
    } else if (this.turnDown) {
      this.elementBullet.style.top = `${this.elementBullet.offsetTop + 5}px`;
    } else if (this.turnUp) {
      this.elementBullet.style.top = `${this.elementBullet.offsetTop - 5}px`;
    } else {
      this.elementBullet.style.top = `${this.elementBullet.offsetTop - 5}px`;
    }
  }

  remove() {
    clearInterval(this.interval);
    this.elementBullet.remove();
  }
}
