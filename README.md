# tonnetto-chess

IMPLEMENTED
- typescript chess - tonnetto, inspired by stockfish
- perft valid as per https://www.chessprogramming.org/Perft_Results
- typed arrays for faster-operation. no bitboards due to caveats in js number type (32-bit is precise, 64-bit may lose precision with bitwise operations, BigInt cannot do all bitwise operations [?])
- encoding using bits for pieces, moves, board state
- negamax search
- alpha-beta pruning for search optimisation
- evaluation using PeSTO's method https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function


TODO Features:
- UCI compliance
- run as standalone engine in command-line, browser, or frontend
- frontend GUI, connect to engine
- quiescence search (to stabilise position's and search)
- MVV-LVA sorting
- Null move pruning
- opening book and/or endgame tablebases


TODO tasks:
- evaluation: if 50 move, eval = 0. and others, e.g. stalemate?
- check isGameEnded in negamax search
- reduce branching factor with better and faster pruning
- refactor code to improve performance (generate moves, is move legal, evaluate position, search, hardcode constants)
- prettify/eslint
- specify types for all method returns
- add comments and annotations where necessary, JSDoc



PIECE SETS:
- Open Chess Font: Colin M.L. Burnett (https://github.com/joshwalters/open-chess-font)