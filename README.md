# tonnetto-chess

IMPLEMENTED
- typescript chess - tonnetto, inspired by stockfish
- perft valid as per https://www.chessprogramming.org/Perft_Results
- typed arrays for faster-operation
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
- check isEndGame in negamax search
- reduce branching factor with better and faster pruning
- refactor code to improve performance (generate moves, is move legal, evaluate position, search)
- prettify/eslint
- specify types for all method returns
- add comments and annotations where necessary, JSDoc
