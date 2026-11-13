function Gameboard () {
    const ROWS = 3;
    const COLUMNS = 3;
    const board = [];

    for (let i = 0; i < ROWS ; i++) {
        board[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            board[i].push(Cell())   
        }
    }

    const getBoard = () => board;

    const addMark = (row, column, player) => {
        if (board[row][column].getValue() !== 0) return;

        board[row][column].addMark(player);
    };

    const clearBoard = () => {
        board.forEach(row => {
            row.forEach(cell => {
                cell.restartValue();
            });
        });
    };

    const getBoardWithCellValues = () => {
        return board.map((row) => row.map((cell) => cell.getValue()));
    };

    return { getBoard, addMark, clearBoard, getBoardWithCellValues };
}

function Cell () {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    const restartValue = () => value = 0;

    return {
        addMark,
        getValue,
        restartValue
    };
}

function GameController (playerOneName, playerTwoName) {
    let playersCanPlay = true;

    const getPlayersCanPlay = () => playersCanPlay;

    const board = Gameboard();

    const getBoard = () => board.getBoard();

    const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

    const players = [
        {
            name: playerOneName,
            mark: 1
        },
        {
            name: playerTwoName,
            mark: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const restartGame = () => {
        board.clearBoard();
        activePlayer = players[0];
        playersCanPlay = true;
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (!playersCanPlay) {
            return;
        };

        if (board.getBoard()[row][column].getValue() !== 0) {
            screenController.showMessage("Can't place a marker there!");
            return;
        }

        board.addMark(row, column, getActivePlayer().mark);

        if (playerHasWon(getActivePlayer().mark)) {
            screenController.showMessage(`${getActivePlayer().name} wins!`);
            playersCanPlay = false;
            return;
        };
        switchPlayerTurn();
    };

    const playerHasWon = (player) => {
        const linearBoard = board.getBoardWithCellValues().flat();
        
        const playerMarks = [];

        linearBoard.forEach((value, index) => {
            if (value === player) {
                playerMarks.push(index);
            }
        });

        return winningCombinations.some(combination =>
            combination.every(position => playerMarks.includes(position))
        );
    };

    return {
        getPlayersCanPlay,
        playRound,
        restartGame,
        getActivePlayer,
        playerHasWon,
        getBoard
    };
}

const screenController = (function screenController () {
    let game = undefined;
    const playerTurnDiv = document.getElementById("turn");
    const boardDiv = document.getElementById("board");
    const messageDiv = document.getElementById("message");

    const initializeGame = (playerOneName, playerTwoName) => {
        game = GameController(playerOneName || "Player One", playerTwoName || "Player Two");
    };

    const getCurrentGame = () => game;

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn!`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = cellIndex;
                cellButton.textContent = ["", "X", "O"][cell.getValue()];
                cellButton.style.color = cellButton.textContent === "X" ? "#E83D65" : "#0799E8";
                boardDiv.appendChild(cellButton);
            });
        });
    };

    const clearDisplay = () => messageDiv.textContent = "";

    const clickHandlerBoard = (e) => {
        if (!game.getPlayersCanPlay()) return;

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow === undefined || selectedColumn === undefined) return;

        clearDisplay();
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    };

    const showMessage = (message) => {
        messageDiv.textContent = message;
    };

    boardDiv.addEventListener("click", clickHandlerBoard);

    return {
        initializeGame,
        getCurrentGame,
        updateScreen,
        clearDisplay,
        showMessage
    };
})();

(function UIController () {
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const startGameModal = document.getElementById("start-game-modal");
    const startGameButton = document.getElementById("start-game-button");
    const playerOneInput = document.getElementById("player-one-name");
    const playerTwoInput = document.getElementById("player-two-name");
    let game = undefined;

    const restartGame = () => {
        if (game === undefined) return;

        game.restartGame();
        screenController.clearDisplay();
        screenController.updateScreen();
    };

    const startModal = () => {
        startGameModal.showModal();
        playerOneInput.value = "";
        playerTwoInput.value = "";
    };

    const startGame = (e) => {
        e.preventDefault();
        startGameModal.close();
        screenController.initializeGame(playerOneInput.value, playerTwoInput.value);
        screenController.clearDisplay();
        screenController.updateScreen();
        game = screenController.getCurrentGame();
    };

    restartButton.addEventListener("click", restartGame);
    startButton.addEventListener("click", startModal);
    startGameButton.addEventListener("click", startGame);
    startGameModal.addEventListener("click", (e) => {
        if (e.target !== startGameModal) return;
        
        startGameModal.close();
    });
})();