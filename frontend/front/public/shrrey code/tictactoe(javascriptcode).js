let boxes = document.querySelectorAll(".box");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let startBtn = document.querySelector("#start-btn");

let xTurn = true; // True for player X's turn
let count = 0; // To track moves

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start the game
const startGame = () => {
  startBtn.disabled = true; // Disable the Start button
  boxes.forEach((box) => {
    box.disabled = false; // Enable the boxes
    box.innerText = ""; // Clear any previous text
  });
  count = 0;
  xTurn = true; // Reset to player X's turn
  msgContainer.classList.remove("show"); // Hide any messages
  setTimeout(autoPlayO, 500); // Trigger computer's first move (O)
};

// Handle player moves (X)
const onBoxClick = (box) => {
  if (box.innerText !== "" || !xTurn) return; // Ignore if box is already filled or it's not X's turn
  box.innerText = "X"; // Player X places mark
  box.disabled = true; // Disable clicked box
  count++; // Increment move count

  if (checkWinner()) {
    showMessage("YOU WON DETECTIVE!");
    setTimeout(() => {
      window.location.href = "../spurthi code/level2.html";
    }, 1000);
  } else if (count === 9) {
    showMessage("It's a Draw!");
    setTimeout(() => {
      window.location.href = "../spurthi code/youlose.html";
    }, 1000);
  } else {
    xTurn = false; // Switch turn to O (AI)
    setTimeout(autoPlayO, 500); // Trigger computer's turn (O)
  }
};

// Check if there's a winner
const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText === boxes[b].innerText &&
      boxes[a].innerText === boxes[c].innerText &&
      boxes[a].innerText !== ""
    ) {
      return true;
    }
  }
  return false;
};

// Show the result message
const showMessage = (message) => {
  msg.innerText = message;
  msgContainer.classList.add("show");
};

// Automated move for computer (O)
const autoPlayO = () => {
  let availableBoxes = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableBoxes.push(index); // Collect empty boxes
    }
  });

  if (availableBoxes.length > 0) {
    const randomIndex =
      availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
    boxes[randomIndex].innerText = "O"; // Computer places O
    boxes[randomIndex].disabled = true; // Disable box
    count++;

    if (checkWinner()) {
      showMessage("YOU HAVE LOST!");
      setTimeout(() => {
        window.location.href = "../spurthi code/youlose.html";
      }, 1000);
    } else if (count === 9) {
      showMessage("It's a Draw!");
      setTimeout(() => {
        window.location.href = "../spurthi code/youlose.html";
      }, 1000);
    } else {
      xTurn = true; // Switch turn back to player X after AI move
    }
  }
};

// Event listener for Start Game button
startBtn.addEventListener("click", startGame);

// Add event listeners to all the boxes (so they can be clicked during Player X's turn)
boxes.forEach((box) => {
  box.addEventListener("click", (e) => onBoxClick(e.target));
});
