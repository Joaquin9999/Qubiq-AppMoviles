import { colors } from '../styles/colors';

/**
 * Tablero de juego - Renderiza el grid 10x20 con las piezas
 */
const GameBoard = ({ gameState }) => {
  if (!gameState) return null;

  const { board, currentPiece } = gameState;
  
  // Log para debug
  console.log('🎨 Renderizando pieza:', currentPiece.type, 'Color:', currentPiece.color);
  
  // Crear una copia del tablero para mostrar
  const displayBoard = board.map(row => [...row]);
  
  // Dibujar la pieza actual en el tablero de display
  const { shape, x, y, color } = currentPiece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
          displayBoard[boardY][boardX] = color;
        }
      }
    }
  }

  // Renderizar las celdas
  const cells = displayBoard.map((row, rowIndex) => 
    row.map((cell, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        style={{
          backgroundColor: cell || colors.panel,
          border: cell ? `1px solid ${colors.background}` : `1px solid ${colors.disabled}30`,
          boxShadow: cell ? `0 0 5px ${cell}80` : 'none'
        }}
      />
    ))
  );

  return (
    <div style={{
      width: '320px',
      height: '520px',
      backgroundColor: colors.panel,
      border: `3px solid ${colors.border}`,
      boxShadow: `0 0 20px ${colors.border}80, inset 0 0 15px ${colors.background}`,
      marginBottom: '15px',
      position: 'relative'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(20, 1fr)',
        width: '100%',
        height: '100%',
        gap: '1px',
        padding: '2px'
      }}>
        {cells}
      </div>
    </div>
  );
};

export default GameBoard;
