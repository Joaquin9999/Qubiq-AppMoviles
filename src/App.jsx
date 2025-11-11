import { useState, useEffect, useRef } from 'react';
import { startGame, handlePlayerAction, GAME_STATES } from './tetrisLogic';
import { useGameLoop } from './hooks/useGameLoop';
import { AudioProvider } from './contexts/AudioContext';

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
  const [gameSessionId, setGameSessionId] = useState(null); // ID único por sesión de juego
  
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
      // Generar un ID único para esta sesión de juego
      setGameSessionId(`game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
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
    // Generar un nuevo ID de sesión para la nueva partida
    setGameSessionId(`game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  };

  // Verificar si hay una partida en progreso
  const hasGameInProgress = gameState && gameState.gameState === GAME_STATES.PAUSED;

  // Renderizado condicional de vistas
  const renderView = () => {
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
          gameSessionId={gameSessionId}
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
  };

  return (
    <AudioProvider>
      {renderView()}
    </AudioProvider>
  );
}

export default App;
