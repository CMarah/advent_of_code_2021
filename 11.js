// Setup
const lines = document.body.innerText.split('\n').filter(x => x);
const initial_board = lines.map(l => l.split('').map(elem => parseInt(elem)));

const validPosition = ([ pos_x, pos_y ], board, already_shined) =>
  0 <= pos_x && pos_x < board.length &&
  0 <= pos_y && pos_y < board[0].length &&
  !already_shined[pos_x][pos_y];

const increaseNeighbors = (prev_board, row, col, already_shined) => {
  const neighbor_positions = [
    [row-1, col-1], [row-1, col  ], [row-1, col+1],
    [row  , col-1],                 [row  , col+1],
    [row+1, col-1], [row+1, col  ], [row+1, col+1],
  ].filter(pos => validPosition(pos, prev_board, already_shined));
  return neighbor_positions.reduce((board, [pos_x, pos_y]) => {
    board[pos_x][pos_y] += 1;
    return board;
  }, prev_board);
};

const advanceBoard = board => {
  let next_board = board.map(row => row.map(elem => elem + 1));
  let already_shined = Array.from( // NxN matrix filled with 0s
    { length: next_board.length },
    () => (new Array(next_board.length)).fill(0),
  );
  while (next_board.some(row => row.some(elem => elem > 9))) { // Shines pending
    const shining_row = next_board.findIndex(row => row.some(elem => elem > 9));
    const shining_col = next_board[shining_row].findIndex(elem => elem > 9);
    next_board = increaseNeighbors(next_board, shining_row, shining_col, already_shined);
    next_board[shining_row][shining_col] = 0;
    already_shined[shining_row][shining_col] = 1;
  }
  const shines_today = JSON.stringify(already_shined).split('1').length - 1;
  return {
    next_board,
    shines_today,
  };
};

const calcBoardAtDay = (board, shines_so_far, day, max_day) => {
  const current_day = day + 1;
  const { next_board, shines_today } = advanceBoard(board);
  if (current_day === max_day) return {
    shines: shines_so_far + shines_today,
  };
  if (shines_today === board.length*board[0].length) return {
    all_shined_day: current_day,
  };
  return calcBoardAtDay(next_board, shines_so_far + shines_today, day+1, max_day);
};

// A
const result_A = calcBoardAtDay(initial_board, 0, 0, 100).shines;

// B
const result_B = calcBoardAtDay(initial_board, 0, 0, 500).all_shined_day;
