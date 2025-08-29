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

	const resetBoard = () => {
		console.log('resetting board');
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				board[i][j] = null;
			}
		}
		printBoard();
	};
	return { getBoard, setBoard, printBoard, resetBoard };
}

function createPlayer(playerMark) {
	const mark = playerMark;
	let score = 0;
	const incrementScore = () => score++;
	const getMark = () => mark;
	const getScore = () => score;

	return { getMark, getScore, incrementScore };
}

function GameController() {
	const board = Gameboard();
	const players = [createPlayer('X'), createPlayer('O')];
	const initialPlayer = 0;
	let isWin = false;
	let isTie = false;
	let gameOn = true;
	let activePlayer = players[initialPlayer];

	const isGameOn = () => gameOn;

	const reset = () => {
		board.resetBoard();
		isWin = false;
		isTie = false;
		gameOn = true;
	};

	const switchPlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getWin = () => isWin;

	const getTie = () => isTie;

	const getActivePlayer = () => activePlayer;

	const getPlayers = () => players;

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
		isTie = remainingCells.length === 0 ? true : false;
		return isTie;
	};

	const playTurn = (row, col) => {
		if (!gameOn) return;
		const currentPlayer = getActivePlayer();
		console.log(`${currentPlayer.getMark()}'s Turn...`);
		// check for legal move
		if (board.setBoard(currentPlayer.getMark(), row, col)) {
			// check for winning patterns or ties
			if (hasWon(currentPlayer, row, col)) {
				// end game
				console.log(`conditions are met for a win by ${currentPlayer.getMark()}`);
				currentPlayer.incrementScore();
				gameOn = false;
			} else if (hasTied()) {
				console.log('conditions are met for a tie');
				gameOn = false;
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

	return {
		playTurn,
		getActivePlayer,
		getBoard: board.getBoard,
		isGameOn,
		getPlayers,
		getWin,
		getTie,
		reset,
	};
}

function ScreenController() {
	const game = GameController();
	const boardDiv = document.querySelector('.gameboard');
	const turnDisplay = document.querySelector('.turn');
	const scoreCountDiv = document.querySelector('.score-count');
	const resetBtn = document.querySelector('.reset');

	function renderScreen() {
		const activePlayer = game.getActivePlayer();
		const players = game.getPlayers();
		boardDiv.innerHTML = '';
		if (game.getWin()) {
			turnDisplay.textContent = `${activePlayer.getMark()} Wins`;
		} else if (game.getTie()) {
			turnDisplay.textContent = "It's a tie";
		} else {
			turnDisplay.textContent = `${activePlayer.getMark()}'s Turn`;
		}

		scoreCountDiv.textContent = '';
		players.forEach((player, index) => {
			scoreCountDiv.textContent += `Player ${index + 1}: ${player.getScore()}`;
		});

		const currentBoard = game.getBoard();
		// create the game board in the DOM
		currentBoard.forEach((row, rowIndex) => {
			row.forEach((cell, cellIndex) => {
				const cellBtn = document.createElement('button');
				cellBtn.textContent = cell === null ? 'test' : cell;
				cellBtn.classList.add('cell');
				cellBtn.dataset.row = rowIndex;
				cellBtn.dataset.column = cellIndex;
				boardDiv.appendChild(cellBtn);
			});
		});
	}

	function boardClickListener(e) {
		if (e.target.tagName === 'BUTTON') {
			const row = e.target.dataset.row;
			const col = e.target.dataset.column;
			game.playTurn(row, col);
			renderScreen();
		}
	}

	function resetGame(e) {
		game.reset();
		renderScreen();
	}

	resetBtn.addEventListener('click', resetGame);
	boardDiv.addEventListener('click', boardClickListener);

	renderScreen();
}

const screen = ScreenController();
