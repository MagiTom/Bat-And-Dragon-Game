import { Character } from "./Character.js";
import { Enemy } from "./Enemy.js";

export class Game {
  domElements = {
    gameBoard: document.querySelector(".game"),
    player: document.createElement("div"),
    score: document.querySelector(".score"),
    lives: document.querySelector(".lives"),
    modal: document.querySelector(".modal"),
    modalScore: document.querySelector(".modal__score"),
    modalText: document.querySelector(".modal__text"),
    modalLevel: document.querySelector(".modal-level"),
    modalLevelScore: document.querySelector(".modal-level__score"),
    level: document.querySelector(".modal-level__text"),
    button: document.querySelector(".modal__button"),
  };

  character = new Character(
    this.domElements.player,
    this.domElements.gameBoard
  );

  enemies = [];
  lives = null;
  score = null;
  level = 1;
  enemiesInterval = null;
  checkPositionInterval = null;
  createEnemyInterval = null;

  init() {
    this.character.init();
    this.newGame();
    this.domElements.button.addEventListener("click", () => this.newGame());
  }

  newGame() {
    this.domElements.modal.classList.add("hide");
    this.enemiesInterval = 30;
    this.lives = 4;
    this.score = 0;
    this.updateLivesText();
    this.updateScoreText();
    this.character.setPosition();
    this.createEnemyInterval = setInterval(() => this.randomNewEnemy(), 1000);
    this.checkPositionInterval = setInterval(() => this.checkPosition(), 1);
  }

  endGame() {
    this.domElements.modal.classList.remove("hide");
    this.domElements.modalText.textContent = `Game over!`;
    this.domElements.modalScore.textContent = `Your score is ${this.score}`;
    this.enemies.forEach((enemy) => enemy.removeEnemy());
    this.enemies.length = 0;
    clearInterval(this.createEnemyInterval);
    clearInterval(this.checkPositionInterval);
  }

  startNextLevel() {
    this.enemiesInterval = 30;
    this.character.setPosition();
    this.createEnemyInterval = setInterval(() => this.randomNewEnemy(), 1000);
    this.checkPositionInterval = setInterval(() => this.checkPosition(), 1);
  }

  randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;

    if (randomNumber % 5 === 0) {
      this.createNewEnemy(
        this.domElements.player,
        this.domElements.gameBoard,
        this.enemiesInterval * 2,
        "enemy--two",
        "explosion"
      );
    } else if (randomNumber % 7 === 0) {
      this.createNewEnemy(
        this.domElements.player,
        this.domElements.gameBoard,
        this.enemiesInterval,
        "ufo",
        "explosion--big",
        2
      );
    } else if (randomNumber % 9 === 0 && this.level === 2) {
      this.createNewEnemy(
        this.domElements.player,
        this.domElements.gameBoard,
        this.enemiesInterval * 5,
        "monster",
        "explosion--big",
        3
      );
    } else {
      this.createNewEnemy(
        this.domElements.player,
        this.domElements.gameBoard,
        this.enemiesInterval,
        "enemy",
        "explosion"
      );
    }
  }

  createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.enemies.push(enemy);
  }

  checkPosition() {
    this.enemies.forEach((enemy, enemyIndex, enemiesArr) => {
      const enemyPosition = {
        top: enemy.enemyElement.offsetTop,
        right: enemy.enemyElement.offsetLeft + enemy.enemyElement.offsetWidth,
        bottom: enemy.enemyElement.offsetTop + enemy.enemyElement.offsetHeight,
        left: enemy.enemyElement.offsetLeft,
      };
      if (
        enemyPosition.top > window.innerHeight ||
        enemyPosition.left > innerWidth
      ) {
        enemy.removeEnemy();
        enemiesArr.splice(enemyIndex, 1);
      }

      if (
        enemyPosition.bottom >= this.domElements.player.offsetTop + this.domElements.player.offsetHeight/2  &&
        enemyPosition.top <=
          this.domElements.player.offsetTop +
            this.domElements.player.offsetHeight/2 &&
        enemyPosition.right >=
          this.domElements.player.offsetLeft + this.domElements.player.offsetWidth/2 &&
        enemyPosition.left <= this.domElements.player.offsetLeft + this.domElements.player.offsetWidth/2
      ) {
        enemy.removeEnemy();
        enemiesArr.splice(enemyIndex, 1);
        this.updateLives();
      }

      this.character.bullets.forEach((bullet, bulletIndex, bulletArr) => {
        const bulletPosition = {
          top: bullet.elementBullet.offsetTop,
          right:
            bullet.elementBullet.offsetLeft + bullet.elementBullet.offsetWidth,
          bottom:
            bullet.elementBullet.offsetTop + bullet.elementBullet.offsetHeight,
          left: bullet.elementBullet.offsetLeft,
        };
        if (
          bulletPosition.bottom >= enemyPosition.top &&
          bulletPosition.top <= enemyPosition.bottom &&
          bulletPosition.right >= enemyPosition.left &&
          bulletPosition.left <= enemyPosition.right
        ) {
          enemy.hit();

          if (enemy.enemyElement.classList.contains("ufo")) {
            enemy.atack();
          }

          if (!enemy.lives) {
            enemiesArr.splice(enemyIndex, 1);
          }
          bullet.remove();
          bulletArr.splice(bulletIndex, 1);
          this.updateScore();
        }

        if (
          bulletPosition.bottom < 0 ||
          bulletPosition.bottom > window.innerHeight ||
          bulletPosition.left < 0 ||
          bulletPosition.left > window.innerWidth
        ) {
          bullet.remove();
          bulletArr.splice(bulletIndex, 1);
        }
      });
    });
  }

  updateScore() {
    this.score++;
    if (!(this.score % 5)) {
      this.enemiesInterval--;
    }
    this.updateScoreText();
    this.updateLevel();
  }

  updateLives() {
    this.lives--;
    this.updateLivesText();
    this.domElements.gameBoard.classList.add("hit");
    setTimeout(() => this.domElements.gameBoard.classList.remove("hit"), 100);
    
    if (!this.lives) {
      this.endGame();
    }
  }

  updateLevel() {
    if (this.score === 5) {
      this.enemies.forEach((enemy) => enemy.removeEnemy());
      this.enemies.length = 0;
      clearInterval(this.createEnemyInterval);
      clearInterval(this.checkPositionInterval);
      this.level++;
      this.domElements.modalLevel.classList.remove("hide");
      setTimeout(() => this.domElements.modalLevel.classList.add("hide"), 1000);
      this.domElements.level.textContent = `Level: ${this.level}`;
      this.startNextLevel();
    }

    if (this.score === 20) {
      this.endGame();
      this.domElements.modalText.textContent = `You Won!`;
    }
  }

  updateScoreText() {
    this.domElements.score.textContent = `Score: ${this.score}`;
  }

  updateLivesText() {
    this.domElements.lives.textContent = `Lives: ${this.lives}`;
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
