[**tonnetto**](../README.md) • **Docs**

***

[tonnetto](../globals.md) / ChessBoard

# Class: ChessBoard

## Constructors

### new ChessBoard()

> **new ChessBoard**(`fen`): [`ChessBoard`](ChessBoard.md)

#### Parameters

• **fen**: `string` = `DEFAULT_FEN`

#### Returns

[`ChessBoard`](ChessBoard.md)

#### Defined in

[chessboard.ts:8](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L8)

## Properties

### board

> **board**: `Uint8Array`

#### Defined in

[chessboard.ts:4](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L4)

***

### ply

> **ply**: `number` = `0`

#### Defined in

[chessboard.ts:6](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L6)

***

### state

> **state**: `Uint32Array`

#### Defined in

[chessboard.ts:5](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L5)

## Methods

### getFen()

> **getFen**(): `string`

#### Returns

`string`

#### Defined in

[chessboard.ts:70](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L70)

***

### parseFen()

> **parseFen**(`fen`): `void`

#### Parameters

• **fen**: `string`

#### Returns

`void`

#### Defined in

[chessboard.ts:12](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L12)

***

### printBoard()

> **printBoard**(): `void`

#### Returns

`void`

#### Defined in

[chessboard.ts:137](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L137)

***

### algebraicToIndex()

> `static` **algebraicToIndex**(`notation`): `number`

#### Parameters

• **notation**: `string`

#### Returns

`number`

#### Defined in

[chessboard.ts:123](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L123)

***

### indexToAlgebraic()

> `static` **indexToAlgebraic**(`index`): `string`

#### Parameters

• **index**: `number`

#### Returns

`string`

#### Defined in

[chessboard.ts:130](https://github.com/marcobuontempo/tonnetto-chess-ts/blob/5b48e10891a709c6d987943c0a8c2c76a5b582f9/src/chessboard.ts#L130)
