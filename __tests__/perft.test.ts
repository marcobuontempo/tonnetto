import Engine from "../src/engine";

describe('Perft Function Tests', () => {
  describe('Default FEN', () => {
    // test('perft depth 0', () => {
    //   const depth = 0;
    //   const expectedMoves = 1;
    //   const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //   expect(engine.perft(depth)).toBe(expectedMoves);
    // });
    // test('perft depth 1', () => {
    //   const depth = 1;
    //   const expectedMoves = 20;
    //   const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //   expect(engine.perft(depth)).toBe(expectedMoves);
    // });
    // test('perft depth 2', () => {
    //   const depth = 2;
    //   const expectedMoves = 400;
    //   const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //   expect(engine.perft(depth)).toBe(expectedMoves);
    // });
    test('perft depth 3', () => {
      const depth = 3;
      const expectedMoves = 8902;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    // test('perft depth 4', () => {
    //   const depth = 4;
    //   const expectedMoves = 197281;
    //   const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //   expect(engine.perft(depth)).toBe(expectedMoves);
    // });
    // test('perft depth 5', () => {
    //   const depth = 5;
    //   const expectedMoves = 4865609;
    //   const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //   expect(engine.perft(depth)).toBe(expectedMoves);
    // });
  });
});