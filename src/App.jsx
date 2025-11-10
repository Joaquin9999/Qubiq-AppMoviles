import { useState, useEffect, useRef } from 'react';
import { startGame, handlePlayerAction, GAME_STATES } from './tetrisLogic';
import { useGameLoop } from './hooks/useGameLoop';

// Vistas
import SplashScreen from './views/SplashScreen';
import MenuView from './views/MenuView';
import GameView from './views/GameView';
import HighScoresView from './views/HighScoresView';
import InstructionsView from './views/InstructionsView';

function App() {
  // Estado de navegación
  const [currentView, setCurrentView] = useState('splash');
  const [hoveredButton, setHoveredButton] = useState(null);
  
  // Estado del juego
  const [gameState, setGameState] = useState(null);
  const [isFastMode, setIsFastMode] = useState(false);
  
  // Ref para evitar doble inicialización en StrictMode
  const gameInitialized = useRef(false);

  // Custom hook para el game loop
  useGameLoop(gameState, setGameState, isFastMode);

  // Iniciar juego cuando se entra a la vista de juego
  useEffect(() => {
    if (currentView === 'game' && !gameState && !gameInitialized.current) {
      gameInitialized.current = true;
      const newGame = startGame();
      setGameState(newGame);
    }
  }, [currentView, gameState]);

  // Handlers
  const handleNavigate = (view) => {
    // Resetear el flag cuando salimos de la vista de juego
    if (currentView === 'game' && view !== 'game') {
      gameInitialized.current = false;
    }
    setCurrentView(view);
  };

  const handleControl = (action) => {
    if (!gameState || gameState.gameState !== GAME_STATES.PLAYING) return;
    setGameState(prevState => handlePlayerAction(action, prevState));
  };

  const handlePause = () => {
    if (!gameState) return;
    setGameState(prevState => ({
      ...prevState,
      gameState: prevState.gameState === GAME_STATES.PLAYING 
        ? GAME_STATES.PAUSED 
        : GAME_STATES.PLAYING
    }));
  };

  const handleRestart = () => {
    setIsFastMode(false);
    gameInitialized.current = false;
    const newGame = startGame();
    setGameState(newGame);
    gameInitialized.current = true;
  };

  // Verificar si hay una partida en progreso
  const hasGameInProgress = gameState && gameState.gameState === GAME_STATES.PAUSED;

  // Renderizado condicional de vistas
  if (currentView === 'splash') {
    return <SplashScreen onStart={() => handleNavigate('menu')} />;
  }

  if (currentView === 'menu') {
    return (
      <MenuView 
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        onNavigate={handleNavigate}
        hasGameInProgress={hasGameInProgress}
      />
    );
  }

  if (currentView === 'game') {
    return (
      <GameView
        gameState={gameState}
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        isFastMode={isFastMode}
        setIsFastMode={setIsFastMode}
        onNavigate={handleNavigate}
        onPause={handlePause}
        onRestart={handleRestart}
        onControl={handleControl}
      />
    );
  }

  if (currentView === 'highscores') {
    return (
      <HighScoresView 
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'instructions') {
    return (
      <InstructionsView 
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        onNavigate={handleNavigate}
      />
    );
  }

  return null;
}

export default App;
