// Setup
const numbers = document.body.innerText.split('\n').filter(x => x);

const getExplodingPairIndex = number => number.split('').reduce(
  ({ found_index, bracket_count }, character, index) => {
    if (found_index) return { found_index };
    if (character === '[') {
      if (bracket_count === 4) return { found_index: index };
      return { bracket_count: bracket_count+1 };
    }
    if (character === ']') return { bracket_count: bracket_count - 1 };
    return { bracket_count };
  }, { bracket_count: 0 }
).found_index;

const addNumberToLeftSide = (side, number_to_add) => {
  const reverseString = string => string.split('').reverse().join('');
  const replaced_reversed = reverseString(side).replace(
    /\d+/, match => reverseString(`${parseInt(reverseString(match)) + number_to_add}`)
  );
  return reverseString(replaced_reversed);
};

const hasToExplode = number => getExplodingPairIndex(number);
const explode = number => {
  const exploding_pair_index = getExplodingPairIndex(number);
  const exploding_pair = number.slice(exploding_pair_index + 1).split(']')[0];
  const [ left_num, right_num ] = exploding_pair.split(',').map(x => parseInt(x));
  const left_side = number.slice(0, exploding_pair_index);
  const right_side = number.slice(exploding_pair_index+exploding_pair.length+2);

  const new_left_side = addNumberToLeftSide(left_side, left_num);
  const new_right_side = right_side.replace(/\d+/, match => parseInt(match) + right_num);
  return new_left_side.trim() + '0' + new_right_side.trim();
};

const hasToSplit = number => /\d{2}/.test(number);
const split = number => number.replace(
  /\d{2,}/,
  match => `[${Math.floor(parseInt(match)/2)}, ${Math.ceil(parseInt(match)/2)}]`,
);

const cleanNumber = number => {
  if (hasToExplode(number)) {
    return cleanNumber(explode(number));
  }
  if (hasToSplit(number)) {
    return cleanNumber(split(number));
  }
  return number;
};

const snailAdd = (number_1, number_2) => {
  const raw_sum = number_1 && `[${number_1},${number_2}]` || number_2;
  return cleanNumber(raw_sum);
};

const getMagnitude = number => {
  if (!Array.isArray(number)) return number;
  return 3*getMagnitude(number[0]) + 2*getMagnitude(number[1]);
};

// A
const added_numbers = numbers.reduce((sum, number) => snailAdd(sum, number), null);
const result_A = getMagnitude(JSON.parse(added_numbers));

// B
const all_number_pairs = numbers.reduce(
  (all_pairs, number, i) => ([
    ...all_pairs,
    ...numbers
      .map((number_2, j) => i !== j && [number, number_2])
      .filter(x => x),
  ])
, []);
const result_B = Math.max(...all_number_pairs.map(
  pair => getMagnitude(JSON.parse(snailAdd(pair[0], pair[1])))
));
