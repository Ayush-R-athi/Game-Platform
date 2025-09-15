// ai_connect4.js - Contains the logic for the Connect 4 AI

const C4_AI_PLAYER = 'Y'; // Yellow
const C4_HUMAN_PLAYER = 'R'; // Red

// --- Main AI Function ---
// This function now correctly uses the selected difficulty.
function getConnect4AIMove(board, difficulty) {
    switch (difficulty) {
        case 'easy':
            return getRandomConnect4Move(board);
        case 'medium':
            return getMediumConnect4Move(board);
        case 'hard':
            return findBestConnect4Move(board);
        default:
            return getRandomConnect4Move(board);
    }
}

// --- Helper: Get all non-full columns ---
function getValidColumns(board) {
    const validCols = [];
    for (let c = 0; c < C4_COLS; c++) {
        if (board[0][c] === '') { // Check top row of the column
            validCols.push(c);
        }
    }
    return validCols;
}

// --- Easy Difficulty: Pick a random valid column ---
function getRandomConnect4Move(board) {
    const validCols = getValidColumns(board);
    const randomIndex = Math.floor(Math.random() * validCols.length);
    return validCols[randomIndex];
}

// --- Medium Difficulty: Simple logic to win or block ---
function getMediumConnect4Move(board) {
    const validCols = getValidColumns(board);
    
    // 1. Check if AI can win in the next move
    for (const col of validCols) {
        const row = findLowestEmptyRow(col, board);
        let tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = C4_AI_PLAYER;
        if (checkConnect4Win(tempBoard, C4_AI_PLAYER)) {
            return col; // Winning move!
        }
    }

    // 2. Check if the player can win in the next move, and block them
    for (const col of validCols) {
        const row = findLowestEmptyRow(col, board);
        let tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = C4_HUMAN_PLAYER;
        if (checkConnect4Win(tempBoard, C4_HUMAN_PLAYER)) {
            return col; // Blocking move!
        }
    }

    // 3. If neither, play a random move
    return getRandomConnect4Move(board);
}


// --- Hard Difficulty: Unbeatable Minimax with Alpha-Beta Pruning ---
function findBestConnect4Move(board) {
    let bestScore = -Infinity;
    let bestCol = -1;
    const validCols = getValidColumns(board);

    // Prioritize center columns for the first move
    if (board.flat().every(cell => cell === '')) {
        return 3;
    }

    for (const col of validCols) {
        const row = findLowestEmptyRow(col, board);
        let tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = C4_AI_PLAYER;
        let score = minimax_c4(tempBoard, 4, -Infinity, Infinity, false); // Depth of 4
        if (score > bestScore) {
            bestScore = score;
            bestCol = col;
        }
    }
    return bestCol;
}

function minimax_c4(board, depth, alpha, beta, isMaximizing) {
    if (checkConnect4Win(board, C4_AI_PLAYER)) return 10000000;
    if (checkConnect4Win(board, C4_HUMAN_PLAYER)) return -10000000;
    if (getValidColumns(board).length === 0) return 0; // Draw
    if (depth === 0) return scorePosition(board, C4_AI_PLAYER);


    const validCols = getValidColumns(board);

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const col of validCols) {
            const row = findLowestEmptyRow(col, board);
            let tempBoard = board.map(r => [...r]);
            tempBoard[row][col] = C4_AI_PLAYER;
            maxScore = Math.max(maxScore, minimax_c4(tempBoard, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, maxScore);
            if (beta <= alpha) break;
        }
        return maxScore;
    } else { // Minimizing
        let minScore = Infinity;
        for (const col of validCols) {
            const row = findLowestEmptyRow(col, board);
            let tempBoard = board.map(r => [...r]);
            tempBoard[row][col] = C4_HUMAN_PLAYER;
            minScore = Math.min(minScore, minimax_c4(tempBoard, depth - 1, alpha, beta, true));
            beta = Math.min(beta, minScore);
            if (beta <= alpha) break;
        }
        return minScore;
    }
}

// Heuristic function to score the board state
function scorePosition(board, player) {
    let score = 0;
    const opponent = player === C4_HUMAN_PLAYER ? C4_AI_PLAYER : C4_HUMAN_PLAYER;
    
    // Center column preference
    for (let r = 0; r < C4_ROWS; r++) {
        if (board[r][Math.floor(C4_COLS / 2)] === player) {
            score += 3;
        }
    }

    // Horizontal score
    for (let r = 0; r < C4_ROWS; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            const window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]];
            score += evaluateWindow(window, player, opponent);
        }
    }

    // Vertical score
    for (let c = 0; c < C4_COLS; c++) {
        for (let r = 0; r <= C4_ROWS - 4; r++) {
            const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]];
            score += evaluateWindow(window, player, opponent);
        }
    }

    // Diagonal (down-right) score
    for (let r = 0; r <= C4_ROWS - 4; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
            score += evaluateWindow(window, player, opponent);
        }
    }

    // Diagonal (up-right) score
    for (let r = 3; r < C4_ROWS; r++) {
        for (let c = 0; c <= C4_COLS - 4; c++) {
            const window = [board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]];
            score += evaluateWindow(window, player, opponent);
        }
    }

    return score;
}

function evaluateWindow(window, player, opponent) {
    let score = 0;
    const playerCount = window.filter(p => p === player).length;
    const opponentCount = window.filter(p => p === opponent).length;
    const emptyCount = window.filter(p => p === '').length;

    if (playerCount === 4) score += 100;
    else if (playerCount === 3 && emptyCount === 1) score += 5;
    else if (playerCount === 2 && emptyCount === 2) score += 2;
    
    if (opponentCount === 3 && emptyCount === 1) score -= 4;

    return score;
}
