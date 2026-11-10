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

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, addMark, printBoard };
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

    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn!`)
    };

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("Can't place a marker there!");
            return;
        }

        console.log(`Placing ${getActivePlayer().name}'s mark into row ${row + 1} column ${column + 1}`);
        board.addMark(row, column, getActivePlayer().mark); 

        // Win condition logic

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();
game.playRound(1, 1);