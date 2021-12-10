// A
const points = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const openers = ['(', '[', '{', '<'];
const closers = [')', ']', '}', '>'];

const lines = document.body.innerText.split('\n');

const getLineError = l => l.split('').reduce(({ stack, error }, c) => {
  if (error) return { error };
  if (openers.includes(c)) return { stack: stack.concat(c) };
  const expected_closer = closers[openers.indexOf(stack[stack.length - 1])];
  if (c !== expected_closer) return { error: points[c] };
  return { stack: stack.slice(0,-1) };
}, { stack: [] });

const result_A = lines.reduce((error_sum, l) => error_sum + (getLineError(l).error || 0), 0);

// B
const line_autocomplete_scores = lines.map(l => (getLineError(l).stack || []).reverse().reduce(
  (score, c) => score*5 + openers.indexOf(c) + 1, 0
)).filter(x => x).sort((a,b) => a - b);
const result_B = line_autocomplete_scores[(line_autocomplete_scores.length-1)/2];
