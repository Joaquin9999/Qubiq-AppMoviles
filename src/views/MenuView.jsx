import { GameController, Trophy, Question } from 'phosphor-react';
import { colors } from '../styles/colors';
import RetroButton from '../components/RetroButton';
import logo from '../assets/logo.png';
import { useAudio } from '../contexts/AudioContext';

/**
 * Vista del menú principal
 */
const MenuView = ({ 
  hoveredButton, 
  setHoveredButton, 
  onNavigate,
  hasGameInProgress 
}) => {
  const { playButtonClick } = useAudio();

  return (
    <div style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      backgroundColor: colors.background, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '0 40px',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <img 
          src={logo} 
          alt="TETRIS" 
          style={{ 
            width: '280px',
            maxWidth: '70vw',
            height: 'auto',
            margin: '0 auto 50px auto',
            display: 'block',
            imageRendering: 'pixelated',
            filter: `drop-shadow(0 0 20px ${colors.border})`
          }} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <RetroButton
            variant="primary"
            isHovered={hoveredButton === 'play'}
            isActive={hasGameInProgress}
            onClick={() => {
              console.log('[MenuView] Play button clicked');
              playButtonClick();
              onNavigate('game');
            }}
            onMouseEnter={() => setHoveredButton('play')}
            onMouseLeave={() => setHoveredButton(null)}
            animationDelay="0s"
          >
            <GameController size={20} weight="fill" style={{ marginRight: '12px' }} />
            {hasGameInProgress ? 'CONTINUE' : 'PLAY'}
          </RetroButton>

          <RetroButton
            variant="secondary"
            isHovered={hoveredButton === 'scores'}
            onClick={() => {
              playButtonClick();
              onNavigate('highscores');
            }}
            onMouseEnter={() => setHoveredButton('scores')}
            onMouseLeave={() => setHoveredButton(null)}
            animationDelay="0.1s"
          >
            <Trophy size={20} weight="fill" style={{ marginRight: '12px' }} />
            SCORES
          </RetroButton>

          <RetroButton
            variant="secondary"
            isHovered={hoveredButton === 'instructions'}
            onClick={() => {
              playButtonClick();
              onNavigate('instructions');
            }}
            onMouseEnter={() => setHoveredButton('instructions')}
            onMouseLeave={() => setHoveredButton(null)}
            animationDelay="0.2s"
          >
            <Question size={20} weight="fill" style={{ marginRight: '12px' }} />
            HELP
          </RetroButton>
        </div>
      </div>
    </div>
  );
};

export default MenuView;
