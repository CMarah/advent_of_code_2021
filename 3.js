// Setup
const numbers = document.body.innerText.split('\n').filter(x => x)
  .map(n => n.split(''));

// A
const gamma = numbers
  .reduce((digit_sums, n) => n.map((d, i) => (digit_sums[i] || 0) + parseInt(d)), [])
  .map(count => count < 500 ? 0 : 1);
const epsilon = gamma.map(d => d === 0 ? 1 : 0);
const result_A = parseInt(gamma.join(''), 2)*parseInt(epsilon.join(''), 2);

//B
const getMostCommonDigit = (numbers, digit_index) => (
  numbers.reduce((sum, n) => sum + parseInt(n[digit_index]), 0)
    < numbers.length/2
) ? 0 : 1;
const oxygen = numbers[0].reduce((valid_numbers, d, digit_index) => {
  if (valid_numbers.length === 1) return valid_numbers;
  const valid_digit = getMostCommonDigit(valid_numbers, digit_index);
  return valid_numbers.filter(n => n[digit_index] == valid_digit);
}, numbers)[0];
const co2 = numbers[0].reduce((valid_numbers, d, digit_index) => {
  if (valid_numbers.length === 1) return valid_numbers;
  const invalid_digit = getMostCommonDigit(valid_numbers, digit_index);
  return valid_numbers.filter(n => n[digit_index] != invalid_digit);
}, numbers)[0];
const result_B = parseInt(oxygen, 2) * parseInt(co2, 2);
