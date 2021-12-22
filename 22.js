// Setup
const input = document.body.innerText.split('\n').filter(x => x);
const instructions = input.map(line => {
  const x_coords = line.split('x=')[1].split(',')[0].split('..').map(x => parseInt(x));
  const y_coords = line.split('y=')[1].split(',')[0].split('..').map(y => parseInt(y));
  const z_coords = line.split('z=')[1].split('..').map(z => parseInt(z));
  return {
    turn_on: line.includes('on'),
    x_coords: [Math.min(...x_coords), Math.max(...x_coords)],
    y_coords: [Math.min(...y_coords), Math.max(...y_coords)],
    z_coords: [Math.min(...z_coords), Math.max(...z_coords)],
  };
});

const removeVolumefromOther = (v1, v2) => {
  // Remove v2 from v1
  if (v2.x_coords[0] > v1.x_coords[1] || v1.x_coords[0] > v2.x_coords[1]) return [v1];
  if (v2.y_coords[0] > v1.y_coords[1] || v1.y_coords[0] > v2.y_coords[1]) return [v1];
  if (v2.z_coords[0] > v1.z_coords[1] || v1.z_coords[0] > v2.z_coords[1]) return [v1];
  if (
    v2.x_coords[0] <= v1.x_coords[0] && v1.x_coords[1] <= v2.x_coords[1] &&
    v2.y_coords[0] <= v1.y_coords[0] && v1.y_coords[1] <= v2.y_coords[1] &&
    v2.z_coords[0] <= v1.z_coords[0] && v1.z_coords[1] <= v2.z_coords[1]
  ) return [];

  let fragments = [];
  if (v1.x_coords[0] <= v2.x_coords[0]-1) {
    fragments = fragments.concat({
      x_coords: [v1.x_coords[0], v2.x_coords[0]-1],
      y_coords: v1.y_coords,
      z_coords: v1.z_coords,
    });
  }
  if (v2.x_coords[1]+1 <= v1.x_coords[1]) {
    fragments = fragments.concat({
      x_coords: [v2.x_coords[1]+1, v1.x_coords[1]],
      y_coords: v1.y_coords,
      z_coords: v1.z_coords,
    });
  }
  if (v1.y_coords[0] <= v2.y_coords[0]-1) {
    fragments = fragments.concat({
      x_coords: [
        Math.max(v1.x_coords[0], v2.x_coords[0]),
        Math.min(v1.x_coords[1], v2.x_coords[1]),
      ],
      y_coords: [v1.y_coords[0], v2.y_coords[0]-1],
      z_coords: v1.z_coords,
    });
  }
  if (v2.y_coords[1]+1 <= v1.y_coords[1]) {
    fragments = fragments.concat({
      x_coords: [
        Math.max(v1.x_coords[0], v2.x_coords[0]),
        Math.min(v1.x_coords[1], v2.x_coords[1]),
      ],
      y_coords: [v2.y_coords[1]+1, v1.y_coords[1]],
      z_coords: v1.z_coords,
    });
  }
  if (v1.z_coords[0] <= v2.z_coords[0]-1) {
    fragments = fragments.concat({
      x_coords: [
        Math.max(v1.x_coords[0], v2.x_coords[0]),
        Math.min(v1.x_coords[1], v2.x_coords[1]),
      ],
      y_coords: [
        Math.max(v1.y_coords[0], v2.y_coords[0]),
        Math.min(v1.y_coords[1], v2.y_coords[1]),
      ],
      z_coords: [v1.z_coords[0], v2.z_coords[0]-1],
    });
  }
  if (v2.z_coords[1]+1 <= v1.z_coords[1]) {
    fragments = fragments.concat({
      x_coords: [
        Math.max(v1.x_coords[0], v2.x_coords[0]),
        Math.min(v1.x_coords[1], v2.x_coords[1]),
      ],
      y_coords: [
        Math.max(v1.y_coords[0], v2.y_coords[0]),
        Math.min(v1.y_coords[1], v2.y_coords[1]),
      ],
      z_coords: [v2.z_coords[1]+1, v1.z_coords[1]],
    });
  }
  return fragments;
};

const getVolume = ({ x_coords, y_coords, z_coords }) =>
  (x_coords[1] - x_coords[0] + 1)*
  (y_coords[1] - y_coords[0] + 1)*
  (z_coords[1] - z_coords[0] + 1);

const getFragments = instructions => instructions.reduce((fragments, instruction, i) => {
  const broken_fragments = fragments.reduce(
    (acc, fragment) => acc.concat(removeVolumefromOther(fragment, instruction)), []
  );
  return [
    ...broken_fragments,
    ...(instruction.turn_on ? [instruction] : []),
  ];
}, []);

// A
const A_instructions = instructions.filter(({ x_coords, y_coords, z_coords }) =>
  x_coords[0] >= -50 && x_coords[1] <= 50 &&
  y_coords[0] >= -50 && y_coords[1] <= 50 &&
  z_coords[0] >= -50 && z_coords[1] <= 50
);
const A_fragments = getFragments(A_instructions);
const result_A =  A_fragments.reduce((total, fragment) => total + getVolume(fragment), 0);

// B
const all_fragments = instructions.reduce((fragments, instruction, i) => {
  const broken_fragments = fragments.reduce(
    (acc, fragment) => acc.concat(removeVolumefromOther(fragment, instruction)), []
  );
  return [
    ...broken_fragments,
    ...(instruction.turn_on ? [instruction] : []),
  ];
}, []);
const result_B =  all_fragments.reduce((total, fragment) => total + getVolume(fragment), 0);
