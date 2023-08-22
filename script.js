const displayController = (() =>
{
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }

    return {
        renderMessage
    }
})();

const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const render = () => {
        let boardHTML = "";
        board.forEach((tile, i) => {
            boardHTML += `<div class="tile" id="tile-${i}">${tile}</div>`;
        })
        document.querySelector("#board").innerHTML = boardHTML;
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach((tiles) => {
            tiles.addEventListener("click", game.handleClick);
        })
    }
    
    const update = (i, value) => {
        board[i] = value;
        render();
    }

    const getBoard = () => board;

    return {
        render,
        update,
        getBoard
    }
})();

const createPlayer = (name, mark) => {
    return {
        name, mark
    }
}

const game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver = false;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"), 
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        gameBoard.render();
    }

    const restart = () => {
        gameOver = false;
        displayController.renderMessage("");
        for(let i = 0; i < 9; i++)
        {
            gameBoard.update(i, "");
            gameBoard.render();
        }
    }

    const handleClick = (e) => {
        if(gameOver)
        {
            return;
        }
        let i = parseInt(e.target.id.split("-")[1]);
        if(gameBoard.getBoard()[i] != "")
            return;
        gameBoard.update(i, players[currentPlayerIndex].mark);
        if(checkForWin(gameBoard.getBoard(), players[currentPlayerIndex].mark))
        {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins!`);
        }
        else if (checkForTie(gameBoard.getBoard()))
        {
            gameOver = true;
            displayController.renderMessage("It's a tie!");
        }
        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0;
    }

    
    return {
        start, 
        restart, 
        handleClick
    }
})();

function checkForWin(board)
{
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for(let i = 0; i < winningCombinations.length; i++)
    {
        const [a, b, c] = winningCombinations[i];
        if(board[a] && board[a] == board[b] && board[a] == board[c])
        {
            return true;
        }
    }
    return false;
}

function checkForTie(board)
{
    return board.every(cell => cell != "");
}

const startBtn = document.querySelector('#start');
startBtn.addEventListener("click", function(e) {
    game.start();
})

const restartBtn = document.querySelector('#restart');
restartBtn.addEventListener("click", function(e) {
    game.restart();
})

