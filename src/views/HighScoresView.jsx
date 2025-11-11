import { useEffect, useState } from 'react';
import { House, Trash } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import { getScores, formatDate, cleanDuplicateScores, clearAllScores } from '../utils/scores';

/**
 * Vista de High Scores
 */
const HighScoresView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Limpiar duplicados primero
    const cleanedScores = cleanDuplicateScores();
    setScores(cleanedScores);
  }, []);

  const handleClearScores = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los scores?')) {
      clearAllScores();
      setScores([]);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: colors.background, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      padding: '20px',
      paddingTop: '80px',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-scores'}
        onClick={() => onNavigate('menu')}
        onMouseEnter={() => setHoveredButton('home-scores')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '20px', left: '20px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Botón para limpiar scores (temporal para testing) */}
      <IconButton
        size="large"
        variant="warning"
        isHovered={hoveredButton === 'clear-scores'}
        onClick={handleClearScores}
        onMouseEnter={() => setHoveredButton('clear-scores')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '20px', right: '20px' }}
      >
        <Trash size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

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
        lineHeight: '1.5',
        marginBottom: '30px',
        visibility: 'hidden',
        height: '40px' // Mantener el espacio para el layout
      }}>
        
      </h1>

      {scores.length > 0 ? (
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: `2px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '20px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '10px',
            marginBottom: '15px',
            padding: '0 10px',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '10px',
            color: colors.accent,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <div>RANK</div>
            <div>DATE</div>
            <div style={{ textAlign: 'right' }}>SCORE</div>
          </div>
          
          <div style={{ overflowY: 'auto' }}>
            {scores.map((score, index) => (
              <div 
                key={score.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gap: '10px',
                  padding: '12px 10px',
                  marginBottom: '8px',
                  backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  borderRadius: '4px',
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '12px',
                  color: colors.textPrimary,
                  alignItems: 'center'
                }}
              >
                <div style={{ color: index < 3 ? colors.accent : colors.textPrimary }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: '9px', color: colors.textSecondary }}>
                  {formatDate(score.date)}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', color: colors.hover }}>
                  {score.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          color: colors.textSecondary,
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '40px',
          lineHeight: '1.6'
        }}>
          NO SCORES YET
          <div style={{ fontSize: '10px', marginTop: '10px' }}>
            PLAY A GAME TO SEE YOUR SCORES HERE
          </div>
        </div>
      )}
    </div>
  );
};

export default HighScoresView;
