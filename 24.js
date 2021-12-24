// Setup
// By reverse engineering source code, we can determine what criteria the input has to
// follow.
const instructions = document.body.innerText.split('\n').filter(x => x);

const x_additions = instructions.filter(line => line.includes('add x'))
  .filter((line, i) => i%2)
  .map(line => parseInt(line.split(' ')[2]));
const y_additions = instructions.filter(line => line.includes('add y'))
  .filter((line, i) => i%4 === 3)
  .map(line => parseInt(line.split(' ')[2]));

const formCoefficients = (x_additions, y_additions, getBestCoeffs) => {
  let coefficients = (new Array(14)).fill(0);
  let y_addition_stack = [];
  for (let i = 0; i < x_additions.length; ++i) {
    const adding_x = x_additions[i];
    if (adding_x > 0) {
      y_addition_stack.push({
        index: i,
        value: y_additions[i],
      });
    } else {
      const { value, index } = y_addition_stack[y_addition_stack.length - 1];
      const [ coeff_index, coeff_i ] = getBestCoeffs(adding_x, value);
      coefficients[i] = coeff_i;
      coefficients[index] = coeff_index;
      y_addition_stack = y_addition_stack.slice(0, -1);
    }
  }
  return coefficients;
};

// A
const getBestCoeffsA = (adding_x, value) => { // Look for max number
  let coeff_index = 9;
  while (coeff_index + value + adding_x > 9) {
    --coeff_index;
  }
  return [coeff_index, coeff_index + value + adding_x];
};
const result_A = formCoefficients(x_additions, y_additions, getBestCoeffsA).join('');

// B
const getBestCoeffsB = (adding_x, value) => { // Look for min number
  let coeff_index = 1;
  while (coeff_index + value + adding_x < 1) {
    ++coeff_index;
  }
  return [coeff_index, coeff_index + value + adding_x];
};
const result_B = formCoefficients(x_additions, y_additions, getBestCoeffsB).join('');
