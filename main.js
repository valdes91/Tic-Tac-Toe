function Gameboard() {
	const board = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];

	const getBoard = () => board;

	const setBoard = (mark, row, col) => {
		if (board[row][col] === null) {
			console.log(`player places ${mark} on row ${row}, column ${col}:`);
			board[row][col] = mark;
			return true;
		} else {
			console.log(`the element at row ${row} col ${col} is ${board[row][col]}`);
			return false;
		}
	};

	const printBoard = () => {
		console.log('Current board:');
		board.forEach((row) => {
			console.log(row);
		});
	};
	return { getBoard, setBoard, printBoard };
}

function createPlayer(playerMark) {
	const mark = playerMark;
	const getMark = () => mark;

	return { getMark };
}

function GameController() {
	const board = Gameboard();
	const players = [createPlayer('X'), createPlayer('O')];
	const gameOn = true;

	const initialPlayer = 0;
	let activePlayer = players[initialPlayer];

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const hasWon = (player, row, col) => {
		const playerMark = player.getMark();
		const currentBoard = board.getBoard();

		// check played row for win
		const playedRow = currentBoard[row];
		const isWinningRow = playedRow.every((cell) => cell === playerMark);

		// check played column for win
		let isWinningColumn = true;
		for (let i = 0; i < currentBoard.length; i++) {
			if (currentBoard[i][col] !== playerMark) {
				isWinningColumn = false;
			}
		}

		// check diagonals for win
		const diagonal = [currentBoard[0][0], currentBoard[1][1], currentBoard[2][2]];
		const antidiagonal = [currentBoard[0][2], currentBoard[1][1], currentBoard[2][0]];
		const isWinningDiagonal =
			diagonal.every((cell) => cell === playerMark) ||
			antidiagonal.every((cell) => cell === playerMark);

		if (isWinningRow || isWinningColumn || isWinningDiagonal) {
			isWin = true;
		}

		return isWin;
	};

	const hasTied = () => {
		const currentBoard = board.getBoard();
		const remainingCells = [];
		currentBoard.forEach((row) => {
			row.forEach((cell) => {
				if (cell === null) remainingCells.push(cell);
			});
		});
		const isTie = remainingCells.length === 0 ? true : false;
		return isTie;
	};

	const playTurn = (row, col) => {
		const currentPlayer = getActivePlayer();
		console.log(`${currentPlayer.getMark()}'s Turn...`);
		// check for legal move
		if (board.setBoard(currentPlayer.getMark(), row, col)) {
			// check for winning patterns or ties
			if (hasWon(currentPlayer, row, col)) {
				// end game
				console.log(`conditions are met for a win by ${currentPlayer.getMark()}`);
			} else if (hasTied()) {
				console.log('conditions are met for a tie');
			} else {
				console.log('no win or tie, continue playing...');
				switchPlayer();
			}
		} else {
			console.log('invalid move, try again.');
		}
		board.printBoard();
	};

	//initial render to console
	board.printBoard();

	return { playTurn, getActivePlayer };
}

const game = GameController();
game.playTurn(0, 0);
game.playTurn(0, 2);
game.playTurn(0, 1);
game.playTurn(1, 0);
game.playTurn(1, 2);
game.playTurn(1, 1);
game.playTurn(2, 0);
game.playTurn(2, 2);
game.playTurn(2, 1);
