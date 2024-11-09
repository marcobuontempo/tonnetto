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
- UCI operability (mostly completed)
- quiescence search (to stabilise position's and search)
- MVV-LVA sorting
- Null move pruning
- opening book and/or endgame tablebases
- run as standalone engine in command-line, browser, or frontend


TODO Engine:
- evaluation: if 50 move, eval = 0. and others, e.g. stalemate?
- check isGameEnded in negamax search [?]
- perft is decently fast. need to improve best move search
- reduce branching factor with better and faster pruning
- refactor code to improve performance (generate moves, is move legal, evaluate position, search, hardcode constants)
- prettify/eslint
- specify types for all method returns
- add comments and annotations where necessary, JSDoc


TODO GUI:
- highlight king in check
- highlight last move
- import using npm script tag


PIECE SETS:
- Open Chess Font: Colin M.L. Burnett (GPLv2+)
- Horsey: cham, michael1241 (CC BY-NC-SA 4.0)