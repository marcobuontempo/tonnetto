import ChessBoard from "./chessboard";
import { EMPTY, EDGE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, DEFAULT_FEN, WHITE, BLACK, PIECE_MASK, COLOUR_MASK, MAILBOX64, MAILBOX120, MOVE_LIST, SQUARE_ASCII, SLIDERS } from "./constants";

export default class Engine {
  private chessboard: ChessBoard;

  constructor(fen?: string) {
    this.chessboard = new ChessBoard(fen);
    return;
  }

  generatePseudoMoves(turnColour: number) {
    for (let i = 0; i < 64; i++) {
      const mailboxIdx = MAILBOX64[i];
      const fromSquare = this.chessboard.board[mailboxIdx];
      const fromPiece = fromSquare & PIECE_MASK;
      const fromColour = fromSquare & COLOUR_MASK;

      // skip checking pieces from opposition colour
      if (fromColour !== turnColour) continue;
      
      // get index for MOVE_LIST and SLIDERS (index is their piece number, except black pawn is 0 as it moves different to white pawn)
      const fromPieceIdx = (fromPiece === PAWN && fromColour === BLACK) ? 0 : fromPiece;

      const directions = MOVE_LIST[fromPieceIdx];
      const slider = SLIDERS[fromPieceIdx];
 
      for (let direction of directions) {
        let toSquare = mailboxIdx;

        while (true) {
          toSquare += direction;

          const currentSquare = this.chessboard.board[toSquare];

          if (currentSquare === EMPTY) {
            console.log(SQUARE_ASCII[fromPiece | fromColour], toSquare, 'Add move - empty');
            break;
          }
          else if (currentSquare === EDGE) {
            console.log(SQUARE_ASCII[fromPiece | fromColour], toSquare, 'No move - edge');
            break;
          }

          const currentColour = currentSquare & COLOUR_MASK;
          if (currentColour === fromColour) {
            console.log(SQUARE_ASCII[fromPiece | fromColour], toSquare, 'No move - colour blocked');
            break;
          }
          else if (currentColour !== fromColour && fromPiece !== PAWN) {
            console.log(SQUARE_ASCII[fromPiece | fromColour], toSquare, 'Add move - capture');
          }

          if (slider === false) {
            console.log(SQUARE_ASCII[fromPiece | fromColour], toSquare, 'Break - no slider');
            break;
          }
        }

        // don't continue calculating moves for pawn (other than single push). special moves are calculated next.
        if (fromPiece === PAWN) break;
      }
    }
  }
}