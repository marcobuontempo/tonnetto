import { BOARD_STATES, DEFAULT_FEN, ENCODED_MOVE, PIECE_MASK, TURN } from './constants';
import Engine from './engine';

declare global {
  interface Window {
    [name: string]: ChessEngineAPI;
  }
}

export default class ChessEngineAPI {
  private initialFEN: string;
  private engine: Engine;

  constructor(fen?: string) {
    this.engine = new Engine(fen);
    this.initialFEN = fen || DEFAULT_FEN;
  }

  /* sets the board state according to new FEN input. removes existing engine state */
  setFen(fen: string) {
    this.engine = new Engine(fen);
    this.initialFEN = fen;
  }

  /* gets the current board FEN */
  getFen() {
    return this.engine.chessboard.getFen();
  }

  /* resets board to the last provided FEN */
  resetBoard() {
    this.engine = new Engine(this.initialFEN);
  }

  /* apply a move to the board with algebraic notation. i.e. e2e4 */
  applyMove(move: string) {
    if (!/^[a-h][1-8][a-h][1-8]$/.test(move.toLowerCase())) return false;  // don't allow invalid algebraic input

    const [from, to] = Engine.algebraicMoveToIndexes(move);

    const turnColour = this.engine.chessboard.board[from] & PIECE_MASK.COLOUR;
    if (turnColour !== TURN.WHITE && turnColour !== TURN.BLACK) return false;  // ensure square to move actually contains a piece

    const legalMoves = this.engine.generateLegalMoves(turnColour);  // find the encoded move information
    const legalMove = legalMoves.find(legalMove => 
      (legalMove & ENCODED_MOVE.FROM_INDEX) === from && 
      ((legalMove & ENCODED_MOVE.TO_INDEX) >> 8) === to
    );

    if (!legalMove) return false;  // if no move found, then it isn't legal or existing

    this.engine.makeMove(legalMove);  // finally, make the move on the board
  }

  /* undo the last move made. can keep being called to first move */
  undoMove() {
    const lastMove = this.engine.moveHistory[this.engine.chessboard.ply];
    if (lastMove === 0) return false;  // no more moves to undo
    this.engine.unmakeMove(lastMove);
  }

  /* searches and returns the best move in the position, up to a specified depth */
  getBestMove(depth = 5) {
    const currentTurn = ((this.engine.chessboard.state[this.engine.chessboard.ply]) & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK;
    const { bestMove } = this.engine.negamax(depth, currentTurn);
    return Engine.encodedMoveToAlgebraic(bestMove);
  }

  /* adds this instance to the global window namespace, so it is callable within browser */
  mountToWindow(name = 'chessEngine') {
    if (typeof window !== 'undefined') {
      window[name] = this;
    }
  }
}