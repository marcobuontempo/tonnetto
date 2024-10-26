import { EMPTY, EDGE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, DEFAULT_FEN, WHITE, BLACK, PIECE_LOOKUP, SQUARE_ASCII, MAILBOX120, MAILBOX64, HAS_MOVED, PIECE_MASK, COLOUR_MASK } from "./constants";

export default class ChessBoard {
  public board = new Uint8Array(120).fill(EDGE);  // 10x12 1D-array board representation

  constructor(fen = DEFAULT_FEN) {
    this.parseFen(fen);
  }

  parseFen(fen: string) {
    // populate 8x8 board
    const board64 = new Uint8Array(64).fill(EMPTY);
    const piecesFEN = fen.split(" ")[0].replace(/\//g, "");

    let boardIndex = 0;
    for (let i = 0; i < piecesFEN.length; i++) {
      const pieceFEN = piecesFEN[i];
      if (parseInt(pieceFEN)) {
        boardIndex += parseInt(pieceFEN);
      }
      else {
        const colour = pieceFEN.toUpperCase() === pieceFEN ? WHITE : BLACK;
        const piece = PIECE_LOOKUP[pieceFEN.toUpperCase()];
        let hasMoved = HAS_MOVED;
        if (piece === PAWN) {
          if (
            (colour === WHITE && boardIndex >= 48 && boardIndex <= 55) ||
            (colour === BLACK && boardIndex >= 8 && boardIndex <= 15)
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
  }

  printBoard() {
    let output = '';

    for (let i = 0; i < 64; i++) {
      const idx = MAILBOX64[i];

      if (i % 8 === 0 && i !== 0) {
        output += '\n';
      }

      const square = this.board[idx];
      const piece = square & PIECE_MASK;
      const colour = square & COLOUR_MASK;
      output += SQUARE_ASCII[piece | colour];
    }

    console.log(output);
  }
}