// Setup
const data = document.body.innerText;
const scanner_data = data.split('\n\n').map(
  block => block.split('\n').slice(1).map(line => line.split(',').map(x => parseInt(x)))
);

const ORIENTATIONS = [
  [1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],
  [-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],
];
const REORDERINGS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];

const moveToPoint = (data, point) => data.map(p => p.map((coord, i) => coord - point[i]));

const pointsInCommon = (data1, data2) => data1.filter(
  point1 => data2.some(point2 => point1.every((coord, i) => coord === point2[i]))
);

const get12CommonPoints = (data_A, data_B) => {
  for (const point_A of data_A) {
    for (const point_B of data_B) {
      const data_A_moved   = moveToPoint(data_A, point_A);
      const data_B_moved = moveToPoint(data_B, point_B);
      const common_points = pointsInCommon(data_A_moved, data_B_moved);
      if (common_points.length >= 12) {
        const correct_A_points = moveToPoint(common_points, point_A.map(c => -c));
        const correct_B_points = moveToPoint(common_points, point_B.map(c => -c));
        return {
          block_A_points: correct_A_points,
          block_B_points: correct_B_points,
        };
      }
    }
  }
};

const getScannersRelativePosition = (data_A, data_B) => {
  const all_data_A_rotations = ORIENTATIONS.map(
    orientation => data_A.map(point => point.map((coord, i) => coord * orientation[i]))
  )
    .reduce((data_rotations, data_block) => data_rotations.concat(
      REORDERINGS.map(reorder => data_block.map(point => [
        point[reorder[0]],
        point[reorder[1]],
        point[reorder[2]],
      ]))
    ), []);
  for(let rotation_index = 0; rotation_index < all_data_A_rotations.length; ++rotation_index){
    const rotation = all_data_A_rotations[rotation_index];
    const twelve_common_points = get12CommonPoints(rotation, data_B);
    if (twelve_common_points) {
      const { block_A_points, block_B_points } = twelve_common_points;
      const scanner_A_position_from_B = block_A_points[0].map(
        (coord, index) => block_B_points[0][index] - coord
      );
      const rotation = ORIENTATIONS[Math.floor(rotation_index/6)];
      const reorder  = REORDERINGS[rotation_index%6];
      return {
        rotation,
        reorder,
        position: scanner_A_position_from_B,
      };
    }
  }
  return null;
};

const transformPosition = (position, rotation, reorder, translation) => position
  .map((coord, index) => rotation[index]*coord)
  .map((coord, index, pos) => translation[index] + pos[reorder[index]]);

const getScannersInfo = raw_scanner_data => {
  // Get positions relative to scanner 0
  let scanner_data = raw_scanner_data.slice(0);
  let scanner_position_info = new Array(scanner_data.length).fill(null);
  let scanners_done = [];
  scanner_position_info[0] = [0,0,0];
  while (scanner_position_info.some(info => !info)) {
    const scanner_to_use = scanner_position_info
      .map((x, i) => i)
      .filter(i => !scanners_done.includes(i) && scanner_position_info[i])[0];
    const position = scanner_position_info[scanner_to_use];
    const new_scanner_info = scanner_data.map((data, i) => {
      if (scanner_position_info[i]) return;
      return getScannersRelativePosition(scanner_data[i], scanner_data[scanner_to_use]);
    });
    new_scanner_info.forEach((info, i) => {
      if (info) {
        scanner_position_info[i] = info.position;
        scanner_data[i] = scanner_data[i].map(
          point => transformPosition(point, info.rotation, info.reorder, info.position)
        );
      }
    });
    scanners_done = scanners_done.concat(scanner_to_use);
  }
  return {
    scanner_position_info,
    scanner_data,
  };
};
const scanners_info = getScannersInfo(scanner_data);

// A
const all_beacons = [...new Set(scanners_info.scanner_data.reduce((all_data, scanner_data) =>
  all_data.concat(scanner_data.map(beacon => JSON.stringify(beacon)))
, []))];
const result_A = all_beacons.length;

// B
const getDistance = (point_1, point_2) => point_1.map(
  (coord, index) => Math.abs(coord - point_2[index])
).reduce((sum, coord) => sum + coord, 0);

const getMaxDistanceScanners = scanners_info => {
  let max_distance = 0;
  const positions = scanners_info.scanner_position_info;
  for (const scanner_1 of positions) {
    for (const scanner_2 of positions) {
      const distance = getDistance(scanner_1, scanner_2);
      if (distance > max_distance) max_distance = distance;
    }
  }
  return max_distance;
};
const result_B = getMaxDistanceScanners(scanners_info);
