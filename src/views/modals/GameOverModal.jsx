import { ArrowCounterClockwise, House } from 'phosphor-react';
import { colors } from '../../styles/colors';
import DecorativeGrid from '../../components/DecorativeGrid';

/**
 * Modal de Game Over
 */
const GameOverModal = ({ score, level, onRestart, onMenu }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-in'
    }}>
      <div style={{
        backgroundColor: colors.panel,
        border: `6px solid ${colors.warning}`,
        padding: '40px 50px',
        boxShadow: `0 0 40px ${colors.warning}, inset 0 0 20px ${colors.warning}30`,
        textAlign: 'center',
        animation: 'popIn 0.4s ease-out',
        maxWidth: '90%'
      }}>
        <h1 style={{
          fontSize: '32px',
          color: colors.warning,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '3px',
          marginBottom: '30px',
          textShadow: `0 0 20px ${colors.warning}, 0 0 30px ${colors.warning}`,
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          GAME<br/>OVER
        </h1>

        <div style={{ marginBottom: '25px' }}>
          <DecorativeGrid columns={5} color={colors.warning} gap="6px" />
        </div>

        {/* Estadísticas finales */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            fontSize: '10px',
            color: colors.textSecondary,
            fontFamily: "'Press Start 2P', cursive",
            marginBottom: '10px',
            letterSpacing: '1px'
          }}>
            FINAL SCORE
          </div>
          <div style={{
            fontSize: '24px',
            color: colors.hover,
            fontFamily: "'Press Start 2P', cursive",
            marginBottom: '20px',
            textShadow: `0 0 15px ${colors.hover}`,
            letterSpacing: '2px'
          }}>
            {score}
          </div>
          <div style={{
            fontSize: '9px',
            color: colors.textSecondary,
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '1px'
          }}>
            LEVEL {level}
          </div>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%'
        }}>
          <button
            onClick={onRestart}
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
            <ArrowCounterClockwise size={16} weight="bold" />
            RESTART
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

export default GameOverModal;
