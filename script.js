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

    const printBoard = () => {
        console.log(getBoardWithCellValues());
    };

    return { getBoard, addMark, printBoard, getBoardWithCellValues };
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
        console.log(`${getActivePlayer().name}'s turn!`)
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    const playRound = (row, column) => {
        if (!playersCanPlay) {
            console.log("Oops, no more tries allowed");
            return;
        };

        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("Can't place a marker there!");
            return;
        }

        console.log(`Placing ${getActivePlayer().name}'s mark into row ${row + 1} column ${column + 1}`);
        board.addMark(row, column, getActivePlayer().mark);

        if (playerHasWon(getActivePlayer().mark)) {
            printNewRound();
            console.log(`${getActivePlayer().name} wins!`);
            playersCanPlay = false;
            return;
        };

        printNewRound();
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
        playRound,
        getActivePlayer,
        playerHasWon,
        getBoard
    };
}

function screenController () {
    const game = GameController();
    const playerTurnDiv = document.getElementById("turn");
    const boardDiv = document.getElementById("board");

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

    function clickHandlerBoard (e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

screenController();