[**tonnetto**](../README.md) • **Docs**

***

[tonnetto](../globals.md) / Engine

# Class: Engine

## Constructors

### new Engine()

> **new Engine**(`fen`?): [`Engine`](Engine.md)

#### Parameters

• **fen?**: `string`

#### Returns

[`Engine`](Engine.md)

#### Defined in

[engine.ts:14](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L14)

## Properties

### chessboard

> **chessboard**: [`ChessBoard`](ChessBoard.md)

#### Defined in

[engine.ts:5](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L5)

***

### kingPositions

> **kingPositions**: `Uint8Array`

#### Defined in

[engine.ts:7](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L7)

***

### moveHistory

> **moveHistory**: `Uint32Array`

#### Defined in

[engine.ts:6](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L6)

## Methods

### decodeMoveData()

> **decodeMoveData**(`move`): `string`

#### Parameters

• **move**: `number`

#### Returns

`string`

#### Defined in

[engine.ts:184](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L184)

***

### evaluate()

> **evaluate**(`turnColour`): `number`

#### Parameters

• **turnColour**: `number`

#### Returns

`number`

#### Defined in

[engine.ts:682](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L682)

***

### generateLegalMoves()

> **generateLegalMoves**(`turnColour`): `Uint32Array`

#### Parameters

• **turnColour**: `number`

#### Returns

`Uint32Array`

#### Defined in

[engine.ts:429](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L429)

***

### generatePseudoMoves()

> **generatePseudoMoves**(`turnColour`): `Uint32Array`

#### Parameters

• **turnColour**: `number`

#### Returns

`Uint32Array`

#### Defined in

[engine.ts:218](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L218)

***

### initMvvLvaTables()

> **initMvvLvaTables**(): `void`

#### Returns

`void`

#### Defined in

[engine.ts:34](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L34)

***

### initPestoTables()

> **initPestoTables**(): `void`

#### Returns

`void`

#### Defined in

[engine.ts:21](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L21)

***

### kingIsInCheck()

> **kingIsInCheck**(`kingColour`): `boolean`

#### Parameters

• **kingColour**: `number`

#### Returns

`boolean`

#### Defined in

[engine.ts:58](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L58)

***

### makeMove()

> **makeMove**(`move`): `void`

#### Parameters

• **move**: `number`

#### Returns

`void`

#### Defined in

[engine.ts:447](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L447)

***

### moveIsLegal()

> **moveIsLegal**(`move`, `turnColour`): `boolean`

#### Parameters

• **move**: `number`

• **turnColour**: `number`

#### Returns

`boolean`

#### Defined in

[engine.ts:140](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L140)

***

### mvvLvaScore()

> **mvvLvaScore**(`move`): `number`

#### Parameters

• **move**: `number`

#### Returns

`number`

#### Defined in

[engine.ts:212](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L212)

***

### negamax()

> **negamax**(`depth`, `turnColour`, `alpha`, `beta`): `object`

#### Parameters

• **depth**: `number`

• **turnColour**: `number`

• **alpha**: `number` = `-Infinity`

• **beta**: `number` = `Infinity`

#### Returns

`object`

##### bestMove

> **bestMove**: `null` \| `number`

##### score

> **score**: `number` = `maxScore`

#### Defined in

[engine.ts:765](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L765)

***

### perft()

> **perft**(`depth`, `outputIndividual`, `firstMove`): `number`

#### Parameters

• **depth**: `number`

• **outputIndividual**: `boolean` = `false`

• **firstMove**: `boolean` = `true`

#### Returns

`number`

#### Defined in

[engine.ts:814](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L814)

***

### quiescenceSearch()

> **quiescenceSearch**(`turnColour`, `alpha`, `beta`): `object`

#### Parameters

• **turnColour**: `number`

• **alpha**: `number` = `-Infinity`

• **beta**: `number` = `Infinity`

#### Returns

`object`

##### bestMove

> **bestMove**: `null` = `null`

##### score

> **score**: `number` = `beta`

#### Defined in

[engine.ts:724](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L724)

***

### unmakeMove()

> **unmakeMove**(`move`): `void`

#### Parameters

• **move**: `number`

#### Returns

`void`

#### Defined in

[engine.ts:600](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L600)

***

### updateKingPositionCache()

> **updateKingPositionCache**(): `void`

#### Returns

`void`

#### Defined in

[engine.ts:44](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L44)

***

### algebraicMoveToIndexes()

> `static` **algebraicMoveToIndexes**(`move`): `number`[]

#### Parameters

• **move**: `string`

#### Returns

`number`[]

#### Defined in

[engine.ts:206](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L206)

***

### encodedMoveToAlgebraic()

> `static` **encodedMoveToAlgebraic**(`move`): `string`

#### Parameters

• **move**: `number`

#### Returns

`string`

#### Defined in

[engine.ts:200](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/engine.ts#L200)
