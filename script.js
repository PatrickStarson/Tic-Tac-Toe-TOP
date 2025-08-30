const Gameboard = {
  board: ['', '', '', '', '', '', '', '', ''],

  getBoard() {
    return this.board;
  },

  resetBoard() {
    this.board = ['', '', '', '', '', '', '', '', ''];
  },

  setCell(index, symbol) {
    if (index >= 0 && index < 9 && this.board[index] === '') {
      this.board[index] = symbol;
      return true;
    }
    return false;
  },
};

const Player = (name, symbol) => {
  return { name, symbol };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let isGameOver = false;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const init = (player1Name, player2Name) => {
    players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
    currentPlayerIndex = 0;
    isGameOver = false;
    Gameboard.resetBoard();
    DisplayController.updateBoard();
    DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
  };

  const playTurn = (index) => {
    if (isGameOver || !Gameboard.setCell(index, players[currentPlayerIndex].symbol)) {
      return;
    }
    DisplayController.updateBoard();
    if (checkWin()) {
      isGameOver = true;
      DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
    } else if (checkDraw()) {
      isGameOver = true;
      DisplayController.setMessage("It's a draw!");
    } else {
      currentPlayerIndex = 1 - currentPlayerIndex;
      DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    return winningCombinations.some(combination =>
      combination.every(index => board[index] === players[currentPlayerIndex].symbol)
    );
  };

  const checkDraw = () => {
    return Gameboard.getBoard().every(cell => cell !== '');
  };

  return { init, playTurn };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const messageElement = document.getElementById('message');
  const startButton = document.getElementById('startButton');
  const player1Input = document.getElementById('player1');
  const player2Input = document.getElementById('player2');

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      Game.playTurn(index);
    });
  });

  startButton.addEventListener('click', () => {
    const player1Name = player1Input.value || 'Player 1';
    const player2Name = player2Input.value || 'Player 2';
    Game.init(player1Name, player2Name);
  });

  const updateBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const setMessage = (message) => {
    messageElement.textContent = message;
  };

  return { updateBoard, setMessage };
})();

// Initial setup
DisplayController.setMessage("Enter player names and click 'Start Game'");  