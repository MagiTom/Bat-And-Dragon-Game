export class Enemy {
  constructor(
    player,
    board,
    intervalTime,
    enemyClass,
    explosionClass,
    lives = 1
  ) {
    this.player = player;
    this.board = board;
    this.enemyElement = document.createElement("div");
    this.rocket = document.createElement("div");
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.intervalTime = intervalTime;
    this.atackInterval = null;
    this.shotInterval = null;
    this.positionLeft = false;
    this.positionTop = false;
    this.maxEnemies = 10;
    this.lives = lives;
  }

  init() {
    this.setEnemy();
    this.updatePosition();
  }

  setEnemy() {
    this.enemyElement.classList.add(this.enemyClass);
    this.board.appendChild(this.enemyElement);
    this.randomPosition();
  }

  randomPosition() {
    const randomPlace = Math.floor(Math.random() * this.maxEnemies);
    if (randomPlace % 2 === 0) {
      this.positionLeft = true;
      this.enemyElement.style.top = `${Math.floor(
        Math.random() * (window.innerHeight - this.enemyElement.offsetHeight)
      )}px`;
      this.enemyElement.style.left = "0px";
    } else {
      this.positionTop = true;
      this.enemyElement.style.top = "0px";
      this.enemyElement.style.left = `${Math.floor(
        Math.random() * (window.innerWidth - this.enemyElement.offsetWidth)
      )}px`;
    }
  }

  updatePosition() {
    this.interval = setInterval(() => this.setNewPosition(), this.intervalTime);
  }

  setNewPosition() {
    if (this.positionTop) {
      this.enemyElement.style.top = `${this.enemyElement.offsetTop + 5}px`;
    } else if (this.positionLeft) {
      this.enemyElement.style.left = `${this.enemyElement.offsetLeft + 5}px`;
    }

    this.changeEnemySprite();
    if (
      this.enemyElement.offsetLeft > window.innerWidth ||
      this.enemyElement.offsetTop > window.innerHeight
    ) {
      this.enemyElement.remove();
    }
  }

  hit() {
    this.lives--;
    if (!this.lives) {
      this.removeEnemy();
    }
  }

  removeEnemy() {
    this.enemyElement.classList.remove(this.classList);
    this.enemyElement.classList.add(this.explosionClass);
    clearInterval(this.interval);
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosion-time"
      ),
      10
    );
    setTimeout(() => this.enemyElement.remove(), animationTime);
  }

  changeEnemySprite() {
    if (
      this.positionTop &&
      (this.enemyElement.classList.contains("enemy") ||
        this.enemyElement.classList.contains("enemy--two"))
    ) {
      this.enemyElement.style.setProperty("animation-name", "enemyMoveDown");
    } else if (
      (this.positionLeft && this.enemyElement.classList.contains("enemy")) ||
      this.enemyElement.classList.contains("enemy--two")
    ) {
      this.enemyElement.style.setProperty("animation-name", "enemyMoveRight");
    }
  }

  //Atack
  atack() {
    this.enemyElement.classList.add("explosion");
    setTimeout(() => this.enemyElement.classList.remove("explosion"), 500);
    this.atackInterval = setInterval(
      () => this.UpdateAtackTransform(),
      this.intervalTime
    );
  }

  UpdateAtackTransform() {
    this.enemyElement.style.setProperty(
      "--y1",
      parseInt(this.enemyElement.offsetTop) + "px"
    );
    this.enemyElement.style.setProperty("--y2", this.player.offsetTop + "px");
    this.enemyElement.style.setProperty(
      "--x1",
      parseInt(this.enemyElement.offsetLeft) + "px"
    );
    this.enemyElement.style.setProperty("--x2", this.player.offsetLeft + "px");
    this.enemyElement.classList.add("dragon");
  }
}
