// Setup
const input = document.body.innerText.split('\n').filter(line => line);
const numbers = input.map(line => parseInt(line));

// A
const result_A = numbers.filter((number, index) => index > 0 && number > numbers[index-1]).length;

// B
const result_B = numbers.filter((number, index) => index > 2 && number > numbers[index-3]).length;
