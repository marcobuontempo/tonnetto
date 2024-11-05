import { TURN } from "./constants";
import Engine from "./engine";

const engine = new Engine();

const start = performance.now();
// const perft = engine.perft(4, true);
const moves = engine.negamax(6, TURN.WHITE);
const time = performance.now() - start;

console.log(engine.mynodes)
