import ChessBoard from "./chessboard";
import { EMPTY, EDGE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, DEFAULT_FEN, WHITE, BLACK, PIECE_MASK, COLOUR_MASK, MAILBOX64, MAILBOX120, MOVE_LIST, SQUARE_ASCII, SLIDERS, HAS_MOVED } from "./constants";

export default class Engine {
  private chessboard: ChessBoard;

  constructor(fen?: string) {
    this.chessboard = new ChessBoard(fen);
    return;
  }

  generatePseudoMoves(turnColour: number) {
    const moves = new Uint32Array(3600);
    let moveIdx = 0;

    for (let i = 0; i < 64; i++) {
      const fromBoardIndex = MAILBOX64[i];
      const fromSquare = this.chessboard.board[fromBoardIndex];
      const fromPiece = fromSquare & PIECE_MASK;
      const fromColour = fromSquare & COLOUR_MASK;
      const fromHasMoved = fromSquare & HAS_MOVED ? 1 : 0;

      // skip checking pieces from opposition colour
      if (fromColour !== turnColour) continue;
      
      // get index for MOVE_LIST and SLIDERS (index is their piece number, except black pawn is 0 as it moves different to white pawn)
      const fromPieceIndex = (fromPiece === PAWN && fromColour === BLACK) ? 0 : fromPiece;

      const directions = MOVE_LIST[fromPieceIndex];
      const slider = SLIDERS[fromPieceIndex];
 
      for (let direction of directions) {
        let toBoardIndex = fromBoardIndex;

        while (true) {
          toBoardIndex += direction;

          const toSquare = this.chessboard.board[toBoardIndex];
          const toColour = toSquare & COLOUR_MASK;

          let move = 0;

          if (toSquare === EMPTY) {
            // empty square means piece can move here
            move = (fromHasMoved << 24) | (toBoardIndex << 8) | (fromBoardIndex);
            moves[moveIdx++] = move;
          }
          else if (toSquare === EDGE) {
            // if edge of board, stop search in this direction
            break;
          }
          else if (toColour === fromColour) {
            // if blocked by same colour pieces, stop search in this direction
            break;
          }
          else if (toColour !== fromColour && fromPiece !== PAWN) {
            // if opponent piece, capture (except pawn, cannot capture with forward push)
            move = (fromHasMoved << 24) | (toSquare << 16) | (toBoardIndex << 8) | (fromBoardIndex);
            moves[moveIdx++] = move;
          }
          
          if (slider === false) {
            break;
          }
        }

        if (fromPiece === PAWN) break;  // only single pawn push here - special moves are generated later
      }


      /* SPECIAL MOVES */

      // pawn
      if (fromPiece === PAWN) {
        // check direction0
          // if empty, add move
          // check !has_moved, if so, check direction1
            // if also empty, add move

        // check direction 2 & 3
          // if opposite piece, add capture
          // if en passant square, add capture
      }
    }

  }
}

