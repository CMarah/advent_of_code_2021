// A
const lines = document.body.innerText.split('\n').filter(x => x);
const map = (new Array(lines.length)).fill(0)
  .map((row, i) => lines[i].split('').map(x => parseInt(x)));

const findPathWithCost = (running_cost, map, next_nodes, done) => {
  const valid_next_nodes_with_cost = (next_nodes[running_cost] || [])
    .filter(node => !done[node.split('_')[0]][node.split('_')[1]]);
  if (valid_next_nodes_with_cost.includes(`${map.length-1}_${map[0].length-1}`)) { // Found exit
    return running_cost;
  }
  if (!valid_next_nodes_with_cost.length) { // No available nodes to move through, increase cost
    return findPathWithCost(running_cost+1, map, next_nodes, done);
  }
  const new_next_nodes = valid_next_nodes_with_cost.reduce((nn, node) => {
    const node_x = parseInt(node.split('_')[0]);
    const node_y = parseInt(node.split('_')[1]);
    const possible_movements = [
      [node_x,   node_y-1],
      [node_x,   node_y+1],
      [node_x-1, node_y  ],
      [node_x+1, node_y  ],
    ];
    possible_movements.forEach(([move_x, move_y]) => {
      if (
        0 <= move_x && move_x < map.length &&
        0 <= move_y && move_y < map.length &&
        !done[move_x][move_y]
      ) {
        const move_cost = running_cost + map[move_x][move_y];
        if (!nn[move_cost] || !nn[move_cost].includes(`${move_x}_${move_y}`)) {
          nn[move_cost] = (nn[move_cost] || []).concat(`${move_x}_${move_y}`);
        }
      }
    });
    return nn;
  }, next_nodes);
  const new_done = valid_next_nodes_with_cost.reduce((new_done, node) => {
    const node_x = parseInt(node.split('_')[0]);
    const node_y = parseInt(node.split('_')[1]);
    done[node_x][node_y] = 1;
    return done;
  }, done);
  return findPathWithCost(running_cost + 1, map, new_next_nodes, done);
};

const initial_next_nodes = map[0][1] === map[1][0] ?
  ({ [map[0][1]]: ['0_1', '1_0'] }) :
  ({ [map[0][1]]: ['0_1'], [map[1][0]]: ['1_0'] });
const initial_done = (new Array(map.length)).fill(0)
  .map(() => new Array(map.length).fill(0));
const result_A = findPathWithCost(1, map, initial_next_nodes, initial_done);

// B
const lines_B = lines.map(l => l.split('').map(x => parseInt(x) - 1));
const map_B = (new Array(5 * lines.length)).fill(0)
  .map((row, i) => {
    const tile_row_extra = Math.floor(i/lines.length);
    return ([
      ...lines_B[i%lines.length],
      ...lines_B[i%lines.length].map(x => x+1),
      ...lines_B[i%lines.length].map(x => x+2),
      ...lines_B[i%lines.length].map(x => x+3),
      ...lines_B[i%lines.length].map(x => x+4),
    ]).map(x => (x + tile_row_extra)%9 + 1);
  });
const initial_next_nodes_B = map[0][1] === map[1][0] ?
  ({ [map[0][1]]: ['0_1', '1_0'] }) :
  ({ [map[0][1]]: ['0_1'], [map[1][0]]: ['1_0'] });
const initial_done_B = (new Array(5*map.length)).fill(0)
  .map(() => new Array(5*map.length).fill(0));
const result_B = findPathWithCost(1, map_B, initial_next_nodes, initial_done_B);
