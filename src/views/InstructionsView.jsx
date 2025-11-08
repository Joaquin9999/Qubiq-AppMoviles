import { House } from 'phosphor-react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import instructionsImg from '../assets/instructions.png';

/**
 * Vista de instrucciones
 */
const InstructionsView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
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
        isHovered={hoveredButton === 'home-instructions'}
        onClick={() => onNavigate('menu')}
        onMouseEnter={() => setHoveredButton('home-instructions')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      <h1 style={{
        fontSize: '24px',
        fontWeight: 'normal',
        textAlign: 'center',
        color: colors.textPrimary,
        textShadow: `
          2px 2px 0px ${colors.secondary},
          4px 4px 0px ${colors.hover},
          0 0 20px ${colors.secondary}
        `,
        fontFamily: "'Press Start 2P', cursive",
        letterSpacing: '2px',
        lineHeight: '1.5'
      }}>
        HOW TO<br />PLAY
      </h1>
      {/* Imagen de instrucciones */}
      <div
        style={{
          width: '95%',
          maxWidth: '700px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={instructionsImg}
          alt="Game instructions"
          style={{
            width: '100%',
            height: 'auto',
            border: `2px solid ${colors.secondary}`,
            borderRadius: '12px',
            boxShadow: `0 0 20px ${colors.hover}`,
          }}
        />
      </div>

    </div>
  );
};

export default InstructionsView;
