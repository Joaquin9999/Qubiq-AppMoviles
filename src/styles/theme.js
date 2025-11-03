import { colors } from './colors';

// Estilos base reutilizables
export const baseButtonStyle = {
  width: '100%',
  padding: '18px 20px',
  backgroundColor: colors.panel,
  border: `4px solid ${colors.border}`,
  borderRadius: '0px',
  fontSize: '14px',
  fontWeight: 'normal',
  cursor: 'pointer',
  color: colors.textPrimary,
  transition: 'all 0.2s ease',
  boxShadow: `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
  fontFamily: "'Press Start 2P', cursive",
  letterSpacing: '2px',
  textTransform: 'uppercase',
  imageRendering: 'pixelated',
  animation: 'slideIn 0.5s ease-out'
};

export const iconButtonStyle = {
  width: '60px',
  height: '60px',
  backgroundColor: colors.panel,
  border: `4px solid ${colors.border}`,
  borderRadius: '0px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '0',
  transition: 'all 0.2s ease',
  boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
  animation: 'pixelBounce 2s ease-in-out infinite'
};

export const smallIconButtonStyle = {
  width: '45px',
  height: '45px',
  backgroundColor: colors.panel,
  border: `3px solid ${colors.border}`,
  borderRadius: '0px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '0',
  transition: 'all 0.2s ease',
  boxShadow: `0 0 15px ${colors.border}80, inset 0 0 8px ${colors.border}20`
};

export const scorePanelBase = {
  backgroundColor: colors.panel,
  border: `2px solid ${colors.border}`,
  textAlign: 'center',
  boxShadow: `0 0 10px ${colors.border}80, inset 0 0 8px ${colors.border}20`,
  fontFamily: "'Press Start 2P', cursive"
};
