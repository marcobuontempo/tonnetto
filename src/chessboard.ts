import { BOARD_STATES, DEFAULT_FEN, MAILBOX120, MAILBOX64, PIECE, PIECE_LOOKUP, PIECE_MASK, SQUARE, SQUARE_ASCII } from "./constants";

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
    for (let p = 0; p < piecesFEN.length; p++) {
      const pieceFEN = piecesFEN[p];
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
    for (let sq = 0; sq < 64; sq++) {
      const squareIdx = MAILBOX64[sq];
      this.board[squareIdx] = board64[sq];
    }

    const currentTurn = turnFEN === 'w' ? BOARD_STATES.CURRENT_TURN_WHITE : BOARD_STATES.CURRENT_TURN_BLACK;

    let castleRights = BOARD_STATES.EMPTY;
    if (castleFEN.includes('K')) castleRights |= BOARD_STATES.WHITE_KINGSIDE_CASTLE;
    if (castleFEN.includes('Q')) castleRights |= BOARD_STATES.WHITE_QUEENSIDE_CASTLE;
    if (castleFEN.includes('k')) castleRights |= BOARD_STATES.BLACK_KINGSIDE_CASTLE;
    if (castleFEN.includes('q')) castleRights |= BOARD_STATES.BLACK_QUEENSIDE_CASTLE;

    const enPassantTarget = epFEN === "-" ? 0 : ChessBoard.algebraicToIndex(epFEN) << 8;

    const halfmove = parseInt(halfmoveFEN);

    const fullmove = parseInt(fullmoveFEN);

    const state = BOARD_STATES.EMPTY | currentTurn | castleRights | enPassantTarget | halfmove;

    const ply = 2 * (fullmove - 1) + (turnFEN === 'w' ? 1 : 2);

    this.ply = ply;
    this.state[ply] = state;
  }

  getFen() {
    let boardPosition = Array.from({ length: 8 }, () => Array(8).fill(''));

    // get board squares
    for (let sq = 0; sq < 64; sq++) {
      const squareIdx = MAILBOX64[sq];
      const square = this.board[squareIdx];
      
      const rank = Math.floor(sq / 8);
      const file = sq % 8;
      
      const piece = square & PIECE_MASK.TYPE;
      const colour = square & PIECE_MASK.COLOUR;
      const ascii = SQUARE_ASCII[piece | colour];
      
      boardPosition[rank][file] = ascii;
    }

    // format board into string
    const boardFEN = boardPosition.map(rank => {
      let emptyCount = 0;
      return rank.reduce((fenStr, square) => {
        if (square === '.') {
          emptyCount++;
        } else {
          // append empty square count if any
          if (emptyCount > 0) {
            fenStr += emptyCount;
            emptyCount = 0; // reset count
          }
          fenStr += square; // append the piece
        }
        return fenStr;
      }, '') + (emptyCount > 0 ? emptyCount : ''); // append any remaining empty squares
    }).join('/'); // join ranks with '/'

    const currentState = this.state[this.ply];
    const currentTurnFEN = (currentState & BOARD_STATES.CURRENT_TURN_WHITE) ? 'w' : 'b';
    
    const ksCastleWhite = (currentState & BOARD_STATES.WHITE_KINGSIDE_CASTLE) ? 'K' : '';
    const qsCastleWhite = (currentState & BOARD_STATES.WHITE_QUEENSIDE_CASTLE) ? 'Q' : '';
    const ksCastleBlack = (currentState & BOARD_STATES.BLACK_KINGSIDE_CASTLE) ? 'k' : '';
    const qsCastleBlack = (currentState & BOARD_STATES.BLACK_QUEENSIDE_CASTLE) ? 'q' : '';
    const castleFEN = (ksCastleWhite + qsCastleWhite + ksCastleBlack + qsCastleBlack) || '-'

    const epFEN = parseInt(ChessBoard.indexToAlgebraic((currentState & BOARD_STATES.EN_PASSANT_SQUARE) >> 8)) || '-';

    const halfmoveFEN = (currentState & BOARD_STATES.HALFMOVE_CLOCK);

    const fullmoveFEN = Math.floor((this.ply + 1) / 2);
    return `${boardFEN} ${currentTurnFEN} ${castleFEN} ${epFEN} ${halfmoveFEN} ${fullmoveFEN}`;
  }

  static algebraicToIndex(notation: string): number {
    const [fileCh, rankCh] = notation.toLowerCase().split("");
    const file = fileCh.charCodeAt(0) - 97;
    const rank = 64 - parseInt(rankCh) * 8;
    return MAILBOX64[file + rank];
  }

  static indexToAlgebraic(index: number) {
    const mailbox64 = MAILBOX120[index];
    const file = String.fromCharCode((mailbox64 % 8) + 65);
    const rank = 8 - Math.floor(mailbox64 / 8);
    return `${file.toLowerCase()}${rank}`;
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

    console.log(`${output}`);
  }
}