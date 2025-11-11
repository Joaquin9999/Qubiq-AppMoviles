// Clave para almacenar las puntuaciones en localStorage
const SCORES_KEY = 'tetris_highscores';
const MAX_SCORES = 10; // Número máximo de puntuaciones a guardar

/**
 * Obtiene las puntuaciones guardadas
 * @returns {Array} Array de puntuaciones ordenadas de mayor a menor
 */
export const getScores = () => {
  try {
    const scores = localStorage.getItem(SCORES_KEY);
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error al cargar las puntuaciones:', error);
    return [];
  }
};

/**
 * Guarda una nueva puntuación
 * @param {string} player - Nombre del jugador
 * @param {number} score - Puntuación obtenida
 * @param {number} level - Nivel alcanzado
 * @param {number} lines - Líneas completadas
 * @returns {Array} Nuevo array de puntuaciones ordenado
 */
export const saveScore = (player, score, level, lines) => {
  try {
    const scores = getScores();
    const newScore = { 
      id: Date.now(),
      player: player.toUpperCase().substring(0, 8), // Limitar a 8 caracteres
      score: Math.max(0, Math.floor(score)),
      level: Math.max(1, Math.floor(level)),
      lines: Math.max(0, Math.floor(lines)),
      date: new Date().toISOString()
    };

    // Añadir la nueva puntuación y ordenar por puntuación (de mayor a menor)
    const updatedScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score || b.level - a.level)
      .slice(0, MAX_SCORES); // Mantener solo las mejores puntuaciones

    localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
    return updatedScores;
  } catch (error) {
    console.error('Error al guardar la puntuación:', error);
    return [];
  }
};

/**
 * Formatea una puntuación para mostrarla
 * @param {number} score - Puntuación a formatear
 * @returns {string} Puntuación formateada con separadores de miles
 */
export const formatScore = (score) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Obtiene la posición de un jugador en el ranking
 * @param {string} player - Nombre del jugador
 * @returns {number} Posición en el ranking (1-based) o -1 si no está en el ranking
 */
export const getPlayerRank = (player) => {
  const scores = getScores();
  const playerName = player.toUpperCase();
  return scores.findIndex(score => score.player === playerName) + 1;
};

/**
 * Limpia todas las puntuaciones guardadas
 */
export const clearScores = () => {
  try {
    localStorage.removeItem(SCORES_KEY);
    return true;
  } catch (error) {
    console.error('Error al limpiar las puntuaciones:', error);
    return false;
  }
};
