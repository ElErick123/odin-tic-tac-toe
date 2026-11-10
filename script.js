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
    const board = Gameboard();

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
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("Can't place a marker there!");
            return;
        }

        console.log(`Placing ${getActivePlayer().name}'s mark into row ${row + 1} column ${column + 1}`);
        board.addMark(row, column, getActivePlayer().mark);

        if (playerHasWon(getActivePlayer().mark)) {
            printNewRound();
            console.log(`${getActivePlayer().name} wins!`);
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
        playerHasWon
    };
}

const game = GameController();
game.playRound(0, 0);
game.playRound(1, 2);
game.playRound(1, 1);
game.playRound(2, 1);
game.playRound(2, 2);