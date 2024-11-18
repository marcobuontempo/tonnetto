import { BOARD_STATES, DEFAULT_FEN, ENCODED_MOVE, PIECE, PIECE_LOOKUP, PIECE_MASK, SQUARE_ASCII, TURN } from './constants';
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

/**
 * @class ChessEngineAPI
 * 
 * ChessEngineAPI is a wrapper around the chess engine logic.
 * It provides methods for managing the game state, applying moves, 
 * checking the game status, and interfacing with the chess engine.
 */
export default class ChessEngineAPI {
  private initialFEN: string;
  private engine: Engine;
  private debug: boolean;
  private start: number;

  /**
   * Creates an instance of ChessEngineAPI.
   * 
   * @param {Object} [options] - The constructor options.
   * @param {string} [options.fen] - The initial FEN string representing the game state.
   * @param {boolean} [options.debug=false] - Whether to enable debug logging.
   */
  constructor(options: ConstructorOptions = {}) {
    const { fen, debug } = options;
    this.engine = new Engine(fen || DEFAULT_FEN);
    this.initialFEN = fen || DEFAULT_FEN;
    this.debug = debug ?? false;
    this.start = 0;
  }

  /**
   * Sets the board state according to a new FEN input and resets the engine state.
   * 
   * @param {string} fen - The new FEN string to set the board state.
   */
  setFen(fen: string) {
    this.engine = new Engine(fen);
    this.initialFEN = fen;
  }

  /**
   * Gets the current board FEN string.
   * 
   * @returns {string} The current board state in FEN format.
   */
  getFen(): string {
    return this.engine.chessboard.getFen();
  }

  /**
   * Resets the board to the last provided FEN string. (i.e. the initial FEN when instantiated, or the last call to setFen())
   */
  resetBoard() {
    this.engine = new Engine(this.initialFEN);
  }

  /**
   * Checks if the current turn's king is in check.
   * 
   * @returns {boolean} True if the king is in check, false otherwise.
   */
  isKingInCheck(): boolean {
    const currentTurn = ((this.engine.chessboard.state[this.engine.chessboard.ply]) & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK;
    return this.engine.kingIsInCheck(currentTurn);
  }

  /**
   * Retrieves the current game state from the FEN string.
   * 
   * @returns {Object} The current game state containing board, turn, castle, ep, halfmove, and fullmove information.
   * @returns {string} returns.board - The board state in FEN format.
   * @returns {string} returns.turn - The turn (either 'w' for white or 'b' for black).
   * @returns {string} returns.castle - The castling rights as a string.
   * @returns {string} returns.ep - The en passant target square, if any.
   * @returns {number} returns.halfmove - The halfmove clock (number of half-moves since the last pawn move or capture).
   * @returns {number} returns.fullmove - The fullmove number.
   */
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

  /**
   * Checks if the game is over (50-move rule, checkmate, stalemate, or still playing).
   * 
   * @returns {string} One of '50-move', 'checkmate', 'stalemate', or 'playing'.
   */
  isGameOver(): string {
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

  /**
   * Applies a move to the board in algebraic notation (e.g. "e2e4").
   * 
   * @param {string} move - The move in algebraic notation.
   * @returns {boolean} True if the move was valid and applied, false otherwise.
   */
  applyMove(move: string): boolean {
    if (!/^[a-h][1-8][a-h][1-8][bnrq]?$/.test(move.toLowerCase())) return false;  // don't allow invalid algebraic input

    const [from, to] = Engine.algebraicMoveToIndexes(move);
    const promotion = move.substring(4,5).toUpperCase();

    const turnColour = this.engine.chessboard.board[from] & PIECE_MASK.COLOUR;
    if (turnColour !== TURN.WHITE && turnColour !== TURN.BLACK) return false;  // ensure square to move actually contains a piece

    const legalMoves = this.engine.generateLegalMoves(turnColour);  // find the encoded move information
    const legalMove = legalMoves.find(legalMove => 
      (legalMove & ENCODED_MOVE.FROM_INDEX) === from && 
      ((legalMove & ENCODED_MOVE.TO_INDEX) >> 8) === to &&
      (((legalMove & ENCODED_MOVE.PROMOTION_TO) >> 25) === (PIECE_LOOKUP[promotion] || 0))
    );

    if (!legalMove) return false;  // if no move found, then it isn't legal or existing

    this.engine.makeMove(legalMove);  // finally, make the move on the board
    return true;
  }

  /**
   * Undoes the last move made.
   * 
   * @returns {boolean} True if a move was undone, false if no moves are left to undo.
   */
  undoMove(): boolean {
    const lastMove = this.engine.moveHistory[this.engine.chessboard.ply];
    if (lastMove === 0) return false;  // no more moves to undo
    this.engine.unmakeMove(lastMove);
    return true;
  }

  /**
   * Searches and returns the best move for the current position up to a specified depth.
   * 
   * @param {number} [depth=5] - The depth, in ply, to search for the best move.
   * @returns {string|null} The best move in algebraic notation or null if no move is found.
   */
  getBestMove(depth: number = 5): string | null {
    if (this.debug) {
      this.start = performance.now();
    }
    const currentTurn = ((this.engine.chessboard.state[this.engine.chessboard.ply]) & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK;
    const { bestMove } = this.engine.negamax(depth, currentTurn);

    if (this.debug) {
      console.log(`${(performance.now() - this.start) / 1000} seconds`);
    }

    if (bestMove) {
      const algebraic = Engine.encodedMoveToAlgebraic(bestMove);
      const promotion = SQUARE_ASCII[((bestMove & ENCODED_MOVE.PROMOTION_TO) >> 25) | PIECE.IS_BLACK];
      return `${algebraic}${promotion || ''}`;
    }
    return null;
  }

  /**
   * Performs a perft (performance test) for a given position and depth.
   * 
   * @param {Object} options - The perft options.
   * @param {string} [options.position=DEFAULT_FEN] - The FEN string representing the position to test.
   * @param {number} [options.depth=5] - The depth to search for perft.
   */
  perft({ position = DEFAULT_FEN, depth = 5 }: { position?: string, depth?: number } = {}) {
    this.setFen(position);
    this.engine.perft(depth, true);
  }

  /**
   * Mounts this instance to the global window namespace, making it accessible in the browser.
   * 
   * @param {string} [name='tonnetto'] - The name under which the instance will be available in the global scope.
   */
  mountToWindow(name: string = 'tonnetto') {
    if (typeof window !== 'undefined') {
      window[name] = this;
    }
  }

  /**
   * Prints the current board to the console using ASCII characters.
   */
  print() {
    this.engine.chessboard.printBoard();
  }
}