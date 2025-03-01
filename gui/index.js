import TonnettoEngine from 'https://cdn.jsdelivr.net/npm/tonnetto';

const chessWorker = new Worker('chessWorker.js', { type: 'module' });
const gameElement = document.getElementById('game');
const settingsElement = document.getElementById('settings');
const endOverlayElement = document.getElementById('end-overlay');
const endTextElement = document.getElementById('endgame-text');
const thinkingElement = document.getElementById('thinking');
const thinkingText = document.getElementById('thinking-text');
const thinkingAnimationElements = document.querySelectorAll('.thinking-animation');

const state = {
  gameState: 'playing',                                               // the current game state (playing | 50-move | stalemate | checkmate) 
  selectedSquare: null,                                               // selected square <div> from onclick handler
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',    // FEN string
  playerColour: 'w',                                                  // the colour the player will use: 'w' or 'b'
  difficulty: 3,                                                      // the difficulty of the AI (i.e scales the depth): 1-5 (but not necessarily depth 1-5)
  pieceSet: 'open-chess-font',                                        // the piece set to use
  boardTheme: 'dark',                                                 // the board theme to use
  lastMovedFrom: null,                                                // the original square of the last moved piece
  lastMovedTo: null,                                                  // the destination square of the last moved piece
}

settingsElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const settingsForm = new FormData(e.target);
  const { playerColour, difficulty, fen, pieceSet, boardTheme } = Object.fromEntries(settingsForm.entries());

  if (playerColour) state.playerColour = playerColour;
  if (difficulty) state.difficulty = difficulty;
  if (fen) state.fen = fen;
  if (pieceSet) state.pieceSet = pieceSet;
  if (boardTheme) state.boardTheme = boardTheme;

  // Start game
  settingsElement.style.display = 'none';
  gameElement.style.display = 'block';
  render();

  if (state.playerColour !== getTurn()) makeComputerMove();
})

const difficultyScale = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
}

const getTurn = () => {
  return state.fen.split(' ')[1];
}

const transformFenToPositionArray = () => {
  const rows = state.fen.split(' ')[0].split('/');

  // map over each row to replace numbers with the corresponding number of '0's (empty squares)
  const boardArray = rows.map(row => {
    return row.replace(/\d/g, (match) => '0'.repeat(parseInt(match, 10)));
  });

  return boardArray.reverse();
};

const renderBoard = () => {
  const board = document.getElementById('chessboard');
  board.innerHTML = '';
  const position = transformFenToPositionArray();
  const currentTurn = getTurn();
  let kingSquare;
  
  if (state.playerColour === 'b') board.classList.add('flip');  // flip board to perspective of player colour

  if (state.playerColour === currentTurn) {
    // only highlight square if player's current turn
    board.classList.add('current-turn');
  } else {
    board.classList.remove('current-turn');
  }
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // chess files (columns)
  for (let row = 8; row > 0; row--) { // rows 8 to 1
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('chess-square');

      // determine the color of the square based on row and column
      if ((row + col) % 2 === 0) {
        square.classList.add('white-square');
      } else {
        square.classList.add('black-square');
      }
      square.classList.add(state.boardTheme);

      // set the coordinate as a data attribute (e.g., "a8", "b7")
      const coordinate = `${files[col]}${row}`;
      square.setAttribute('data-coordinate', coordinate);

      let pieceChar = position[row-1][col];
      
      if (pieceChar !== '0') {
        // if it's a piece, add the image of the piece
        const piece = document.createElement('img');
        const pieceColour = pieceChar.toLowerCase() === pieceChar ? 'b' : 'w';
        piece.classList.add('chess-piece');
        if (state.playerColour === 'b') piece.classList.add('flip');
        piece.src = `./chess-pieces/${state.pieceSet}/${pieceColour}${pieceChar.toUpperCase()}.svg`;
        piece.setAttribute('data-piece-colour', pieceColour);
        piece.setAttribute('data-piece-type', pieceChar);
        square.appendChild(piece);
      }

      if ((currentTurn === 'w' && pieceChar === 'K') || (currentTurn === 'b' && pieceChar === 'k')) {
        kingSquare = square;
      }

      // Highlight last moves
      if (coordinate === state.lastMovedFrom || coordinate === state.lastMovedTo) square.classList.add('last-moved');

      board.appendChild(square);
      // add click event listener for selecting a piece
      square.addEventListener('click', () => {
        handleSquareClick(square);
      });
    }
  }

  // Highlight if king is in check
  const engine = new TonnettoEngine({ fen: state.fen });
  if (engine.isKingInCheck()) kingSquare.classList.add('in-check');
};

const renderOverlay = () => {
  switch (state.gameState) {
    case 'checkmate':
      const winner = getTurn() === 'w' ? 'BLACK': 'WHITE';
      endTextElement.innerHTML =  `${winner} WINS (checkmate)`;
      endOverlayElement.style.display = 'flex';
      thinkingElement.style.display = 'none';
      break;
    case 'stalemate':
      endTextElement.innerHTML = 'DRAW (stalemate)';
      endOverlayElement.style.display = 'flex';
      thinkingElement.style.display = 'none';
      break;
    case '50-move':
      endTextElement.innerHTML = 'DRAW (50-move rule)';
      endOverlayElement.style.display = 'flex';
      thinkingElement.style.display = 'none';
      break;
    case 'playing':
    default:
      endOverlayElement.style.display = 'none';
  }
}

const render = () => {
  renderBoard();
  renderOverlay();
}

const handleSquareClick = async (square) => {
  if (getTurn() !== state.playerColour) return; // only allow moves if player's current turn

  const existingCoordinate = state.selectedSquare?.getAttribute('data-coordinate');
  const clickedCoordinate = square.getAttribute('data-coordinate');
  const piece = square.querySelector('.chess-piece');
  
  if (!state.selectedSquare && piece) {
    toggleSquareHighlight(square);
    state.selectedSquare = square;
  } else if (state.selectedSquare) {
    let move = `${existingCoordinate}${clickedCoordinate}`;
    const movedPieceType = state.selectedSquare.children[0].getAttribute('data-piece-type');
    const fileFrom = existingCoordinate[0];
    const fileTo = clickedCoordinate[0];
    const rankTo = parseInt(clickedCoordinate[1]);
    if (((movedPieceType === 'P' && rankTo === 8) || (movedPieceType === 'p' && rankTo === 1)) && (fileFrom === fileTo)) {
      const promotionPiece = await selectPromotionPiece();
      if (!promotionPiece) {
        toggleSquareHighlight(state.selectedSquare);
        state.selectedSquare = null;
        return;
      } else {
        move += promotionPiece;
      }
    }
    if (isValidMove(move)) {
      makeMove(move);
      makeComputerMove();
    } else if (existingCoordinate === clickedCoordinate) {
      toggleSquareHighlight(square)
    } else if (piece?.getAttribute('data-piece-colour') === state.playerColour){
      toggleSquareHighlight(state.selectedSquare)
      toggleSquareHighlight(square)
      state.selectedSquare = square;
    } else {
      toggleSquareHighlight(state.selectedSquare)
      state.selectedSquare = null;
    }
  }
};

const selectPromotionPiece = () => {
  return new Promise((resolve, reject) => {
    const promotionFormElement = document.getElementById('promotion-select-form');
    const promotionSelectElement = document.getElementById('promotion-select');
    const confirmPromotion = document.getElementById('promotion-confirm');
    const cancelPromotion = document.getElementById('promotion-cancel');
    
    promotionFormElement.style.display = 'flex';

    confirmPromotion.addEventListener('click', (e) => {
      e.preventDefault();
      promotionFormElement.style.display = 'none';
      resolve(promotionSelectElement.value);
    });

    cancelPromotion.addEventListener('click', (e) => {
      e.preventDefault();
      promotionFormElement.style.display = 'none';
      resolve(null);
    });
  });
}

const toggleSquareHighlight = (square) => {
  square.classList.toggle('selected-square');
}

const setBotIsThinking = (isThinking) => {
  thinkingText.innerHTML = `Tonnetto Bot is ${isThinking ? 'thinking...' : 'ready for your turn!'}`;
  thinkingAnimationElements.forEach((el) => {
    if (isThinking) {
      el.classList.add('animate');
    } else {
      el.classList.remove('animate');
    }
  })
}

const isValidMove = (moveNotation) => {
  const engine = new TonnettoEngine({ fen: state.fen });
  engine.applyMove(moveNotation);
  return !(engine.getFen().split(' ')[0] === state.fen.split(' ')[0]);
}

const makeMove = (moveNotation) => {
  const engine = new TonnettoEngine({ fen: state.fen });
  
  // perform the move
  engine.applyMove(moveNotation); // call the engine to make the move

  // update the last moved square
  state.lastMovedFrom = moveNotation.substring(0,2);
  state.lastMovedTo = moveNotation.substring(2,4);
 
  // clear previous selection
  if (state.selectedSquare) {
    state.selectedSquare.classList.remove('selected-square');
  }
  state.selectedSquare = null; // deselect the square
 
  state.fen = engine.getFen();

  state.gameState = engine.isGameOver();

  render();
}

const makeComputerMove = () => {
  // send the board state to the worker for processing
  setBotIsThinking(true);
  const message = {
    fen: state.fen,
    depth: difficultyScale[state.difficulty],
  }
  chessWorker.postMessage(JSON.stringify(message));

  // listen for the best move from the worker
  chessWorker.onmessage = function(event) {
    const bestMove = event.data;
    if (bestMove) {
      // update the board with the best move
      makeMove(bestMove);
    }
    setBotIsThinking(false);
  };
}

const resetGame = () => {
  window.location.reload();
}
document.getElementById('play-again-button').addEventListener('click', resetGame);