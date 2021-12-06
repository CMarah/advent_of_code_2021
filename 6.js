const initial_state = document.body.innerText.slice(0,-1).split(',').reduce(
  (acc, n) => ({ ...acc, [n]: ((acc[n] || 0) + 1), }), {}
)
const DAYS = 256;
const final_state = (new Array(DAYS).fill(0)).reduce(state =>
  (new Array(9).fill(0)).map((z, i) =>
    i === 8 ? state[0] :
    i === 6 ? state[0] + state[7] :
    state[i+1]
  ).reduce((new_state, v, k) => ({
    ...new_state,
    [k]: v || 0,
  }), {})
, initial_state);
const result = Object.values(final_state).reduce((acc, v) => acc + v, 0);
