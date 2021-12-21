// Setup
const input = document.body.innerText.split('\n').filter(x => x);
const p1_start = parseInt(input[0].split(': ')[1]) - 1;
const p2_start = parseInt(input[1].split(': ')[1]) - 1;

// A
const playGame = (p1_start, p2_start) => {
  let p1_score = 0;
  let p2_score = 0;
  let p1_position = p1_start;
  let p2_position = p2_start;
  let dice_thrown = 0;
  let p1_turn = true;
  while (p1_score < 1000 && p2_score < 1000) {
    const number_to_add = 3*dice_thrown + 6;
    dice_thrown += 3;
    if (p1_turn) {
      p1_position = (p1_position + number_to_add)%10;
      p1_score = p1_score + p1_position + 1;
    } else {
      p2_position = (p2_position + number_to_add)%10;
      p2_score = p2_score + p2_position + 1;
    }
    p1_turn = !p1_turn;
  }
  return { p1_score, p2_score, dice_thrown };
};
const game_A = playGame(p1_start, p2_start);
const result_A = game_A.dice_thrown*Math.min(game_A.p1_score, game_A.p2_score);

// B
const dirac_distribution = { // Num cases of 3 Dirac Die summing X
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};

const countVictories = (scores, positions, p1_turn) => {
  if (scores[0] > 20) return [1, 0];
  if (scores[1] > 20) return [0, 1];
  const victories = Object.entries(dirac_distribution).map(
    ([die_sum, probability]) => {
      const next_positions = [
        (positions[0] + (p1_turn ? parseInt(die_sum) : 0))%10,
        (positions[1] + (p1_turn ? 0 : parseInt(die_sum)))%10,
      ];
      const next_scores = [
        scores[0] + (p1_turn ? (next_positions[0]+1) : 0),
        scores[1] + (p1_turn ? 0 : (next_positions[1]+1)),
      ];
      const sub_victories = countVictories(next_scores, next_positions, !p1_turn);
      return [
        probability*sub_victories[0],
        probability*sub_victories[1],
      ];
    }
  );
  return victories.reduce((results, result) => [
    results[0] + result[0],
    results[1] + result[1],
  ], [0, 0]);
};
const result_B = Math.max(...countVictories([0,0], [p1_start-1,p2_start-1], true));
