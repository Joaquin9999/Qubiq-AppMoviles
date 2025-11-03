import { Play, House } from 'phosphor-react';
import { colors } from '../../styles/colors';
import DecorativeGrid from '../../components/DecorativeGrid';

/**
 * Modal de pausa
 */
const PauseModal = ({ onResume, onMenu }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      animation: 'fadeIn 0.2s ease-in'
    }}>
      <div style={{
        backgroundColor: colors.panel,
        border: `6px solid ${colors.accent}`,
        padding: '35px 45px',
        boxShadow: `0 0 40px ${colors.accent}, inset 0 0 20px ${colors.accent}30`,
        textAlign: 'center',
        animation: 'popIn 0.3s ease-out',
        maxWidth: '90%'
      }}>
        <h2 style={{
          fontSize: '28px',
          color: colors.accent,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '3px',
          marginBottom: '30px',
          textShadow: `0 0 20px ${colors.accent}`,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          PAUSED
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <DecorativeGrid columns={5} color={colors.accent} gap="5px" />
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%'
        }}>
          <button
            onClick={onResume}
            style={{
              width: '100%',
              padding: '15px 20px',
              backgroundColor: colors.panel,
              border: `4px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: '11px',
              fontFamily: "'Press Start 2P', cursive",
              cursor: 'pointer',
              boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              letterSpacing: '2px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.accent;
              e.target.style.borderColor = colors.hover;
              e.target.style.boxShadow = `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.panel;
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`;
            }}
          >
            <Play size={16} weight="fill" />
            RESUME
          </button>

          <button
            onClick={onMenu}
            style={{
              width: '100%',
              padding: '15px 20px',
              backgroundColor: colors.panel,
              border: `4px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: '11px',
              fontFamily: "'Press Start 2P', cursive",
              cursor: 'pointer',
              boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              letterSpacing: '2px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.secondary;
              e.target.style.borderColor = colors.hover;
              e.target.style.boxShadow = `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.panel;
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`;
            }}
          >
            <House size={16} weight="fill" />
            MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;
