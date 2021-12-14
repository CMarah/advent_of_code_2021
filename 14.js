// A
const lines = document.body.innerText.split('\n').filter(x => x);
const starting_pairs = lines[0].split('').reduce(
  (pairs, component, index, all_components) => {
    if (index === all_components.length - 1) return pairs;
    const pair = component + all_components[index + 1];
    return {
      ...pairs,
      [pair]: (pairs[pair] || 0) + 1,
    };
  }, {}
);
const rules = Object.fromEntries(lines.slice(1).map(
  line => [line.split(' ')[0], line.split(' ')[2]]
));

const processDay = (prev_pairs, rules, day) => {
  if (day === 0) return prev_pairs;
  const next_pairs = Object.entries(prev_pairs).reduce(
    (next_pairs, [pair, amount]) => {
      const new_pair_l = pair[0] + rules[pair];
      const new_pair_r = rules[pair] + pair[1];
      return {
        ...next_pairs,
        [new_pair_l]: (next_pairs[new_pair_l] || 0) + amount,
        [new_pair_r]: (next_pairs[new_pair_r] || 0) + amount,
      };
    }, {});
  return processDay(next_pairs, rules, day - 1);
};
const getComponentCounts = pairs => Object.entries(pairs).reduce(
  (counts, [pair, amount]) => {
    counts[pair[0]] = (counts[pair[0]] || 0) + amount;
    counts[pair[1]] = (counts[pair[1]] || 0) + amount;
    return counts;
  }, { // +1 to count of starting + ending components
    [lines[0][0]]: 1,
    [lines[0][lines[0].length - 1]]: 1,
  }
);

const day10Pairs = processDay(starting_pairs, rules, 10);
const amounts_A = Object.values(getComponentCounts(day10Pairs))
  .map(x => x/2).sort((a, b) => a - b);
const result_A = amounts_A[amounts_A.length - 1] - amounts_A[0];

// B
const day40Pairs = processDay(starting_pairs, rules, 40);
const amounts_B = Object.values(getComponentCounts(day40Pairs))
  .map(x => x/2).sort((a, b) => a - b);
const result_B = amounts_B[amounts_B.length - 1] - amounts_B[0];
