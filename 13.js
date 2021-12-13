// A
const lines = document.body.innerText.split('\n').filter(x => x);
const points = lines.filter(l => !l.includes('fold'))
  .map(l => l.split(',').map(c => parseInt(c)));
const folds = lines.filter(l => l.includes('fold'));

const foldAlong = (point, fold) => {
  const fold_direction = fold.split('along ')[1][0];
  const fold_coord = parseInt(fold.split('=')[1]);
  if (fold_direction === 'x' && fold_coord < point[0]) {
    return [2*fold_coord - point[0], point[1]];
  }
  if (fold_direction === 'y' && fold_coord < point[1]) {
    return [point[0], 2*fold_coord - point[1]];
  }
  return point;
};
const folded_points = points.map(p => foldAlong(p, folds[0]));
const result_A = (new Set(folded_points.map(p => `${p[0]}_${p[1]}`))).size;

// B
const folded_points_B = folds.reduce(
  (folded_points, fold) => folded_points.map(p => foldAlong(p, fold)),
points);
const printPoints = points => {
  const formatted_points = points.map(p => `${p[1]}_${p[0]}`);
  let board = '';
  for (let i = 0; i <= Math.max(...points.map(p => p[1])); ++i) {
    for (let j = 0; j <= Math.max(...points.map(p => p[0])); ++j) {
      if (formatted_points.includes(`${i}_${j}`)) board += 'X';
      else board += ' ';
    }
    board += '\n';
  }
  console.log(board);
};
printPoints(folded_points_B);
