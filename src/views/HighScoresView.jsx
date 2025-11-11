import { useEffect, useState } from 'react';
import { House, Trash } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import { getScores, formatDate, cleanDuplicateScores, clearAllScores } from '../utils/scores';
import logo from '../assets/logo.png';
import { useAudio } from '../contexts/AudioContext';

/**
 * Vista de High Scores
 */
const HighScoresView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
  const [scores, setScores] = useState([]);
  const { playButtonClick } = useAudio();

  useEffect(() => {
    // Limpiar duplicados primero
    const cleanedScores = cleanDuplicateScores();
    setScores(cleanedScores);
  }, []);

  const handleClearScores = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los scores?')) {
      playButtonClick();
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
      paddingTop: '120px',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-scores'}
        onClick={() => {
          playButtonClick();
          onNavigate('menu');
        }}
        onMouseEnter={() => setHoveredButton('home-scores')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Logo */}
      <img 
        src={logo} 
        alt="TETRIS" 
        style={{ 
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          maxWidth: '50vw',
          height: 'auto',
          imageRendering: 'pixelated',
          filter: `drop-shadow(0 0 15px ${colors.border})`
        }} 
      />

      {scores.length > 0 ? (
        <>
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

          {/* Botón para eliminar scores */}
          <button
            onClick={handleClearScores}
            onMouseEnter={() => setHoveredButton('clear-scores-btn')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '15px 20px',
              backgroundColor: hoveredButton === 'clear-scores-btn' ? colors.warning : colors.panel,
              border: `4px solid ${hoveredButton === 'clear-scores-btn' ? colors.hover : colors.border}`,
              borderRadius: '8px',
              color: colors.textPrimary,
              fontSize: '11px',
              fontFamily: "'Press Start 2P', cursive",
              cursor: 'pointer',
              boxShadow: hoveredButton === 'clear-scores-btn'
                ? `0 0 25px ${colors.warning}, inset 0 0 15px ${colors.warning}30`
                : `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              letterSpacing: '2px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            <Trash size={20} weight="bold" />
            ELIMINAR
          </button>
        </>
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
