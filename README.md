# tonnetto-chess

IMPLEMENTED
- typescript chess - tonnetto, inspired by stockfish
- stockfishjs is WASM and considerably larger in size. ts engine allows for good performance at much smaller package size. also native to browser enviornment
- perft valid as per https://www.chessprogramming.org/Perft_Results
- typed arrays for faster-operation. no bitboards due to caveats in js number type (32-bit is precise, 64-bit may lose precision with bitwise operations, BigInt cannot do all bitwise operations [?])
- encoding using bits for pieces, moves, board state
- negamax search
- alpha-beta pruning for search optimisation
- evaluation using PeSTO's method https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function (significantly improved positional play)
- MVV-LVA sorting (faster pruning)
- quiescence search (to stabilise position's and search. significant improvement in preventing blunders)


TODO (ENGINE):
- improve faster and search speed (Null move pruning, ...)
- refactor code to improve performance (generate moves, is move legal, evaluate position, search, hardcode constants)
- prettify/eslint
- specify types for all method returns
- add comments and annotations where necessary, JSDoc
- evaluate ELO (depth | time | ~elo)
- Complete UCI operability
- Create build process to output as executable


TODO (GUI):
- mobile responsive
- change difficulty (1 is more than novice. show slider in terms of approx. elo)
- import using npm script tag


PIECE SETS:
- Open Chess Font: Colin M.L. Burnett (GPLv2+)
- Horsey: cham, michael1241 (CC BY-NC-SA 4.0)