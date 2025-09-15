// connect4.js - Contains the logic specific to the Connect 4 game.

const C4_ROWS = 6;
const C4_COLS = 7;

function createConnect4Board(container) {
    container.innerHTML = '';
    const board = document.createElement('div');
    board.classList.add('connect4-board');
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c < C4_COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('connect4-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            board.appendChild(cell);
        }
    }
    container.appendChild(board);
}

/**
 * Finds the lowest empty row in a given column.
 * @param {number} col - The column to check.
 * @param {Array<Array<string>>} board - The 2D array representing the game board.
 * @returns {number} The lowest empty row index, or -1 if the column is full.
 */
function findLowestEmptyRow(col, board) {
    for (let r = C4_ROWS - 1; r >= 0; r--) {
        if (board[r][col] === '') {
            return r;
        }
    }
    return -1; // Column is full
}

/**
 * Checks if the last move resulted in a win.
 * @param {Array<Array<string>>} board - The game board.
 * @param {string} player - The player who just made a move ('R' or 'Y').
 * @returns {boolean} True if the player has won, false otherwise.
 */
function checkConnect4Win(board, player) {
    // Check horizontal
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
                return true;
            }
        }
    }

    // Check vertical
    for (let r = 0; r <= C4_ROWS - 4; r++) {
        for (let c = 0; c < C4_COLS; c++) {
            if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
                return true;
            }
        }
    }

    // Check diagonal (down-right)
    for (let r = 0; r <= C4_ROWS - 4; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
                return true;
            }
        }
    }

    // Check diagonal (up-right)
    for (let r = 3; r < C4_ROWS; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) {
                return true;
            }
        }
    }

    return false;
}

