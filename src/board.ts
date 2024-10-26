import { EMPTY, EDGE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, DEFAULT_FEN, WHITE, BLACK } from "./constants";

const PIECE_LOOKUP: Record<string, number> = {
  P: PAWN,
  N: KNIGHT,
  B: BISHOP,
  R: ROOK,
  Q: QUEEN,
  K: KING,
};

const SQUARE_ALPHAS: Record<number, string> = {
  0b0000_0000: ".",   // Empty
  0b0001_0001: "P",   // Pawn White
  0b0001_0010: "N",   // Knight White
  0b0001_0011: "B",   // Bishop White
  0b0001_0100: "R",   // Rook White
  0b0001_0101: "Q",   // Queen White
  0b0001_0110: "K",   // King White
  0b0010_0001: "p",   // Pawn Black
  0b0010_0010: "n",   // Knight Black
  0b0010_0011: "b",   // Bishop Black
  0b0010_0100: "r",   // Rook Black
  0b0010_0101: "q",   // Queen Black
  0b0010_0110: "k",   // King Black
};

export default class Board {
  private board = new Uint8Array(64).fill(EMPTY);
  private mailbox64 = new Uint8Array();
  private mailbox120 = new Uint8Array();

  constructor(fen = DEFAULT_FEN) {
    this.parseFen(fen);
  }

  parseFen(fen: string) {
    const piecesFEN = fen.split(" ")[0].replace(/\//g, "");

    let boardIndex = 0;
    for(let i = 0; i < piecesFEN.length; i++) {
      const pieceFEN = piecesFEN[i];
      if (parseInt(pieceFEN)) {
        boardIndex += parseInt(pieceFEN);
      }
      else {
        const colour = pieceFEN.toUpperCase() === pieceFEN ? WHITE : BLACK;
        const piece = PIECE_LOOKUP[pieceFEN.toUpperCase()] | colour;
        this.board[boardIndex] = piece;
        boardIndex++;
      }
    }
  }


  printBoard() {
    console.log(this.board)
    let output = '';

    for (let i = 0; i < this.board.length; i++) {
      if (i % 8 === 0 && i !== 0) {
        output += '\n';
      }

      const square = this.board[i];
      output += SQUARE_ALPHAS[square];
    }

    console.log(output);
  }
}