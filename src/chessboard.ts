import { BOARD_STATES, DEFAULT_FEN, MAILBOX64, PIECE, PIECE_LOOKUP, PIECE_MASK, SQUARE, SQUARE_ASCII } from "./constants";

export default class ChessBoard {
  public board = new Uint8Array(120).fill(SQUARE.EDGE);  // 10x12 1D-array board representation
  public state = new Uint32Array(3600).fill(BOARD_STATES.EMPTY);
  public ply = 0;

  constructor(fen = DEFAULT_FEN) {
    this.parseFen(fen);
  }

  parseFen(fen: string) {
    // populate 8x8 board
    const board64 = new Uint8Array(64).fill(SQUARE.EMPTY);
    const [boardFEN, turnFEN, castleFEN, epFEN, halfmoveFEN, fullmoveFEN] = fen.split(" ");
    const piecesFEN = boardFEN.replace(/\//g, "");

    let boardIndex = 0;
    for (let i = 0; i < piecesFEN.length; i++) {
      const pieceFEN = piecesFEN[i];
      if (parseInt(pieceFEN)) {
        boardIndex += parseInt(pieceFEN);
      }
      else {
        const colour = pieceFEN.toUpperCase() === pieceFEN ? PIECE.IS_WHITE : PIECE.IS_BLACK;
        const piece = PIECE_LOOKUP[pieceFEN.toUpperCase()];
        let hasMoved = PIECE.HAS_MOVED;
        if (piece === PIECE.PAWN) {
          if (
            (colour === PIECE.IS_WHITE && boardIndex >= 48 && boardIndex <= 55) ||
            (colour === PIECE.IS_BLACK && boardIndex >= 8 && boardIndex <= 15)
          ) {
            hasMoved = 0;
          }
        }

        board64[boardIndex] = piece | colour | hasMoved;
        boardIndex++;
      }
    }

    // embed 8x8 board into 10x12 internal `this.board`
    for (let i = 0; i < 64; i++) {
      const newIdx = MAILBOX64[i];
      this.board[newIdx] = board64[i];
    }

    const currentTurn = turnFEN === 'w' ? BOARD_STATES.CURRENT_TURN_WHITE : BOARD_STATES.CURRENT_TURN_BLACK;

    let castleRights = BOARD_STATES.EMPTY;
    if (castleFEN.includes('K')) castleRights |= BOARD_STATES.WHITE_KINGSIDE_CASTLE;
    if (castleFEN.includes('Q')) castleRights |= BOARD_STATES.WHITE_QUEENSIDE_CASTLE;
    if (castleFEN.includes('k')) castleRights |= BOARD_STATES.BLACK_KINGSIDE_CASTLE;
    if (castleFEN.includes('q')) castleRights |= BOARD_STATES.BLACK_QUEENSIDE_CASTLE;

    const enPassantTarget = epFEN === "-" ? 0 : this.algebraicToIndex(epFEN) << 8;

    const halfmove = parseInt(halfmoveFEN);

    const fullmove = parseInt(fullmoveFEN);

    const state = BOARD_STATES.EMPTY | currentTurn | castleRights | enPassantTarget | halfmove;

    const ply = 2 * (fullmove - 1) + (turnFEN === 'w' ? 1 : 2);

    this.ply = ply;
    this.state[ply] = state;
  }

  algebraicToIndex(notation: string): number {
    const [fileCh, rankCh] = notation.split("");
    const file = fileCh.charCodeAt(0) - 97;
    const rank = 64 - parseInt(rankCh) * 8;
    return MAILBOX64[file + rank];
  }

  printBoard() {
    let output = '';

    for (let i = 0; i < 64; i++) {
      const idx = MAILBOX64[i];

      if (i % 8 === 0 && i !== 0) {
        output += '\n';
      }

      const square = this.board[idx];
      const piece = square & PIECE_MASK.TYPE;
      const colour = square & PIECE_MASK.COLOUR;
      output += SQUARE_ASCII[piece | colour];
    }

    console.log(output);
  }
}