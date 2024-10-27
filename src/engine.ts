import ChessBoard from "./chessboard";
import { BOARD_STATES, DIRECTION, ENCODED_MOVE, MAILBOX64, CASTLE_INDEXES, MOVE_LIST, PIECE, PIECE_MASK, PROMOTION_PIECES, SLIDERS, SQUARE } from "./constants";

export default class Engine {
  private chessboard: ChessBoard;
  private kingPositions = new Uint8Array([SQUARE.EMPTY, SQUARE.EMPTY]);    // cache for [white, black] kig positions for quick lookup

  constructor(fen?: string) {
    this.chessboard = new ChessBoard(fen);


    return;
  }

  updateKingPositionCache() {
    for (let i = 0; i < 64; i++) {
      const boardIndex = MAILBOX64[i];
      const square = this.chessboard.board[boardIndex];
      const piece = square & PIECE_MASK.TYPE;
      const colour = square & PIECE_MASK.COLOUR;

      if (piece === PIECE.KING) {
        const positionIndex = (colour === PIECE.IS_WHITE) ? 0 : 1;
        this.kingPositions[positionIndex] = boardIndex;
      }
    }
  }

  generatePseudoMoves(turnColour: number) {
    const moves = new Uint32Array(256);
    let moveIdx = 0;

    const ply = this.chessboard.ply;
    const state = this.chessboard.state[ply];

    for (let i = 0; i < 64; i++) {
      const fromBoardIndex = MAILBOX64[i];
      const fromSquare = this.chessboard.board[fromBoardIndex];
      const fromPiece = fromSquare & PIECE_MASK.TYPE;
      const fromColour = fromSquare & PIECE_MASK.COLOUR;
      const fromHasMoved = fromSquare & PIECE.HAS_MOVED ? 1 : 0;

      // skip checking pieces from opposition colour
      if (fromColour !== turnColour) continue;
      
      // get index for MOVE_LIST and SLIDERS (index is their piece number, except black pawn is 0 as it moves different to white pawn)
      const fromPieceIndex = (fromPiece === PIECE.PAWN && fromColour === PIECE.IS_BLACK) ? 0 : fromPiece;

      const directions = MOVE_LIST[fromPieceIndex];
      const slider = SLIDERS[fromPieceIndex];
 
      for (let direction of directions) {
        let toBoardIndex = fromBoardIndex;  // initialise from the current square, and we will add directions to it next during generation

        while (true) {
          if (fromPiece === PIECE.PAWN) break;  // handle all pawn moves separately, as they contain special rules

          toBoardIndex += direction;

          const toSquare = this.chessboard.board[toBoardIndex];
          const toColour = toSquare & PIECE_MASK.COLOUR;

          if (toSquare === SQUARE.EMPTY) {
            // empty square means piece can move here (pawn moves handled different due to promotions)
            moves[moveIdx++] = (fromHasMoved << 24) | (toBoardIndex << 8) | (fromBoardIndex);
          }
          else if (toSquare === SQUARE.EDGE) {
            // if edge of board, stop search in this direction
            break;
          }
          else if (toColour === fromColour) {
            // if blocked by same colour pieces, stop search in this direction
            break;
          }
          else if (toColour !== fromColour) {
            // if opponent piece, capture
            moves[moveIdx++] = (fromHasMoved << 24) | (toSquare << 16) | (toBoardIndex << 8) | (fromBoardIndex);
          }
          
          if (slider === false) {
            break;
          }
        }
      }


      /* SPECIAL MOVES */

      // pawn
      if (fromPiece === PIECE.PAWN) {
        // get all move positions
        const singlePushIndex = fromBoardIndex + directions[0];
        const doublePushIndex = fromBoardIndex + directions[1];
        const eastDiagonalIndex = fromBoardIndex + directions[2];
        const westDiagonalIndex = fromBoardIndex + directions[3];

        // get en passant target index, and the actual target pawn if so 
        const enPassantTarget = (state & BOARD_STATES.EN_PASSANT_SQUARE) >> 8;
        let enPassantSquare;
        
        if (enPassantTarget >= 71 && enPassantTarget <= 78) {
          enPassantSquare = this.chessboard.board[enPassantTarget + DIRECTION.NORTH];
        }
        else if (enPassantTarget >= 41 && enPassantTarget <= 48) {
          enPassantSquare = this.chessboard.board[enPassantTarget + DIRECTION.SOUTH];
        }
        
        if (this.chessboard.board[singlePushIndex] === SQUARE.EMPTY) {
          if (singlePushIndex >= 31 && singlePushIndex <= 81) {
            // regular single push
            moves[moveIdx++] = (fromHasMoved << 24) | (singlePushIndex << 8) | (fromBoardIndex);
          }
          else {
            // single push with promotion
            for (let promotionPiece of PROMOTION_PIECES) {
              moves[moveIdx++] = (promotionPiece << 25) | (fromHasMoved << 24) | (singlePushIndex << 8) | (fromBoardIndex);
            }
          }

          if (!fromHasMoved && this.chessboard.board[doublePushIndex] === SQUARE.EMPTY) {
            // double push
            moves[moveIdx++] = (ENCODED_MOVE.DOUBLE_PUSH_MOVE) | (fromHasMoved << 24) | (doublePushIndex << 8) | (fromBoardIndex);
          }
        }

        const eastSquare = this.chessboard.board[eastDiagonalIndex];
        const eastColour = eastSquare | PIECE_MASK.COLOUR;
        if (eastColour !== fromColour) {
          if (eastDiagonalIndex >= 31 && eastDiagonalIndex <= 81) {
            // east diagonal piece capture
            moves[moveIdx++] = (fromHasMoved << 24) | (eastSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
          }
          else {
            // east diagonal piece capture with promotion
            for (let promotionPiece of PROMOTION_PIECES) {
              moves[moveIdx++] = (promotionPiece << 25) | (fromHasMoved << 24) | (eastSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
            }
          }
        }
        else if (eastDiagonalIndex === enPassantTarget && enPassantSquare) {
          // en passant capture
          moves[moveIdx++] = (ENCODED_MOVE.EN_PASSANT_MOVE) | (fromHasMoved << 24) | (enPassantSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
        }

        const westSquare = this.chessboard.board[westDiagonalIndex];
        const westColour = westSquare | PIECE_MASK.COLOUR;
        if (westColour !== fromColour) {
          if (westDiagonalIndex >= 31 && westDiagonalIndex <= 81) {
            // west diagonal piece capture
            moves[moveIdx++] = (fromHasMoved << 24) | (westSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
          }
          else {
            // west diagonal piece capture with promotion
            for (let promotionPiece of PROMOTION_PIECES) {
              moves[moveIdx++] = (promotionPiece << 25) | (fromHasMoved << 24) | (westSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
            }
          }
        }
        else if (westDiagonalIndex === enPassantTarget && enPassantSquare) {
          // en passant capture
          moves[moveIdx++] = (ENCODED_MOVE.EN_PASSANT_MOVE) | (fromHasMoved << 24) | (enPassantSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
        }
      }

      // castle
      if (fromPiece === PIECE.KING) {
        if (fromColour === PIECE.IS_WHITE) {
          if (state & BOARD_STATES.WHITE_KINGSIDE_CASTLE) {
            // add white kingside castle
            moves[moveIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | (CASTLE_INDEXES.KING_TO_KINGSIDE << 8) | (fromBoardIndex);
          }
          if (state & BOARD_STATES.WHITE_QUEENSIDE_CASTLE) {
            // add white queenside castle
            moves[moveIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | (CASTLE_INDEXES.KING_TO_QUEENSIDE << 8) | (fromBoardIndex);
          }
        }
        else if (fromColour === PIECE.IS_BLACK) {
          if (state & BOARD_STATES.BLACK_KINGSIDE_CASTLE) {
            // add black kingside castle
            moves[moveIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | (CASTLE_INDEXES.KING_TO_KINGSIDE << 8) | (fromBoardIndex);
          }
          if (state & BOARD_STATES.BLACK_QUEENSIDE_CASTLE) {
            // add black queenside castle
            moves[moveIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | (CASTLE_INDEXES.KING_TO_QUEENSIDE << 8) | (fromBoardIndex);
          }
        }
      }
    }
  }

  kingIsInCheck(kingColour: number) {
    // get king position
    const cacheIndex = (kingColour === PIECE.IS_WHITE) ? 0 : 1;
    const kingPosition = this.kingPositions[cacheIndex];

    // check for any attacking sliders
    const sliderMoves = MOVE_LIST[PIECE.QUEEN];
    for (let direction of sliderMoves) {
      let currentPosition = kingPosition;
      while (true) {
        currentPosition += direction;
        const currentSquare = this.chessboard.board[currentPosition];
        const currentPiece = currentSquare & PIECE_MASK.TYPE;
        const currentColour = currentSquare & PIECE_MASK.COLOUR;

        if (currentSquare === SQUARE.EMPTY) continue;
        if (currentSquare === SQUARE.EDGE) break;
        if (currentColour === kingColour) break;

        const currentIsSlider = SLIDERS[currentPiece];
        if (currentIsSlider) return true;  // under attack by slider
        break;  // piece is protected from sliders by a non-slider opponent piece
      }
    }

    // check for attacking knights
    const knightMoves = MOVE_LIST[PIECE.KNIGHT];
    for (let direction of knightMoves) {
      const currentSquare = this.chessboard.board[kingPosition + direction];
      const currentPiece = currentSquare & PIECE_MASK.TYPE;
      const currentColour = currentSquare & PIECE_MASK.COLOUR;
      if (currentColour === kingColour) continue;
      if (currentPiece === PIECE.KNIGHT) return true;  // under attack by knight
    }

    // check for diagonal pawn moves
    const pawnIndex = kingColour === PIECE.IS_WHITE ? 0 : 1;    // used to access the black/white pawn's move set. we use the *same* colour moves as the king to check, as we are searching backwards *from* the king, and the same pawn colour mirrors the opponent pawn attacks.
    const eastPawnIndex = MOVE_LIST[pawnIndex][2];
    const eastPawnSquare = this.chessboard.board[eastPawnIndex];
    const eastPawnPiece = eastPawnSquare & PIECE_MASK.TYPE;
    const eastPawnColour = eastPawnSquare & PIECE_MASK.COLOUR;
    if (eastPawnColour !== kingColour && eastPawnPiece === PIECE.PAWN) {
      return true;  // under attack by pawn
    }

    const westPawnIndex = MOVE_LIST[pawnIndex][3];
    const westPawnSquare = this.chessboard.board[westPawnIndex];
    const westPawnPiece = westPawnSquare & PIECE_MASK.TYPE;
    const westPawnColour = westPawnSquare & PIECE_MASK.COLOUR;
    if (westPawnColour !== kingColour && westPawnPiece === PIECE.PAWN) {
      return true;  // under attack by pawn
    }

    // default return if no attackers found
    return false;
  }
  
}

