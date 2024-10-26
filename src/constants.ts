/* SQUARE REPRESENTATION */

export const EMPTY = 0b0000_0000;       // = 0
export const EDGE = 0b1000_0000;        // = 128

export const PAWN = 0b0000_0001;        // = 1
export const KNIGHT = 0b0000_0010;      // = 2
export const BISHOP = 0b0000_0011;      // = 3
export const ROOK = 0b0000_0100;        // = 4
export const QUEEN = 0b0000_0101;       // = 5
export const KING = 0b0000_0110;        // = 6

export const HAS_MOVED = 0b0000_1000;   // = 8

export const WHITE = 0b0001_0000;       // = 16
export const BLACK = 0b0010_0000;       // = 32
 

/* PIECES - OTHER */

export const PIECE_MASK = 0b0000_0111;
export const COLOUR_MASK = 0b0011_0000;

export const PIECE_LOOKUP: Record<string, number> = {
  P: PAWN,
  N: KNIGHT,
  B: BISHOP,
  R: ROOK,
  Q: QUEEN,
  K: KING,
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

export const NORTH = -10;
export const SOUTH = 10;
export const EAST = 1;
export const WEST = -1;
export const NORTHEAST = -9;
export const NORTHWEST = -11;
export const SOUTHEAST = 11;
export const SOUTHWEST = 9;


/* MOVE LIST */

export const MOVE_LIST = [
  /* black pawn */  [(SOUTH), (2*SOUTH), (SOUTHEAST), (SOUTHWEST)],
  /* white pawn */  [(NORTH), (2*NORTH), (NORTHEAST), (NORTHWEST)],
  /*     knight */  [(NORTH+NORTHEAST), (NORTH+NORTHWEST), (EAST+NORTHEAST), (EAST+SOUTHEAST), (SOUTH+SOUTHEAST), (SOUTH+SOUTHWEST), (WEST+NORTHWEST), (WEST+SOUTHWEST)],
  /*     bishop */  [(NORTHEAST), (NORTHWEST), (SOUTHEAST), (SOUTHWEST)],
  /*       rook */  [(NORTH), (SOUTH), (EAST), (WEST)],
  /*      queen */  [(NORTH), (SOUTH), (EAST), (WEST), (NORTHEAST), (NORTHWEST), (SOUTHEAST), (SOUTHWEST)],
  /*       king */  [(NORTH), (SOUTH), (EAST), (WEST), (NORTHEAST), (NORTHWEST), (SOUTHEAST), (SOUTHWEST)],
]

export const SLIDERS = [
  /* black pawn */ false,
  /* white pawn */ false,
  /*     knight */ false,
  /*     bishop */ true,
  /*       rook */ true,
  /*      queen */ true,
  /*       king */ false,
];


/* MOVE ENCODING */

const FROM_INDEX_MASK =             0b0000_0000_0000_0000_0000_0000_1111_1111;  // << 0
const TO_INDEX_MASK =               0b0000_0000_0000_0000_1111_1111_0000_0000;  // << 8
const PIECE_CAPTURE_MASK =          0b0000_0000_0011_1111_0000_0000_0000_0000;  // << 16
const PIECE_FROM_HAS_MOVED_MASK =   0b0000_0001_0000_0000_0000_0000_0000_0000;  // << 24
const PROMOTION_TO_MASK =           0b0000_1110_0000_0000_0000_0000_0000_0000;  // << 25
const ENPASSANT_MASK =              0b0001_0000_0000_0000_0000_0000_0000_0000;  // << 28
const DOUBLE_PUSH_MASK =            0b0010_0000_0000_0000_0000_0000_0000_0000;  // << 29
const KINGSIDE_CASTLE_MASK =        0b0100_0000_0000_0000_0000_0000_0000_0000;  // << 30
const QUEENSIDE_CASTLE_MASK =       0b1000_0000_0000_0000_0000_0000_0000_0000;  // << 31