// Setup

const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`.split('\n').filter(x => x);

//const base_distr = ['','',['B','D','D','A'],'',['C','C','B','D'],'',['B','B','A','C'],'',['D','A','C','A'],'',''];
//const base_distr = ['A','A',['','','D','A'],'',['B','B','B','B'],'',['C','C','C','C'],'',['','','D','D'],'A','D'];
const base_distr = ['','',['D','D','D','B'],'',['C','C','B','C'],'',['A','B','A','D'],'',['B','A','C','A'],'',''];

const TARGET = { 'A': 2, 'B': 4, 'C': 6, 'D': 8 };
const COST   = { 'A': 1, 'B': 10, 'C': 100, 'D': 1000 };

const checkDone = distribution =>
  distribution[2][0] === 'A' && distribution[2][1] === 'A' &&
  distribution[4][0] === 'B' && distribution[4][1] === 'B' &&
  distribution[6][0] === 'C' && distribution[6][1] === 'C' &&
  distribution[8][0] === 'D' && distribution[8][1] === 'D';

const sameDistribution = (distr_A, distr_B) =>
  JSON.stringify(distr_A) === JSON.stringify(distr_B);

const occupiedPath = (distr, point_A, point_B) => {
  const start = Math.min(point_A, point_B);
  const finish = Math.max(point_A, point_B);
  return distr.some(
    (x, i) => start < i && i < finish && i%2 === 1 && distr[i]
  );
};
const occupiedRoom = (room, c) => room.some(c2 => c2 && c !== c2);

const copyDistribution = distr => distr.map((x, i) => Array.isArray(x) ? x.map(c => c) : x);

const correctlyPlaced = (c, index, room_pos, distr) => {
  if (!TARGET[c] === room_pos) return false;
  return distr[room_pos].slice(index+1).every(c2 => c === c2);
};

const getNextMoves = distr => {
  let moves = [];
  [0,1,3,5,7,9,10].forEach(hall_pos => {
    if (!distr[hall_pos]) { // Hall Position is empty
      [2,4,6,8].forEach(room_pos => {
        if (occupiedPath(distr, hall_pos, room_pos)) return;
        if (distr[room_pos][0]) {
          const c = distr[room_pos][0];
          if (correctlyPlaced(c, 0, room_pos, distr)) return;
          let new_distr = copyDistribution(distr);
          new_distr[hall_pos] = c;
          new_distr[room_pos][0] = '';
          moves.push({
            cost: COST[c]*(Math.abs(room_pos - hall_pos) + 1),
            distr: new_distr,
          });
        } else if (distr[room_pos][1]) {
          const c = distr[room_pos][1];
          if (correctlyPlaced(c, 0, room_pos, distr)) return;
          let new_distr = copyDistribution(distr);
          new_distr[hall_pos] = c;
          new_distr[room_pos][1] = '';
          moves.push({
            cost: COST[c]*(Math.abs(room_pos - hall_pos) + 2),
            distr: new_distr,
          });
        } else if (distr[room_pos][2]) {
          const c = distr[room_pos][2];
          if (correctlyPlaced(c, 0, room_pos, distr)) return;
          let new_distr = copyDistribution(distr);
          new_distr[hall_pos] = c;
          new_distr[room_pos][2] = '';
          moves.push({
            cost: COST[c]*(Math.abs(room_pos - hall_pos) + 3),
            distr: new_distr,
          });
        } else if (distr[room_pos][3]) {
          const c = distr[room_pos][3];
          if (TARGET[c] === room_pos) return;
          let new_distr = copyDistribution(distr);
          new_distr[hall_pos] = c;
          new_distr[room_pos][3] = '';
          moves.push({
            cost: COST[c]*(Math.abs(room_pos - hall_pos) + 4),
            distr: new_distr,
          });
        }
      });
    } else { // Hall is occupied
      const c = distr[hall_pos];
      const target = TARGET[c];
      if (occupiedRoom(distr[target], c)) return;
      if (occupiedPath(distr, hall_pos, target)) return;
      if (!distr[target][3]) {
        let new_distr = copyDistribution(distr);
        new_distr[hall_pos] = '';
        new_distr[target][3] = c;
        moves.push({
          cost: COST[c]*(Math.abs(target - hall_pos) + 4),
          distr: new_distr,
        });
      } else if (!distr[target][2]) {
        let new_distr = copyDistribution(distr);
        new_distr[hall_pos] = '';
        new_distr[target][2] = c;
        moves.push({
          cost: COST[c]*(Math.abs(target - hall_pos) + 3),
          distr: new_distr,
        });
      } else if (!distr[target][1]) {
        let new_distr = copyDistribution(distr);
        new_distr[hall_pos] = '';
        new_distr[target][1] = c;
        moves.push({
          cost: COST[c]*(Math.abs(target - hall_pos) + 2),
          distr: new_distr,
        });
      } else {
        let new_distr = copyDistribution(distr);
        new_distr[hall_pos] = '';
        new_distr[target][0] = c;
        moves.push({
          cost: COST[c]*(Math.abs(target - hall_pos) + 1),
          distr: new_distr,
        });
      }
    }
  });
  return moves;
};

const mainLoop = base_distr => {
  let current_cost = 0;
  let cost_distr_obj = { 0: [base_distr] };
  let done = [];
  while (true) {
    console.log(current_cost, cost_distr_obj[current_cost].length);
    const current_distr = cost_distr_obj[current_cost]
      .filter(distr => !done.includes(JSON.stringify(distr)));
    if (current_distr.some(checkDone)) return current_cost;
    current_distr.forEach(distr => {
      const next_moves = getNextMoves(distr);
      next_moves.forEach(move => {
        const move_cost = current_cost + move.cost;
        const distr_with_cost = cost_distr_obj[move_cost];
        if (!distr_with_cost) cost_distr_obj[move_cost] = [move.distr];
        else if (!distr_with_cost.some(dcost => sameDistribution(dcost, move.distr))) {
          cost_distr_obj[move_cost].push(move.distr);
        }
      });
      done.push(JSON.stringify(distr));
    });
    delete cost_distr_obj[current_cost];
    current_cost = Math.min(...Object.keys(cost_distr_obj).map(k => parseInt(k)));
  }
};
const result_A = mainLoop(base_distr);
console.log(result_A);
