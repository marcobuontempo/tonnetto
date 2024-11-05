import Engine from "./engine";

export default class UCIInterface {
  private engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  startListening() {
    // listen to cli
  }

  processCommand(command: string) {
    switch (command) {
      // match commands with relevant methods
    }
  }

  uci() {
    // tell engine to use the uci (universal chess interface),
    // this will be sent once as a first command after program boot
    // to tell the engine to switch to uci mode.
    // After receiving the uci command the engine must identify itself with the "id" command
    // and send the "option" commands to tell the GUI which engine settings the engine supports if any.
    // After that the engine should send "uciok" to acknowledge the uci mode.
    // If no uciok is sent within a certain time period, the engine task will be killed by the GUI.
  }

  debug() {
    // switch the debug mode of the engine on and off.
    // In debug mode the engine should send additional infos to the GUI, e.g. with the "info string" command,
    // to help debugging, e.g. the commands that the engine has received etc.
    // This mode should be switched off by default and this command can be sent
    // any time, also when the engine is thinking.
  }

  isready() {
    // this is used to synchronize the engine with the GUI. When the GUI has sent a command or
    // multiple commands that can take some time to complete,
    // this command can be used to wait for the engine to be ready again or
    // to ping the engine to find out if it is still alive.
    // E.g. this should be sent after setting the path to the tablebases as this can take some time.
    // This command is also required once before the engine is asked to do any search
    // to wait for the engine to finish initializing.
    // This command must always be answered with "readyok" and can be sent also when the engine is calculating
    // in which case the engine should also immediately answer with "readyok" without stopping the search.
  }

  position(...args: Array<string>) {
    // set up the position described in fenstring on the internal board and
    // play the moves on the internal chess board.
    // if the game was played  from the start position the string "startpos" will be sent
    // Note: no "new" command is needed. However, if this position is from a different game than
    // the last position sent to the engine, the GUI should have sent a "ucinewgame" inbetween.
  }

  go() {
    // start calculating on the current position set up with the "position" command.
    // There are a number of commands that can follow this command, all will be sent in the same string.
    // If one command is not sent its value should be interpreted as it would not influence the search.
    // * searchmoves <move1> .... <movei>
    //   restrict search to this moves only
    //   Example: After "position startpos" and "go infinite searchmoves e2e4 d2d4"
    //   the engine should only search the two moves e2e4 and d2d4 in the initial position.
    // * ponder
    //   start searching in pondering mode.
    //   Do not exit the search in ponder mode, even if it's mate!
    //   This means that the last move sent in in the position string is the ponder move.
    //   The engine can do what it wants to do, but after a "ponderhit" command
    //   it should execute the suggested move to ponder on. This means that the ponder move sent by
    //   the GUI can be interpreted as a recommendation about which move to ponder. However, if the
    //   engine decides to ponder on a different move, it should not display any mainlines as they are
    //   likely to be misinterpreted by the GUI because the GUI expects the engine to ponder
    //    on the suggested move.
    // * wtime <x>
    //   white has x msec left on the clock
    // * btime <x>
    //   black has x msec left on the clock
    // * winc <x>
    //   white increment per move in mseconds if x > 0
    // * binc <x>
    //   black increment per move in mseconds if x > 0
    // * movestogo <x>
    //     there are x moves to the next time control,
    //   this will only be sent if x > 0,
    //   if you don't get this and get the wtime and btime it's sudden death
    // * depth <x>
    //   search x plies only.
    // * nodes <x>
    //    search x nodes only,
    // * mate <x>
    //   search for a mate in x moves
    // * movetime <x>
    //   search exactly x mseconds
    // * infinite
    //   search until the "stop" command. Do not exit the search without being told so in this mode!
  }

  stop() {
    // stop calculating as soon as possible,
	  // don't forget the "bestmove" and possibly the "ponder" token when finishing the search
  }

  quit() {
    // quit the program as soon as possible
  }
}