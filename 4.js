//A
const numbers = document.body.innerText.split('\n\n')[0].split(',').map(x => parseInt(x));
const raw_boards = document.body.innerText.split('\n\n').slice(1).map(
  b => b.split('\n').filter(x => x).map(l => l.split(' ').filter(x => x).map(n => parseInt(n)))
);
const boards = raw_boards.map(b => ({
  rows: b,
  cols: b.reduce((acc, r, i) => r.map((n, j) => (acc[j] || []).concat(n)),
[]), }));
const { winner, winner_number } = numbers.reduce(
  (acc, n) => {
    if (acc.winner) return acc;
    const new_boards = acc.boards.map(b => ({
      rows: b.rows.map(r => r.filter(e => e !== n)),
      cols: b.cols.map(c => c.filter(e => e !== n)),
    }));
    const winner = new_boards.find(
      b => b.rows.some(r => !r.length) || b.cols.some(c => !c.length)
    );
    return { winner, boards: new_boards, winner_number: n };
  }, { boards }
);
const result = winner_number*winner.cols.reduce(
  (acc, c) => acc + c.reduce((col_acc, e) => col_acc + e, 0), 0
);

//B
const loser_board = numbers.reduce((acc, n) => {
  if (acc.length === 1) return acc;
  return acc.map(b => ({
    rows: b.rows.map(r => r.filter(e => e !== n)),
    cols: b.cols.map(c => c.filter(e => e !== n)),
  })).filter(b => !b.rows.some(r => !r.length) && !b.cols.some(c => !c.length));
}, boards)[0];
const { final_number, board } = numbers.reduce(({ final_number, board }, n) => {
  if (final_number) return { final_number, board };
  const new_board = {
    rows: board.rows.map(r => r.filter(e => e !== n)),
    cols: board.cols.map(c => c.filter(e => e !== n)),
  };
  const done = new_board.cols.some(c => !c.length) ||new_board.rows.some(r => !r.length);
  return { board: new_board, final_number: done ? n : null, };
}, { board: loser_board });
const result_B = final_number * board.cols.reduce(
  (acc, c) => acc + c.reduce((col_acc, e) => col_acc + e, 0), 0
);
