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
