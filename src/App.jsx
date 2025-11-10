import { useState, useEffect } from 'react';
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

  // Custom hook para el game loop
  useGameLoop(gameState, setGameState, isFastMode);

  // Iniciar juego cuando se entra a la vista de juego
  useEffect(() => {
    if (currentView === 'game' && !gameState) {
      console.log('🎮 App.jsx: Iniciando nuevo juego desde useEffect');
      const newGame = startGame();
      setGameState(newGame);
    }
  }, [currentView, gameState]);

  // Handlers
  const handleNavigate = (view) => {
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
    console.log('🔄 App.jsx: Reiniciando juego desde handleRestart');
    setIsFastMode(false);
    const newGame = startGame();
    setGameState(newGame);
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
