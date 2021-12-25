// A
const initial_positions = document.body.innerText.split('\n')
  .filter(x => x)
  .map(line => line.split(''));

const copyArray = array => JSON.parse(JSON.stringify(array));

const moveCucumbersRight = positions => {
  const height = positions.length;
  const width = positions[0].length;
  let new_positions = copyArray(positions);
  for (let row_index = 0; row_index < height; ++row_index) {
    for (let col_index = 0; col_index < width; ++col_index) {
      if (
        positions[row_index][col_index] === '.' &&
        positions[row_index][(col_index-1+width)%width] === '>'
      ) {
        new_positions[row_index][col_index]   = '>';
        new_positions[row_index][(col_index-1+width)%width] = '.';
      }
    }
  }
  return new_positions;
};

const moveCucumbersDown = positions => {
  const height = positions.length;
  const width = positions[0].length;
  let new_positions = copyArray(positions);
  for (let row_index = 0; row_index < height; ++row_index) {
    for (let col_index = 0; col_index < width; ++col_index) {
      if (
        positions[row_index][col_index] === '.' &&
        positions[(row_index-1+height)%height][col_index] === 'v'
      ) {
        new_positions[row_index][col_index] = 'v';
        new_positions[(row_index-1+height)%height][col_index] = '.'
      }
    }
  }
  return new_positions;
};

const canSomeoneMove = positions => positions.some(
  (row, row_index) => row.some((c, col_index) => c === '.' && (
    positions[row_index][(col_index - 1 + row.length)%row.length] === '>' ||
    positions[(row_index - 1 + positions.length)%positions.length][col_index] === 'v'
  ))
);

const findFinalDay = initial_positions => {
  let day = 1;
  let positions = copyArray(initial_positions);
  while (canSomeoneMove(positions)) {
    positions = moveCucumbersDown(moveCucumbersRight(positions));
    ++day;
  }
  return day;
};

const result = findFinalDay(initial_positions);
