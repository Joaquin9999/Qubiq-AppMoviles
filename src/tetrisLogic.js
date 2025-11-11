export const TETROMINOS = {
  I: {
    shape: [
      [[0, 0, 0, 0],
       [1, 1, 1, 1],
       [0, 0, 0, 0],
       [0, 0, 0, 0]],
      
      [[0, 0, 1, 0],
       [0, 0, 1, 0],
       [0, 0, 1, 0],
       [0, 0, 1, 0]],
      
      [[0, 0, 0, 0],
       [0, 0, 0, 0],
       [1, 1, 1, 1],
       [0, 0, 0, 0]],
      
      [[0, 1, 0, 0],
       [0, 1, 0, 0],
       [0, 1, 0, 0],
       [0, 1, 0, 0]]
    ],
    color: '#00FFFF'
  },
  
  O: {
    shape: [
      [[1, 1],
       [1, 1]]
    ],
    color: '#FFFF00'
  },
  
  T: {
    shape: [
      [[0, 1, 0],
       [1, 1, 1],
       [0, 0, 0]],
      
      [[0, 1, 0],
       [0, 1, 1],
       [0, 1, 0]],
      
      [[0, 0, 0],
       [1, 1, 1],
       [0, 1, 0]],
      
      [[0, 1, 0],
       [1, 1, 0],
       [0, 1, 0]]
    ],
    color: '#B026FF'
  },
  
  S: {
    shape: [
      [[0, 1, 1],
       [1, 1, 0],
       [0, 0, 0]],
      
      [[0, 1, 0],
       [0, 1, 1],
       [0, 0, 1]]
    ],
    color: '#00FF00'
  },
  
  Z: {
    shape: [
      [[1, 1, 0],
       [0, 1, 1],
       [0, 0, 0]],
      
      [[0, 0, 1],
       [0, 1, 1],
       [0, 1, 0]]
    ],
    color: '#FF0000'
  },
  
  J: {
    shape: [
      [[1, 0, 0],
       [1, 1, 1],
       [0, 0, 0]],
      
      [[0, 1, 1],
       [0, 1, 0],
       [0, 1, 0]],
      
      [[0, 0, 0],
       [1, 1, 1],
       [0, 0, 1]],
      
      [[0, 1, 0],
       [0, 1, 0],
       [1, 1, 0]]
    ],
    color: '#0000FF'
  },
  
  L: {
    shape: [
      [[0, 0, 1],
       [1, 1, 1],
       [0, 0, 0]],
      
      [[0, 1, 0],
       [0, 1, 0],
       [0, 1, 1]],
      
      [[0, 0, 0],
       [1, 1, 1],
       [1, 0, 0]],
      
      [[1, 1, 0],
       [0, 1, 0],
       [0, 1, 0]]
    ],
    color: '#FF7A00'
  }
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(0)
  );
};


export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};


const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createNewBag = () => {
  const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return shuffleArray(pieces);
};


const getNextPieceFromBag = (currentBag) => {
  let bag = [...currentBag];
  

  if (bag.length === 0) {
    bag = createNewBag();
  }
  

  const piece = bag.shift();
  
  return { piece, bag };
};


export const getRandomTetromino = (bag = []) => {
  const { piece: randomPiece, bag: newBag } = getNextPieceFromBag(bag);
  
  return {
    tetromino: {
      type: randomPiece,
      shape: TETROMINOS[randomPiece].shape[0],
      color: TETROMINOS[randomPiece].color,
      rotation: 0,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[randomPiece].shape[0][0].length / 2),
      y: 0
    },
    bag: newBag
  };
};

export const createInitialGameState = () => {
  const { tetromino: currentPiece, bag: bag1 } = getRandomTetromino([]);
  const { tetromino: nextPiece, bag: bag2 } = getRandomTetromino(bag1);
  
  return {
    board: createEmptyBoard(),
    currentPiece,
    nextPiece,
    pieceBag: bag2,
    gameState: GAME_STATES.IDLE,
    score: 0,
    level: 1,
    lines: 0
  };
};

export const rotatePiece = (piece) => {
  const { type, rotation } = piece;
  const tetromino = TETROMINOS[type];
  const nextRotation = (rotation + 1) % tetromino.shape.length;
  
  return {
    ...piece,
    shape: tetromino.shape[nextRotation],
    rotation: nextRotation
  };
};

export const rotatePieceCounterClockwise = (piece) => {
  const { type, rotation } = piece;
  const tetromino = TETROMINOS[type];
  const nextRotation = rotation === 0 ? tetromino.shape.length - 1 : rotation - 1;
  
  return {
    ...piece,
    shape: tetromino.shape[nextRotation],
    rotation: nextRotation
  };
};

export const movePieceLeft = (piece) => {
  return {
    ...piece,
    x: piece.x - 1
  };
};

export const movePieceRight = (piece) => {
  return {
    ...piece,
    x: piece.x + 1
  };
};

export const movePieceDown = (piece) => {
  return {
    ...piece,
    y: piece.y + 1
  };
};

export const getPieceCoordinates = (piece) => {
  const coordinates = [];
  const { shape, x, y } = piece;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        coordinates.push({
          x: x + col,
          y: y + row
        });
      }
    }
  }
  
  return coordinates;
};

export const clonePiece = (piece) => {
  return {
    ...piece,
    shape: piece.shape.map(row => [...row])
  };
};

const isWithinBounds = (x, y) => {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
};

export const checkCollision = (piece, board) => {
  const coordinates = getPieceCoordinates(piece);
  
  for (let coord of coordinates) {
    const { x, y } = coord;
    
    if (!isWithinBounds(x, y)) {
      return true;
    }
    
    if (board[y] && board[y][x] !== 0) {
      return true;
    }
  }
  
  return false;
};

export const tryMoveLeft = (piece, board) => {
  const movedPiece = movePieceLeft(piece);
  
  if (checkCollision(movedPiece, board)) {
    return piece;
  }
  
  return movedPiece;
};

export const tryMoveRight = (piece, board) => {
  const movedPiece = movePieceRight(piece);
  
  if (checkCollision(movedPiece, board)) {
    return piece;
  }
  
  return movedPiece;
};

export const tryMoveDown = (piece, board) => {
  const movedPiece = movePieceDown(piece);
  
  if (checkCollision(movedPiece, board)) {
    return { piece, collided: true };
  }
  
  return { piece: movedPiece, collided: false };
};

export const tryRotate = (piece, board) => {
  const rotatedPiece = rotatePiece(piece);
  
  if (checkCollision(rotatedPiece, board)) {
    const kickedLeft = { ...rotatedPiece, x: rotatedPiece.x - 1 };
    if (!checkCollision(kickedLeft, board)) {
      return kickedLeft;
    }
    
    const kickedRight = { ...rotatedPiece, x: rotatedPiece.x + 1 };
    if (!checkCollision(kickedRight, board)) {
      return kickedRight;
    }
    
    const kickedRight2 = { ...rotatedPiece, x: rotatedPiece.x + 2 };
    if (!checkCollision(kickedRight2, board)) {
      return kickedRight2;
    }
    
    return piece;
  }
  
  return rotatedPiece;
};

export const hardDrop = (piece, board) => {
  let droppedPiece = { ...piece };
  let distance = 0;
  
  while (true) {
    const movedDown = movePieceDown(droppedPiece);
    if (checkCollision(movedDown, board)) {
      break;
    }
    droppedPiece = movedDown;
    distance++;
  }
  
  return { piece: droppedPiece, distance };
};

export const getGhostPiece = (piece, board) => {
  const { piece: ghostPiece } = hardDrop(piece, board);
  return ghostPiece;
};

export const placePiece = (piece, board) => {
  const newBoard = board.map(row => [...row]);
  const coordinates = getPieceCoordinates(piece);
  
  for (let coord of coordinates) {
    const { x, y } = coord;
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      newBoard[y][x] = piece.color;
    }
  }
  
  return newBoard;
};

const isLineComplete = (line) => {
  return line.every(cell => cell !== 0);
};

export const clearLines = (board) => {
  let newBoard = [...board];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (isLineComplete(newBoard[y])) {
      newBoard.splice(y, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      y++;
    }
  }
  
  return { board: newBoard, linesCleared };
};

export const calculateScore = (linesCleared, level) => {
  const baseScores = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };
  
  return (baseScores[linesCleared] || 0) * level;
};

export const calculateLevel = (totalLines) => {
  return Math.floor(totalLines / 10) + 1;
};

export const getDropSpeed = (level) => {
  const baseSpeed = 1000;
  const speedDecrease = 50;
  const minSpeed = 100;
  
  return Math.max(minSpeed, baseSpeed - (level - 1) * speedDecrease);
};

export const isGameOver = (piece, board) => {
  return checkCollision(piece, board);
};

export const lockPiece = (piece, board, currentScore, currentLevel, currentLines) => {
  const newBoard = placePiece(piece, board);
  
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  
  const scoreGained = calculateScore(linesCleared, currentLevel);
  const newScore = currentScore + scoreGained;
  
  const newTotalLines = currentLines + linesCleared;
  
  const newLevel = calculateLevel(newTotalLines);
  
  return {
    board: clearedBoard,
    score: newScore,
    level: newLevel,
    lines: newTotalLines,
    linesCleared
  };
};

export const spawnNextPiece = (nextPiece, currentBag) => {
  const { tetromino: newNextPiece, bag: newBag } = getRandomTetromino(currentBag);
  
  return {
    currentPiece: nextPiece,
    nextPiece: newNextPiece,
    pieceBag: newBag
  };
};

export const startGame = () => {
  const initialState = createInitialGameState();
  
  return {
    ...initialState,
    gameState: GAME_STATES.PLAYING
  };
};

export const pauseGame = (gameState) => {
  if (gameState === GAME_STATES.PLAYING) {
    return GAME_STATES.PAUSED;
  } else if (gameState === GAME_STATES.PAUSED) {
    return GAME_STATES.PLAYING;
  }
  return gameState;
};

export const endGame = () => {
  return GAME_STATES.GAME_OVER;
};

export const resetGame = () => {
  return startGame();
};

export const gameTick = (gameState) => {
  const { currentPiece, board, score, level, lines, nextPiece, pieceBag } = gameState;
  
  const { piece: movedPiece, collided } = tryMoveDown(currentPiece, board);
  
  if (!collided) {
    return {
      ...gameState,
      currentPiece: movedPiece
    };
  } else {
    const lockResult = lockPiece(currentPiece, board, score, level, lines);
    
    const { currentPiece: newPiece, nextPiece: newNextPiece, pieceBag: newBag } = spawnNextPiece(nextPiece, pieceBag);
    
    if (isGameOver(newPiece, lockResult.board)) {
      return {
        ...gameState,
        ...lockResult,
        gameState: GAME_STATES.GAME_OVER
      };
    }
    
    return {
      ...gameState,
      board: lockResult.board,
      currentPiece: newPiece,
      nextPiece: newNextPiece,
      pieceBag: newBag,
      score: lockResult.score,
      level: lockResult.level,
      lines: lockResult.lines
    };
  }
};

export const processHardDrop = (gameState) => {
  const { currentPiece, board, score, level, lines, nextPiece, pieceBag } = gameState;
  
  const { piece: droppedPiece, distance } = hardDrop(currentPiece, board);
  
  const hardDropBonus = distance * 2;
  
  const lockResult = lockPiece(droppedPiece, board, score + hardDropBonus, level, lines);
  
  const { currentPiece: newPiece, nextPiece: newNextPiece, pieceBag: newBag } = spawnNextPiece(nextPiece, pieceBag);
  
  if (isGameOver(newPiece, lockResult.board)) {
    return {
      ...gameState,
      ...lockResult,
      gameState: GAME_STATES.GAME_OVER
    };
  }
  
  
  return {
    ...gameState,
    board: lockResult.board,
    currentPiece: newPiece,
    nextPiece: newNextPiece,
    pieceBag: newBag,
    score: lockResult.score,
    level: lockResult.level,
    lines: lockResult.lines
  };
};




export const handlePlayerAction = (action, gameState) => {
  const { currentPiece, board } = gameState;
  
  switch (action) {
    case 'MOVE_LEFT':
      return {
        ...gameState,
        currentPiece: tryMoveLeft(currentPiece, board)
      };
      
    case 'MOVE_RIGHT':
      return {
        ...gameState,
        currentPiece: tryMoveRight(currentPiece, board)
      };
      
    case 'MOVE_DOWN':
      const { piece: downPiece, collided } = tryMoveDown(currentPiece, board);
      if (!collided) {
        return {
          ...gameState,
          currentPiece: downPiece,
          score: gameState.score + 1 
        };
      }
      return gameState;
      
    case 'ROTATE':
      return {
        ...gameState,
        currentPiece: tryRotate(currentPiece, board)
      };
      
    case 'HARD_DROP':
      return processHardDrop(gameState);
      
    default:
      return gameState;
  }
};
