import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

// Importar los archivos de audio
import buttonClickSound from '../assets/audio/music/button-click.mp3';
import dropSound from '../assets/audio/music/drop.mp3';
import gameOverSound from '../assets/audio/music/game-over.mp3';
import levelUpSound from '../assets/audio/music/level-up.mp3';
import lineClearSound from '../assets/audio/music/line-clear.mp3';
import rotateSound from '../assets/audio/music/rotate.mp3';
import tetrisSound from '../assets/audio/music/tetris.mp3';

const AudioContext = createContext();

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
};

// Alias for convenience
export const useAudio = useAudioContext;

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Referencias a los audios de efectos (pool de 3 instancias por sonido)
  const audioRefs = useRef({
    buttonClick: [],
    drop: [],
    gameOver: [],
    levelUp: [],
    lineClear: [],
    rotate: [],
  });
  
  // Flag para saber si ya se inicializaron los audios
  const audioInitialized = useRef({
    buttonClick: false,
    drop: false,
    gameOver: false,
    levelUp: false,
    lineClear: false,
    rotate: false,
  });
  
  // URLs de los sonidos
  const audioUrls = useRef({
    buttonClick: buttonClickSound,
    drop: dropSound,
    gameOver: gameOverSound,
    levelUp: levelUpSound,
    lineClear: lineClearSound,
    rotate: rotateSound,
  });

  // Referencia separada para la música de fondo
  const backgroundMusicRef = useRef(null);

  // Inicializar solo la música de fondo al inicio
  useEffect(() => {
    // Música de fondo - inicializar solo una vez
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Audio(tetrisSound);
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = volume * 0.3;
      backgroundMusicRef.current.preload = 'auto';
      
      // Importante: cargar todo el archivo antes de reproducir
      backgroundMusicRef.current.load();
      
      console.log('[AudioContext] Background music initialized with loop=true');
    }

    return () => {
      // Limpiar audios al desmontar
      Object.values(audioRefs.current).forEach(audioArray => {
        audioArray.forEach(audio => {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
      });
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Actualizar volumen cuando cambia
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audioArray => {
      audioArray.forEach(audio => {
        if (audio) audio.volume = isMuted ? 0 : volume;
      });
    });
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = isMuted ? 0 : volume * 0.3;
    }
  }, [volume, isMuted]);

  const playSound = useCallback((soundName) => {
    if (isMuted) return;
    
    // Inicializar el pool de audios si no existe (lazy loading)
    if (!audioInitialized.current[soundName]) {
      console.log(`[AudioContext] Lazy loading audio pool for: ${soundName}`);
      audioRefs.current[soundName] = [];
      
      const poolSize = 3;
      for (let i = 0; i < poolSize; i++) {
        const audio = new Audio();
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Establecer src DESPUÉS de configurar el audio
        audio.src = audioUrls.current[soundName];
        
        // Agregar evento de error para debugging
        audio.addEventListener('error', (e) => {
          console.error(`[AudioContext] Error loading ${soundName} instance ${i}:`, e, audio.error);
          if (audio.error) {
            console.error(`[AudioContext] Error details - code: ${audio.error.code}, message: ${audio.error.message}`);
          }
        });
        
        // Agregar evento de carga exitosa
        audio.addEventListener('loadeddata', () => {
          console.log(`[AudioContext] ${soundName} instance ${i} loaded successfully`);
        });
        
        audioRefs.current[soundName].push(audio);
      }
      
      audioInitialized.current[soundName] = true;
      console.log(`[AudioContext] Created ${poolSize} instances of ${soundName}`);
    }
    
    const audioPool = audioRefs.current[soundName];
    if (audioPool && audioPool.length > 0) {
      // Buscar un audio que no esté reproduciendo y esté listo
      let availableAudio = audioPool.find(audio => audio.paused && audio.readyState >= 2);
      
      // Si no hay ninguno listo, buscar el primero que esté pausado (aunque no esté completamente cargado)
      if (!availableAudio) {
        availableAudio = audioPool.find(audio => audio.paused);
      }
      
      // Si todos están ocupados, usar el primero y reiniciarlo
      if (!availableAudio) {
        availableAudio = audioPool[0];
      }
      
      // Reiniciar el tiempo solo si está reproduciendo o ya empezó
      if (availableAudio.currentTime > 0) {
        availableAudio.currentTime = 0;
      }
      
      availableAudio.volume = isMuted ? 0 : volume;
      
      console.log(`[AudioContext] Attempting to play ${soundName} - readyState: ${availableAudio.readyState}, paused: ${availableAudio.paused}, src: ${availableAudio.src ? 'set' : 'not set'}`);
      
      // Función para intentar reproducir
      const attemptPlay = () => {
        availableAudio.play()
          .then(() => {
            console.log(`[AudioContext] Successfully playing ${soundName}`);
          })
          .catch(err => {
            console.warn(`Failed to play sound ${soundName}:`, err.message || err);
            
            // Si falla, intentar recargar y reproducir de nuevo
            if (availableAudio.readyState < 2) {
              console.log(`[AudioContext] Reloading ${soundName} and retrying...`);
              availableAudio.load();
              
              // Esperar un momento y reintentar
              setTimeout(() => {
                if (availableAudio.readyState >= 2) {
                  availableAudio.play().catch(retryErr => {
                    console.error(`[AudioContext] Retry failed for ${soundName}:`, retryErr);
                  });
                }
              }, 100);
            }
          });
      };
      
      // Verificar si el audio está listo para reproducir
      if (availableAudio.readyState >= 2) {
        // El audio está listo, reproducir inmediatamente
        attemptPlay();
      } else {
        // El audio no está listo, esperar a que se cargue
        console.log(`[AudioContext] Waiting for ${soundName} to load...`);
        
        const handleCanPlay = () => {
          console.log(`[AudioContext] ${soundName} loaded, playing now`);
          attemptPlay();
        };
        
        availableAudio.addEventListener('canplaythrough', handleCanPlay, { once: true });
        
        // Forzar la carga si no se ha iniciado
        if (availableAudio.readyState === 0 || !availableAudio.src) {
          if (!availableAudio.src) {
            availableAudio.src = audioUrls.current[soundName];
          }
          availableAudio.load();
        }
        
        // Timeout de seguridad - intentar reproducir después de 200ms
        setTimeout(() => {
          if (availableAudio.paused && availableAudio.readyState >= 1) {
            console.log(`[AudioContext] Timeout fallback for ${soundName}`);
            attemptPlay();
          }
        }, 200);
      }
    } else {
      console.warn(`[AudioContext] Audio pool not found: ${soundName}`);
    }
  }, [isMuted, volume]);

  const playBackgroundMusic = useCallback(() => {
    if (!backgroundMusicRef.current || isMuted) {
      console.log('[AudioContext] Background music not available or muted');
      return;
    }
    
    // Solo iniciar si no está reproduciendo
    if (backgroundMusicRef.current.paused) {
      // Asegurar que el loop esté activado
      backgroundMusicRef.current.loop = true;
      
      // Esperar a que esté listo para reproducir
      if (backgroundMusicRef.current.readyState >= 2) {
        console.log(`[AudioContext] Starting background music (loop: ${backgroundMusicRef.current.loop}, currentTime: ${backgroundMusicRef.current.currentTime}, readyState: ${backgroundMusicRef.current.readyState})`);
        
        backgroundMusicRef.current.play().catch(err => {
          console.warn('Failed to play background music:', err);
        });
        setIsMusicPlaying(true);
      } else {
        console.log('[AudioContext] Waiting for background music to load...');
        backgroundMusicRef.current.addEventListener('canplay', () => {
          console.log('[AudioContext] Background music loaded, starting playback');
          backgroundMusicRef.current.play().catch(err => {
            console.warn('Failed to play background music after load:', err);
          });
          setIsMusicPlaying(true);
        }, { once: true });
      }
    } else {
      console.log('[AudioContext] Background music already playing, skipping play() call');
    }
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    setIsMusicPlaying(false);
  }, []);

  const pauseBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
    setIsMusicPlaying(false);
  }, []);

  const resumeBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && !isMuted) {
      // Solo reanudar si está pausada
      if (backgroundMusicRef.current.paused) {
        // Asegurar que el loop esté activado
        backgroundMusicRef.current.loop = true;
        console.log(`[AudioContext] Resuming background music (loop: ${backgroundMusicRef.current.loop}, currentTime: ${backgroundMusicRef.current.currentTime})`);
        
        backgroundMusicRef.current.play().catch(err => {
          console.warn('Failed to resume background music:', err);
        });
        setIsMusicPlaying(true);
      } else {
        console.log('[AudioContext] Background music already playing, skipping resume');
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const changeVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const value = {
    playSound,
    toggleMute,
    changeVolume,
    isMuted,
    volume,
    isMusicPlaying,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    // Funciones específicas para cada sonido
    playButtonClick: () => playSound('buttonClick'),
    playDrop: () => playSound('drop'),
    playGameOver: () => playSound('gameOver'),
    playLevelUp: () => playSound('levelUp'),
    playLineClear: () => playSound('lineClear'),
    playRotate: () => playSound('rotate'),
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
