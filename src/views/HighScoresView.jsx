import { House, Trophy } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';

// Datos de ejemplo para las puntuaciones
const sampleScores = [
  { id: 1, player: 'PLAYER1', score: 50000, level: 15, lines: 120 },
  { id: 2, player: 'TETRIS', score: 45000, level: 14, lines: 110 },
  { id: 3, player: 'GAMER', score: 40000, level: 13, lines: 100 },
  { id: 4, player: 'USER', score: 35000, level: 12, lines: 90 },
  { id: 5, player: 'NEWBIE', score: 30000, level: 10, lines: 80 },
];

/**
 * Componente de una fila de puntuación
 */
const ScoreRow = ({ rank, player, score, level, lines, isHeader = false }) => {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 2fr 1fr 1fr',
    gap: '10px',
    width: '100%',
    padding: '10px 15px',
    backgroundColor: isHeader ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    borderBottom: `1px solid ${colors.border}40`,
    fontFamily: "'Press Start 2P', cursive",
    fontSize: isHeader ? '10px' : '12px',
    color: isHeader ? colors.accent : colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textShadow: isHeader ? `0 0 5px ${colors.accent}` : 'none',
  };

  return (
    <div style={rowStyle}>
      <div style={{ textAlign: 'center' }}>{rank}</div>
      <div style={{ textAlign: 'left' }}>{player}</div>
      <div style={{ textAlign: 'right' }}>{score.toLocaleString()}</div>
      <div style={{ textAlign: 'center' }}>{level}</div>
      <div style={{ textAlign: 'center' }}>{lines}</div>
    </div>
  );
};

/**
 * Vista de High Scores
 */
const HighScoresView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
  return (
    <div style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      backgroundColor: colors.background, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative',
      paddingTop: '80px',
      boxSizing: 'border-box'
    }}>
      {/* Botón de regreso al menú */}
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-scores'}
        onClick={() => onNavigate('menu')}
        onMouseEnter={() => setHoveredButton('home-scores')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '20px', left: '20px' }}
      >
        <House size={28} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Título */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '30px',
        gap: '15px'
      }}>
        <Trophy size={40} weight="fill" color={colors.accent} />
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'normal', 
          textAlign: 'center',
          color: colors.textPrimary,
          textShadow: `
            2px 2px 0px ${colors.accent},
            4px 4px 0px ${colors.secondary},
            0 0 20px ${colors.accent}
          `,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '2px',
          lineHeight: '1.4',
          margin: 0
        }}>
          HIGH SCORES
        </h1>
      </div>

      {/* Contenedor de la tabla de puntuaciones */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: 'rgba(27, 28, 30, 0.7)',
        border: `3px solid ${colors.border}`,
        borderRadius: '10px',
        padding: '15px',
        boxShadow: `0 0 20px ${colors.border}80`,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Efecto de borde brillante */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `2px solid ${colors.accent}40`,
          borderRadius: '8px',
          pointerEvents: 'none',
          zIndex: -1
        }} />

        {/* Cabecera de la tabla */}
        <ScoreRow 
          rank="#" 
          player="PLAYER" 
          score="SCORE" 
          level="LVL" 
          lines="LINES" 
          isHeader={true} 
        />

        {/* Lista de puntuaciones */}
        <div style={{
          maxHeight: '50vh',
          overflowY: 'auto',
          marginTop: '10px',
          paddingRight: '5px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.accent} ${colors.panel}`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.panel,
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.accent,
            borderRadius: '3px',
          },
        }}>
          {sampleScores.map((score, index) => (
            <ScoreRow
              key={score.id}
              rank={index + 1}
              player={score.player}
              score={score.score}
              level={score.level}
              lines={score.lines}
            />
          ))}
        </div>
      </div>

      {/* Mensaje de vuelta al menú */}
      <p style={{
        marginTop: '30px',
        color: colors.textSecondary,
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '10px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        opacity: 0.7
      }}>
        PRESS START TO RETURN TO MENU
      </p>
    </div>
  );
};

export default HighScoresView;
