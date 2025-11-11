import { useRef, useEffect, useState } from 'react';

/**
 * Hook personalizado para manejar audio en el juego
 * @param {string} src - Ruta del archivo de audio
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Controles del audio
 */
export const useAudio = (src, options = {}) => {
  const {
    volume = 1.0,
    loop = false,
    autoplay = false
  } = options;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Crear el elemento de audio
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;

    // Event listeners
    const handleCanPlay = () => setIsLoaded(true);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener('canplaythrough', handleCanPlay);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    if (autoplay && isLoaded) {
      audioRef.current.play().catch(err => {
        console.warn('Autoplay prevented:', err);
      });
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
    };
  }, [src, volume, loop, autoplay, isLoaded]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Play failed:', err);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
    isLoaded
  };
};

/**
 * Hook para manejar efectos de sonido
 * @param {string} src - Ruta del archivo de audio
 * @returns {Function} - Función para reproducir el sonido
 */
export const useSoundEffect = (src) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = 0.5; // Volumen moderado por defecto

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src]);

  const play = () => {
    if (audioRef.current) {
      // Reiniciar el audio si ya está sonando
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Sound effect play failed:', err);
      });
    }
  };

  return play;
};
