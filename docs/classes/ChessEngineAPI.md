[**tonnetto**](../README.md) • **Docs**

***

[tonnetto](../globals.md) / ChessEngineAPI

# Class: ChessEngineAPI

ChessEngineAPI

ChessEngineAPI is a wrapper around the chess engine logic.
It provides methods for managing the game state, applying moves, 
checking the game status, and interfacing with the chess engine.

## Constructors

### new ChessEngineAPI()

> **new ChessEngineAPI**(`options`?): [`ChessEngineAPI`](ChessEngineAPI.md)

Creates an instance of ChessEngineAPI.

#### Parameters

• **options?**: `ConstructorOptions` = `{}`

The constructor options.

#### Returns

[`ChessEngineAPI`](ChessEngineAPI.md)

#### Defined in

[api.ts:35](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L35)

## Methods

### applyMove()

> **applyMove**(`move`): `boolean`

Applies a move to the board in algebraic notation (e.g. "e2e4").

#### Parameters

• **move**: `string`

The move in algebraic notation.

#### Returns

`boolean`

True if the move was valid and applied, false otherwise.

#### Defined in

[api.ts:133](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L133)

***

### getBestMove()

> **getBestMove**(`depth`?): `null` \| `string`

Searches and returns the best move for the current position up to a specified depth.

#### Parameters

• **depth?**: `number` = `5`

The depth, in ply, to search for the best move.

#### Returns

`null` \| `string`

The best move in algebraic notation or null if no move is found.

#### Defined in

[api.ts:173](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L173)

***

### getFen()

> **getFen**(): `string`

Gets the current board FEN string.

#### Returns

`string`

The current board state in FEN format.

#### Defined in

[api.ts:58](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L58)

***

### getGameState()

> **getGameState**(): `object`

Retrieves the current game state from the FEN string.

#### Returns

`object`

The current game state containing board, turn, castle, ep, halfmove, and fullmove information.

returns.board - The board state in FEN format.

returns.turn - The turn (either 'w' for white or 'b' for black).

returns.castle - The castling rights as a string.

returns.ep - The en passant target square, if any.

returns.halfmove - The halfmove clock (number of half-moves since the last pawn move or capture).

returns.fullmove - The fullmove number.

##### board

> **board**: `string`

##### castle

> **castle**: `string`

##### ep

> **ep**: `string`

##### fullmove

> **fullmove**: `number`

##### halfmove

> **halfmove**: `number`

##### turn

> **turn**: `string`

#### Defined in

[api.ts:90](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L90)

***

### isGameOver()

> **isGameOver**(): `string`

Checks if the game is over (50-move rule, checkmate, stalemate, or still playing).

#### Returns

`string`

One of '50-move', 'checkmate', 'stalemate', or 'playing'.

#### Defined in

[api.ts:107](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L107)

***

### isKingInCheck()

> **isKingInCheck**(): `boolean`

Checks if the current turn's king is in check.

#### Returns

`boolean`

True if the king is in check, false otherwise.

#### Defined in

[api.ts:74](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L74)

***

### mountToWindow()

> **mountToWindow**(`name`?): `void`

Mounts this instance to the global window namespace, making it accessible in the browser.

#### Parameters

• **name?**: `string` = `'tonnetto'`

The name under which the instance will be available in the global scope.

#### Returns

`void`

#### Defined in

[api.ts:209](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L209)

***

### perft()

> **perft**(`options`): `void`

Performs a perft (performance test) for a given position and depth.

#### Parameters

• **options** = `{}`

The perft options.

• **options.depth?**: `number` = `5`

The depth to search for perft.

• **options.position?**: `string` = `DEFAULT_FEN`

The FEN string representing the position to test.

#### Returns

`void`

#### Defined in

[api.ts:199](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L199)

***

### print()

> **print**(): `void`

Prints the current board to the console using ASCII characters.

#### Returns

`void`

#### Defined in

[api.ts:218](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L218)

***

### resetBoard()

> **resetBoard**(): `void`

Resets the board to the last provided FEN string. (i.e. the initial FEN when instantiated, or the last call to setFen())

#### Returns

`void`

#### Defined in

[api.ts:65](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L65)

***

### setFen()

> **setFen**(`fen`): `void`

Sets the board state according to a new FEN input and resets the engine state.

#### Parameters

• **fen**: `string`

The new FEN string to set the board state.

#### Returns

`void`

#### Defined in

[api.ts:48](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L48)

***

### undoMove()

> **undoMove**(): `boolean`

Undoes the last move made.

#### Returns

`boolean`

True if a move was undone, false if no moves are left to undo.

#### Defined in

[api.ts:160](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/api.ts#L160)
