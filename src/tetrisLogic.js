// PASO 1: Estructura de Datos Básica del Tetris

// Definición de las 7 piezas tetrominos con sus rotaciones
// Cada pieza es una matriz donde 1 representa un bloque
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
    color: '#00FFFF' // Cian
  },
  
  O: {
    shape: [
      [[1, 1],
       [1, 1]]
    ],
    color: '#FFFF00' // Amarillo
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
    color: '#B026FF' // Púrpura
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
    color: '#00FF00' // Verde
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
    color: '#FF0000' // Rojo
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
    color: '#0000FF' // Azul
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
    color: '#FF7A00' // Naranja
  }
};

// Constantes del juego
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Crear tablero vacío (matriz 20x10)
export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(0)
  );
};

// Estados del juego
export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// Obtener una pieza aleatoria
export const getRandomTetromino = () => {
  const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    type: randomPiece,
    shape: TETROMINOS[randomPiece].shape[0], // Primera rotación
    color: TETROMINOS[randomPiece].color,
    rotation: 0,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[randomPiece].shape[0][0].length / 2),
    y: 0
  };
};

// Estado inicial del juego
export const createInitialGameState = () => {
  return {
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    nextPiece: getRandomTetromino(),
    gameState: GAME_STATES.IDLE,
    score: 0,
    level: 1,
    lines: 0
  };
};

// ============================================
// PASO 2: SISTEMA DE PIEZAS
// ============================================

// Rotar pieza en sentido horario
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

// Rotar pieza en sentido antihorario
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

// Mover pieza a la izquierda
export const movePieceLeft = (piece) => {
  return {
    ...piece,
    x: piece.x - 1
  };
};

// Mover pieza a la derecha
export const movePieceRight = (piece) => {
  return {
    ...piece,
    x: piece.x + 1
  };
};

// Mover pieza hacia abajo
export const movePieceDown = (piece) => {
  return {
    ...piece,
    y: piece.y + 1
  };
};

// Obtener las coordenadas absolutas de la pieza en el tablero
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

// Clonar una pieza
export const clonePiece = (piece) => {
  return {
    ...piece,
    shape: piece.shape.map(row => [...row])
  };
};

// ============================================
// PASO 3: MOVIMIENTO BÁSICO Y VALIDACIÓN
// ============================================

// Verificar si una posición está dentro de los límites del tablero
const isWithinBounds = (x, y) => {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
};

// Verificar si una pieza colisiona con el tablero o con otras piezas
export const checkCollision = (piece, board) => {
  const coordinates = getPieceCoordinates(piece);
  
  for (let coord of coordinates) {
    const { x, y } = coord;
    
    // Verificar límites del tablero
    if (!isWithinBounds(x, y)) {
      return true;
    }
    
    // Verificar colisión con piezas ya colocadas
    if (board[y] && board[y][x] !== 0) {
      return true;
    }
  }
  
  return false;
};

// Intentar mover la pieza a la izquierda
export const tryMoveLeft = (piece, board) => {
  const movedPiece = movePieceLeft(piece);
  
  if (checkCollision(movedPiece, board)) {
    return piece; // No se puede mover, retornar pieza original
  }
  
  return movedPiece;
};

// Intentar mover la pieza a la derecha
export const tryMoveRight = (piece, board) => {
  const movedPiece = movePieceRight(piece);
  
  if (checkCollision(movedPiece, board)) {
    return piece; // No se puede mover, retornar pieza original
  }
  
  return movedPiece;
};

// Intentar mover la pieza hacia abajo
export const tryMoveDown = (piece, board) => {
  const movedPiece = movePieceDown(piece);
  
  if (checkCollision(movedPiece, board)) {
    return { piece, collided: true }; // Colisionó
  }
  
  return { piece: movedPiece, collided: false };
};

// Intentar rotar la pieza
export const tryRotate = (piece, board) => {
  const rotatedPiece = rotatePiece(piece);
  
  if (checkCollision(rotatedPiece, board)) {
    // Intentar wall kick (desplazar la pieza si rota cerca de una pared)
    // Probar desplazamiento a la izquierda
    const kickedLeft = { ...rotatedPiece, x: rotatedPiece.x - 1 };
    if (!checkCollision(kickedLeft, board)) {
      return kickedLeft;
    }
    
    // Probar desplazamiento a la derecha
    const kickedRight = { ...rotatedPiece, x: rotatedPiece.x + 1 };
    if (!checkCollision(kickedRight, board)) {
      return kickedRight;
    }
    
    // Probar desplazamiento doble a la derecha
    const kickedRight2 = { ...rotatedPiece, x: rotatedPiece.x + 2 };
    if (!checkCollision(kickedRight2, board)) {
      return kickedRight2;
    }
    
    return piece; // No se puede rotar
  }
  
  return rotatedPiece;
};

// Caída rápida (hard drop) - dejar caer la pieza hasta el fondo
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

// Obtener la posición fantasma (ghost piece) - muestra dónde caerá la pieza
export const getGhostPiece = (piece, board) => {
  const { piece: ghostPiece } = hardDrop(piece, board);
  return ghostPiece;
};

// ============================================
// PASO 5: COLOCAR PIEZAS Y LÍNEAS COMPLETAS
// ============================================

// Colocar la pieza actual en el tablero
export const placePiece = (piece, board) => {
  // Crear una copia del tablero
  const newBoard = board.map(row => [...row]);
  const coordinates = getPieceCoordinates(piece);
  
  // Colocar cada bloque de la pieza en el tablero
  for (let coord of coordinates) {
    const { x, y } = coord;
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      // Guardar el color de la pieza en el tablero
      newBoard[y][x] = piece.color;
    }
  }
  
  return newBoard;
};

// Verificar si una línea está completa
const isLineComplete = (line) => {
  return line.every(cell => cell !== 0);
};

// Detectar y eliminar líneas completas
export const clearLines = (board) => {
  let newBoard = [...board];
  let linesCleared = 0;
  
  // Recorrer desde abajo hacia arriba
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (isLineComplete(newBoard[y])) {
      // Eliminar la línea completa
      newBoard.splice(y, 1);
      // Agregar una línea vacía al principio
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      // Volver a verificar esta fila (porque bajó una nueva)
      y++;
    }
  }
  
  return { board: newBoard, linesCleared };
};

// Calcular puntos según líneas eliminadas (sistema original de Tetris)
export const calculateScore = (linesCleared, level) => {
  const baseScores = {
    1: 100,   // Single
    2: 300,   // Double
    3: 500,   // Triple
    4: 800    // Tetris
  };
  
  return (baseScores[linesCleared] || 0) * level;
};

// Calcular el nivel según las líneas completadas
export const calculateLevel = (totalLines) => {
  return Math.floor(totalLines / 10) + 1;
};

// Obtener la velocidad de caída según el nivel (en milisegundos)
export const getDropSpeed = (level) => {
  // Fórmula del Tetris original
  const baseSpeed = 1000; // 1 segundo en nivel 1
  const speedDecrease = 50; // Disminuye 50ms por nivel
  const minSpeed = 100; // Velocidad mínima
  
  return Math.max(minSpeed, baseSpeed - (level - 1) * speedDecrease);
};

// Verificar si el juego ha terminado (Game Over)
export const isGameOver = (piece, board) => {
  // Si la pieza nueva colisiona al aparecer, es Game Over
  return checkCollision(piece, board);
};

// Procesar el lock de una pieza (colocar y verificar líneas)
export const lockPiece = (piece, board, currentScore, currentLevel, currentLines) => {
  // Colocar la pieza en el tablero
  const newBoard = placePiece(piece, board);
  
  // Verificar y eliminar líneas completas
  const { board: clearedBoard, linesCleared } = clearLines(newBoard);
  
  // Calcular nueva puntuación
  const scoreGained = calculateScore(linesCleared, currentLevel);
  const newScore = currentScore + scoreGained;
  
  // Actualizar líneas totales
  const newTotalLines = currentLines + linesCleared;
  
  // Calcular nuevo nivel
  const newLevel = calculateLevel(newTotalLines);
  
  return {
    board: clearedBoard,
    score: newScore,
    level: newLevel,
    lines: newTotalLines,
    linesCleared
  };
};

// ============================================
// PASO 6: SISTEMA DE JUEGO
// ============================================

// Generar nueva pieza y avanzar la siguiente
export const spawnNextPiece = (nextPiece) => {
  const newNextPiece = getRandomTetromino();
  
  return {
    currentPiece: nextPiece,
    nextPiece: newNextPiece
  };
};

// Iniciar el juego
export const startGame = () => {
  const initialState = createInitialGameState();
  
  return {
    ...initialState,
    gameState: GAME_STATES.PLAYING
  };
};

// Pausar el juego
export const pauseGame = (gameState) => {
  if (gameState === GAME_STATES.PLAYING) {
    return GAME_STATES.PAUSED;
  } else if (gameState === GAME_STATES.PAUSED) {
    return GAME_STATES.PLAYING;
  }
  return gameState;
};

// Terminar el juego (Game Over)
export const endGame = () => {
  return GAME_STATES.GAME_OVER;
};

// Reiniciar el juego
export const resetGame = () => {
  return startGame();
};

// Actualizar el tick del juego (caída automática)
export const gameTick = (gameState) => {
  const { currentPiece, board, score, level, lines, nextPiece } = gameState;
  
  // Intentar mover la pieza hacia abajo
  const { piece: movedPiece, collided } = tryMoveDown(currentPiece, board);
  
  if (!collided) {
    // La pieza se movió correctamente
    return {
      ...gameState,
      currentPiece: movedPiece
    };
  } else {
    // La pieza colisionó, fijarla al tablero
    const lockResult = lockPiece(currentPiece, board, score, level, lines);
    
    // Generar nueva pieza
    const { currentPiece: newPiece, nextPiece: newNextPiece } = spawnNextPiece(nextPiece);
    
    // Verificar si hay Game Over
    if (isGameOver(newPiece, lockResult.board)) {
      return {
        ...gameState,
        ...lockResult,
        gameState: GAME_STATES.GAME_OVER
      };
    }
    
    // Continuar el juego con nueva pieza
    return {
      ...gameState,
      board: lockResult.board,
      currentPiece: newPiece,
      nextPiece: newNextPiece,
      score: lockResult.score,
      level: lockResult.level,
      lines: lockResult.lines
    };
  }
};

// Procesar hard drop (caída instantánea)
export const processHardDrop = (gameState) => {
  const { currentPiece, board, score, level, lines, nextPiece } = gameState;
  
  // Dejar caer la pieza hasta el fondo
  const { piece: droppedPiece, distance } = hardDrop(currentPiece, board);
  
  // Bonus por hard drop (2 puntos por celda)
  const hardDropBonus = distance * 2;
  
  // Fijar la pieza al tablero
  const lockResult = lockPiece(droppedPiece, board, score + hardDropBonus, level, lines);
  
  // Generar nueva pieza
  const { currentPiece: newPiece, nextPiece: newNextPiece } = spawnNextPiece(nextPiece);
  
  // Verificar si hay Game Over
  if (isGameOver(newPiece, lockResult.board)) {
    return {
      ...gameState,
      ...lockResult,
      gameState: GAME_STATES.GAME_OVER
    };
  }
  
  // Continuar el juego con nueva pieza
  return {
    ...gameState,
    board: lockResult.board,
    currentPiece: newPiece,
    nextPiece: newNextPiece,
    score: lockResult.score,
    level: lockResult.level,
    lines: lockResult.lines
  };
};

// Manejar acciones del jugador
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
          score: gameState.score + 1 // Bonus por caída manual
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
