import { colors } from '../styles/colors';

/**
 * Preview de la siguiente pieza (Next Piece)
 */
const NextPiecePreview = ({ nextPiece }) => {
  const previewStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: colors.disabled,
    border: `2px solid ${colors.border}`,
    boxShadow: `inset 0 0 8px ${colors.background}, 0 0 6px ${colors.border}60`,
    display: 'inline-block',
    margin: '2px'
  };

  if (!nextPiece) {
    return (
      <>
        <div style={previewStyle}></div>
        <div style={previewStyle}></div>
      </>
    );
  }

  const { shape, color } = nextPiece;
  const cells = [];
  
  // Encontrar bloques no vacíos
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        cells.push(
          <div
            key={`next-${row}-${col}`}
            style={{
              ...previewStyle,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}80, inset 0 0 5px ${color}40`
            }}
          />
        );
      }
    }
  }
  
  // Limitar a 2 bloques para el display
  return cells.slice(0, 2).length > 0 ? cells.slice(0, 2) : (
    <>
      <div style={previewStyle}></div>
      <div style={previewStyle}></div>
    </>
  );
};

export default NextPiecePreview;
