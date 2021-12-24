// Setup
const input = document.body.innerText;
const initial_fishes = Array.from(
  { length: 9 },
  (x, fish_state) => input.split(fish_state).length - 1,
);

const processDay = prev_fishes => Array.from(
  { length: 9 },
  (x, fish_state) => {
    if (fish_state === 8) return prev_fishes[0];
    if (fish_state === 6) return prev_fishes[0] + prev_fishes[7];
    return prev_fishes[fish_state+1];
  }
);

const fishesAtDay = (day, fishes, num_days) => {
  if (day === num_days) return fishes;
  const next_fishes = processDay(fishes);
  return fishesAtDay(day + 1, next_fishes, num_days);
};

// A
const fishes_A = fishesAtDay(0, initial_fishes, 80);
const result_A = fishes_A.reduce((total, fishes_at_state) => total + fishes_at_state, 0);
console.log(result_A);

// B
const fishes_B = fishesAtDay(0, initial_fishes, 256);
const result_B = fishes_B.reduce((total, fishes_at_state) => total + fishes_at_state, 0);
console.log(result_B);
