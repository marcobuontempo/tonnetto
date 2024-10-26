import Board from "./board";

export default class Engine {
  private board: Board;

  constructor(fen?: string) {
    this.board = new Board(fen);
    this.board.printBoard();
    return;
  }

  
}