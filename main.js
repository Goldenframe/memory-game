const levels = {
  easy: { pairs: 8, attempts: 10 },
  medium: { pairs: 16, attempts: 12 },
  hard: { pairs: 24, attempts: 14 },
};

const board = document.querySelector(".tiles");
const attemptCount = document.querySelector(".attempt-count");
const status = document.querySelector(".game-status");
const levelButtons = document.querySelectorAll("[data-level]");

let level = "easy";
let attempts;
let matchedPairs;
let openTiles;
let revealTimer;
let gameOver;

function shuffledDeck(pairs) {
  const values = Array.from({ length: pairs }, (_, index) => index + 1);
  const deck = [...values, ...values];

  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }

  return deck;
}

function startGame(nextLevel) {
  clearTimeout(revealTimer);
  level = nextLevel;
  const settings = levels[level];
  attempts = settings.attempts;
  matchedPairs = 0;
  openTiles = [];
  gameOver = false;
  attemptCount.textContent = attempts;
  status.textContent = "";

  for (const button of levelButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.level === level));
  }

  const tiles = shuffledDeck(settings.pairs).map((value, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile";
    button.textContent = value;
    button.setAttribute("aria-label", "Card " + (index + 1) + ", face down");

    const tile = { button, value, number: index + 1, matched: false };
    button.addEventListener("click", () => openTile(tile));
    return button;
  });

  board.replaceChildren(...tiles);
}

function openTile(tile) {
  if (gameOver || tile.matched || openTiles.includes(tile) || openTiles.length === 2) return;

  tile.button.classList.add("isOpen");
  tile.button.setAttribute("aria-label", "Card " + tile.number + ", value " + tile.value);
  openTiles.push(tile);

  if (openTiles.length === 2) {
    revealTimer = setTimeout(checkPair, 1300);
  }
}

function checkPair() {
  const [first, second] = openTiles;
  const matched = first.value === second.value;

  for (const tile of openTiles) {
    tile.button.classList.remove("isOpen");
    if (matched) {
      tile.matched = true;
      tile.button.classList.add("foundDouble");
      tile.button.setAttribute("aria-disabled", "true");
      tile.button.setAttribute("aria-label", "Matched card, value " + tile.value);
    } else {
      tile.button.setAttribute("aria-label", "Card " + tile.number + ", face down");
    }
  }
  openTiles = [];

  if (matched) {
    matchedPairs++;
    if (matchedPairs === levels[level].pairs) {
      gameOver = true;
      status.textContent = "You won!";
    }
  } else {
    attempts--;
    attemptCount.textContent = attempts;
    if (attempts === 0) {
      gameOver = true;
      status.textContent = "No attempts left. Start a new game to try again.";
    }
  }
}

for (const button of levelButtons) {
  button.addEventListener("click", () => startGame(button.dataset.level));
}
document.querySelector(".reset-btn").addEventListener("click", () => startGame(level));

startGame(level);
