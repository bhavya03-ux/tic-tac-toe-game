const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const message = document.getElementById("winningMessage");
const messageText = document.getElementById("messageText");
const restartButton = document.getElementById("restartButton");

let isCircleTurn = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  isCircleTurn = false;
  cells.forEach(cell => {
    cell.classList.remove("x", "o");
    cell.textContent = "";
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  message.style.display = "none";
}

function handleClick(e) {
  const cell = e.target;
  placeMark(cell, "x");

  if (checkWin("x")) {
    endGame(false, "X");
    return;
  } else if (isDraw()) {
    endGame(true);
    return;
  }

  // Computer's turn
  const bestMove = getBestMove();
  placeMark(cells[bestMove], "o");

  if (checkWin("o")) {
    endGame(false, "O");
  } else if (isDraw()) {
    endGame(true);
  }
}

function placeMark(cell, mark) {
  cell.classList.add(mark);
  cell.textContent = mark.toUpperCase();
  cell.removeEventListener("click", handleClick);
}

function checkWin(mark) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => cells[index].classList.contains(mark))
  );
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains("x") || cell.classList.contains("o")
  );
}

function endGame(draw, winner = "") {
  message.style.display = "block";
  messageText.textContent = draw ? "It's a Draw!" : `${winner} Wins!`;
}

// -------------------------
// Minimax Logic Starts Here
// -------------------------

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  cells.forEach((cell, index) => {
    if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
      cell.classList.add("o");
      let score = minimax(cells, 0, false);
      cell.classList.remove("o");
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

function minimax(boardCells, depth, isMaximizing) {
  if (checkWin("o")) return 10 - depth;
  if (checkWin("x")) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    boardCells.forEach((cell, index) => {
      if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
        cell.classList.add("o");
        let score = minimax(boardCells, depth + 1, false);
        cell.classList.remove("o");
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boardCells.forEach((cell, index) => {
      if (!cell.classList.contains("x") && !cell.classList.contains("o")) {
        cell.classList.add("x");
        let score = minimax(boardCells, depth + 1, true);
        cell.classList.remove("x");
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}
