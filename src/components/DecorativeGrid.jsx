import { colors } from '../styles/colors';

/**
 * Grid decorativo retro (usado en Splash y modales)
 */
const DecorativeGrid = ({ columns = 7, color = colors.border, gap = '8px' }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, ${columns === 5 ? '25px' : '40px'})`,
      gap,
      justifyContent: 'center'
    }}>
      {[...Array(columns)].map((_, i) => (
        <div key={i} style={{
          width: columns === 5 ? '25px' : '40px',
          height: columns === 5 ? '6px' : '10px',
          backgroundColor: colors.panel,
          border: `2px solid ${color}`,
          boxShadow: `0 0 8px ${color}60`
        }} />
      ))}
    </div>
  );
};

export default DecorativeGrid;
