document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let gameSettings = { game: null, mode: null, difficulty: null };
    let activeGame = { board: [], currentPlayer: 'X', isGameActive: false };

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const boardContainer = document.getElementById('game-board-container');
    const statusText = document.getElementById('status-text');

    // --- Screen Management ---
    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.toggle('hidden', screen.id !== screenId));
    }

    // --- Game Initialization ---
    function startGame() {
        if (gameSettings.game === 'tictactoe') {
            setupTicTacToe();
        } else if (gameSettings.game === 'connect4') {
            setupConnect4(); // Fixed the syntax error here
        }
        showScreen('screen-game');
    }

    // --- Tic-Tac-Toe Section ---
    function setupTicTacToe() {
        createTicTacToeBoard(boardContainer);
        activeGame.board = Array(9).fill('');
        activeGame.currentPlayer = 'X';
        activeGame.isGameActive = true;
        statusText.textContent = `${activeGame.currentPlayer}'s Turn`;
        document.querySelectorAll('.tictactoe-cell').forEach(cell => cell.addEventListener('click', handleTicTacToeMove));
    }

    function handleTicTacToeMove(event) {
        const cellIndex = parseInt(event.target.dataset.index);
        if (activeGame.board[cellIndex] !== '' || !activeGame.isGameActive || (gameSettings.mode === 'pva' && activeGame.currentPlayer === 'O')) return;

        makeTicTacToeMove(cellIndex, activeGame.currentPlayer);
        if (checkTicTacToeResult()) return;
        switchPlayer();

        if (gameSettings.mode === 'pva' && activeGame.currentPlayer === 'O' && activeGame.isGameActive) {
            boardContainer.style.pointerEvents = 'none';
            setTimeout(() => {
                const aiMoveIndex = getAIMove(activeGame.board, gameSettings.difficulty);
                makeTicTacToeMove(aiMoveIndex, activeGame.currentPlayer);
                if (!checkTicTacToeResult()) switchPlayer();
                boardContainer.style.pointerEvents = 'auto';
            }, 500);
        }
    }

    function makeTicTacToeMove(index, player) {
        activeGame.board[index] = player;
        document.querySelector(`.tictactoe-cell[data-index='${index}']`).classList.add(player.toLowerCase());
    }

    function checkTicTacToeResult() {
        if (checkWinner(activeGame.board, activeGame.currentPlayer)) {
            statusText.textContent = `${activeGame.currentPlayer} Wins!`;
            activeGame.isGameActive = false; return true;
        }
        if (!activeGame.board.includes('')) {
            statusText.textContent = 'Draw!';
            activeGame.isGameActive = false; return true;
        }
        return false;
    }

    // --- Connect 4 Section ---
    function setupConnect4() {
        createConnect4Board(boardContainer);
        activeGame.board = Array(C4_ROWS).fill(null).map(() => Array(C4_COLS).fill(''));
        activeGame.currentPlayer = 'R'; // R for Red
        activeGame.isGameActive = true;
        statusText.textContent = `Red's Turn`;
        boardContainer.querySelector('.connect4-board').addEventListener('click', handleConnect4Move);
    }

    function handleConnect4Move(event) {
        if (!activeGame.isGameActive || !event.target.matches('.connect4-cell') || (gameSettings.mode === 'pva' && activeGame.currentPlayer === 'Y')) return;

        const col = parseInt(event.target.dataset.col);
        const row = findLowestEmptyRow(col, activeGame.board);

        if (row === -1) return; // Column is full

        makeConnect4Move(row, col, activeGame.currentPlayer);
        if (checkConnect4Result()) return;
        switchPlayer();

        // AI's turn for Connect 4
        if (gameSettings.mode === 'pva' && activeGame.currentPlayer === 'Y' && activeGame.isGameActive) {
            boardContainer.style.pointerEvents = 'none';
            setTimeout(() => {
                const aiMoveCol = getConnect4AIMove(activeGame.board, gameSettings.difficulty);
                const aiMoveRow = findLowestEmptyRow(aiMoveCol, activeGame.board);
                if (aiMoveRow !== -1) {
                    makeConnect4Move(aiMoveRow, aiMoveCol, activeGame.currentPlayer);
                    if (!checkConnect4Result()) switchPlayer();
                }
                boardContainer.style.pointerEvents = 'auto';
            }, 500);
        }
    }

    function makeConnect4Move(row, col, player) {
        activeGame.board[row][col] = player;
        const color = player === 'R' ? 'red' : 'yellow';
        document.querySelector(`.connect4-cell[data-row='${row}'][data-col='${col}']`).classList.add(color);
    }

    function checkConnect4Result() {
        if (checkConnect4Win(activeGame.board, activeGame.currentPlayer)) {
            const winner = activeGame.currentPlayer === 'R' ? 'Red' : 'Yellow';
            statusText.textContent = `${winner} Wins!`;
            activeGame.isGameActive = false; return true;
        }
        if (activeGame.board[0].every(cell => cell !== '')) {
            statusText.textContent = 'Draw!';
            activeGame.isGameActive = false; return true;
        }
        return false;
    }

    // --- Shared Game Logic ---
    function switchPlayer() {
        if (gameSettings.game === 'tictactoe') {
            activeGame.currentPlayer = activeGame.currentPlayer === 'X' ? 'O' : 'X';
            statusText.textContent = `${activeGame.currentPlayer}'s Turn`;
        } else if (gameSettings.game === 'connect4') {
            activeGame.currentPlayer = activeGame.currentPlayer === 'R' ? 'Y' : 'R';
            const nextPlayer = activeGame.currentPlayer === 'R' ? 'Red' : 'Yellow';
            statusText.textContent = `${nextPlayer}'s Turn`;
        }
    }

    // --- Menu Navigation Event Listener ---
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.matches('[data-game]')) {
            gameSettings.game = target.dataset.game;
            document.querySelectorAll('#platform-title, #mode-title, #difficulty-title').forEach(el => {
                el.textContent = gameSettings.game === 'tictactoe' ? 'Tic-Tac-Toe' : 'Connect 4';
            });
            showScreen('screen-platform');
        }
        if (target.id === 'play-online-btn') showScreen('screen-mode');
        if (target.matches('[data-mode]')) {
            gameSettings.mode = target.dataset.mode;
            if (gameSettings.mode === 'pvp') startGame(); else showScreen('screen-difficulty');
        }
        if (target.matches('[data-difficulty]')) {
            gameSettings.difficulty = target.dataset.difficulty;
            startGame();
        }
        if (target.id === 'restart-game-btn') startGame();
        if (target.id === 'main-menu-btn') showScreen('screen-welcome');
        if (target.id === 'game-back-btn') {
            if (gameSettings.mode === 'pva') showScreen('screen-difficulty'); else showScreen('screen-mode');
        }
        if (target.matches('.back-button')) showScreen(target.dataset.target);
    });

    // --- Initial Setup ---
    showScreen('screen-welcome');
});