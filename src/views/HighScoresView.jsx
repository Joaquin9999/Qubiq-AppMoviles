import { useState, useEffect } from 'react';
import { House, Trophy, Faders, Trash } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import { getScores, clearScores, formatScore } from '../utils/scores';

/**
 * Componente de una fila de puntuación
 */
const ScoreRow = ({ rank, player, score, level, lines, isHeader = false, isHighlighted = false }) => {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 2fr 1fr 1fr',
    gap: '10px',
    width: '100%',
    padding: '12px 15px',
    backgroundColor: isHeader 
      ? 'rgba(255, 255, 255, 0.05)' 
      : isHighlighted 
        ? 'rgba(255, 89, 94, 0.1)' 
        : 'transparent',
    borderBottom: `1px solid ${colors.border}40`,
    fontFamily: "'Press Start 2P', cursive",
    fontSize: isHeader ? '10px' : '12px',
    color: isHeader 
      ? colors.accent 
      : isHighlighted 
        ? colors.primary 
        : colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textShadow: isHeader 
      ? `0 0 5px ${colors.accent}` 
      : isHighlighted 
        ? `0 0 8px ${colors.accent}80` 
        : 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    ...(isHighlighted && {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`,
        boxShadow: `0 0 10px ${colors.primary}`
      }
    })
  };

  return (
    <div style={rowStyle}>
      <div style={{ textAlign: 'center' }}>{rank}</div>
      <div style={{ textAlign: 'left' }}>{player}</div>
      <div style={{ textAlign: 'right' }}>{typeof score === 'number' ? formatScore(score) : score}</div>
      <div style={{ textAlign: 'center' }}>{level}</div>
      <div style={{ textAlign: 'center' }}>{lines}</div>
    </div>
  );
};

/**
 * Vista de High Scores
 */
const HighScoresView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Cargar puntuaciones al montar el componente
  useEffect(() => {
    const loadScores = () => {
      try {
        const savedScores = getScores();
        setScores(savedScores);
      } catch (error) {
        console.error('Error al cargar las puntuaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, []);

  const handleClearScores = () => {
    if (showClearConfirm) {
      // Confirmar limpieza
      clearScores();
      setScores([]);
      setShowClearConfirm(false);
    } else {
      // Mostrar confirmación
      setShowClearConfirm(true);
      // Ocultar el mensaje de confirmación después de 3 segundos
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };
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
      {/* Botones de acción */}
      <div style={{ 
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        {/* Botón de regreso al menú */}
        <IconButton
          size="large"
          variant="secondary"
          isHovered={hoveredButton === 'home-scores'}
          onClick={() => onNavigate('menu')}
          onMouseEnter={() => setHoveredButton('home-scores')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <House size={28} weight="bold" color={colors.textPrimary} />
        </IconButton>

        {/* Botón para limpiar puntuaciones */}
        <IconButton
          size="large"
          variant={showClearConfirm ? 'primary' : 'secondary'}
          isHovered={hoveredButton === 'clear-scores'}
          onClick={handleClearScores}
          onMouseEnter={() => setHoveredButton('clear-scores')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            backgroundColor: showClearConfirm ? colors.warning : 'transparent',
            borderColor: showClearConfirm ? colors.warning : colors.border,
            transition: 'all 0.3s ease'
          }}
        >
          {showClearConfirm ? (
            <Trash size={24} weight="fill" color={colors.textPrimary} />
          ) : (
            <Faders size={24} weight="bold" color={colors.textPrimary} />
          )}
        </IconButton>
      </div>

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
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: scores.length > 0 ? 'flex-start' : 'center',
          ...(scores.length === 0 && { alignItems: 'center' })
        }}>
          {isLoading ? (
            <p style={{
              color: colors.textSecondary,
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '10px',
              textAlign: 'center',
              opacity: 0.7,
              animation: 'pulse 1.5s infinite',
              margin: '20px 0'
            }}>
              LOADING SCORES...
            </p>
          ) : scores.length > 0 ? (
            scores.map((score, index) => (
              <ScoreRow
                key={score.id || index}
                rank={index + 1}
                player={score.player}
                score={score.score}
                level={score.level}
                lines={score.lines}
                isHighlighted={index < 3} // Destacar los 3 primeros puestos
              />
            ))
          ) : (
            <p style={{
              color: colors.textSecondary,
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '10px',
              textAlign: 'center',
              opacity: 0.7,
              padding: '20px',
              lineHeight: '1.6'
            }}>
              NO SCORES YET
              <br />
              PLAY A GAME TO SAVE
              <br />
              YOUR SCORE!
            </p>
          )}
        </div>

        {/* Mensaje de confirmación de limpieza */}
        {showClearConfirm && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 16, 83, 0.2)',
            border: `2px solid ${colors.warning}`,
            padding: '10px 20px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <Trash size={16} weight="fill" color={colors.warning} />
            <span style={{
              color: colors.textPrimary,
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '10px',
              textTransform: 'uppercase'
            }}>
              CLICK AGAIN TO CLEAR ALL SCORES
            </span>
          </div>
        )}

        {/* Estilos de animación */}
        <style jsx global>{`
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
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
