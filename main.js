let isEasy = true;
let isMedium = false;
let isHard = false;
let tileItem = [1, 2, 3, 4, 5, 6, 7, 8];

function createTiles() {
  tileItem = isEasy
    ? [1, 2, 3, 4, 5, 6, 7, 8]
    : isMedium
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    : [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24,
      ];

  const tilesItems = [...tileItem, ...tileItem].sort(() => Math.random() - 0.5);

  let openTiles = [];
  let foundDoubles = 0;
  let attempts = isEasy ? 10 : isMedium ? 12 : 14;

  let attemptCount = document.querySelector(".attempt-count");

  attemptCount.innerHTML = attempts;
  document.querySelector(".attempts").appendChild(attemptCount);

  const tilesContainer = document.querySelector(".tiles");

  tilesContainer.innerHTML = "";

  for (let i = 0; i < tilesItems.length; i++) {
    let element = document.createElement("div");
    element.innerHTML = tilesItems[i];
    element.classList.add("tile");
    element.setAttribute("data", tilesItems[i]);

    element.onclick = function () {
      if (openTiles.length < 2) {
        this.classList.add("isOpen");
        openTiles.push(this);
      }

      if (openTiles.length === 2) {
        setTimeout(() => {
          if (
            openTiles[0] &&
            openTiles[1] &&
            openTiles[0].getAttribute("data") ===
              openTiles[1].getAttribute("data")
          ) {
            openTiles.forEach((openTile) => {
              openTile.classList.add("foundDouble");
              openTile.classList.remove("isOpen");
            });
            foundDoubles += 2;
          } else {
            openTiles.forEach((openTile) => {
              openTile.classList.remove("isOpen");
            });
            attempts--;
            attemptCount.innerHTML = attempts;

            console.log(attempts);
            if (attempts === 0) {
              alert("You've lost.");
              window.location.reload();
            }
          }
          openTiles = [];
        }, 1300);
      }
    };
    tilesContainer.appendChild(element);
  }
}

const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener("click", () => {
  window.location.reload();
});

const easyDifficultyBtn = document.getElementById("easy-btn");
const mediumDifficultyBtn = document.getElementById("medium-btn");
const hardDifficultyBtn = document.getElementById("hard-btn");

easyDifficultyBtn.addEventListener("click", () => {
  isEasy = true;
  isMedium = false;
  isHard = false;

  createTiles(); 
});

mediumDifficultyBtn.addEventListener("click", () => {
  isMedium = true;
  isEasy = false;
  isHard = false;

  createTiles(); 
});

hardDifficultyBtn.addEventListener("click", () => {
  isHard = true;
  isEasy = false;
  isMedium = false;

  createTiles(); 
});

window.addEventListener("load", function() {
  createTiles();
});