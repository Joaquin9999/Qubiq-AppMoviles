import { colors } from '../styles/colors';

/**
 * Botón retro reutilizable con estilo Tetris
 */
const RetroButton = ({ 
  children, 
  onClick, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave,
  variant = 'primary', // 'primary', 'secondary', 'accent', 'warning'
  isActive = false,
  animationDelay = '0s',
  style = {}
}) => {
  const getBackgroundColor = () => {
    if (isHovered || isActive) {
      switch (variant) {
        case 'primary': return colors.primary;
        case 'secondary': return colors.secondary;
        case 'accent': return colors.accent;
        case 'warning': return colors.warning;
        default: return colors.primary;
      }
    }
    return colors.panel;
  };

  const buttonStyle = {
    width: '100%',
    padding: '18px 20px',
    backgroundColor: getBackgroundColor(),
    border: `4px solid ${(isHovered || isActive) ? colors.hover : colors.border}`,
    borderRadius: '0px',
    fontSize: '14px',
    fontWeight: 'normal',
    cursor: 'pointer',
    color: colors.textPrimary,
    transition: 'all 0.2s ease',
    boxShadow: (isHovered || isActive)
      ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30, 6px 6px 0px ${colors.border}`
      : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20, 4px 4px 0px ${colors.border}`,
    transform: (isHovered || isActive) ? 'translate(-2px, -2px)' : 'translate(0, 0)',
    animation: (isHovered || isActive) ? 'buttonGlow 0.8s ease-in-out infinite' : 'slideIn 0.5s ease-out',
    animationDelay,
    fontFamily: "'Press Start 2P', cursive",
    letterSpacing: '2px',
    textTransform: 'uppercase',
    imageRendering: 'pixelated',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};

export default RetroButton;
