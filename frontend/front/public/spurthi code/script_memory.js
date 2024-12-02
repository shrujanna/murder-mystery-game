class AudioController {
  constructor() {
    this.bgMusic = new Audio("assets/audio/mystery-music-loop-226835.mp3");
    this.flipSound = new Audio("assets/audio/flip.wav");
    this.matchSound = new Audio("assets/audio/match.wav");
    this.victorySound = new Audio("assets/audio/victory.wav");
    this.gameOverSound = new Audio("assets/audio/gameOver.wav");
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class MixorMax {
  constructor(totaltime, cards) {
    this.cardsArray = cards;
    this.totaltime = totaltime;
    this.timeremaining = totaltime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips");
    this.audioController = new AudioController();
  }

  startGame() {
    this.cardtoCheck = null;
    this.totalclicks = 0;
    this.timeremaining = this.totaltime;
    this.matchedcards = [];
    this.busy = true;

    this.hidecards();

    setTimeout(() => {
      this.audioController.startMusic();
      this.shufflecard();
      this.countdown = this.startcountdown();
      this.busy = false;
    }, 500);

    this.timer.innerText = this.timeremaining;
    this.ticker.innerHTML = this.totalclicks;
  }

  hidecards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }

  flipcard(card) {
    if (this.canflipcard(card)) {
      this.audioController.flip();
      this.totalclicks++;
      this.ticker.innerText = this.totalclicks;
      card.classList.add("visible");

      if (this.cardtoCheck) {
        this.checkforcardmatch(card);
      } else {
        this.cardtoCheck = card;
      }
    }
  }

  checkforcardmatch(card) {
    if (this.getcardtype(card) === this.getcardtype(this.cardtoCheck)) {
      this.cardmatch(card, this.cardtoCheck);
    } else {
      this.cardmismatch(card, this.cardtoCheck);
    }
    this.cardtoCheck = null;
  }

  cardmatch(card1, card2) {
    this.matchedcards.push(card1);
    this.matchedcards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();

    if (this.matchedcards.length === this.cardsArray.length) {
      this.victory();
    }
  }

  cardmismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 500);
  }

  getcardtype(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }

  startcountdown() {
    return setInterval(() => {
      this.timeremaining--;
      this.timer.innerHTML = this.timeremaining;
      if (this.timeremaining === 0) {
        this.gameover();
      }
    }, 1000);
  }

  gameover() {
    clearInterval(this.countdown);
    document.getElementById("game-over-text").classList.add("visible");
    this.audioController.gameOver();
  }

  victory() {
    clearInterval(this.countdown);
    document.getElementById("victory-text").classList.add("visible");
    this.audioController.victory();
  }

  shufflecard() {
    this.cardsArray.forEach((card) => {
      let randomIndex = Math.floor(Math.random() * this.cardsArray.length);
      card.style.order = randomIndex;
    });
  }

  canflipcard(card) {
    return (
      !this.busy &&
      !this.matchedcards.includes(card) &&
      card !== this.cardtoCheck
    );
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName("overlay-text"));
  let cards = Array.from(document.getElementsByClassName("card"));
  let game = new MixorMax(100, cards);

  // Add click listener to overlays
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      game.startGame();
    });
  });

  // Click listener for cards
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      game.flipcard(card);
    });
  });

  // Game over and victory overlays lead to new pages
  let gameOverText = document.getElementById("game-over-text");
  let victoryText = document.getElementById("victory-text");

  if (gameOverText) {
    gameOverText.addEventListener("click", () => {
      console.log("Game Over Overlay clicked!"); // Debug log
      window.location.href = "youlose.html"; // Redirect to Game Over page
    });
  }

  if (victoryText) {
    victoryText.addEventListener("click", () => {
      console.log("Victory Overlay clicked!"); // Debug log
      window.location.href = "level3.html"; // Redirect to Victory page
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
