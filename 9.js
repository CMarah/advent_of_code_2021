// A
const lines = document.body.innerText.split('\n').filter(x => x);
const line_width = lines[0].length;
const result_A = lines.join('').split('')
  .map(p => parseInt(p))
  .reduce((res, p, i, arr) => {
    if (i%line_width !== 0            && p >= arr[i-1]) return res;
    if ((i+1)%line_width !== 0        && p >= arr[i+1]) return res;
    if (i >= line_width               && p >= arr[i-line_width]) return res;
    if (i < (arr.length - line_width) && p >= arr[i+line_width]) return res;
    return res + 1 + p;
  }, 0);

// B
const getNeighbours = (i, line_width, arr_length) => ([
  i%line_width === 0             ? '' : `${(i-1)%line_width}_${Math.floor(i/line_width)}`,
  (i+1)%line_width === 0         ? '' : `${(i+1)%line_width}_${Math.floor(i/line_width)}`,
  i < line_width                 ? '' : `${i%line_width}_${Math.floor(i/line_width - 1)}`,
  i >= (arr_length - line_width) ? '' : `${i%line_width}_${Math.floor(i/line_width + 1)}`,
]).filter(x => x); // format is y-coord_x-coord

const basins = lines.join('').split('')
  .map(p => parseInt(p))
  .reduce((basins, p, i, arr) => {
    if (p === 9) return basins;
    const neighbours = getNeighbours(i, line_width, arr.length);
    // Remove connected basins, add new main one
    const connected_basins_indexes = basins
      .map((b, bi) => neighbours.some(n => b.includes(n)) ? bi : -1)
      .filter(bi => bi !== -1);
    const position_id = `${i%line_width}_${Math.floor(i/line_width)}`;
    const new_basin = basins.reduce((acc, b, bi) =>
      !connected_basins_indexes.includes(bi) ? acc : acc.concat(b)
    , [position_id]);
    return [
      ...basins.filter((b, bi) => !connected_basins_indexes.includes(bi)),
      new_basin,
    ];
  }, [])
  .sort((a, b) => b.length - a.length);
const result_B = basins[0].length * basins[1].length * basins[2].length;
