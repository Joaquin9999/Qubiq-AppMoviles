import { colors } from '../styles/colors';
import DecorativeGrid from '../components/DecorativeGrid';
import logo from '../assets/logo.png';

/**
 * Pantalla de bienvenida / Splash Screen
 */
const SplashScreen = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Marco retro tipo tablero de Tetris */}
      <div style={{
        border: `6px solid ${colors.border}`,
        padding: '40px 60px',
        backgroundColor: colors.background,
        boxShadow: `0 0 30px ${colors.border}, inset 0 0 20px ${colors.border}30`,
        position: 'relative'
      }}>
        {/* Grid decorativo superior */}
        <div style={{ marginBottom: '30px' }}>
          <DecorativeGrid columns={7} />
        </div>

        <img 
          src={logo} 
          alt="TETRIS" 
          style={{ 
            width: '300px',
            maxWidth: '80vw',
            height: 'auto',
            marginBottom: '30px',
            animation: 'fadeIn 1s ease-in',
            imageRendering: 'pixelated',
            filter: `drop-shadow(0 0 20px ${colors.border})`
          }} 
        />

        {/* Grid decorativo inferior */}
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <DecorativeGrid columns={7} />
        </div>
      </div>

      <p style={{ 
        fontSize: '12px', 
        color: colors.hover,
        textAlign: 'center',
        marginTop: '40px',
        animation: 'pulse 2s ease-in-out infinite',
        textShadow: `0 0 10px ${colors.hover}`,
        fontFamily: "'Press Start 2P', cursive",
        letterSpacing: '2px'
      }}>
        TAP TO START
      </p>
      
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '8px',
        color: colors.textSecondary,
        fontFamily: "'Press Start 2P', cursive"
      }}>
        v1.0.0
      </div>
    </div>
  );
};

export default SplashScreen;
