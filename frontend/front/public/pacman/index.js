const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreEl");
canvas.width = innerWidth - 837;
canvas.height = innerHeight - 10;
let paused = false;

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.openRate = 0.12;
    this.rotation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    c.lineTo(this.position.x, this.position.y);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
    this.radians += this.openRate;
  }
}

class Ghost {
  static speed = 2;
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
    this.scared = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared ? "blue" : this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pellet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position;
    this.radius = 8;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}

const pellets = [];
const boundaries = [];
const powerUps = [];
const ghost = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "pink",
  }),
];
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const keys = {
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

let lastKey = " ";
let score = -10;

const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i,
            },
            image: createImage("./img/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            color: "blue",
            image: createImage("./img/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height,
            },
            image: createImage("./img/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
      case "p":
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

function circlerectcollison({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1;
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
}
let animationID;
function drawPauseMessage() {
  c.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
  c.fillRect(0, 0, canvas.width, canvas.height); // Cover the whole canvas
  c.fillStyle = "white";
  c.font = "40px Arial";
  c.textAlign = "center";
  c.fillText("Paused", canvas.width / 2, canvas.height / 2);
  if (!paused) {
    animationID = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function resume() {}

function animate() {
  if (!paused) {
    animationID = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Player Movement Logic
    if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circlerectcollison({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: -2,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = -2;
        }
      }
    } else if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circlerectcollison({
            circle: {
              ...player,
              velocity: {
                x: -2,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.x = 0;
          break;
        } else {
          player.velocity.x = -2;
        }
      }
    } else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circlerectcollison({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: 2,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.y = 0;
          break;
        } else {
          player.velocity.y = 2;
        }
      }
    } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (
          circlerectcollison({
            circle: {
              ...player,
              velocity: {
                x: 2,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          player.velocity.x = 0;
          break;
        } else {
          player.velocity.x = 2;
        }
      }
    }
    //collision between player and ghosts
    for (let i = ghost.length - 1; i >= 0; i--) {
      const ghos = ghost[i];
      if (
        Math.hypot(
          ghos.position.x - player.position.x,
          ghos.position.y - player.position.y
        ) <
        ghos.radius + player.radius
      ) {
        if (ghos.scared) {
          ghost.splice(i, 1);//just removes it 
        } else {
          cancelAnimationFrame(animationID);
          window.location.replace("../spurthi code/youlose.html");
        }
      }
    }

    //WIN
    if (pellets.length === 0) {
      console.log("you win");
      cancelAnimationFrame(animationID);
      window.location.replace("../spurthi code/youwin.html");
    }

    //powerups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];
      powerUp.draw();
      //when player gets the powerup
      if (
        Math.hypot(
          powerUp.position.x - player.position.x,
          powerUp.position.y - player.position.y
        ) <
        powerUp.radius + player.radius
      ) {
        powerUps.splice(i, 1);
        //scared ghosts
        ghost.forEach((ghost) => {
          ghost.scared = true;
          console.log("SCARED");

          setTimeout(() => {
            ghost.scared = false;
            console.log("SCARED");
          }, 5000);
        });
      }
    }
    // Render Pellets and Handle Collision with Player
    for (let i = pellets.length - 1; i >= 0; i--) {
      const pellet = pellets[i];
      pellet.draw();

      if (
        Math.hypot(
          pellet.position.x - player.position.x,
          pellet.position.y - player.position.y
        ) <
        pellet.radius + player.radius
      ) {
        pellets.splice(i, 1);
        score += 10;
        scoreEl.innerHTML = score;
      }
    }

    // Render Boundaries and Handle Collision with Player
    boundaries.forEach((boundary) => {
      boundary.draw();
      if (circlerectcollison({ circle: player, rectangle: boundary })) {
        player.velocity.x = 0;
        player.velocity.y = 0;
      }
    });

    player.update();

    // Ghost Movement Logic
    ghost.forEach((ghost) => {
      ghost.update();

      const collisions = [];

      boundaries.forEach((boundary) => {
        if (
          !collisions.includes("right") &&
          circlerectcollison({
            circle: {
              ...ghost,
              velocity: { x: ghost.speed, y: 0 },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("right");
        }
        if (
          !collisions.includes("left") &&
          circlerectcollison({
            circle: {
              ...ghost,
              velocity: { x: -ghost.speed, y: 0 },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("left");
        }
        if (
          !collisions.includes("up") &&
          circlerectcollison({
            circle: {
              ...ghost,
              velocity: { x: 0, y: -ghost.speed },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("up");
        }
        if (
          !collisions.includes("down") &&
          circlerectcollison({
            circle: {
              ...ghost,
              velocity: { x: 0, y: ghost.speed },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("down");
        }
      });

      if (collisions.length > ghost.prevCollisions.length) {
        ghost.prevCollisions = collisions;
      }

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        const pathways = ghost.prevCollisions.filter((collision) => {
          return !collisions.includes(collision);
        });

        if (pathways.length > 0) {
          const direction =
            pathways[Math.floor(Math.random() * pathways.length)];

          switch (direction) {
            case "down":
              ghost.velocity.y = ghost.speed;
              ghost.velocity.x = 0;
              break;
            case "up":
              ghost.velocity.y = -ghost.speed;
              ghost.velocity.x = 0;
              break;
            case "left":
              ghost.velocity.x = -ghost.speed;
              ghost.velocity.y = 0;
              break;
            case "right":
              ghost.velocity.x = ghost.speed;
              ghost.velocity.y = 0;
              break;
          }
        }

        ghost.prevCollisions = [];
      }
    });

    if (player.velocity.x > 0) player.rotation = 0;
    else if (player.velocity.x < 0) player.rotation = Math.PI;
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
  } else drawPauseMessage();
}
/* the and and part makes sure no diagonalish movements */
animate();

window.addEventListener("keydown", ({ key }) => {
  setTimeout(() => {
    switch (key) {
      case "Escape":
        paused = !paused;
        if (paused) {
          resume();
        } else {
          drawPauseMessage();
        }
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        lastKey = "ArrowUp";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        lastKey = "ArrowLeft";
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = true;
        lastKey = "ArrowDown";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        lastKey = "ArrowRight";
        break;
    }
  }, 2);
});
