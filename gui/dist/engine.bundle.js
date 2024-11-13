/* SQUARE REPRESENTATION */
const SQUARE = {
    EMPTY: 0, // = 0
    EDGE: 128, // = 128
};
const PIECE = {
    PAWN: 1, // = 1
    KNIGHT: 2, // = 2
    BISHOP: 3, // = 3
    ROOK: 4, // = 4
    QUEEN: 5, // = 5
    KING: 6, // = 6
    HAS_MOVED: 8, // = 8
    IS_WHITE: 16, // = 16
    IS_BLACK: 32, // = 32
};
const PIECE_MASK = {
    TYPE: 7,
    COLOUR: 48,
};
const PIECE_LOOKUP = {
    P: PIECE.PAWN,
    N: PIECE.KNIGHT,
    B: PIECE.BISHOP,
    R: PIECE.ROOK,
    Q: PIECE.QUEEN,
    K: PIECE.KING,
};
const SQUARE_ASCII = {
    0: ".", // Empty
    17: "P", // Pawn White
    18: "N", // Knight White
    19: "B", // Bishop White
    20: "R", // Rook White
    21: "Q", // Queen White
    22: "K", // King White
    33: "p", // Pawn Black
    34: "n", // Knight Black
    35: "b", // Bishop Black
    36: "r", // Rook Black
    37: "q", // Queen Black
    38: "k", // King Black
};
/* FEN */
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/* MAILBOX */
const MAILBOX64 = new Int8Array([
    21, 22, 23, 24, 25, 26, 27, 28,
    31, 32, 33, 34, 35, 36, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48,
    51, 52, 53, 54, 55, 56, 57, 58,
    61, 62, 63, 64, 65, 66, 67, 68,
    71, 72, 73, 74, 75, 76, 77, 78,
    81, 82, 83, 84, 85, 86, 87, 88,
    91, 92, 93, 94, 95, 96, 97, 98
]);
const EDGE = SQUARE.EDGE;
const MAILBOX120 = new Int8Array([
    EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
    EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
    EDGE, 0, 1, 2, 3, 4, 5, 6, 7, EDGE,
    EDGE, 8, 9, 10, 11, 12, 13, 14, 15, EDGE,
    EDGE, 16, 17, 18, 19, 20, 21, 22, 23, EDGE,
    EDGE, 24, 25, 26, 27, 28, 29, 30, 31, EDGE,
    EDGE, 32, 33, 34, 35, 36, 37, 38, 39, EDGE,
    EDGE, 40, 41, 42, 43, 44, 45, 46, 47, EDGE,
    EDGE, 48, 49, 50, 51, 52, 53, 54, 55, EDGE,
    EDGE, 56, 57, 58, 59, 60, 61, 62, 63, EDGE,
    EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
    EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
]);
/* DIRECTIONS */
const DIRECTION = {
    NORTH: -10,
    SOUTH: 10,
    EAST: 1,
    WEST: -1,
    NORTHEAST: -9,
    NORTHWEST: -11,
    SOUTHEAST: 11,
    SOUTHWEST: 9,
};
/* MOVE LIST */
const MOVE_LIST = [
    /* black pawn */ new Int8Array([(DIRECTION.SOUTH), (2 * DIRECTION.SOUTH), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)]),
    /* white pawn */ new Int8Array([(DIRECTION.NORTH), (2 * DIRECTION.NORTH), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST)]),
    /*     knight */ new Int8Array([(DIRECTION.NORTH + DIRECTION.NORTHEAST), (DIRECTION.NORTH + DIRECTION.NORTHWEST), (DIRECTION.EAST + DIRECTION.NORTHEAST), (DIRECTION.EAST + DIRECTION.SOUTHEAST), (DIRECTION.SOUTH + DIRECTION.SOUTHEAST), (DIRECTION.SOUTH + DIRECTION.SOUTHWEST), (DIRECTION.WEST + DIRECTION.NORTHWEST), (DIRECTION.WEST + DIRECTION.SOUTHWEST)]),
    /*     bishop */ new Int8Array([(DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)]),
    /*       rook */ new Int8Array([(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST)]),
    /*      queen */ new Int8Array([(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)]),
    /*       king */ new Int8Array([(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)]),
];
const SLIDERS = [
    /* black pawn */ false,
    /* white pawn */ false,
    /*     knight */ false,
    /*     bishop */ true,
    /*       rook */ true,
    /*      queen */ true,
    /*       king */ false,
];
const CASTLE_INDEXES = {
    KING_TO_KINGSIDE: 2 * DIRECTION.EAST,
    KING_TO_QUEENSIDE: 2 * DIRECTION.WEST,
    ROOK_TO_KINGSIDE: 2 * DIRECTION.WEST,
    ROOK_TO_QUEENSIDE: 3 * DIRECTION.EAST,
    DEFAULT_WHITE_KING: 60,
    DEFAULT_WHITE_KINGSIDE_ROOK: 98,
    DEFAULT_WHITE_QUEENSIDE_ROOK: 91,
    CASTLED_WHITE_KINGSIDE_ROOK: 96,
    CASTLED_WHITE_QUEENSIDE_ROOK: 94,
    DEFAULT_BLACK_KING: 4,
    DEFAULT_BLACK_KINGSIDE_ROOK: 28,
    DEFAULT_BLACK_QUEENSIDE_ROOK: 21,
    CASTLED_BLACK_KINGSIDE_ROOK: 26,
    CASTLED_BLACK_QUEENSIDE_ROOK: 24,
};
/* MOVE ENCODING */
const ENCODED_MOVE = {
    EMPTY: 0,
    FROM_INDEX: 255, // << 0
    TO_INDEX: 65280, // << 8
    PIECE_CAPTURE: 4128768, // << 16
    PIECE_FROM_HAS_MOVED: 8388608, // << 23
    PROMOTION_TO: 234881024, // << 25
    EN_PASSANT_MOVE: 268435456, // << 28
    DOUBLE_PUSH_MOVE: 536870912, // << 29
    KINGSIDE_CASTLE_MOVE: 1073741824, // << 30
    QUEENSIDE_CASTLE_MOVE: 2147483648, // << 31
};
/* BOARD STATE */
const TURN = {
    WHITE: PIECE.IS_WHITE,
    BLACK: PIECE.IS_BLACK,
};
const BOARD_STATES = {
    EMPTY: 0,
    HALFMOVE_CLOCK: 255,
    EN_PASSANT_SQUARE: 65280,
    CASTLE_RIGHTS: 983040,
    WHITE_KINGSIDE_CASTLE: 524288,
    WHITE_QUEENSIDE_CASTLE: 262144,
    BLACK_KINGSIDE_CASTLE: 131072,
    BLACK_QUEENSIDE_CASTLE: 65536,
    CURRENT_TURN: 3145728,
    CURRENT_TURN_WHITE: 1048576,
    CURRENT_TURN_BLACK: 2097152,
};
/* PIECE & POSITION EVALUATION */
const MG_PIECE_VALUES = new Uint16Array([
    0, // none
    82, // pawn
    337, // knight
    365, // bishop
    477, // rook
    1025, // queen
    20000, // king
]);
const EG_PIECE_VALUES = new Uint16Array([
    0, // none
    94, // pawn
    281, // knight
    297, // bishop
    512, // rook
    936, // queen
    20000, // king
]);
// middle-game values
const MG_PIECE_SQUARE_TABLE = [
    // no piece = 0
    new Int16Array([]),
    // pawn = 1
    new Int16Array([
        0, 0, 0, 0, 0, 0, 0, 0,
        98, 134, 61, 95, 68, 126, 34, -11,
        -6, 7, 26, 31, 65, 56, 25, -20,
        -14, 13, 6, 21, 23, 12, 17, -23,
        -27, -2, -5, 12, 17, 6, 10, -25,
        -26, -4, -4, -10, 3, 3, 33, -12,
        -35, -1, -20, -23, -15, 24, 38, -22,
        0, 0, 0, 0, 0, 0, 0, 0,
    ]),
    // knight = 2
    new Int16Array([
        -167, -89, -34, -49, 61, -97, -15, -107,
        -73, -41, 72, 36, 23, 62, 7, -17,
        -47, 60, 37, 65, 84, 129, 73, 44,
        -9, 17, 19, 53, 37, 69, 18, 22,
        -13, 4, 16, 13, 28, 19, 21, -8,
        -23, -9, 12, 10, 19, 17, 25, -16,
        -29, -53, -12, -3, -1, 18, -14, -19,
        -105, -21, -58, -33, -17, -28, -19, -23,
    ]),
    // bishop = 3
    new Int16Array([
        -29, 4, -82, -37, -25, -42, 7, -8,
        -26, 16, -18, -13, 30, 59, 18, -47,
        -16, 37, 43, 40, 35, 50, 37, -2,
        -4, 5, 19, 50, 37, 37, 7, -2,
        -6, 13, 13, 26, 34, 12, 10, 4,
        0, 15, 15, 15, 14, 27, 18, 10,
        4, 15, 16, 0, 7, 21, 33, 1,
        -33, -3, -14, -21, -13, -12, -39, -21,
    ]),
    // rook = 4
    new Int16Array([
        32, 42, 32, 51, 63, 9, 31, 43,
        27, 32, 58, 62, 80, 67, 26, 44,
        -5, 19, 26, 36, 17, 45, 61, 16,
        -24, -11, 7, 26, 24, 35, -8, -20,
        -36, -26, -12, -1, 9, -7, 6, -23,
        -45, -25, -16, -17, 3, 0, -5, -33,
        -44, -16, -20, -9, -1, 11, -6, -71,
        -19, -13, 1, 17, 16, 7, -37, -26,
    ]),
    // queen = 5
    new Int16Array([
        -28, 0, 29, 12, 59, 44, 43, 45,
        -24, -39, -5, 1, -16, 57, 28, 54,
        -13, -17, 7, 8, 29, 56, 47, 57,
        -27, -27, -16, -16, -1, 17, -2, 1,
        -9, -26, -9, -10, -2, -4, 3, -3,
        -14, 2, -11, -2, -5, 2, 14, 5,
        -35, -8, 11, 2, 8, 15, -3, 1,
        -1, -18, -9, 10, -15, -25, -31, -50,
    ]),
    // king = 6
    new Int16Array([
        -65, 23, 16, -15, -56, -34, 2, 13,
        29, -1, -20, -7, -8, -4, -38, -29,
        -9, 24, 2, -16, -20, 6, 22, -22,
        -17, -20, -12, -27, -30, -25, -14, -36,
        -49, -1, -27, -39, -46, -44, -33, -51,
        -14, -14, -22, -46, -44, -30, -15, -27,
        1, 7, -8, -64, -43, -16, 9, 8,
        -15, 36, 12, -54, 8, -28, 24, 14,
    ]),
];
// end-game values
const EG_PIECE_SQUARE_TABLE = [
    // no piece = 0
    new Int16Array([]),
    // pawn = 1
    new Int16Array([
        0, 0, 0, 0, 0, 0, 0, 0,
        178, 173, 158, 134, 147, 132, 165, 187,
        94, 100, 85, 67, 56, 53, 82, 84,
        32, 24, 13, 5, -2, 4, 17, 17,
        13, 9, -3, -7, -7, -8, 3, -1,
        4, 7, -6, 1, 0, -5, -1, -8,
        13, 8, 8, 10, 13, 0, 2, -7,
        0, 0, 0, 0, 0, 0, 0, 0,
    ]),
    // knight = 2
    new Int16Array([
        -58, -38, -13, -28, -31, -27, -63, -99,
        -25, -8, -25, -2, -9, -25, -24, -52,
        -24, -20, 10, 9, -1, -9, -19, -41,
        -17, 3, 22, 22, 22, 11, 8, -18,
        -18, -6, 16, 25, 16, 17, 4, -18,
        -23, -3, -1, 15, 10, -3, -20, -22,
        -42, -20, -10, -5, -2, -20, -23, -44,
        -29, -51, -23, -15, -22, -18, -50, -64,
    ]),
    // bishop = 3
    new Int16Array([
        -14, -21, -11, -8, -7, -9, -17, -24,
        -8, -4, 7, -12, -3, -13, -4, -14,
        2, -8, 0, -1, -2, 6, 0, 4,
        -3, 9, 12, 9, 14, 10, 3, 2,
        -6, 3, 13, 19, 7, 10, -3, -9,
        -12, -3, 8, 10, 13, 3, -7, -15,
        -14, -18, -7, -1, 4, -9, -15, -27,
        -23, -9, -23, -5, -9, -16, -5, -17,
    ]),
    // rook = 4
    new Int16Array([
        13, 10, 18, 15, 12, 12, 8, 5,
        11, 13, 13, 11, -3, 3, 8, 3,
        7, 7, 7, 5, 4, -3, -5, -3,
        4, 3, 13, 1, 2, 1, -1, 2,
        3, 5, 8, 4, -5, -6, -8, -11,
        -4, 0, -5, -1, -7, -12, -8, -16,
        -6, -6, 0, 2, -9, -9, -11, -3,
        -9, 2, 3, -1, -5, -13, 4, -20,
    ]),
    // queen = 5
    new Int16Array([
        -9, 22, 22, 27, 27, 19, 10, 20,
        -17, 20, 32, 41, 58, 25, 30, 0,
        -20, 6, 9, 49, 47, 35, 19, 9,
        3, 22, 24, 45, 57, 40, 57, 36,
        -18, 28, 19, 47, 31, 34, 39, 23,
        -16, -27, 15, 6, 9, 17, 10, 5,
        -22, -23, -30, -16, -16, -23, -36, -32,
        -33, -28, -22, -43, -5, -32, -20, -41,
    ]),
    // king = 6
    new Int16Array([
        -74, -35, -18, -18, -11, 15, 4, -17,
        -12, 17, 14, 17, 17, 38, 23, 11,
        10, 17, 23, 15, 20, 45, 44, 13,
        -8, 22, 24, 27, 26, 33, 26, 3,
        -18, -4, 21, 24, 27, 23, 9, -11,
        -19, -3, 11, 21, 23, 16, 7, -9,
        -27, -11, 4, 13, 14, 4, -5, -17,
        -53, -34, -21, -11, -28, -14, -24, -43
    ]),
];
// index to swap piece-square table from white to black (i.e. from black's perspective, index=0 should be H8)
const FLIP = new Uint8Array([
    56, 57, 58, 59, 60, 61, 62, 63,
    48, 49, 50, 51, 52, 53, 54, 55,
    40, 41, 42, 43, 44, 45, 46, 47,
    32, 33, 34, 35, 36, 37, 38, 39,
    24, 25, 26, 27, 28, 29, 30, 31,
    16, 17, 18, 19, 20, 21, 22, 23,
    8, 9, 10, 11, 12, 13, 14, 15,
    0, 1, 2, 3, 4, 5, 6, 7,
]);
const GAME_PHASE = new Uint8Array([0, 0, 1, 1, 2, 4, 0]); // used as weights to calculate how 'influential' a piece move is towards reaching endgame [n/a, pawn, knight, bishop, etc...]

class ChessBoard {
    constructor(fen = DEFAULT_FEN) {
        this.board = new Uint8Array(120).fill(SQUARE.EDGE); // 10x12 1D-array board representation
        this.state = new Uint32Array(3600).fill(BOARD_STATES.EMPTY);
        this.ply = 0;
        this.parseFen(fen);
    }
    parseFen(fen) {
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
                    if ((colour === PIECE.IS_WHITE && boardIndex >= 48 && boardIndex <= 55) ||
                        (colour === PIECE.IS_BLACK && boardIndex >= 8 && boardIndex <= 15)) {
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
        if (castleFEN.includes('K'))
            castleRights |= BOARD_STATES.WHITE_KINGSIDE_CASTLE;
        if (castleFEN.includes('Q'))
            castleRights |= BOARD_STATES.WHITE_QUEENSIDE_CASTLE;
        if (castleFEN.includes('k'))
            castleRights |= BOARD_STATES.BLACK_KINGSIDE_CASTLE;
        if (castleFEN.includes('q'))
            castleRights |= BOARD_STATES.BLACK_QUEENSIDE_CASTLE;
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
                }
                else {
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
        const castleFEN = (ksCastleWhite + qsCastleWhite + ksCastleBlack + qsCastleBlack) || '-';
        const epFEN = parseInt(ChessBoard.indexToAlgebraic((currentState & BOARD_STATES.EN_PASSANT_SQUARE) >> 8)) || '-';
        const halfmoveFEN = (currentState & BOARD_STATES.HALFMOVE_CLOCK);
        const fullmoveFEN = Math.floor((this.ply + 1) / 2);
        return `${boardFEN} ${currentTurnFEN} ${castleFEN} ${epFEN} ${halfmoveFEN} ${fullmoveFEN}`;
    }
    static algebraicToIndex(notation) {
        const [fileCh, rankCh] = notation.toLowerCase().split("");
        const file = fileCh.charCodeAt(0) - 97;
        const rank = 64 - parseInt(rankCh) * 8;
        return MAILBOX64[file + rank];
    }
    static indexToAlgebraic(index) {
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

class Engine {
    constructor(fen) {
        this.moveHistory = new Uint32Array(3600); // stores the move history - 3600 is maximum theoretical moves
        this.kingPositions = new Uint8Array([SQUARE.EMPTY, SQUARE.EMPTY]); // cache for [white, black] kig positions for quick lookup
        this.mgTablesWhite = Array.from({ length: 7 }, () => new Uint16Array(64)); // precomputed middle-game values table [piece][square]
        this.mgTablesBlack = Array.from({ length: 7 }, () => new Uint16Array(64));
        this.egTablesWhite = Array.from({ length: 7 }, () => new Uint16Array(64)); // precomputed end-game values table
        this.egTablesBlack = Array.from({ length: 7 }, () => new Uint16Array(64));
        this.mvvLvaTables = Array.from({ length: 7 }, () => new Uint16Array(6)); // precomputed mvv-lva tables
        this.chessboard = new ChessBoard(fen);
        this.updateKingPositionCache();
        this.initPestoTables();
        this.initMvvLvaTables();
    }
    initPestoTables() {
        for (let pc = PIECE.PAWN; pc <= PIECE.KING; pc++) {
            for (let sq = 0; sq < 64; sq++) {
                // white tables
                this.mgTablesWhite[pc][sq] = MG_PIECE_VALUES[pc] + MG_PIECE_SQUARE_TABLE[pc][sq];
                this.egTablesWhite[pc][sq] = EG_PIECE_VALUES[pc] + EG_PIECE_SQUARE_TABLE[pc][sq];
                // black tables
                this.mgTablesBlack[pc][sq] = MG_PIECE_VALUES[pc] + MG_PIECE_SQUARE_TABLE[pc][FLIP[sq]];
                this.egTablesBlack[pc][sq] = EG_PIECE_VALUES[pc] + EG_PIECE_SQUARE_TABLE[pc][FLIP[sq]];
            }
        }
    }
    initMvvLvaTables() {
        for (let pcA = PIECE.PAWN; pcA <= PIECE.KING; pcA++) {
            for (let pcV = PIECE.PAWN; pcV <= PIECE.KING; pcV++) {
                const attackerValue = MG_PIECE_VALUES[pcA];
                const victimValue = MG_PIECE_VALUES[pcV];
                this.mvvLvaTables[pcA][pcV] = (victimValue * 10) - attackerValue;
            }
        }
    }
    updateKingPositionCache() {
        for (let sq = 0; sq < 64; sq++) {
            const boardIndex = MAILBOX64[sq];
            const square = this.chessboard.board[boardIndex];
            const piece = square & PIECE_MASK.TYPE;
            const colour = square & PIECE_MASK.COLOUR;
            if (piece === PIECE.KING) {
                const positionIndex = (colour === PIECE.IS_WHITE) ? 0 : 1;
                this.kingPositions[positionIndex] = boardIndex;
            }
        }
    }
    kingIsInCheck(kingColour) {
        // get king positions (in reference to king colour)
        let [kingPosition, opponentKingPosition] = this.kingPositions;
        if (kingColour === PIECE.IS_BLACK) {
            const tmp = kingPosition;
            kingPosition = opponentKingPosition;
            opponentKingPosition = tmp;
        }
        // check for any attacking sliders (straight and diagonal)
        const straightMoves = MOVE_LIST[PIECE.ROOK];
        for (let m = 0; m < straightMoves.length; m++) {
            const direction = straightMoves[m];
            let currentPosition = kingPosition;
            if ((kingPosition + direction) === opponentKingPosition)
                return true; // piece is attacked by opponent king
            while (true) {
                currentPosition += direction;
                const currentSquare = this.chessboard.board[currentPosition];
                const currentPiece = currentSquare & PIECE_MASK.TYPE;
                const currentColour = currentSquare & PIECE_MASK.COLOUR;
                if (currentSquare === SQUARE.EMPTY)
                    continue;
                if (currentSquare === SQUARE.EDGE)
                    break;
                if (currentColour === kingColour)
                    break;
                if (currentPiece === PIECE.ROOK || currentPiece === PIECE.QUEEN)
                    return true; // piece is under attack
                break; // piece is protected from sliders by a non-slider opponent piece
            }
        }
        const diagonalMoves = MOVE_LIST[PIECE.BISHOP];
        for (let m = 0; m < diagonalMoves.length; m++) {
            const direction = diagonalMoves[m];
            let currentPosition = kingPosition;
            if ((kingPosition + direction) === opponentKingPosition)
                return true; // piece is attacked by opponent king
            while (true) {
                currentPosition += direction;
                const currentSquare = this.chessboard.board[currentPosition];
                const currentPiece = currentSquare & PIECE_MASK.TYPE;
                const currentColour = currentSquare & PIECE_MASK.COLOUR;
                if (currentSquare === SQUARE.EMPTY)
                    continue;
                if (currentSquare === SQUARE.EDGE)
                    break;
                if (currentColour === kingColour)
                    break;
                if (currentPiece === PIECE.BISHOP || currentPiece === PIECE.QUEEN)
                    return true; // piece is under attack
                break; // piece is protected from sliders by a non-slider opponent piece
            }
        }
        // check for attacking knights
        const knightMoves = MOVE_LIST[PIECE.KNIGHT];
        for (let m = 0; m < knightMoves.length; m++) {
            const direction = knightMoves[m];
            const currentSquare = this.chessboard.board[kingPosition + direction];
            const currentPiece = currentSquare & PIECE_MASK.TYPE;
            const currentColour = currentSquare & PIECE_MASK.COLOUR;
            if (currentColour === kingColour)
                continue;
            if (currentPiece === PIECE.KNIGHT)
                return true; // under attack by knight
        }
        // check for diagonal pawn moves
        const pawnIndex = kingColour === PIECE.IS_WHITE ? 1 : 0; // used to access the black/white pawn's move set. we use the *same* colour moves as the king to check, as we are searching backwards *from* the king, and the same pawn colour mirrors the opponent pawn attacks.
        const eastPawnIndex = kingPosition + MOVE_LIST[pawnIndex][2];
        const eastPawnSquare = this.chessboard.board[eastPawnIndex];
        const eastPawnPiece = eastPawnSquare & PIECE_MASK.TYPE;
        const eastPawnColour = eastPawnSquare & PIECE_MASK.COLOUR;
        if (eastPawnColour !== kingColour && eastPawnPiece === PIECE.PAWN) {
            return true; // under attack by pawn
        }
        const westPawnIndex = kingPosition + MOVE_LIST[pawnIndex][3];
        const westPawnSquare = this.chessboard.board[westPawnIndex];
        const westPawnPiece = westPawnSquare & PIECE_MASK.TYPE;
        const westPawnColour = westPawnSquare & PIECE_MASK.COLOUR;
        if (westPawnColour !== kingColour && westPawnPiece === PIECE.PAWN) {
            return true; // under attack by pawn
        }
        // default return if no attackers found
        return false;
    }
    moveIsLegal(move, turnColour) {
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
            for (let i = 0; i <= 1; i++) {
                const eastIndex = fromIndex + (DIRECTION.EAST * i);
                const eastSquare = this.chessboard.board[eastIndex];
                const kingsideCastleMove = (ENCODED_MOVE.PIECE_FROM_HAS_MOVED) | (eastSquare << 16) | (eastIndex << 8) | (fromIndex);
                this.makeMove(kingsideCastleMove);
                if (this.kingIsInCheck(turnColour)) {
                    this.unmakeMove(kingsideCastleMove);
                    return false;
                }
                this.unmakeMove(kingsideCastleMove);
            }
        }
        else if (queensideCastle) {
            for (let i = 0; i <= 2; i++) {
                const westIndex = fromIndex + (DIRECTION.WEST * i);
                const westSquare = this.chessboard.board[westIndex];
                const queensideCastleMove = (ENCODED_MOVE.PIECE_FROM_HAS_MOVED) | (westSquare << 16) | (westIndex << 8) | (fromIndex);
                this.makeMove(queensideCastleMove);
                if (this.kingIsInCheck(turnColour)) {
                    this.unmakeMove(queensideCastleMove);
                    return false;
                }
                this.unmakeMove(queensideCastleMove);
            }
        }
        return true;
    }
    decodeMoveData(move) {
        const from = ChessBoard.indexToAlgebraic(move & ENCODED_MOVE.FROM_INDEX);
        const to = ChessBoard.indexToAlgebraic((move & ENCODED_MOVE.TO_INDEX) >> 8);
        const pieceCapture = SQUARE_ASCII[((move & ENCODED_MOVE.PIECE_CAPTURE) >> 16) & (PIECE_MASK.TYPE | PIECE_MASK.COLOUR)];
        const pieceHasMoved = !!(move & ENCODED_MOVE.PIECE_FROM_HAS_MOVED);
        const promotionTo = SQUARE_ASCII[((move & ENCODED_MOVE.PROMOTION_TO) >> 25) | PIECE.IS_BLACK]; // IS_BLACK just to get lowercase ascii
        const enPassant = !!(move & ENCODED_MOVE.EN_PASSANT_MOVE);
        const doublePush = !!(move & ENCODED_MOVE.DOUBLE_PUSH_MOVE);
        const kingsideCastle = !!(move & ENCODED_MOVE.KINGSIDE_CASTLE_MOVE);
        const queensideCastle = !!(move & ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE);
        return (`${from}->${to}${pieceCapture !== '.' ? ' captured:' + pieceCapture : ''}${pieceHasMoved ? ' moved' : ''}${promotionTo ? ' promote:' + promotionTo : ''}${enPassant ? ' en-passant' : ''}${doublePush ? ' double-push' : ''}${kingsideCastle ? ' ks-castle' : ''}${queensideCastle ? ' qs-castle' : ''}`);
    }
    static encodedMoveToAlgebraic(move) {
        const from = ChessBoard.indexToAlgebraic(move & ENCODED_MOVE.FROM_INDEX);
        const to = ChessBoard.indexToAlgebraic((move & ENCODED_MOVE.TO_INDEX) >> 8);
        return `${from}${to}`;
    }
    static algebraicMoveToIndexes(move) {
        const from = ChessBoard.algebraicToIndex(move.substring(0, 2));
        const to = ChessBoard.algebraicToIndex(move.substring(2, 4));
        return [from, to];
    }
    mvvLvaScore(move) {
        const attacker = this.chessboard.board[(move & ENCODED_MOVE.FROM_INDEX)] & PIECE_MASK.TYPE;
        const victim = ((move & ENCODED_MOVE.PIECE_CAPTURE) >> 16) & PIECE_MASK.TYPE;
        return this.mvvLvaTables[attacker][victim];
    }
    generatePseudoMoves(turnColour) {
        const regularMoves = new Uint32Array(256); // track normal moves
        let regularMovesIdx = 0;
        const captureMoves = new Uint32Array(256); // track capture moves separate (to allow prioritisation in move ordering)
        let captureMovesIdx = 0;
        const ply = this.chessboard.ply;
        const state = this.chessboard.state[ply];
        for (let sq = 0; sq < 64; sq++) {
            const fromBoardIndex = MAILBOX64[sq];
            const fromSquare = this.chessboard.board[fromBoardIndex];
            const fromPiece = fromSquare & PIECE_MASK.TYPE;
            const fromColour = fromSquare & PIECE_MASK.COLOUR;
            const fromHasMoved = (fromSquare & PIECE.HAS_MOVED) ? ENCODED_MOVE.PIECE_FROM_HAS_MOVED : ENCODED_MOVE.EMPTY;
            // skip checking pieces from opposition colour
            if (fromColour !== turnColour)
                continue;
            // get index for MOVE_LIST and SLIDERS (index is their piece number, except black pawn is 0 as it moves different to white pawn)
            const pieceMovesIndex = (fromPiece === PIECE.PAWN && fromColour === PIECE.IS_BLACK) ? 0 : fromPiece;
            const directions = MOVE_LIST[pieceMovesIndex];
            const slider = SLIDERS[pieceMovesIndex];
            for (let d = 0; d < directions.length; d++) {
                const direction = directions[d];
                let toBoardIndex = fromBoardIndex; // initialise from the current square, and we will add directions to it next during generation
                while (true) {
                    if (fromPiece === PIECE.PAWN)
                        break; // handle all pawn moves separately, as they contain special rules
                    toBoardIndex += direction;
                    const toSquare = this.chessboard.board[toBoardIndex];
                    const toColour = toSquare & PIECE_MASK.COLOUR;
                    if (toSquare === SQUARE.EMPTY) {
                        // empty square means piece can move here (pawn single push handled different - calculated all pawn moves separately later)
                        regularMoves[regularMovesIdx++] = (fromHasMoved) | (toBoardIndex << 8) | (fromBoardIndex);
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
                        captureMoves[captureMovesIdx++] = (fromHasMoved) | (toSquare << 16) | (toBoardIndex << 8) | (fromBoardIndex);
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
                    if (singlePushIndex >= 31 && singlePushIndex <= 88) {
                        // regular single push
                        regularMoves[regularMovesIdx++] = (fromHasMoved) | (singlePushIndex << 8) | (fromBoardIndex);
                    }
                    else {
                        // single push with promotion
                        for (let promotionPiece = PIECE.KNIGHT; promotionPiece <= PIECE.QUEEN; promotionPiece++) {
                            regularMoves[regularMovesIdx++] = (promotionPiece << 25) | (fromHasMoved) | (singlePushIndex << 8) | (fromBoardIndex);
                        }
                    }
                    if (!fromHasMoved && this.chessboard.board[doublePushIndex] === SQUARE.EMPTY) {
                        // double push
                        regularMoves[regularMovesIdx++] = (ENCODED_MOVE.DOUBLE_PUSH_MOVE) | (fromHasMoved) | (doublePushIndex << 8) | (fromBoardIndex);
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
                        captureMoves[captureMovesIdx++] = (fromHasMoved) | (eastSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
                    }
                    else {
                        // east diagonal piece capture with promotion
                        for (let promotionPiece = PIECE.KNIGHT; promotionPiece <= PIECE.QUEEN; promotionPiece++) {
                            captureMoves[captureMovesIdx++] = (promotionPiece << 25) | (fromHasMoved) | (eastSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
                        }
                    }
                }
                else if (eastDiagonalIndex === enPassantTarget && enPassantSquare) {
                    // en passant capture
                    captureMoves[captureMovesIdx++] = (ENCODED_MOVE.EN_PASSANT_MOVE) | (fromHasMoved) | (enPassantSquare << 16) | (eastDiagonalIndex << 8) | (fromBoardIndex);
                }
                const westSquare = this.chessboard.board[westDiagonalIndex];
                const westPiece = westSquare & PIECE_MASK.TYPE;
                const westColour = westSquare & PIECE_MASK.COLOUR;
                if (westPiece && westColour !== fromColour) {
                    if (westDiagonalIndex >= 31 && westDiagonalIndex <= 88) {
                        // west diagonal piece capture
                        captureMoves[captureMovesIdx++] = (fromHasMoved) | (westSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
                    }
                    else {
                        // west diagonal piece capture with promotion
                        for (let promotionPiece = PIECE.KNIGHT; promotionPiece <= PIECE.QUEEN; promotionPiece++) {
                            captureMoves[captureMovesIdx++] = (promotionPiece << 25) | (fromHasMoved) | (westSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
                        }
                    }
                }
                else if (westDiagonalIndex === enPassantTarget && enPassantSquare) {
                    // en passant capture
                    captureMoves[captureMovesIdx++] = (ENCODED_MOVE.EN_PASSANT_MOVE) | (fromHasMoved) | (enPassantSquare << 16) | (westDiagonalIndex << 8) | (fromBoardIndex);
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
                            regularMoves[regularMovesIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_KINGSIDE) << 8) | (fromBoardIndex);
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
                            regularMoves[regularMovesIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_QUEENSIDE) << 8) | (fromBoardIndex);
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
                            regularMoves[regularMovesIdx++] = (ENCODED_MOVE.KINGSIDE_CASTLE_MOVE) | (fromHasMoved) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_KINGSIDE) << 8) | (fromBoardIndex);
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
                            regularMoves[regularMovesIdx++] = (ENCODED_MOVE.QUEENSIDE_CASTLE_MOVE) | (fromHasMoved) | ((fromBoardIndex + CASTLE_INDEXES.KING_TO_QUEENSIDE) << 8) | (fromBoardIndex);
                        }
                    }
                }
            }
        }
        // efficiently combine all moves into single array, with capture moves being ordered first
        const combinedMoves = new Uint32Array(regularMovesIdx + captureMovesIdx);
        combinedMoves.set(captureMoves.subarray(0, captureMovesIdx).sort((moveA, moveB) => this.mvvLvaScore(moveB) - this.mvvLvaScore(moveA)), 0); // MVV-LVA sort before combining
        combinedMoves.set(regularMoves.subarray(0, regularMovesIdx), captureMovesIdx);
        return combinedMoves;
    }
    generateLegalMoves(turnColour) {
        const pseudoMoves = this.generatePseudoMoves(turnColour);
        const legalMoves = new Uint32Array(pseudoMoves.length);
        let moveIdx = 0;
        for (let m = 0; m < pseudoMoves.length; m++) {
            const pseudoMove = pseudoMoves[m];
            if (pseudoMove === 0)
                break;
            if (this.moveIsLegal(pseudoMove, turnColour)) {
                legalMoves[moveIdx++] = pseudoMove;
            }
        }
        return legalMoves.subarray(0, moveIdx);
    }
    makeMove(move) {
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
        // move piece (and flag as 'has moved')
        this.chessboard.board[toIndex] = fromSquare | PIECE.HAS_MOVED;
        // empty square that piece moved from
        this.chessboard.board[fromIndex] = SQUARE.EMPTY;
        // promoted piece if required
        if (promotionPiece) {
            this.chessboard.board[toIndex] &= ~(PIECE_MASK.TYPE); // remove piece type
            this.chessboard.board[toIndex] |= promotionPiece; // add promoted piece type
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
        updatedState &= ~(BOARD_STATES.CURRENT_TURN); // remove current turn indicator
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
    unmakeMove(move) {
        let ply = this.chessboard.ply;
        this.chessboard.state[ply] = BOARD_STATES.EMPTY; // remove updated state - since not required
        this.moveHistory[ply] = ENCODED_MOVE.EMPTY; // remove most recent move from history stack
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
            this.chessboard.board[restorePieceIndex] = capturedSquare; // restore piece on board
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
    evaluate(turnColour) {
        // track the current evaluation score
        const mg = new Int32Array([0, 0]); // middle-game scores [WHITE, BLACK]
        const eg = new Int32Array([0, 0]); // end-game scores
        // track game-phase (start, mid, endgame)
        let gamePhase = 0;
        for (let sq = 0; sq < 64; sq++) {
            const boardIndex = MAILBOX64[sq];
            const square = this.chessboard.board[boardIndex];
            if (square === SQUARE.EMPTY)
                continue; // skip empty squares for eval
            const piece = square & PIECE_MASK.TYPE;
            const colour = square & PIECE_MASK.COLOUR;
            if (colour === PIECE.IS_WHITE) {
                mg[0] += this.mgTablesWhite[piece][sq];
                eg[0] += this.egTablesWhite[piece][sq];
            }
            else if (colour === PIECE.IS_BLACK) {
                mg[1] += this.mgTablesBlack[piece][sq];
                eg[1] += this.egTablesBlack[piece][sq];
            }
            gamePhase += GAME_PHASE[piece];
        }
        // tapered evaluation
        let mgScore = mg[0] - mg[1]; // white - black
        let egScore = eg[0] - eg[1];
        if (turnColour === PIECE.IS_BLACK) {
            mgScore *= -1;
            egScore *= -1;
        }
        const mgPhase = Math.min(gamePhase, 24); // cap game phase at 24 (1 for each piece, but early promotion may skew result)
        const egPhase = 24 - mgPhase;
        return ((mgScore * mgPhase) + (egScore * egPhase)) / 24; // normalise score, weighted by phase of the game
    }
    negamax(depth, turnColour, alpha = -Infinity, beta = Infinity) {
        if (depth === 0) {
            return { score: this.evaluate(turnColour), bestMove: null };
        }
        const moves = this.generateLegalMoves(turnColour);
        if (moves.length === 0) {
            if (this.kingIsInCheck(turnColour)) {
                // checkmate. return a mate score adjusted for depth
                const mateScore = -(EG_PIECE_VALUES[PIECE.KING] + depth);
                return { score: mateScore, bestMove: null };
            }
            else {
                // stalemate
                return { score: 0, bestMove: 0 };
            }
        }
        const opponentColour = turnColour === TURN.WHITE ? TURN.BLACK : TURN.WHITE;
        let maxScore = -Infinity;
        let bestMove = null;
        for (let m = 0; m < moves.length; m++) {
            const move = moves[m];
            this.makeMove(move);
            let { score } = this.negamax(depth - 1, opponentColour, -beta, -alpha);
            score *= -1;
            this.unmakeMove(move);
            if (score > maxScore) {
                maxScore = score;
                bestMove = move;
            }
            // alpha-beta pruning
            alpha = Math.max(alpha, maxScore);
            if (beta <= alpha) {
                break;
            }
        }
        return {
            score: maxScore,
            bestMove: bestMove,
        };
    }
    perft(depth, outputIndividual = false, firstMove = true) {
        if (outputIndividual) {
            console.log(`\n*** perft ***`);
            console.log(`position: ${this.chessboard.getFen()}`);
            console.log(`depth: ${depth}\n`);
        }
        const startTime = performance.now();
        let nodes = 0;
        const legalMoves = this.generateLegalMoves((this.chessboard.state[this.chessboard.ply] & BOARD_STATES.CURRENT_TURN_WHITE) ? TURN.WHITE : TURN.BLACK);
        if (depth === 0) {
            return 1;
        }
        else if (depth === 1) {
            if (outputIndividual && firstMove) {
                for (let m = 0; m < legalMoves.length; m++) {
                    const move = legalMoves[m];
                    const from = ChessBoard.indexToAlgebraic(move & ENCODED_MOVE.FROM_INDEX).toLowerCase();
                    const to = ChessBoard.indexToAlgebraic((move & ENCODED_MOVE.TO_INDEX) >> 8).toLowerCase();
                    const promotion = SQUARE_ASCII[PIECE.IS_BLACK | ((move & ENCODED_MOVE.PROMOTION_TO) >> 25)] || '';
                    console.log(`${from}${to}${promotion}: 1`);
                }
                const nodesPerSecond = (legalMoves.length / ((performance.now() - startTime) / 1000)).toFixed(2);
                if (outputIndividual) {
                    console.log(`\nNodes: ${nodes}`);
                    console.log(`Speed: ${nodesPerSecond} / sec`);
                }
            }
            return legalMoves.length;
        }
        for (let m = 0; m < legalMoves.length; m++) {
            const move = legalMoves[m];
            let childnodes = 0;
            this.makeMove(move);
            childnodes += this.perft(depth - 1, false, false);
            this.unmakeMove(move);
            nodes += childnodes;
            if (firstMove && outputIndividual) {
                const from = ChessBoard.indexToAlgebraic(move & ENCODED_MOVE.FROM_INDEX).toLowerCase();
                const to = ChessBoard.indexToAlgebraic((move & ENCODED_MOVE.TO_INDEX) >> 8).toLowerCase();
                const promotion = SQUARE_ASCII[PIECE.IS_BLACK | ((move & ENCODED_MOVE.PROMOTION_TO) >> 25)] || '';
                if (outputIndividual) {
                    console.log(`${from}${to}${promotion === '.' ? '' : promotion}: ${childnodes}`);
                }
            }
        }
        if (outputIndividual) {
            const seconds = (performance.now() - startTime) / 1000;
            const nodesPerSecond = (nodes / seconds).toFixed(2);
            console.log(`\nNodes: ${nodes}`);
            console.log(`\Time: ${seconds} secs`);
            console.log(`Speed: ${nodesPerSecond} nodes / sec`);
        }
        return nodes;
    }
}

class ChessEngineAPI {
    constructor(options = {}) {
        const { fen, debug } = options;
        this.engine = new Engine(fen || DEFAULT_FEN);
        this.initialFEN = fen || DEFAULT_FEN;
        this.debug = debug !== null && debug !== void 0 ? debug : false;
        this.start = 0;
    }
    /* sets the board state according to new FEN input. removes existing engine state */
    setFen(fen) {
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
        };
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
            }
            else {
                return 'stalemate';
            }
        }
        return 'playing';
    }
    /* apply a move to the board with algebraic notation. i.e. e2e4 */
    applyMove(move) {
        if (!/^[a-h][1-8][a-h][1-8]$/.test(move.toLowerCase()))
            return false; // don't allow invalid algebraic input
        const [from, to] = Engine.algebraicMoveToIndexes(move);
        const turnColour = this.engine.chessboard.board[from] & PIECE_MASK.COLOUR;
        if (turnColour !== TURN.WHITE && turnColour !== TURN.BLACK)
            return false; // ensure square to move actually contains a piece
        const legalMoves = this.engine.generateLegalMoves(turnColour); // find the encoded move information
        const legalMove = legalMoves.find(legalMove => (legalMove & ENCODED_MOVE.FROM_INDEX) === from &&
            ((legalMove & ENCODED_MOVE.TO_INDEX) >> 8) === to);
        if (!legalMove)
            return false; // if no move found, then it isn't legal or existing
        this.engine.makeMove(legalMove); // finally, make the move on the board
    }
    /* undo the last move made. can keep being called to first move */
    undoMove() {
        const lastMove = this.engine.moveHistory[this.engine.chessboard.ply];
        if (lastMove === 0)
            return false; // no more moves to undo
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
    perft({ position = DEFAULT_FEN, depth = 5 } = {}) {
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

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = global$1.performance || {};
var performanceNow =
  performance$1.now        ||
  performance$1.mozNow     ||
  performance$1.msNow      ||
  performance$1.oNow       ||
  performance$1.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance$1)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

class UCIInterface {
    constructor(engine) {
        this.engine = engine;
    }
    startListening() {
        browser$1.stdin.setEncoding('utf-8');
        browser$1.stdin.on('data', (data) => {
            const commands = data.toString().split('\n'); // split the input into lines
            commands.forEach((command) => {
                command = command.trim(); // remove any extra whitespace
                if (command) { // ignore empty lines
                    this.processCommand(command);
                }
            });
        });
    }
    processCommand(command) {
        const args = command.split(' ');
        switch (args[0]) {
            case 'uci':
                this.uci();
                break;
            case 'debug':
                this.debug(args);
                break;
            case 'isready':
                this.isready();
                break;
            case 'position':
                this.position(args);
                break;
            case 'go':
                this.go(args);
                break;
            case 'stop':
                this.stop();
                break;
            case 'quit':
                this.quit();
                break;
        }
    }
    uci() {
        console.log(`id name ${UCIInterface.NAME}`);
        console.log(`id author ${UCIInterface.AUTHOR}`);
        console.log('uciok');
    }
    debug(args) {
        console.log('debug not supported');
        return args[0];
    }
    isready() {
        console.log('readyok');
    }
    position(args) {
        let fen;
        let moves;
        if (args[1] === 'fen') {
            fen = args[2];
            moves = args.slice(3);
        }
        else if (args[1] === 'startpos') {
            fen = DEFAULT_FEN;
            moves = args.slice(2);
        }
        else {
            return false;
        }
        this.engine.setFen(fen);
        if (moves) {
            for (let move of moves) {
                this.engine.applyMove(move);
            }
        }
    }
    go(args) {
        let depth;
        if (args[1] === 'depth') {
            depth = parseInt(args[2]);
        }
        return this.engine.getBestMove(depth);
    }
    stop() {
        return false;
    }
    quit() {
        browser$1.exit();
    }
}
UCIInterface.NAME = 'Tonnetto';
UCIInterface.AUTHOR = 'Marco Buontempo';

export { ChessBoard, ChessEngineAPI, Engine, TURN, UCIInterface };