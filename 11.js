// A
const lines = document.body.innerText.split('\n').filter(x => x);
const initial_board = lines.map(l => l.split('').map(elem => parseInt(elem)));
const printBoard = board => board.map(row => row.map(e => e < 10 ? `  ${e}` : ` ${e}`).join('')).join('\n');

const increaseNeighbors = (initial_board, row, col, already_shined) => [
  [row-1, col-1], [row-1, col  ], [row-1, col+1],
  [row  , col-1],                 [row  , col+1],
  [row+1, col-1], [row+1, col  ], [row+1, col+1],
].reduce((board, [pos_x, pos_y]) => {
  if (board?.[pos_x]?.[pos_y] === undefined || already_shined?.[pos_x]?.[pos_y]) return board;
  return board.map(
    (row, i) => i !== pos_x ? row : row.map((elem, j) => j !== pos_y ? elem : (elem+1))
  );
}, initial_board);

const calcBoardAtDay = (prev_board, day, number_shines) => {
  if (day === 0) return number_shines;
  let next_board = prev_board.map(row => row.map(elem => elem + 1));
  let already_shined = (new Array(next_board.length).fill(0))
    .map(x => new Array(next_board[0].length).fill(0));
  let shines_today = 0;
  while (next_board.some(row => row.some(elem => elem > 9))) {
    const shining_row = next_board.findIndex(row => row.some(elem => elem > 9));
    const shining_col = next_board[shining_row].findIndex(elem => elem > 9);
    next_board = increaseNeighbors(next_board, shining_row, shining_col, already_shined);
    shines_today += 1;
    next_board[shining_row][shining_col] = 0;
    already_shined[shining_row][shining_col] = 1;
  }
  if (shines_today === lines.length*lines[0].length) return {
    all_shined: day,
  };
  return calcBoardAtDay(next_board, day-1, number_shines + shines_today);
};

const result_A = calcBoardAtDay(initial_board, 100, 0);

// B
const result_B = 301 - calcBoardAtDay(initial_board, 300, 0).all_shined;
