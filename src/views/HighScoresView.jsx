import { House } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';

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
      justifyContent: 'center',
      padding: '40px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-scores'}
        onClick={() => onNavigate('menu')}
        onMouseEnter={() => setHoveredButton('home-scores')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
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
        lineHeight: '1.5'
      }}>
        HIGH<br/>SCORES
      </h1>
    </div>
  );
};

export default HighScoresView;
