import { ChessEngineAPI } from "./dist/tonnetto.bundle.js";

self.onmessage = function(event) {
  const message = JSON.parse(event.data);
  const engine = new ChessEngineAPI({ fen: message.fen })
  const bestMove = engine.getBestMove(message.depth);
  self.postMessage(bestMove); // send the best move back to the main thread
};