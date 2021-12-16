// Setup
const lines = document.body.innerText.split('\n').filter(x => x);

const alreadyHasNode = (node_array, [pos_x, pos_y]) => (node_array || []).some(
  ([ node_x, node_y ]) => node_x === pos_x && node_y === pos_y
);

const addFoundNodes = (map_cost_nodes, next_nodes, cave, done, running_cost) =>
  // Add adjacent nodes to cost_nodes object;  { [cost]: [nodes with cost] }
  next_nodes.reduce((new_map_cost_nodes, [node_x, node_y]) => {
    const possible_movements = [
      [node_x,   node_y-1],
      [node_x,   node_y+1],
      [node_x-1, node_y  ],
      [node_x+1, node_y  ],
    ].filter(([move_x, move_y]) =>
      // check move node is inside cave & has not been done
      0 <= move_x && move_x < cave.length &&
      0 <= move_y && move_y < cave.length &&
      !done[move_x][move_y]
    );
    possible_movements.forEach(([move_x, move_y]) => {
      // if we don't already have move with that cost, add it
      const move_cost = running_cost + cave[move_x][move_y];
      if (!alreadyHasNode(new_map_cost_nodes[move_cost], [move_x, move_y])) {
        new_map_cost_nodes[move_cost] = (new_map_cost_nodes[move_cost] || [])
          .concat([[move_x, move_y]]);
      }
    });
    return map_cost_nodes;
  }, map_cost_nodes);

const containsExit = (valid_next_nodes, cave) => valid_next_nodes.some(
  ([node_x, node_y]) => node_x === cave.length - 1 && node_y === cave[0].length -1
);

const findExitCost = cave => {
  let cost = 1;
  let map_cost_nodes = cave[0][1] === cave[1][0] ? // { [cost]: [nodes with cost] }
    ({ [cave[0][1]]: [[0,1], [1,0]] }) :
    ({ [cave[0][1]]: [[0,1]], [cave[1][0]]: [[1,0]] });
  let nodes_done = (new Array(cave.length)).fill(0) // Matrix filled with 0s
    .map(() => new Array(cave.length).fill(0));
  // Array of unvisited nodes with given cost
  let next_nodes = map_cost_nodes[cost] || [];
  while (!containsExit(next_nodes, cave)) {
    if (next_nodes.length) {
      map_cost_nodes = addFoundNodes(map_cost_nodes, next_nodes, cave, nodes_done, cost);
      next_nodes.forEach(([node_x, node_y]) => {
        nodes_done[node_x][node_y] = 1;
      });
    }
    cost += 1;
    next_nodes = (map_cost_nodes[cost] || [])
      .filter(([node_x, node_y]) => !nodes_done[node_x][node_y]);
  }
  return cost;
};

// A
const cave = (new Array(lines.length)).fill(0)
  .map((row, i) => lines[i].split('').map(x => parseInt(x)));
const result_A = findExitCost(cave);

// B
const cave_B = (new Array(5 * lines.length)).fill(0).map((row, i) =>
  (new Array(5 * lines.length)).fill(0).map((x, j) => {
    const tile_row_extra = Math.floor(i/lines.length);
    const tile_col_extra = Math.floor(j/lines.length);
    return (cave[i%lines.length][j%lines.length] + tile_row_extra + tile_col_extra - 1)%9 + 1;
  })
);
const result_B = findExitCost(cave_B);
