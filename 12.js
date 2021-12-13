// A
const lines = document.body.innerText.split('\n').filter(x => x);
const connections = lines.reduce((conn, line) => {
  const [v1, v2] = line.split('-');
  return {
    ...conn,
    [v1]: (conn[v1] || []).concat(v2),
    [v2]: (conn[v2] || []).concat(v1),
  };
}, {});

const progressPathA = (prev_path, connections) => {
  if (prev_path.includes('end')) return [prev_path];
  const possible_next_steps = connections[prev_path[prev_path.length - 1]]
    .filter(next => next.toLowerCase() !== next || !prev_path.includes(next));
  if (!possible_next_steps.length) return [];
  const descendant_paths = possible_next_steps.map(
    next => progressPathA(prev_path.concat(next), connections)
  );
  return descendant_paths.reduce((paths, desc_paths) => paths.concat(desc_paths), []);
};
const result_A = progressPathA(['start'], connections).length;

// B
const progressPathB = (prev_path, connections) => {
  if (prev_path.includes('end')) return [prev_path];
  const some_lowercase_visited_twice = prev_path.some((v, i) =>
    v.toLowerCase() === v && prev_path.slice(i+1).includes(v)
  );
  const possible_next_steps = connections[prev_path[prev_path.length - 1]]
    .filter(next => next !== 'start')
    .filter(next =>
      next.toLowerCase() !== next ||
      (!some_lowercase_visited_twice || !prev_path.includes(next))
    );
  if (!possible_next_steps.length) return [];
  const descendant_paths = possible_next_steps.map(
    next => progressPathB(prev_path.concat(next), connections)
  );
  return descendant_paths.reduce((paths, desc_paths) => paths.concat(desc_paths), []);
};
const result_B = progressPathB(['start'], connections).length;
