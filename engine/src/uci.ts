import ChessEngineAPI from "./api";
import process from 'process'
import { DEFAULT_FEN } from "./constants";

export default class UCIInterface {
  private static readonly NAME = 'Tonnetto';
  private static readonly AUTHOR = 'Marco Buontempo';
  private engine;

  constructor(engine: ChessEngineAPI) {
    this.engine = engine;
  }

  startListening() {
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (data) => {
      const commands = data.toString().split('\n'); // split the input into lines
      commands.forEach((command: string) => {
          command = command.trim(); // remove any extra whitespace
          if (command) { // ignore empty lines
            this.processCommand(command);
          }
      });
    });
  }

  processCommand(command: string) {
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
      default:
        break;
        
    }
  }

  uci() {
    console.log(`id name ${UCIInterface.NAME}`);
    console.log(`id author ${UCIInterface.AUTHOR}`);
    console.log('uciok');
  }
  
  debug(args: Array<string>) {
    console.log('debug not supported');
    return args[0];
  }

  isready() {
    console.log('readyok');
  }

  position(args: Array<string>) {
    let fen;
    let moves;

    if (args[1] === 'fen') {
      fen = args[2];
      moves = args.slice(3);
    } else if (args[1] === 'startpos') {
      fen = DEFAULT_FEN;
      moves = args.slice(2);
    } else {
      return false;
    }

    this.engine.setFen(fen);

    if (moves) {
      for (let move of moves) {
        this.engine.applyMove(move);
      }
    }
  }

  go(args: Array<string>) {
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
    process.exit();
  }
}