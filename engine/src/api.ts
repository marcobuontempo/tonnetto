import { BOARD_STATES, DEFAULT_FEN, ENCODED_MOVE, PIECE_MASK, TURN } from './constants';
import Engine from './engine';

declare global {
  interface Window {
    [name: string]: ChessEngineAPI;
  }
}

interface ConstructorOptions {
  fen?: string;
  debug?: boolean;
}

export default class ChessEngineAPI {
  private initialFEN: string;
  private engine: Engine;
  private debug: boolean;
  private start: number;

  constructor(options: ConstructorOptions = {}) {
    const { fen, debug } = options;
    this.engine = new Engine(fen || DEFAULT_FEN);
    this.initialFEN = fen || DEFAULT_FEN;
    this.debug = debug ?? false;
    this.start = 0;
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

  /* checks if current king is in check */
  isKingInCheck() {
    const currentTurn = ((this.engine.chessboard.state[this.engine.chessboard.ply]) & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK;
    return this.engine.kingIsInCheck(currentTurn);
  }

  /* get the game state (breakdown of information from the FEN) */
  getGameState() {
    const [board, turn, castle, ep, halfmove, fullmove] = this.engine.chessboard.getFen();
    return {
      board,
      turn,
      castle,
      ep,
      halfmove: parseInt(halfmove),
      fullmove: parseInt(halfmove),
    }
  }

  /* (playing | 50 move | stalemate | checkmate) */
  isGameOver() {
    const moves = this.getBestMove(1);
    const kingInCheck = this.isKingInCheck();
    const { halfmove } = this.getGameState();

    if (halfmove === 100) {
      return '50-move';
    }

    if (moves === null) {
      if (kingInCheck) {
        return 'checkmate';
      } else {
        return 'stalemate';
      }
    }

    return 'playing';
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
    if (this.debug) {
      this.start = performance.now();
    }
    const currentTurn = ((this.engine.chessboard.state[this.engine.chessboard.ply]) & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK;
    const { bestMove } = this.engine.negamax(depth, currentTurn);

    if (this.debug) {
      console.log(`${(performance.now() - this.start) / 1000} seconds`);
    }

    return bestMove ? Engine.encodedMoveToAlgebraic(bestMove) : bestMove;
  }

  /* perft for a specific position and depth */
  perft({ position = DEFAULT_FEN, depth = 5 }: { position?: string, depth?: number } = {}) {
    this.setFen(position);
    this.engine.perft(depth, true);
  }

  /* adds this instance to the global window namespace, so it is callable within browser */
  mountToWindow(name = 'chessEngine') {
    if (typeof window !== 'undefined') {
      window[name] = this;
    }
  }

  /* prints board using ascii characters to cli/console 8 */
  print() {
    this.engine.chessboard.printBoard();
  }
}