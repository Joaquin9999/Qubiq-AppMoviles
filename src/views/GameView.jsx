import { useState, useRef, useCallback, useEffect } from 'react';
import { House, Pause, Play, ArrowCounterClockwise } from 'phosphor-react';
import { colors } from '../styles/colors';
import { GAME_STATES } from '../tetrisLogic';
import { useAudioContext } from '../contexts/AudioContext';
import IconButton from '../components/IconButton';
import ScorePanel from '../components/ScorePanel';
import GameBoard from '../components/GameBoard';
import NextPiecePreview from '../components/NextPiecePreview';
import PauseModal from './modals/PauseModal';
import GameOverModal from './modals/GameOverModal';
import logo from '../assets/logo.png';

/**
 * Vista principal del juego
 */
const GameView = ({ 
  gameState,
  gameSessionId,
  hoveredButton,
  setHoveredButton,
  isFastMode,
  setIsFastMode,
  onNavigate,
  onPause,
  onRestart,
  onControl
}) => {
  if (!gameState) return null;

  const isGameOver = gameState.gameState === GAME_STATES.GAME_OVER;
  const isPaused = gameState.gameState === GAME_STATES.PAUSED;

  // Obtener funciones de audio
  const { 
    playRotate, 
    playButtonClick, 
    playDrop, 
    playGameOver, 
    playLineClear, 
    playLevelUp,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic 
  } = useAudioContext();

  // Estado y referencias para mantener presionado
  const [pressedButton, setPressedButton] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isLongPressRef = useRef(false);
  const previousGameStateRef = useRef(null);
  const previousLinesRef = useRef(gameState.lines);
  const previousLevelRef = useRef(gameState.level);
  const previousPieceTypeRef = useRef(gameState.currentPiece.type);
  const musicStartedRef = useRef(false);
  const wasPausedRef = useRef(false);
  const previousIsPlayingRef = useRef(false);
  const previousIsPausedRef = useRef(false);
  const previousIsGameOverRef = useRef(false);

  // Controlar música de fondo según el estado del juego
  useEffect(() => {
    const isPlaying = gameState.gameState === GAME_STATES.PLAYING && !isPaused && !isGameOver;
    const hasStateChanged = 
      isPlaying !== previousIsPlayingRef.current ||
      isPaused !== previousIsPausedRef.current ||
      isGameOver !== previousIsGameOverRef.current;

    if (!hasStateChanged) {
      // No hay cambios de estado, salir
      return;
    }

    console.log(`[GameView] Music control - Playing: ${isPlaying}, Paused: ${isPaused}, GameOver: ${isGameOver}`);
    
    // Juego iniciado/jugando
    if (isPlaying) {
      if (!musicStartedRef.current) {
        // Iniciar música por primera vez
        console.log('[GameView] Iniciando música de fondo');
        playBackgroundMusic();
        musicStartedRef.current = true;
        wasPausedRef.current = false;
      } else if (wasPausedRef.current) {
        // Reanudar música después de pausa
        console.log('[GameView] Reanudando música');
        resumeBackgroundMusic();
        wasPausedRef.current = false;
      }
    }
    // Juego pausado
    else if (isPaused && musicStartedRef.current && !wasPausedRef.current) {
      console.log('[GameView] Pausando música');
      pauseBackgroundMusic();
      wasPausedRef.current = true;
    }
    // Juego terminado
    else if (isGameOver && musicStartedRef.current) {
      console.log('[GameView] Game Over - Deteniendo música');
      stopBackgroundMusic();
      musicStartedRef.current = false;
      wasPausedRef.current = false;
    }

    // Actualizar referencias
    previousIsPlayingRef.current = isPlaying;
    previousIsPausedRef.current = isPaused;
    previousIsGameOverRef.current = isGameOver;
  }, [gameState.gameState, isPaused, isGameOver, playBackgroundMusic, resumeBackgroundMusic, pauseBackgroundMusic, stopBackgroundMusic]);
  
  // Detener música al desmontar
  useEffect(() => {
    return () => {
      if (musicStartedRef.current) {
        console.log('[GameView] Desmontando componente - Deteniendo música');
        stopBackgroundMusic();
      }
    };
  }, []);

  // Detectar cuando una pieza se fija (lockea) - cuando cambia el tipo de pieza
  useEffect(() => {
    if (gameState.currentPiece.type !== previousPieceTypeRef.current && previousPieceTypeRef.current !== null) {
      // Una nueva pieza ha aparecido, significa que la anterior se fijó
      playDrop();
    }
    previousPieceTypeRef.current = gameState.currentPiece.type;
  }, [gameState.currentPiece.type, playDrop]);

  // Detectar cuando se completan líneas
  useEffect(() => {
    if (gameState.lines > previousLinesRef.current) {
      playLineClear();
    }
    previousLinesRef.current = gameState.lines;
  }, [gameState.lines, playLineClear]);

  // Detectar cuando sube de nivel
  useEffect(() => {
    if (gameState.level > previousLevelRef.current) {
      playLevelUp();
    }
    previousLevelRef.current = gameState.level;
  }, [gameState.level, playLevelUp]);

  // Detectar cambio a game over y reproducir sonido
  useEffect(() => {
    if (isGameOver && previousGameStateRef.current !== GAME_STATES.GAME_OVER) {
      playGameOver();
    }
    previousGameStateRef.current = gameState.gameState;
  }, [isGameOver, gameState.gameState, playGameOver]);

  // Limpiar intervalos cuando el juego no está en PLAYING
  useEffect(() => {
    if (isGameOver || isPaused) {
      handleButtonUp();
    }
  }, [isGameOver, isPaused]);

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Función para manejar el inicio de la presión
  const handleButtonDown = useCallback((action) => {
    // No permitir si el juego está pausado o terminado
    if (isGameOver || isPaused) return;
    
    isLongPressRef.current = false;
    setPressedButton(action);
    
    // Retraso para detectar si es un press largo
    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      
      // Reproducir sonido según la acción
      if (action === 'ROTATE') {
        playRotate();
      } else if (action === 'MOVE_LEFT' || action === 'MOVE_RIGHT') {
        playButtonClick();
      }
      
      // Ejecutar la primera vez al empezar el long press
      onControl(action);
      
      // Intervalo de repetición
      intervalRef.current = setInterval(() => {
        // Reproducir sonido en cada repetición
        if (action === 'ROTATE') {
          playRotate();
        } else if (action === 'MOVE_LEFT' || action === 'MOVE_RIGHT') {
          playButtonClick();
        }
        onControl(action);
      }, 80); // Repetir cada 80ms
    }, 400); // Esperar 400ms para considerar que es un long press
  }, [onControl, isGameOver, isPaused, playRotate, playButtonClick]);

  // Función para manejar el fin de la presión
  const handleButtonUp = useCallback(() => {
    setPressedButton(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  // Función para manejar el click (solo si no fue long press)
  const handleButtonClick = useCallback((action) => {
    // No permitir si el juego está pausado o terminado
    if (isGameOver || isPaused) return;
    
    // Solo ejecutar si no fue un long press
    if (!isLongPressRef.current) {
      // Reproducir sonido según la acción
      if (action === 'ROTATE') {
        playRotate();
      } else if (action === 'MOVE_LEFT' || action === 'MOVE_RIGHT') {
        playButtonClick();
      }
      onControl(action);
    }
  }, [onControl, isGameOver, isPaused, playRotate, playButtonClick]);

  return (
    <div style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      backgroundColor: colors.background, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      paddingTop: '100px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Botón Home */}
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-game'}
        onClick={() => {
          // Pausar el juego antes de ir al menú
          if (gameState.gameState === GAME_STATES.PLAYING) {
            onPause();
          }
          onNavigate('menu');
        }}
        onMouseEnter={() => setHoveredButton('home-game')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Logo */}
      <img 
        src={logo} 
        alt="TETRIS" 
        style={{ 
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          maxWidth: '50vw',
          height: 'auto',
          imageRendering: 'pixelated',
          filter: `drop-shadow(0 0 15px ${colors.border})`
        }} 
      />

      {/* Botones de Control - Pausa y Reinicio */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        display: 'flex',
        gap: '8px'
      }}>
        <IconButton
          size="small"
          variant="accent"
          isHovered={hoveredButton === 'pause'}
          onClick={() => {
            playButtonClick();
            onPause();
          }}
          onMouseEnter={() => setHoveredButton('pause')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {isPaused ? (
            <Play size={24} weight="fill" color={colors.textPrimary} />
          ) : (
            <Pause size={24} weight="fill" color={colors.textPrimary} />
          )}
        </IconButton>

        <IconButton
          size="small"
          variant="warning"
          isHovered={hoveredButton === 'restart'}
          onClick={() => {
            playButtonClick();
            onRestart();
          }}
          onMouseEnter={() => setHoveredButton('restart')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <ArrowCounterClockwise size={24} weight="bold" color={colors.textPrimary} />
        </IconButton>
      </div>

      {/* Marcador Superior */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '10px',
        marginTop: '5px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        padding: '0 10px'
      }}>
        <ScorePanel type="small" label="LEVEL" value={gameState.level} />
        
        <ScorePanel type="next" label="NEXT">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '3px',
            justifyContent: 'center'
          }}>
            <NextPiecePreview nextPiece={gameState.nextPiece} />
          </div>
        </ScorePanel>

        <ScorePanel type="small" label="SCORE" value={gameState.score} />
      </div>

      {/* Game Board */}
      <GameBoard gameState={gameState} />

      {/* Controles */}
      <div style={{
        width: '100%',
        maxWidth: '350px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        {/* Flechas de movimiento */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => handleButtonClick('MOVE_LEFT')}
            onMouseDown={() => handleButtonDown('MOVE_LEFT')}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={() => handleButtonDown('MOVE_LEFT')}
            onTouchEnd={handleButtonUp}
            onTouchCancel={handleButtonUp}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: pressedButton === 'MOVE_LEFT' ? colors.accent : colors.panel,
              border: `3px solid ${pressedButton === 'MOVE_LEFT' ? colors.hover : colors.border}`,
              color: colors.textPrimary,
              fontSize: '40px',
              cursor: 'pointer',
              boxShadow: pressedButton === 'MOVE_LEFT'
                ? `0 0 20px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
                : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s ease',
              transform: pressedButton === 'MOVE_LEFT' ? 'scale(0.95)' : 'scale(1)',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}>
            ◄
          </button>

          <button 
            onClick={() => handleButtonClick('MOVE_RIGHT')}
            onMouseDown={() => handleButtonDown('MOVE_RIGHT')}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={() => handleButtonDown('MOVE_RIGHT')}
            onTouchEnd={handleButtonUp}
            onTouchCancel={handleButtonUp}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: pressedButton === 'MOVE_RIGHT' ? colors.accent : colors.panel,
              border: `3px solid ${pressedButton === 'MOVE_RIGHT' ? colors.hover : colors.border}`,
              color: colors.textPrimary,
              fontSize: '40px',
              cursor: 'pointer',
              boxShadow: pressedButton === 'MOVE_RIGHT'
                ? `0 0 20px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
                : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s ease',
              transform: pressedButton === 'MOVE_RIGHT' ? 'scale(0.95)' : 'scale(1)',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}>
            ►
          </button>
        </div>

        {/* Botón de Rotación */}
        <button 
          onClick={() => handleButtonClick('ROTATE')}
          onMouseDown={() => handleButtonDown('ROTATE')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
          onTouchStart={() => handleButtonDown('ROTATE')}
          onTouchEnd={handleButtonUp}
          onTouchCancel={handleButtonUp}
          style={{
            flex: '1',
            height: '80px',
            backgroundColor: pressedButton === 'ROTATE' ? colors.accent : colors.panel,
            border: `3px solid ${pressedButton === 'ROTATE' ? colors.hover : colors.border}`,
            color: colors.textPrimary,
            fontSize: '10px',
            fontFamily: "'Press Start 2P', cursive",
            cursor: 'pointer',
            boxShadow: pressedButton === 'ROTATE'
              ? `0 0 20px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
              : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.1s ease',
            letterSpacing: '1px',
            marginLeft: '15px',
            transform: pressedButton === 'ROTATE' ? 'scale(0.95)' : 'scale(1)',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none'
          }}>
          <div style={{ fontSize: '28px' }}>↻</div>
          <div>ROTATE</div>
        </button>
      </div>

      {/* Botón FAST */}
      <div style={{
        width: '100%',
        maxWidth: '350px',
        padding: '0 20px',
        marginTop: '15px'
      }}>
        <button 
          onMouseDown={() => setIsFastMode(true)}
          onMouseUp={() => setIsFastMode(false)}
          onMouseLeave={() => setIsFastMode(false)}
          onTouchStart={() => setIsFastMode(true)}
          onTouchEnd={() => setIsFastMode(false)}
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: isFastMode ? colors.warning : colors.panel,
            border: `3px solid ${isFastMode ? colors.hover : colors.border}`,
            color: colors.textPrimary,
            fontSize: '14px',
            fontFamily: "'Press Start 2P', cursive",
            cursor: 'pointer',
            boxShadow: isFastMode 
              ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}40` 
              : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.1s ease',
            letterSpacing: '3px',
            transform: isFastMode ? 'scale(0.98)' : 'scale(1)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}>
          FAST ▼▼▼
        </button>
      </div>

      {/* Modales */}
      {isPaused && (
        <PauseModal 
          onResume={onPause}
          onMenu={() => onNavigate('menu')}
        />
      )}

      {isGameOver && (
        <GameOverModal 
          score={gameState.score}
          level={gameState.level}
          gameSessionId={gameSessionId}
          onRestart={onRestart}
          onMenu={() => onNavigate('menu')}
        />
      )}
    </div>
  );
};

export default GameView;
