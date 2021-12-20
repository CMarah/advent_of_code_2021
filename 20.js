// Setup
const input = document.body.innerText.split('\n').filter(x => x);
const algorithm = input[0];
const base_image = input.slice(1).map(line => line.split('').map(c => c === '#' ? 1 : 0));

const AREA_MASK = [
  [-1,-1],[-1, 0],[-1, 1],
  [ 0,-1],[ 0, 0],[ 0, 1],
  [ 1,-1],[ 1, 0],[ 1, 1],
];

const formElement = (row_index, col_index, image, algorithm, step_number) => {
  const surrounding_numbers = AREA_MASK.map(([x_offset, y_offset]) => {
    const x_image = row_index + x_offset - 1;
    const y_image = col_index + y_offset - 1;
    if (0 <= x_image && x_image < image.length && 0 <= y_image && y_image < image[0].length) {
      // Pixel inside previous image
      return image[x_image][y_image];
    }
    // infinite image, #s could be generated outside of previous image
    if (algorithm[0] === '.') return 0;
    if (algorithm[511] === '#') return 1;
    return step_number%2 ? 1 : 0;
  });
  const algorithm_index = parseInt(surrounding_numbers.reduce(
    (acc, surrounding_number) => acc + surrounding_number
  , ''), 2);
  return algorithm[algorithm_index] === '#' ? 1 : 0;
};

const formRow = (row_index, image, algorithm, step_number) => Array.from(
  { length: image[0].length + 2 },
  (col, col_index) => formElement(row_index, col_index, image, algorithm, step_number),
);

const generateNextImage = (image, algorithm, step_number) => Array.from(
  { length: image.length + 2 },
  (row, row_index) => formRow(row_index, image, algorithm, step_number),
);

const generateImageN = (initial_image, algorithm, steps) => {
  let image = initial_image;
  for (let i = 0; i < steps; ++i) {
    image = generateNextImage(image, algorithm, i);
  };
  return image;
};

const countLighted = image => image.reduce(
  (sum, row) => sum + row.reduce((row_sum, element) => row_sum + element, 0)
, 0);

// A
const result_A = countLighted(generateImageN(base_image, algorithm, 2));

// B
const result_B = countLighted(generateImageN(base_image, algorithm, 50));
