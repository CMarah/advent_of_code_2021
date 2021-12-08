// A
const lines = document.body.innerText.split('\n').filter(x => x);
const result_A = lines.reduce((acc, l) => acc +
  l.split(' | ')[1].split(' ').filter(c => [2,3,4,7].includes(c.length)).length
, 0);

// B
const decodeNumber = (translation, n) => {
  if (n.length === 2) return 1;
  if (n.length === 3) return 7;
  if (n.length === 4) return 4;
  if (n.length === 7) return 8;
  const translated_n = n.split('').map(c => translation[c]).join('');
  if (n.length === 6) {
    if (!translated_n.includes('c')) return 6;
    if (!translated_n.includes('d')) return 0;
    return 9;
  }
  if (translated_n.includes('e')) return 2;
  if (translated_n.includes('b')) return 5;
  return 3;
};

const result_B = lines.reduce((sum, l) => {
  const [ input, output ] = l.split(' | ');
  const n1   = input.split(' ').filter(n => n.length === 2)[0];
  const n7   = input.split(' ').filter(n => n.length === 3)[0];
  const n4   = input.split(' ').filter(n => n.length === 4)[0];
  const n069 = input.split(' ').filter(n => n.length === 6);
  const new_a = n7.split('').find(c => !n1.includes(c));
  const new_f = n1.split('').find(c => n069.every(n => n.includes(c)));
  const new_c = n1.replace(new_f, '');
  const n2 = input.split(' ').find(
    n => n.length === 5 && n.includes(new_c) && !n.includes(new_f)
  );
  const new_b = 'abcdefg'.split('').find(c => c !== new_f && !n2.includes(c));
  const new_d = n4.split('').find(c => ![new_b, new_c, new_f].includes(c));
  const new_g = 'abcdefg'.split('').find(c =>
    ![new_a, new_b, new_c, new_d, new_f].includes(c) &&
    n069.every(n => n.includes(c))
  );
  const new_e = 'abcdefg'.split('').find(
    c => ![new_a, new_b, new_c, new_d, new_f, new_g].includes(c)
  );
  const translation = {
    [new_a]: 'a', [new_b]: 'b', [new_c]: 'c', [new_d]: 'd',
    [new_e]: 'e', [new_f]: 'f', [new_g]: 'g',
  };
  return sum + output.split(' ').reduce(
    (partial, n, i) => partial + decodeNumber(translation, n)*Math.pow(10, 3-i), 0
  );
}, 0);
