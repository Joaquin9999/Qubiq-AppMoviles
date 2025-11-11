# 🎵 Audio Assets

Esta carpeta contiene todos los archivos de audio del juego Quibic.

## 📁 Estructura

### `music/`
Música de fondo para las diferentes pantallas del juego:
- Música del menú principal
- Música durante el gameplay
- Música de game over
- Etc.

**Formatos recomendados:** `.mp3`, `.ogg`, `.m4a`

### `sfx/` (Sound Effects)
Efectos de sonido para las interacciones del juego:
- Sonido de rotación de pieza
- Sonido de movimiento de pieza
- Sonido de línea completada
- Sonido de game over
- Sonido de botones
- Etc.

**Formatos recomendados:** `.mp3`, `.ogg`, `.wav`

## 💡 Uso

Para importar archivos de audio en los componentes:

```javascript
// Música
import backgroundMusic from '../assets/audio/music/background.mp3';

// Efectos de sonido
import moveSound from '../assets/audio/sfx/move.mp3';
import rotateSound from '../assets/audio/sfx/rotate.mp3';

// Usar con el reproductor de audio
const audio = new Audio(moveSound);
audio.play();
```

## 📝 Notas

- Los archivos `.mp3` tienen mejor compatibilidad cross-platform
- Mantén los archivos de audio lo más pequeños posible para reducir el tamaño de la app
- Considera usar archivos comprimidos para música de fondo
- Los efectos de sonido deben ser cortos (< 2 segundos generalmente)
