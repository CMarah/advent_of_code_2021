// Setup
const [ raw_numbers, ...raw_boards ] = document.body.innerText.split('\n\n');
const numbers = raw_numbers.split(',').map(n => parseInt(n));
const initial_boards = raw_boards
  .map(b => b.split('\n').filter(x => x).map(
    line => line.split(' ').filter(x => x).map(n => parseInt(n))
  ))
  .map(b => ({
    rows: b,
    cols: b.reduce((acc, r, i) => r.map((n, j) => (acc[j] || []).concat(n)), []),
  }));

const getBoardScore = board => board.cols.reduce(
  (score, col) => score + col.reduce((col_score, elem) => col_score + elem, 0), 0
);

const processBoards = (boards, number) => boards.map(
  b => ({
    rows: b.rows.map(row => row.filter(e => e !== number)),
    cols: b.cols.map(col => col.filter(e => e !== number)),
  })
);

const finishedBoard = board => [...board.rows, ...board.cols]
  .some(line => !line.length);

const playBingo = (initial_boards, numbers) => {
  let boards = initial_boards.slice(0);
  let finished_boards = [];
  for (const number of numbers) {
    const processed_boards = processBoards(boards, number);
    boards = processed_boards.filter(b => !finishedBoard(b));
    finished_boards = finished_boards.concat(
      processed_boards.filter(finishedBoard).map(b => ({
        board: b,
        number,
      }))
    );
  };
  return finished_boards;
};
const bingo_results = playBingo(initial_boards, numbers);

// A
const result_A = getBoardScore(bingo_results[0].board)*bingo_results[0].number;

//B
const loser_info =  bingo_results[bingo_results.length - 1];
const result_B = getBoardScore(loser_info.board)*loser_info.number;
