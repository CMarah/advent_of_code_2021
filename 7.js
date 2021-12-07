// A
const crabs = document.body.innerText.split(',').map(x => parseInt(x)).sort((a,b) => a - b);
const median = crabs[crabs.length/2];
const result_A = crabs.reduce((acc, c) => acc + Math.abs(median - c), 0);

// B
const average = crabs.reduce((acc, c) => acc + c, 0)/crabs.length;
const calcFuel = pos => crabs.reduce(
  (acc, c) => acc + Math.abs(pos - c)*(Math.abs(pos - c) + 1)/2, 0
);
const result_B = Math.min(...[Math.floor(avg), Math.floor(avg) + 1].map(calcFuel));
