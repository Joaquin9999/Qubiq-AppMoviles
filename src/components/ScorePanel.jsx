import { colors } from '../styles/colors';
import { scorePanelBase } from '../styles/theme';

/**
 * Panel de información del juego (Level, Score, Next)
 */
const ScorePanel = ({ 
  type = 'small', // 'small' (Level/Score) o 'next' (Next Piece)
  label,
  value,
  children 
}) => {
  const getStyle = () => {
    if (type === 'next') {
      return {
        ...scorePanelBase,
        padding: '8px',
        flex: '0 0 auto',
        minWidth: '95px',
        width: '95px',
        height: '95px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      };
    }
    
    return {
      ...scorePanelBase,
      padding: '12px 15px',
      flex: '0 0 auto',
      minWidth: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    };
  };

  const labelStyle = {
    fontSize: type === 'next' ? '8px' : '7px',
    color: colors.textSecondary,
    marginBottom: type === 'next' ? '10px' : '6px',
    letterSpacing: type === 'next' ? '1px' : '0.5px'
  };

  const valueStyle = {
    fontSize: '16px',
    color: colors.textPrimary,
    textShadow: `0 0 8px ${colors.hover}, 0 0 12px ${colors.hover}`,
    letterSpacing: '1px'
  };

  return (
    <div style={getStyle()}>
      <div style={labelStyle}>{label}</div>
      {value !== undefined ? (
        <div style={valueStyle}>{value}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default ScorePanel;
