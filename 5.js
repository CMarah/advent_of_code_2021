// A
const lines = document.body.innerText.split('\n').filter(x => x);
const map_A = lines.reduce((m, line) => {
  const [ start, end ] = line.split(' -> ');
  const [ x1, y1 ] = start.split(',').map(n => parseInt(n));
  const [ x2, y2 ] = end.split(',').map(n => parseInt(n));
  const startX = Math.min(x1,x2);
  const endX = Math.max(x1,x2);
  const startY = Math.min(y1,y2);
  const endY = Math.max(y1,y2);
  if (startX === endX) {
    return m.map((r, i) => i !== startX ? r :
      r.map((e, j) => startY <= j && j <= endY ? (e+1) : e)
    );
  }
  if (startY === endY) {
    return m.map((r, i) => startX <= i && i <= endX ?
      r.map((e, j) => startY === j ? (e+1) : e) : r
    );
  }
  return m;
}, (new Array(1000)).fill(new Array(1000).fill(0)));
const result_A = map_A.reduce(
  (total, r) => total + r.reduce((partial, e) => e > 1 ? (partial + 1) : partial, 0), 0
);

// B
const map_B = lines.reduce((m, line) => {
  const [ start, end ] = line.split(' -> ');
  const [ x1, y1 ] = start.split(',').map(n => parseInt(n));
  const [ x2, y2 ] = end.split(',').map(n => parseInt(n));
  const startX = Math.min(x1,x2);
  const endX = Math.max(x1,x2);
  const startY = Math.min(y1,y2);
  const endY = Math.max(y1,y2);
  if (startX === endX) return m.map((r, i) => i !== startX ? r :
    r.map((e, j) => startY <= j && j <= endY ? (e+1) : e)
  );
  if (startY === endY) return m.map((r, i) => startX <= i && i <= endX ?
    r.map((e, j) => startY === j ? (e+1) : e) : r
  );
  const descending = (startX === x1 ? y1 : y2) > (startX === x1 ? y2 : y1);
  return m.map((r, i) => startX > i || i > endX ? r : r.map((e, j) =>
    (j === (startX === x1 ? y1 : y2) + (descending ? (-1) : 1) * (i - startX)) ? (e+1) : e
  ));
}, (new Array(1000)).fill(new Array(1000).fill(0)))
const result_B = map_B.reduce(
  (total, r) => total + r.reduce((partial, e) => e > 1 ? (partial + 1) : partial, 0), 0
);
