// Setup
const input = `target area: x=20..30, y=-10..-5`.trim();
const x_range = input.split('x=')[1].split(', ')[0].split('..').map(x => parseInt(x));
const y_range = input.split('y=')[1].split('..').map(x => parseInt(x));

const isInRange = (point, x_range, y_range) => {
  const [pos_x, pos_y] = point;
  const [min_x, max_x] = x_range;
  const [min_y, max_y] = y_range;
  return pos_x >= min_x && pos_x <= max_x && pos_y >= min_y && pos_y <= max_y;
};

const getTrajectoryData = (initial_velocity, x_range, y_range) => {
  let position = [0, 0];
  let velocity = initial_velocity;
  let valid = true;
  let max_y_reached = 0;
  while (valid && !isInRange(position, x_range, y_range)) {
    position = [
      position[0] + velocity[0],
      position[1] + velocity[1],
    ];
    max_y_reached = Math.max(max_y_reached, position[1]);
    velocity = [
      velocity[0] > 0 ? (velocity[0] - 1) : 0,
      velocity[1] - 1,
    ];
    valid = position[0] <= x_range[1] && position[1] >= y_range[0]; // Have not missed target
  }
  return { valid, max_y_reached };
};

const x_velocity_candidates = Array.from({ length: x_range[1] }, (x, i) => i+1);
const y_velocity_candidates = Array.from(
  { length: Math.abs(y_range[0]*2 + y_range[1]) },
  (x, i) => y_range[0] + i,
);
const velocity_candidates = Array.from(
  { length: x_velocity_candidates.length*y_velocity_candidates.length },
  (x, i) => [
    x_velocity_candidates[i%x_velocity_candidates.length],
    y_velocity_candidates[parseInt(i/x_velocity_candidates.length)],
  ]
);
const valid_velocities = velocity_candidates
  .map(v => getTrajectoryData(v, x_range, y_range))
  .filter(data => data.valid)

// A
const result_A = valid_velocities.sort(
  (data_a, data_b) => data_b.max_y_reached - data_a.max_y_reached
)[0].max_y_reached;

// B
const result_B = valid_velocities.length;
