const aiPlayer = 'O';
const humanPlayer = 'X';

function getAIMove(board, difficulty) {
    switch (difficulty) {
        case 'easy': return getRandomMove(board);
        case 'medium': return getMediumMove(board);
        case 'hard': return findBestMove(board);
        default: return getRandomMove(board);
    }
}

function getRandomMove(board) {
    let availableMoves = [];
    board.forEach((cell, index) => { if (cell === '') availableMoves.push(index); });
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove(board) {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            let tempBoard = [...board]; tempBoard[i] = aiPlayer;
            if (checkWinner(tempBoard, aiPlayer)) return i;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            let tempBoard = [...board]; tempBoard[i] = humanPlayer;
            if (checkWinner(tempBoard, humanPlayer)) return i;
        }
    }
    return getRandomMove(board);
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            let tempBoard = [...board]; tempBoard[i] = aiPlayer;
            let moveVal = minimax(tempBoard, 0, false, -Infinity, Infinity);
            if (moveVal > bestVal) { bestMove = i; bestVal = moveVal; }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    let score = evaluate(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!board.includes('')) return 0;
    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                let tempBoard = [...board]; tempBoard[i] = aiPlayer;
                best = Math.max(best, minimax(tempBoard, depth + 1, !isMaximizing, alpha, beta));
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                let tempBoard = [...board]; tempBoard[i] = humanPlayer;
                best = Math.min(best, minimax(tempBoard, depth + 1, !isMaximizing, alpha, beta));
                beta = Math.min(beta, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    }
}

function evaluate(board) {
    if (checkWinner(board, aiPlayer)) return 10;
    if (checkWinner(board, humanPlayer)) return -10;
    return 0;
}

function checkWinner(board, player) {
    const winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) return true;
    }
    return false;
}