function createTicTacToeBoard(container) {
    container.innerHTML = '';
    const board = document.createElement('div');
    board.classList.add('tictactoe-board');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('tictactoe-cell');
        cell.dataset.index = i;
        board.appendChild(cell);
    }
    container.appendChild(board);
}