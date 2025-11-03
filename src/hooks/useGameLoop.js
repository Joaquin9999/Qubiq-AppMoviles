import { useEffect, useRef } from 'react';
import { gameTick, getDropSpeed, GAME_STATES } from '../tetrisLogic';

/**
 * Custom hook para manejar el loop del juego (caída automática de piezas)
 * @param {Object} gameState - Estado actual del juego
 * @param {Function} setGameState - Función para actualizar el estado del juego
 * @param {boolean} isFastMode - Si el modo rápido está activado
 */
export const useGameLoop = (gameState, setGameState, isFastMode) => {
  const gameLoopRef = useRef(null);

  useEffect(() => {
    // Solo ejecutar el loop si el juego está en estado PLAYING
    if (!gameState || gameState.gameState !== GAME_STATES.PLAYING) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Calcular velocidad: 50ms en modo rápido, velocidad normal según nivel
    const dropSpeed = isFastMode ? 50 : getDropSpeed(gameState.level);
    
    // Iniciar el intervalo para la caída automática
    gameLoopRef.current = setInterval(() => {
      setGameState(prevState => gameTick(prevState));
    }, dropSpeed);

    // Cleanup: limpiar el intervalo cuando el componente se desmonte o cambien las dependencias
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState?.gameState, gameState?.level, isFastMode, setGameState]);

  return gameLoopRef;
};
