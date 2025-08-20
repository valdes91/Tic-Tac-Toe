function Gameboard() {
	const board = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];

	const getBoard = () => board;

	const setBoard = (mark, row, col) => {
		if (board[row][col] === null) {
			board[row][col] = mark;
			return true;
		} else {
			console.log(`the element at row ${row} col ${col} is ${board[row][col]}`);
			return false;
		}
	};

	const printBoard = () => {
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

	const initialPlayer = 0;
	let activePlayer = players[initialPlayer];

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const playTurn = (row, col) => {
		const currentPlayer = getActivePlayer();
		console.log(`${currentPlayer.getMark()}'s Turn...`);
		// check for legal move
		if (board.setBoard(currentPlayer.getMark(), row, col)) {
			// check for winning patterns or ties

			switchPlayer();
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
