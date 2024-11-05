/* SQUARE REPRESENTATION */

export const SQUARE = {
  EMPTY: 0b0000_0000,        // = 0
  EDGE:  0b1000_0000,        // = 128
}

export const PIECE = {
  PAWN:      0b0000_0001,        // = 1
  KNIGHT:    0b0000_0010,        // = 2
  BISHOP:    0b0000_0011,        // = 3
  ROOK:      0b0000_0100,        // = 4
  QUEEN:     0b0000_0101,        // = 5
  KING:      0b0000_0110,        // = 6
  HAS_MOVED: 0b0000_1000,        // = 8
  IS_WHITE:  0b0001_0000,        // = 16
  IS_BLACK:  0b0010_0000,        // = 32
}

export const PIECE_MASK = {
  TYPE:   0b0000_0111,
  COLOUR: 0b0011_0000,
}

export const PROMOTION_PIECES = [PIECE.KNIGHT, PIECE.BISHOP, PIECE.ROOK, PIECE.QUEEN];

export const PIECE_LOOKUP: Record<string, number> = {
  P: PIECE.PAWN,
  N: PIECE.KNIGHT,
  B: PIECE.BISHOP,
  R: PIECE.ROOK,
  Q: PIECE.QUEEN,
  K: PIECE.KING,
};

export const SQUARE_ASCII: Record<number, string> = {
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


/* FEN */

export const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 


/* MAILBOX */

export const MAILBOX64 = new Int8Array([
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
export const MAILBOX120 = new Int8Array([
  EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
  EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
  EDGE,    0,    1,    2,    3,    4,    5,    6,    7, EDGE,
  EDGE,    8,    9,   10,   11,   12,   13,   14,   15, EDGE,
  EDGE,   16,   17,   18,   19,   20,   21,   22,   23, EDGE,
  EDGE,   24,   25,   26,   27,   28,   29,   30,   31, EDGE,
  EDGE,   32,   33,   34,   35,   36,   37,   38,   39, EDGE,
  EDGE,   40,   41,   42,   43,   44,   45,   46,   47, EDGE,
  EDGE,   48,   49,   50,   51,   52,   53,   54,   55, EDGE,
  EDGE,   56,   57,   58,   59,   60,   61,   62,   63, EDGE,
  EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
  EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE, EDGE,
]);


/* DIRECTIONS */

export const DIRECTION = {
  NORTH:     -10,
  SOUTH:      10,
  EAST:       1,
  WEST:      -1,
  NORTHEAST: -9,
  NORTHWEST: -11,
  SOUTHEAST:  11,
  SOUTHWEST:  9,
}


/* MOVE LIST */

export const MOVE_LIST = [
  /* black pawn */  [(DIRECTION.SOUTH), (2*DIRECTION.SOUTH), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)],
  /* white pawn */  [(DIRECTION.NORTH), (2*DIRECTION.NORTH), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST)],
  /*     knight */  [(DIRECTION.NORTH+DIRECTION.NORTHEAST), (DIRECTION.NORTH+DIRECTION.NORTHWEST), (DIRECTION.EAST+DIRECTION.NORTHEAST), (DIRECTION.EAST+DIRECTION.SOUTHEAST), (DIRECTION.SOUTH+DIRECTION.SOUTHEAST), (DIRECTION.SOUTH+DIRECTION.SOUTHWEST), (DIRECTION.WEST+DIRECTION.NORTHWEST), (DIRECTION.WEST+DIRECTION.SOUTHWEST)],
  /*     bishop */  [(DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)],
  /*       rook */  [(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST)],
  /*      queen */  [(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)],
  /*       king */  [(DIRECTION.NORTH), (DIRECTION.SOUTH), (DIRECTION.EAST), (DIRECTION.WEST), (DIRECTION.NORTHEAST), (DIRECTION.NORTHWEST), (DIRECTION.SOUTHEAST), (DIRECTION.SOUTHWEST)],
];

export const SLIDERS = [
  /* black pawn */ false,
  /* white pawn */ false,
  /*     knight */ false,
  /*     bishop */ true,
  /*       rook */ true,
  /*      queen */ true,
  /*       king */ false,
];

export const CASTLE_INDEXES = {
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

export const ENCODED_MOVE = {
  EMPTY:                  0b0000_0000_0000_0000_0000_0000_0000_0000,
  FROM_INDEX:             0b0000_0000_0000_0000_0000_0000_1111_1111,  // << 0
  TO_INDEX:               0b0000_0000_0000_0000_1111_1111_0000_0000,  // << 8
  PIECE_CAPTURE:          0b0000_0000_0011_1111_0000_0000_0000_0000,  // << 16
  PIECE_FROM_HAS_MOVED:   0b0000_0000_1000_0000_0000_0000_0000_0000,  // << 23
  PUTS_KING_IN_CHECK:     0b0000_0001_0000_0000_0000_0000_0000_0000,  // << 24
  PROMOTION_TO:           0b0000_1110_0000_0000_0000_0000_0000_0000,  // << 25
  EN_PASSANT_MOVE:        0b0001_0000_0000_0000_0000_0000_0000_0000,  // << 28
  DOUBLE_PUSH_MOVE:       0b0010_0000_0000_0000_0000_0000_0000_0000,  // << 29
  KINGSIDE_CASTLE_MOVE:   0b0100_0000_0000_0000_0000_0000_0000_0000,  // << 30
  QUEENSIDE_CASTLE_MOVE:  0b1000_0000_0000_0000_0000_0000_0000_0000,  // << 31
}


/* BOARD STATE */

export const TURN = {
  WHITE: PIECE.IS_WHITE,
  BLACK: PIECE.IS_BLACK,
};

export const BOARD_STATES = {
  EMPTY:                    0b0000_0000_0000_0000_0000_0000_0000_0000,
  HALFMOVE_CLOCK:           0b0000_0000_0000_0000_0000_0000_0111_1111,
  EN_PASSANT_SQUARE:        0b0000_0000_0000_0000_1111_1111_0000_0000,
  CASTLE_RIGHTS:            0b0000_0000_0000_1111_0000_0000_0000_0000,
  WHITE_KINGSIDE_CASTLE:    0b0000_0000_0000_1000_0000_0000_0000_0000,
  WHITE_QUEENSIDE_CASTLE:   0b0000_0000_0000_0100_0000_0000_0000_0000,
  BLACK_KINGSIDE_CASTLE:    0b0000_0000_0000_0010_0000_0000_0000_0000,
  BLACK_QUEENSIDE_CASTLE:   0b0000_0000_0000_0001_0000_0000_0000_0000,
  CURRENT_TURN:             0b0000_0000_0011_0000_0000_0000_0000_0000,
  CURRENT_TURN_WHITE:       0b0000_0000_0001_0000_0000_0000_0000_0000,
  CURRENT_TURN_BLACK:       0b0000_0000_0010_0000_0000_0000_0000_0000,
}


/* PIECE-SQUARE TABLES */

export const PIECE_SQUARE_TABLE = [
  // no piece = 0
  [],

  // pawn = 1
  [
    100,   100,   100,   100,   100,   100,   100,   100, 
    150,   150,   150,   150,   150,   150,   150,   150, 
    110,   110,   120,   130,   130,   120,   110,   110, 
    105,   105,   110,   125,   125,   110,   105,   105, 
    100,   100,   100,   120,   120,   100,   100,   100,
    105,    95,    90,   100,   100,    90,    95,   105, 
    105,   110,   110,    80,    80,   110,   110,   105, 
    100,   100,   100,   100,   100,   100,   100,   100,
  ],

  // knight = 2
  [
    270,   280,   290,   290,   290,   290,   280,   270, 
    280,   300,   320,   320,   320,   320,   300,   280, 
    290,   320,   330,   335,   335,   330,   320,   290,
    290,   325,   335,   340,   340,   335,   325,   290, 
    290,   320,   335,   340,   340,   335,   320,   290, 
    290,   325,   330,   335,   335,   330,   325,   290, 
    280,   300,   320,   325,   325,   320,   300,   280, 
    270,   280,   290,   290,   290,   290,   280,   270,
  ],

  // bishop = 3
  [
    310,   320,   320,   320,   320,   320,   320,   310, 
    320,   330,   330,   330,   330,   330,   330,   320, 
    320,   330,   335,   340,   340,   335,   330,   320, 
    320,   335,   335,   340,   340,   335,   335,   320, 
    320,   330,   340,   340,   340,   340,   330,   320, 
    320,   340,   340,   340,   340,   340,   340,   320,
    320,   335,   330,   330,   330,   330,   335,   320, 
    310,   320,   320,   320,   320,   320,   320,   310,
  ],

  // rook = 4
  [
    830,   830,   830,   830,   830,   830,   830,   830, 
    835,   840,   840,   840,   840,   840,   840,   835, 
    825,   830,   830,   830,   830,   830,   830,   825, 
    825,   830,   830,   830,   830,   830,   830,   825, 
    825,   830,   830,   830,   830,   830,   830,   825, 
    825,   830,   830,   830,   830,   830,   830,   825, 
    825,   830,   830,   830,   830,   830,   830,   825, 
    830,   830,   830,   835,   835,   830,   830,   830,
  ],

  // queen = 5
  [
    880,   890,   890,   895,   895,   890,   890,   880, 
    890,   900,   900,   900,   900,   900,   900,   890, 
    890,   900,   905,   905,   905,   905,   900,   890, 
    895,   900,   905,   905,   905,   905,   900,   895, 
    900,   900,   905,   905,   905,   905,   900,   895, 
    890,   905,   905,   905,   905,   905,   900,   890, 
    890,   900,   905,   900,   900,   900,   900,   890, 
    880,   890,   890,   895,   895,   890,   890,   880,
  ],

  // king = 6
  [
    19970, 19960, 19960, 19950, 19950, 19960, 19960, 19970, 
    19970, 19960, 19960, 19950, 19950, 19960, 19960, 19970,
    19970, 19960, 19960, 19950, 19950, 19960, 19960, 19970,
    19970, 19960, 19960, 19950, 19950, 19960, 19960, 19970, 
    19980, 19970, 19970, 19960, 19960, 19970, 19970, 19980, 
    19990, 19980, 19980, 19980, 19980, 19980, 19980, 19990,
    20020, 20020, 20000, 20000, 20000, 20000, 20020, 20020, 
    20020, 20030, 20010, 20000, 20000, 20010, 20030, 20020,
  ],
];

// index to swap piece-square table from white to black
export const FLIP = [
  56, 57, 58, 59, 60, 61, 62, 63,
  48, 49, 50, 51, 52, 53, 54, 55,
  40, 41, 42, 43, 44, 45, 46, 47,
  32, 33, 34, 35, 36, 37, 38, 39,
  24, 25, 26, 27, 28, 29, 30, 31,
  16, 17, 18, 19, 20, 21, 22, 23,
   8,  9, 10, 11, 12, 13, 14, 15,
   0,  1,  2,  3,  4,  5,  6,  7,
];