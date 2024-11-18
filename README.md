# Tonnetto Chess Engine

Tonnetto is a lightweight and small JavaScript-based chess engine, designed to be a more compact alternative to heavyweight engines like Stockfish. Inspired by the name Stockfish, which translates to "cod" in Norwegian, Tonnetto is named after "little tuna" — a playful and fitting tribute to the original engine.

Unlike many current JavaScript chess engines that are written in WebAssembly (WASM) and optimised for higher-performance server-side usage, Tonnetto focuses on being more lightweight and runs natively in the browser, making it an excellent choice for web applications that require minimal footprint. It also aims to be more performant than "tiny" JS chess engines at the cost of a slightly larger bundle size.

In saying this, Tonnetto is just a hobbyist project and so may not fulfill your requirements better than other alternatives.

## Features
- **Small Bundle Size:** Unlike alternatives such as [stockfish.js](https://github.com/nmrugg/stockfish.js/) which can be around 6MB-66MB in bundle size (depending if lite-mode or full-performance), Tonnetto's JavaScript implementation is significantly smaller, at only ~20kB.
- **Perft Valid:** The engine is perft (performance test) valid, in accordance with the chess programming community's standard [Perft Results](https://www.chessprogramming.org/Perft_Results).
- **Typed Arrays for Speed:** Tonnetto leverages JavaScript's [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays) for faster operations, avoiding the performance-limitations of standard arrays for a chess engine. This results in a more efficient implementation for piece movement and board state calculations.
- **Encoding:** The board state, moves, and pieces are encoded directly into the typed array's integer's bits using a custom design. This concept is [described here](https://www.chessprogramming.org/Encoding_Moves), and is helpful in the performance demanded by a chess engine.
- **10x12 Mailbox Representation:** The engine is board-centric (not piece-centric), with the board position being represented in a [10x12 mailbox](https://www.chessprogramming.org/Mailbox), which improves the speed of position generation.
- **Negamax Search Algorithm:** Tonnetto uses the [negamax algorithm](https://www.chessprogramming.org/Negamax), an implementation of the minmax search algorithm.
- **Alpha-Beta Pruning:** Optimises search performance by eliminating branches that do not need to be evaluated, speeding up decision-making. The framework is [described here](https://www.chessprogramming.org/Alpha-Beta).
- **PeSTO Evaluation:** Tonnetto uses [PeSTO evaluation](https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function), a well-established heuristic function that significantly improves positional play and the engine’s understanding of the game.
- **MVV-LVA Sorting:** The engine employs [MVV-LVA](https://www.chessprogramming.org/MVV-LVA) (Most Valuable Victim, Least Valuable Attacker) move sorting to prioritise more impactful moves, reducing search time by pruning branches quicker.
- **Quiescence Search:** Prevents evaluation blunders by searching deeper when the position is unstable, ensuring more accurate evaluations in complex positions. It avoids the "horizon effect", as [described here](https://www.chessprogramming.org/Quiescence_Search).
- **Native Browser Support:** Runs directly in the browser without requiring a server or WebAssembly, making it easy to integrate into web-based chess applications.
- **Wide-Support:** By using native typed arrays, as mentioned earlier, there is much better compatability with older browsers. This comes at the cost of not using [bitboards](https://www.chessprogramming.org/Bitboards), which may provide faster move generation. However, bitboards would require 64-bit integers, which are not natively supported in JavaScript until [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt), which has slightly less compatability. BigInt also had potential limitations with bitwise operations, although I'm not sure that is correct as I didn't go down this route anyway.
- **TypeScript Source:** The source code is written in TypeScript, allowing for better type-safety, maintainability, and bug-prevention. Once transpiled into JavaScript, it runs completely native to the browser environment.
- **UCI Compatibility:** Tonnetto can also run directly in the terminal (with Node.js installed), and supports the [UCI protocol](https://en.wikipedia.org/wiki/Universal_Chess_Interface#:~:text=The%20Universal%20Chess%20Interface%20(UCI,to%20communicate%20with%20user%20interfaces.), allowing it to be used with third-party GUI applications that support UCI engines.
- **GUI Demo:** A simple graphical user interface is provided for demo purposes. You can test Tonnetto live at [chess.marcobuontempo.com](https://chess.marcobuontempo.com).
- **Piece Sets:** The GUI demo uses the following piece sets:
  - Open Chess Font: Created by Colin M.L. Burnett [GPLv2+](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
  - Horsey: Designed by cham and michael1241 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## FUTURE TODO:
  - [] Performance Improvements: Work on optimizing search speed, including adding features like null move pruning and other advanced pruning techniques.
  - [] Code Refactoring: Refactor code to improve performance in key areas, such as generate moves, is move legal, evaluate position, search, and hardcode constants.
  - [] Prettify/ESLint: Clean up the code style and enforce consistent formatting with ESLint.
  - [] TypeScript Typing: Fully specify return types for all methods to ensure strong type checking and improve maintainability.
  - [] Add JSDoc: Document code with annotations to make it easier for developers to understand and contribute.
  - [] Evaluate Engine Strength: Measure the engine's strength with respect to depth, time, and approximate Elo rating. Present in a table format.
  - [] Build Process: Create a build process to output Tonnetto as an executable for easier distribution and usage.
  - [] Publish to NPM: Publish Tonnetto as an npm package to make it easier to install and use in web projects.
  - [] GUI Demo Enhancements: Update the demo to reflect the difficulty level as an approximate Elo rating in the slider (instead of showing depth).
  - [] Switch to npm Import in GUI Demo: Refactor the demo to import the engine via npm rather than directly using the bundled JS file.

## Usage

### Live Demo
You can play the bot directly in the browser, using the custom-built GUI at [chess.marcobuontempo.com](https://chess.marcobuontempo.com).

### Importing
  Import using CDN:
  ```js
  import TonnettoEngine from 'https://cdn.jsdelivr.net/npm/tonnetto';
  ```
  OR, if using npm:
  ```bash
  npm install tonnetto
  ```
  ```js
  import TonnettoEngine from 'tonnetto';
  ```

### Browser
1. Use in your website's JavaScript:
    ```js
    // use default start position
    const engine = new TonnettoEngine();
    // OR, use a custom FEN (must be valid, as engine does NOT validate)
    const engine = new TonnettoEngine({ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" });
    ```

1. Refer to docs (TODO) for available methods.

### NodeJs Terminal
1. Start the file where you have imported the program (for example, if you imported into a file called `chess-engine.js`):
    ```bash
    node chess-engine.js
    ```

## License
Tonnetto is open-source and licensed under the [MIT License](LICENSE).

## Contributing
Contributions to Tonnetto are welcome! Please fork the repository, make your changes, and submit a pull request. Preferred contributions are unit tests or bug-fixes, but feature additions or optimisations are also welcome

