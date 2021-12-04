//A
const numbers = document.body.innerText.split('\n').filter(x => x);
const gamma = numbers.filter(x => x).reduce(
  (acc, x) => x.split('').map((d, i) => (acc[i] || 0) + parseInt(d)), []
).map(count => count < 500 ? 0 : 1).join('');
const epsilon = gamma.split('').map(d => d === '0' ? '1' : '0').join('');
const result_A = parseInt(gamma, 2)*parseInt(epsilon, 2);

//B
const getMostCommonDigit = (numbers, i) => (numbers.reduce((acc, n) => acc + parseInt(n.split('')[i]), 0) < numbers.length/2) ? 0 : 1;
const oxygen = numbers[0].split('').reduce((acc, d, i) => {
    if (acc.length === 1) return acc;
    const valid_digit = getMostCommonDigit(acc, i);
    return acc.filter(n => n.split('')[i] == valid_digit);
}, numbers)[0];
const co2 = numbers[0].split('').reduce((acc, d, i) => {
    if (acc.length === 1) return acc;
    const valid_digit = getMostCommonDigit(acc, i);
    return acc.filter(n => n.split('')[i] != valid_digit);
}, numbers)[0];
const result_B = parseInt(oxygen, 2) * parseInt(co2, 2);
