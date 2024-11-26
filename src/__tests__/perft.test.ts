import Engine from "../engine";

describe('Perft Function Tests', () => {
  describe('Default FEN', () => {
    test('perft depth 0', () => {
      const depth = 0;
      const expectedMoves = 1;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 1', () => {
      const depth = 1;
      const expectedMoves = 20;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 2', () => {
      const depth = 2;
      const expectedMoves = 400;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 3', () => {
      const depth = 3;
      const expectedMoves = 8902;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 4', () => {
      const depth = 4;
      const expectedMoves = 197281;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 5', () => {
      const depth = 5;
      const expectedMoves = 4865609;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 6', () => {
      const depth = 6;
      const expectedMoves = 119060324;
      const engine = new Engine("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
  });

  describe('Kiwi Pete', () => {
    test('perft depth 0', () => {
      const depth = 0;
      const expectedMoves = 1;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 1', () => {
      const depth = 1;
      const expectedMoves = 48;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 2', () => {
      const depth = 2;
      const expectedMoves = 2039;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 3', () => {
      const depth = 3;
      const expectedMoves = 97862;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 4', () => {
      const depth = 4;
      const expectedMoves = 4085603;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 5', () => {
      const depth = 5;
      const expectedMoves = 193690690;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 6', () => {
      const depth = 6;
      const expectedMoves = 8031647685;
      const engine = new Engine("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
  });

  describe('Talkchess', () => {
    test('perft depth 0', () => {
      const depth = 0;
      const expectedMoves = 1;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 1', () => {
      const depth = 1;
      const expectedMoves = 44;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 2', () => {
      const depth = 2;
      const expectedMoves = 1486;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 3', () => {
      const depth = 3;
      const expectedMoves = 62379;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 4', () => {
      const depth = 4;
      const expectedMoves = 2103487;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
    test('perft depth 5', () => {
      const depth = 5;
      const expectedMoves = 89941194;
      const engine = new Engine("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
      expect(engine.perft(depth)).toBe(expectedMoves);
    });
  });
});