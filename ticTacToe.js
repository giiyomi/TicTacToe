const main = document.getElementById("bricks");
const boxes = document.getElementById("boxes");
const piecesDiv = document.querySelectorAll("#pieces div");
const homePage = document.getElementById("homePage");
const footer = document.getElementById("footer");
const pieceWin = document.getElementById("youWin");
const reviewP = document.querySelector("#review p");
const restartP = document.querySelector("#restart p");
const reviewSteps = document.getElementById("reviewSteps");
const undo = document.getElementById("undo");
const redo = document.getElementById("redo");
const reset = document.getElementById("reset");
let playerX = true;
let isBoardClickable = true;
let round = 1;

piecesDiv.forEach(pieceDiv => {

    pieceDiv.addEventListener("click", (piece) => {
        console.log(`Round ${round++}`)
        if (piece.target.id === "xPiece") {
            playerX = true;
            homePage.style.display = "none";
            reviewSteps.style.display = "none"
            main.style.display = "flex";
        } else if (piece.target.id === "oPiece") {
            playerX = false;
            homePage.style.display = "none";
            reviewSteps.style.display = "none"
            main.style.display = "flex";
        }
    });
});

let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let gameState = [];

for (let box = 0; box < 9; box++) {
    let boxDiv = document.createElement("div");
    boxes.appendChild(boxDiv);
    boxDiv.setAttribute("id", `id${box}`);
    boxDiv.addEventListener("click", boxClickHandler);
}

function boxClickHandler() {
    const boxDiv = this;
    const box = parseInt(boxDiv.id.slice(2));
    
    if (!checkWin() && boxDiv.innerHTML.trim() === "") {
        if (playerX) {
            boxDiv.textContent = "X";
            playerX = false;
        } else {
            boxDiv.textContent = "O";
            playerX = true;
        }
        updateGameBoard(boxDiv, box);

        const winner = checkWin();
        if (winner) {
            console.log(`Player ${winner} wins!`);
            disableBoxClicks();

            footer.style.display = "flex";
            pieceWin.innerHTML = `Player ${winner} wins!`;
        } else if (checkDraw()) {
            console.log("It's a draw!");
            disableBoxClicks();
            footer.style.display = "flex";
            pieceWin.innerHTML = "It's a draw!";
        }
    }
}

reviewP.addEventListener("click", () => {
    footer.style.transition = "2s";
    footer.style.display = "none";
    reviewSteps.style.display = "flex"
    
});

function updateGameBoard(boxDiv, box) {
    let row = Math.floor(box / 3);
    let column = box % 3;

    gameBoard[row][column] = boxDiv.innerHTML;

    let boardCopy = [];
    for (let i = 0; i < gameBoard.length; i++) {
        const row = [];
        for (let j = 0; j < gameBoard.length; j++) {
            row.push(gameBoard[i][j]);
        }
        boardCopy.push(row);
    }
    gameState.push(boardCopy);
    console.log(gameBoard)
}

function disableBoxClicks() {
    piecesDiv.forEach(boxDiv => {
        boxDiv.removeEventListener("click", boxClickHandler);
    });
}

function checkWin() {
    const Combinations = [
        [[0, 0], [0, 1], [0, 2]], // Horizontal
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], // Vertical
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], // Diagonal
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let combination of Combinations) {
        const [a, b, c] = combination;
        const [firstArray, firstItem] = a;
        const [secondArray, secondItem] = b;
        const [thirdArray, thirdItem] = c;

        if (
            gameBoard[firstArray][firstItem] !== "" &&
            gameBoard[firstArray][firstItem] === gameBoard[secondArray][secondItem] &&
            gameBoard[firstArray][firstItem] === gameBoard[thirdArray][thirdItem]
        ) {return gameBoard[firstArray][firstItem]}
    }
    return null;
}

function checkDraw() {
    for (let row = 0; row < gameBoard.length; row++) {
        for (let col = 0; col < gameBoard[row].length; col++) {
            if (gameBoard[row][col] === "") {
                return false;
            }
        }
    }
    return true;
}

restartP.addEventListener("click", function () {
    location.reload()
})

const backTrack = [];

undo.addEventListener("click", function () {
    console.log(gameBoard)
    if (gameState.length > 1) {
        const lastMove = gameState.pop();
        backTrack.push(lastMove);
        const previousMove = gameState[gameState.length - 1];

        for (let i = 0; i < previousMove.length; i++) {
            for (let j = 0; j < previousMove[i].length; j++) {
                const boxDiv = document.getElementById(`id${3 * i + j}`);
                boxDiv.textContent = previousMove[i][j];
                gameBoard[i][j] = previousMove[i][j];
                boxDiv.removeEventListener("click", boxClickHandler);
            }
        }
    }
})

redo.addEventListener("click", function () {
    console.log(gameBoard)
    if (backTrack.length > 0) {
        const nextMove = backTrack.pop();
        gameState.push(nextMove);
        const currentMove = gameState[gameState.length - 1];

        for (let i = 0; i < currentMove.length; i++) {
            for (let j = 0; j < currentMove[i].length; j++) {
                const boxDiv = document.getElementById(`id${3 * i + j}`);
                boxDiv.textContent = currentMove[i][j];
                gameBoard[i][j] = currentMove[i][j];

                boxDiv.removeEventListener("click", boxClickHandler);
            }
        }
    }
})

reset.addEventListener("click", function () {

    playerX = true;
    gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    gameState = [];

    const boxDivs = document.querySelectorAll("#boxes div");
    boxDivs.forEach(boxDiv => {
        boxDiv.textContent = "";
    });

    boxDivs.forEach(boxDiv => {
        boxDiv.removeEventListener("click", boxClickHandler);
        boxDiv.addEventListener("click", boxClickHandler);
    });

    footer.style.display = "none";
    homePage.style.display = "flex";
    piecesDiv.forEach(pieceDiv => {
        pieceDiv.style.display = "block";
    });
});
