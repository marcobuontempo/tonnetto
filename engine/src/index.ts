import Engine from './engine';
import ChessEngineAPI from './api';
import ChessBoard from './chessboard';
import UCIInterface from './uci';
import { TURN } from './constants';

const engine = new ChessEngineAPI();

// if node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const uciInstance = new UCIInterface(engine);
  uciInstance.startListening();
}

// if browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  engine.mountToWindow();
}

export { 
  ChessBoard,
  Engine,
  ChessEngineAPI,
  TURN,
};
