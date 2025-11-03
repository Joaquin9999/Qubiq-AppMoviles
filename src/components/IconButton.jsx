import { colors } from '../styles/colors';

/**
 * Botón de icono (Home, Pause, Restart, etc.)
 */
const IconButton = ({ 
  children, 
  onClick, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave,
  variant = 'default', // 'default', 'accent', 'warning', 'secondary'
  size = 'large', // 'large' (60px), 'small' (45px)
  position = null, // { top, left, right, bottom } para posicionamiento absoluto
  style = {}
}) => {
  const getSize = () => {
    return size === 'large' ? { width: '60px', height: '60px', border: '4px' } 
                            : { width: '45px', height: '45px', border: '3px' };
  };

  const getBackgroundColor = () => {
    if (isHovered) {
      switch (variant) {
        case 'accent': return colors.accent;
        case 'warning': return colors.warning;
        case 'secondary': return colors.secondary;
        default: return colors.secondary;
      }
    }
    return colors.panel;
  };

  const sizes = getSize();
  
  const buttonStyle = {
    width: sizes.width,
    height: sizes.height,
    backgroundColor: getBackgroundColor(),
    border: `${sizes.border} solid ${isHovered ? colors.hover : colors.border}`,
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0',
    transition: 'all 0.2s ease',
    boxShadow: isHovered 
      ? `0 0 ${size === 'large' ? '20' : '15'}px ${colors.hover}` 
      : `0 0 15px ${colors.border}${size === 'large' ? '60' : '80'}`,
    ...(position && { position: 'absolute', ...position }),
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

export default IconButton;
