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

    const getBoardWithCellValues = () => {
        return board.map((row) => row.map((cell) => cell.getValue()));
    };

    return { getBoard, addMark, getBoardWithCellValues };
}

function Cell () {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

function GameController (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
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
        getActivePlayer,
        playerHasWon,
        getBoard
    };
}

const screenController = (function screenController () {
    const game = GameController();
    const playerTurnDiv = document.getElementById("turn");
    const boardDiv = document.getElementById("board");
    const messageDiv = document.getElementById("message");

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

    const clickHandlerBoard = (e) => {
        if (!game.getPlayersCanPlay()) return;

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow === undefined || selectedColumn === undefined) return;

        messageDiv.textContent = "";
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    };

    const showMessage = (message) => {
        messageDiv.textContent = message;
    };

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

    return {
        showMessage
    };
})();