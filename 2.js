// Setup
const instructions = document.body.innerText.split('\n').filter(l => l);

// A
const processInstructionA = (prev_pos, instruction) => {
  const [ action, amount ] = instruction.split(' ');
  if (action === 'forward') return {
    horizontal: prev_pos.horizontal + parseInt(amount),
    vertical: prev_pos.vertical,
  };
  if (action === 'down') return {
    horizontal: prev_pos.horizontal,
    vertical: prev_pos.vertical + parseInt(amount),
  };
  return {
    horizontal: prev_pos.horizontal,
    vertical: prev_pos.vertical - parseInt(amount),
  };
};
const final_pos_A = instructions.reduce(processInstructionA, { horizontal: 0, vertical: 0 });
const result_A = final_pos_A.horizontal * final_pos_A.vertical;
console.log(final_pos_A);

// B
const processInstructionB = (prev_pos, instruction) => {
  const [ action, amount ] = instruction.split(' ');
  if (action === 'forward') return {
    horizontal: prev_pos.horizontal + parseInt(amount),
    vertical: prev_pos.vertical + prev_pos.aim*amount,
    aim: prev_pos.aim,
  };
  if (action === 'down') return {
    horizontal: prev_pos.horizontal,
    vertical: prev_pos.vertical,
    aim: prev_pos.aim + parseInt(amount),
  };
  return {
    horizontal: prev_pos.horizontal,
    vertical: prev_pos.vertical,
    aim: prev_pos.aim - parseInt(amount),
  };
};
const final_pos_B = instructions.reduce(
  processInstructionB, { horizontal: 0, vertical: 0, aim: 0 },
);
const result_B = final_pos_B.horizontal * final_pos_B.vertical;
console.log(final_pos_B);
