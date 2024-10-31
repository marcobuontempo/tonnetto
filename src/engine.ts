import ChessBoard from "./chessboard";
import { BOARD_STATES, DIRECTION, ENCODED_MOVE, MAILBOX64, CASTLE_INDEXES, MOVE_LIST, PIECE, PIECE_MASK, PROMOTION_PIECES, SLIDERS, SQUARE, SQUARE_ASCII } from "./constants";

export default class Engine {
  public chessboard: ChessBoard;
  public moveHistory = new Uint32Array(3600);    // stores the move history - 3600 is maximum theoretical moves
  public kingPositions = new Uint8Array([SQUARE.EMPTY, SQUARE.EMPTY]);    // cache for [white, black] kig positions for quick lookup

  constructor(fen?: string) {
    this.chessboard = new ChessBoard(fen);
    this.updateKingPositionCache();
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

  generatePseudoMoves(turnColour: number): [Uint32Array, number] {
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
      const pieceMovesIndex = (fromPiece === PIECE.PAWN && fromColour === PIECE.IS_BLACK) ? 0 : fromPiece;

      const directions = MOVE_LIST[pieceMovesIndex];
      const slider = SLIDERS[pieceMovesIndex];
 
      for (let direction of directions) {
        let toBoardIndex = fromBoardIndex;  // initialise from the current square, and we will add directions to it next during generation

        while (true) {
          if (fromPiece === PIECE.PAWN) break;  // handle all pawn moves separately, as they contain special rules

          toBoardIndex += direction;

          const toSquare = this.chessboard.board[toBoardIndex];
          const toColour = toSquare & PIECE_MASK.COLOUR;

          if (toSquare === SQUARE.EMPTY) {
            // empty square means piece can move here (pawn single push handled different - calculated all pawn moves separately later)
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
            // if opponent piece, capture and stop search in this direction
            moves[moveIdx++] = (fromHasMoved << 24) | (toSquare << 16) | (toBoardIndex << 8) | (fromBoardIndex);
            break;
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

        // get en passant target index, and the actual target pawn if so. used to check en passant during captures
        const enPassantTarget = (state & BOARD_STATES.EN_PASSANT_SQUARE) >> 8;
        let enPassantSquare;
        
        if (enPassantTarget >= 71 && enPassantTarget <= 78) {
          enPassantSquare = this.chessboard.board[enPassantTarget + DIRECTION.NORTH];
        }
        else if (enPassantTarget >= 41 && enPassantTarget <= 48) {
          enPassantSquare = this.chessboard.board[enPassantTarget + DIRECTION.SOUTH];
        }

        const eastSquare = this.chessboard.board[eastDiagonalIndex];
        const eastPiece = eastSquare & PIECE_MASK.TYPE;
        const eastColour = eastSquare & PIECE_MASK.COLOUR;
        if (eastPiece && eastColour !== fromColour) {
          if (eastDiagonalIndex >= 31 && eastDiagonalIndex <= 88) {
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
        const westPiece = westSquare & PIECE_MASK.TYPE;
        const westColour = westSquare & PIECE_MASK.COLOUR;

        if (westPiece && westColour !== fromColour) {
          if (westDiagonalIndex >= 31 && westDiagonalIndex <= 88) {
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
            let gapEmpty = true;
            for (let j = 1; j < 3; j++) {
              if (this.chessboard.board[fromBoardIndex + (j * DIRECTION.EAST)] !== SQUARE.EMPTY) {
                gapEmpty = false;
                break;
              }
            }
            if (gapEmpty === true) {
              moves[moveIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_KINGSIDE) << 8) | (fromBoardIndex);
            }
          }
          if (state & BOARD_STATES.WHITE_QUEENSIDE_CASTLE) {
            // add white queenside castle
            let gapEmpty = true;
            for (let j = 1; j < 4; j++) {
              if (this.chessboard.board[fromBoardIndex + (j * DIRECTION.WEST)] !== SQUARE.EMPTY) {
                gapEmpty = false;
                break;
              }
            }
            if (gapEmpty === true) {
              moves[moveIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_QUEENSIDE) << 8) | (fromBoardIndex);
            }
          }
        }
        else if (fromColour === PIECE.IS_BLACK) {
          if (state & BOARD_STATES.BLACK_KINGSIDE_CASTLE) {
            // add black kingside castle
            let gapEmpty = true;
            for (let j = 1; j < 3; j++) {
              if (this.chessboard.board[fromBoardIndex + (j * DIRECTION.EAST)] !== SQUARE.EMPTY) {
                gapEmpty = false;
                break;
              }
            }
            if (gapEmpty === true) {
              moves[moveIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_KINGSIDE) << 8) | (fromBoardIndex);
            }
          }
          if (state & BOARD_STATES.BLACK_QUEENSIDE_CASTLE) {
            // add black queenside castle
            let gapEmpty = true;
            for (let j = 1; j < 4; j++) {
              if (this.chessboard.board[fromBoardIndex + (j * DIRECTION.WEST)] !== SQUARE.EMPTY) {
                gapEmpty = false;
                break;
              }
            }
            if (gapEmpty === true) {
              moves[moveIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved << 24) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_QUEENSIDE) << 8) | (fromBoardIndex);
            }
          }
        }
      }
    }

    return [moves, moveIdx];
  }

  kingIsInCheck(kingColour: number) {
    // get king position
    const cacheIndex = (kingColour === PIECE.IS_WHITE) ? 0 : 1;
    const kingPosition = this.kingPositions[cacheIndex];

    // check for any attacking sliders
    const straightMoves = MOVE_LIST[PIECE.ROOK];
    for (let direction of straightMoves) {
      let currentPosition = kingPosition;
      while (true) {
        currentPosition += direction;
        const currentSquare = this.chessboard.board[currentPosition];
        const currentPiece = currentSquare & PIECE_MASK.TYPE;
        const currentColour = currentSquare & PIECE_MASK.COLOUR;

        if (currentSquare === SQUARE.EMPTY) continue;
        if (currentSquare === SQUARE.EDGE) break;
        if (currentColour === kingColour) break;

        if (currentPiece === PIECE.ROOK || currentPiece === PIECE.QUEEN) return true; // piece is under attack
        break;  // piece is protected from sliders by a non-slider opponent piece
      }
    }

    const diagonalMoves = MOVE_LIST[PIECE.BISHOP];
    for (let direction of diagonalMoves) {
      let currentPosition = kingPosition;
      while (true) {
        currentPosition += direction;
        const currentSquare = this.chessboard.board[currentPosition];
        const currentPiece = currentSquare & PIECE_MASK.TYPE;
        const currentColour = currentSquare & PIECE_MASK.COLOUR;

        if (currentSquare === SQUARE.EMPTY) continue;
        if (currentSquare === SQUARE.EDGE) break;
        if (currentColour === kingColour) break;

        if (currentPiece === PIECE.BISHOP || currentPiece === PIECE.QUEEN) return true; // piece is under attack
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
    const pawnIndex = kingColour === PIECE.IS_WHITE ? 1 : 0;    // used to access the black/white pawn's move set. we use the *same* colour moves as the king to check, as we are searching backwards *from* the king, and the same pawn colour mirrors the opponent pawn attacks.
    const eastPawnIndex = kingPosition + MOVE_LIST[pawnIndex][2];
    const eastPawnSquare = this.chessboard.board[eastPawnIndex];
    const eastPawnPiece = eastPawnSquare & PIECE_MASK.TYPE;
    const eastPawnColour = eastPawnSquare & PIECE_MASK.COLOUR;
    if (eastPawnColour !== kingColour && eastPawnPiece === PIECE.PAWN) {
      return true;  // under attack by pawn
    }

    const westPawnIndex = kingPosition + MOVE_LIST[pawnIndex][3];
    const westPawnSquare = this.chessboard.board[westPawnIndex];
    const westPawnPiece = westPawnSquare & PIECE_MASK.TYPE;
    const westPawnColour = westPawnSquare & PIECE_MASK.COLOUR;
    if (westPawnColour !== kingColour && westPawnPiece === PIECE.PAWN) {
      return true;  // under attack by pawn
    }

    // default return if no attackers found
    return false;
  }

  makeMove(move: number) {
    let ply = this.chessboard.ply;
    const state = this.chessboard.state[ply] | 0;
    let updatedState = state;

    const fromIndex = move & ENCODED_MOVE.FROM_INDEX;
    const toIndex = (move & ENCODED_MOVE.TO_INDEX) >> 8;
    const capturedSquare = (move & ENCODED_MOVE.PIECE_CAPTURE) >> 16;
    const promotionPiece = (move & ENCODED_MOVE.PROMOTION_TO) >> 25;
    const enPassant = move & ENCODED_MOVE.EN_PASSANT_MOVE;
    const doublePush = move & ENCODED_MOVE.DOUBLE_PUSH_MOVE;
    const kingsideCastle = move & ENCODED_MOVE.KINGSIDE_CASTLE_MOVE;
    const queensideCastle = move & ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE;

    const fromSquare = this.chessboard.board[fromIndex];
    const fromPiece = fromSquare & PIECE_MASK.TYPE;
    const fromColour = fromSquare & PIECE_MASK.COLOUR;

    const capturedPiece = capturedSquare & PIECE_MASK.TYPE;
    const capturedColour = capturedSquare & PIECE_MASK.COLOUR;

    // move piece (and flag as 'has moved')
    this.chessboard.board[toIndex] = fromSquare | PIECE.HAS_MOVED;

    // empty square that piece moved from
    this.chessboard.board[fromIndex] = SQUARE.EMPTY;
    
    // promoted piece if required
    if (promotionPiece) {
      this.chessboard.board[toIndex] &= ~(PIECE_MASK);    // remove piece type
      this.chessboard.board[toIndex] |= promotionPiece;   // add promoted piece type
    }

    // en passant - remove attacked pawn if so
    if (enPassant) {
      if (toIndex >= 71 && toIndex <= 78) {
        this.chessboard.board[toIndex + DIRECTION.NORTH] = SQUARE.EMPTY;
      }
      else if (toIndex >= 41 && toIndex <= 48) {
        this.chessboard.board[toIndex + DIRECTION.SOUTH] = SQUARE.EMPTY;
      }
    }

    // add enpassant square to state if double push
    updatedState &= ~(BOARD_STATES.EN_PASSANT_SQUARE);
    if (doublePush) {
      if (fromColour === PIECE.IS_WHITE) {
        updatedState |= ((toIndex + DIRECTION.SOUTH) << 8);
      }
      else if (fromColour === PIECE.IS_BLACK) {
        updatedState |= ((toIndex + DIRECTION.NORTH) << 8);
      }
    }

    // castle
    if (kingsideCastle) {
      // move rook kingside
      if (fromColour === PIECE.IS_WHITE) {
        this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_KINGSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_KINGSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_KINGSIDE_ROOK] = SQUARE.EMPTY;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_KINGSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_KINGSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_KINGSIDE_ROOK] = SQUARE.EMPTY;
      }
    }
    else if (queensideCastle) {
      // move rook queenside
      if (fromColour === PIECE.IS_WHITE) {
        this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_QUEENSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_QUEENSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_QUEENSIDE_ROOK] = SQUARE.EMPTY;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_QUEENSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_QUEENSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_QUEENSIDE_ROOK] = SQUARE.EMPTY;
      }
    }

    // if piece is king, remove all castle rights
    if (fromPiece === PIECE.KING) {
      if (fromColour === PIECE.IS_WHITE) {
        updatedState &= ~(BOARD_STATES.WHITE_KINGSIDE_CASTLE);
        updatedState &= ~(BOARD_STATES.WHITE_QUEENSIDE_CASTLE);
        this.kingPositions[0] = toIndex;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        updatedState &= ~(BOARD_STATES.BLACK_KINGSIDE_CASTLE);
        updatedState &= ~(BOARD_STATES.BLACK_QUEENSIDE_CASTLE);
        this.kingPositions[1] = toIndex;
      }
    }

    // if piece is rook, remove ks/qs castle rights
    if (fromPiece === PIECE.ROOK) {
      if (fromColour === PIECE.IS_WHITE) {
        if (fromIndex === CASTLE_INDEXES.DEFAULT_WHITE_KINGSIDE_ROOK) {
          updatedState &= ~(BOARD_STATES.WHITE_KINGSIDE_CASTLE);
        }
        else if (fromIndex === CASTLE_INDEXES.DEFAULT_WHITE_QUEENSIDE_ROOK) {
          updatedState &= ~(BOARD_STATES.WHITE_QUEENSIDE_CASTLE);
        }
      }
      else if (fromColour === PIECE.IS_BLACK) {
        if (fromIndex === CASTLE_INDEXES.DEFAULT_BLACK_KINGSIDE_ROOK) {
          updatedState &= ~(BOARD_STATES.BLACK_KINGSIDE_CASTLE);
        }
        else if (fromIndex === CASTLE_INDEXES.DEFAULT_BLACK_QUEENSIDE_ROOK) {
          updatedState &= ~(BOARD_STATES.BLACK_QUEENSIDE_CASTLE);
        }
      }
    }

    // if captured a rook, remove opponents castle rights for it
    if (capturedPiece === PIECE.ROOK) {
      if (toIndex === CASTLE_INDEXES.DEFAULT_WHITE_KINGSIDE_ROOK) {
        updatedState &= ~(BOARD_STATES.WHITE_KINGSIDE_CASTLE);
      }
      else if (toIndex === CASTLE_INDEXES.DEFAULT_WHITE_QUEENSIDE_ROOK) {
        updatedState &= ~(BOARD_STATES.WHITE_QUEENSIDE_CASTLE);
      }
      else if (toIndex === CASTLE_INDEXES.DEFAULT_BLACK_KINGSIDE_ROOK) {
        updatedState &= ~(BOARD_STATES.BLACK_KINGSIDE_CASTLE);
      }
      else if (toIndex === CASTLE_INDEXES.DEFAULT_BLACK_QUEENSIDE_ROOK) {
        updatedState &= ~(BOARD_STATES.BLACK_QUEENSIDE_CASTLE);
      }
    }

    // if piece is pawn, or if capture, set halfmove clock to 0
    // else, increment by 1
    if (fromPiece === PIECE.PAWN || capturedSquare) {
      updatedState &= ~(BOARD_STATES.HALFMOVE_CLOCK);
    }
    else {
      updatedState++;
    }

    // flip the current turn
    const currentTurnIsWhite = state & BOARD_STATES.CURRENT_TURN_WHITE;
    updatedState &= ~(BOARD_STATES.CURRENT_TURN);    // remove current turn indicator
    if (currentTurnIsWhite) {
      updatedState |= BOARD_STATES.CURRENT_TURN_BLACK;
    }
    else {
      updatedState |= BOARD_STATES.CURRENT_TURN_WHITE;
    }
    
    // update state
    ply = ++this.chessboard.ply;
    this.chessboard.state[ply] = updatedState;
    this.moveHistory[ply] = move;
  }

  unmakeMove(move: number) {
    let ply = this.chessboard.ply;
    this.chessboard.state[ply] = BOARD_STATES.EMPTY;    // remove updated state - since not required
    this.moveHistory[ply] = ENCODED_MOVE.EMPTY;    // remove most recent move from history stack
    this.chessboard.ply--;

    const fromIndex = move & ENCODED_MOVE.FROM_INDEX;
    const toIndex = (move & ENCODED_MOVE.TO_INDEX) >> 8;
    const capturedSquare = (move & ENCODED_MOVE.PIECE_CAPTURE) >> 16;
    const promotionPiece = (move & ENCODED_MOVE.PROMOTION_TO) >> 25;
    const pieceMovedFlag = (move & ENCODED_MOVE.PIECE_FROM_HAS_MOVED);
    const enPassant = move & ENCODED_MOVE.EN_PASSANT_MOVE;
    const kingsideCastle = move & ENCODED_MOVE.KINGSIDE_CASTLE_MOVE;
    const queensideCastle = move & ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE;
    const fromPiece = this.chessboard.board[toIndex] & PIECE_MASK.TYPE;

    // move squareto -> squarefrom (restore piece)
    this.chessboard.board[fromIndex] = this.chessboard.board[toIndex];

    // restore 'has moved' flag back onto piece at squarefrom
    this.chessboard.board[fromIndex] &= ~(PIECE.HAS_MOVED);
    if (pieceMovedFlag) {
      this.chessboard.board[fromIndex] |= PIECE.HAS_MOVED;
    }

    // if promoted, return to pawn
    if (promotionPiece) {
      this.chessboard.board[fromIndex] &= ~(PIECE_MASK.TYPE);
      this.chessboard.board[fromIndex] |= PIECE.PAWN;
    }

    // if captured piece, restore at squareTo (except if en passant, return to ep square +- 1)
    if (capturedSquare) {
      let restorePieceIndex = toIndex;
      if (enPassant) {
        if (toIndex >= 41 && toIndex <= 48) {
          restorePieceIndex = toIndex + DIRECTION.SOUTH;
        }
        else if (toIndex >= 71 && toIndex <= 78) {
          restorePieceIndex = toIndex + DIRECTION.NORTH;
        }
        this.chessboard.board[toIndex] = SQUARE.EMPTY;
      }
      this.chessboard.board[restorePieceIndex] = capturedSquare;
    }
    else {
      this.chessboard.board[toIndex] = SQUARE.EMPTY;
    }

    // if castle, restore rook position
    const fromColour = this.chessboard.board[fromIndex] & PIECE_MASK.COLOUR;
    if (kingsideCastle) {
      if (fromColour === PIECE.IS_WHITE) {
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_KINGSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_KINGSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_KINGSIDE_ROOK] = SQUARE.EMPTY;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_KINGSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_KINGSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_KINGSIDE_ROOK] = SQUARE.EMPTY;
      }
    }
    else if (queensideCastle) {
      if (fromColour === PIECE.IS_WHITE) {
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_WHITE_QUEENSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_QUEENSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.CASTLED_WHITE_QUEENSIDE_ROOK] = SQUARE.EMPTY;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        this.chessboard.board[CASTLE_INDEXES.DEFAULT_BLACK_QUEENSIDE_ROOK] = this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_QUEENSIDE_ROOK];
        this.chessboard.board[CASTLE_INDEXES.CASTLED_BLACK_QUEENSIDE_ROOK] = SQUARE.EMPTY;
      }
    }
    
    if (fromPiece === PIECE.KING) {
      if (fromColour === PIECE.IS_WHITE) {
        this.kingPositions[0] = fromIndex;
      }
      else if (fromColour === PIECE.IS_BLACK) {
        this.kingPositions[1] = fromIndex;
      }
    }  
  }
  
  moveIsLegal(move: number, turnColour: number) {
    this.makeMove(move);

    if (this.kingIsInCheck(turnColour)) {
      this.unmakeMove(move);
      return false;
    }

    this.unmakeMove(move);
    
    // check movement square in castle is not in check
    const kingsideCastle = move & ENCODED_MOVE.KINGSIDE_CASTLE_MOVE;
    const queensideCastle = move & ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE;
    const fromIndex = move & ENCODED_MOVE.FROM_INDEX;
    if (kingsideCastle) {
      const eastIndex = fromIndex + DIRECTION.EAST;
      const eastSquare = this.chessboard.board[eastIndex];
      const kingsideCastleMove = (ENCODED_MOVE.PIECE_FROM_HAS_MOVED) | (eastSquare << 16) | (eastIndex << 8) | (fromIndex);
      this.makeMove(kingsideCastleMove);
      if(this.kingIsInCheck(turnColour)) {
        this.unmakeMove(kingsideCastleMove)
        return false;
      }
      this.unmakeMove(kingsideCastleMove);
    }
    else if (queensideCastle) {
      for (let i = 1; i <= 2; i++) {
        const westIndex = fromIndex + (DIRECTION.WEST * i);
        const westSquare = this.chessboard.board[westIndex];
        const queensideCastleMove = (ENCODED_MOVE.PIECE_FROM_HAS_MOVED) | (westSquare << 16) | (westIndex << 8) | (fromIndex);
        this.makeMove(queensideCastleMove);
        if (this.kingIsInCheck(turnColour)) {
          this.unmakeMove(queensideCastleMove)
          return false;
        }
        this.unmakeMove(queensideCastleMove);
      }
    }

    return true;
  }
  
  generateLegalMoves(turnColour: number): [Uint32Array, number] {
    const [pseudoMoves, pseudoMoveCount] = this.generatePseudoMoves(turnColour);
    const legalMoves = new Uint32Array(pseudoMoveCount);

    
    let moveIdx = 0;
    for (let i = 0; i < pseudoMoveCount; i++) {
      const pseudoMove = pseudoMoves[i];
      if (pseudoMove === 0) break;
      
      if (this.moveIsLegal(pseudoMove, turnColour)) {
        legalMoves[moveIdx++] = pseudoMove;
      }
    }

    return [legalMoves, moveIdx];
  }

  perft(depth: number) {
    let nodes = 0;
    const [legalMoves, moveCount] = this.generateLegalMoves((this.chessboard.state[this.chessboard.ply] & BOARD_STATES.CURRENT_TURN_WHITE) ? PIECE.IS_WHITE : PIECE.IS_BLACK);

    if (depth === 0) {
      return 1;
    }
    else if (depth === 1) {
      return moveCount;
    }

    for (let i = 0; i < moveCount; i++) {
      this.makeMove(legalMoves[i]);
      nodes += this.perft(depth - 1);
      this.unmakeMove(legalMoves[i]);
    }

    return nodes;
  }

  decodeMove(move: number) {
    const from = this.chessboard.indexToAlgebraic(move & ENCODED_MOVE.FROM_INDEX);
    const to = this.chessboard.indexToAlgebraic((move & ENCODED_MOVE.TO_INDEX) >> 8);
    const pieceCapture = SQUARE_ASCII[((move & ENCODED_MOVE.PIECE_CAPTURE) >> 16) & (PIECE_MASK.TYPE | PIECE_MASK.COLOUR)];
    const pieceHasMoved = !!(move & ENCODED_MOVE.PIECE_FROM_HAS_MOVED);
    const promotionTo = SQUARE_ASCII[(move & ENCODED_MOVE.PROMOTION_TO) >> 25];
    const enPassant = !!(move & ENCODED_MOVE.EN_PASSANT_MOVE);
    const doublePush = !!(move & ENCODED_MOVE.DOUBLE_PUSH_MOVE);
    const kingsideCastle = !!(move & ENCODED_MOVE.KINGSIDE_CASTLE_MOVE);
    const queensideCastle = !!(move & ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE);

    return (
      `${from}->${to}${pieceCapture!=='.' ? ' captured:'+pieceCapture : ''}${pieceHasMoved ? ' moved' : ''}${promotionTo!=='.' ? ' promote:'+promotionTo : ''}${enPassant ? ' en-passant' : ''}${doublePush ? ' double-push' : ''}${kingsideCastle ? ' ks-castle' : ''}${queensideCastle ? ' qs-castle' : ''}`
    );
  }
}

