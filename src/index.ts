import { PIECE, PIECE_SQUARE_TABLE, TURN } from "./constants";
import Engine from "./engine";

const engine = new Engine();

// const start = performance.now();
// const perft = engine.perft(5, true);
// const time = performance.now() - start;

// console.log(perft, time);

console.log(engine.decodeMove(engine.negamax(2, TURN.WHITE).bestMove));

// const [moves, moveCount] = engine.generateLegalMoves(TURN.WHITE);

// for (let i = 0; i < moveCount; i++) {
//   console.log(engine.decodeMove(moves[i]));
// }