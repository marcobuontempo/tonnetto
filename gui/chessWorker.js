import TonnettoEngine from 'https://cdn.jsdelivr.net/npm/tonnetto';

self.onmessage = function(event) {
  const message = JSON.parse(event.data);
  const engine = new TonnettoEngine({ fen: message.fen })
  const bestMove = engine.getBestMove(message.depth);
  self.postMessage(bestMove); // send the best move back to the main thread
};