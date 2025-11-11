// Utilidad para manejar el almacenamiento de puntuaciones

const SCORES_KEY = 'tetris_high_scores';
const MAX_SCORES = 10; // Número máximo de puntuaciones a guardar

// Obtener todas las puntuaciones guardadas
export const getScores = () => {
  try {
    const scores = localStorage.getItem(SCORES_KEY);
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error al obtener las puntuaciones:', error);
    return [];
  }
};

// Guardar una nueva puntuación
export const saveScore = (scoreData) => {
  try {
    const scores = getScores();
    
    // Verificar que tengamos un gameSessionId
    if (!scoreData.gameSessionId) {
      console.error('[saveScore] No se proporcionó gameSessionId');
      return scores;
    }
    
    // Verificar si este gameSessionId ya fue guardado
    const alreadySaved = scores.some(s => s.gameSessionId === scoreData.gameSessionId);
    if (alreadySaved) {
      console.log(`[saveScore] Score con session ID ${scoreData.gameSessionId} ya existe, no se guardará duplicado`);
      return scores;
    }
    
    // Añadir la nueva puntuación con la fecha/hora actual
    const newScore = {
      ...scoreData,
      date: new Date().toISOString(),
      id: Date.now() + Math.random(), // ID único para React keys
      gameEndTime: Date.now() // Timestamp para referencia
    };
    
    console.log('[saveScore] Guardando nuevo score:', newScore);
    
    // Ordenar las puntuaciones (de mayor a menor) y mantener solo las mejores
    const updatedScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES);
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
    console.log(`[saveScore] Total de scores guardados: ${updatedScores.length}`);
    return updatedScores;
  } catch (error) {
    console.error('Error al guardar la puntuación:', error);
    return [];
  }
};

// Formatear la fecha para mostrarla
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Limpiar duplicados del localStorage
export const cleanDuplicateScores = () => {
  try {
    const scores = getScores();
    
    // Eliminar duplicados basándose en gameSessionId (es único por partida)
    const uniqueScores = [];
    const seenSessions = new Set();
    
    for (const score of scores) {
      // Si tiene gameSessionId, usarlo como identificador único
      if (score.gameSessionId) {
        if (!seenSessions.has(score.gameSessionId)) {
          seenSessions.add(score.gameSessionId);
          uniqueScores.push(score);
        } else {
          console.log('[cleanDuplicateScores] Duplicado removido por sessionId:', score);
        }
      } else {
        // Para scores antiguos sin gameSessionId, usar la lógica anterior
        // basada en score y timestamp
        const roundedTime = Math.floor((score.gameEndTime || 0) / 1000);
        const key = `${score.score}-${roundedTime}`;
        
        if (!seenSessions.has(key)) {
          seenSessions.add(key);
          uniqueScores.push(score);
        } else {
          console.log('[cleanDuplicateScores] Duplicado removido por score/time:', score);
        }
      }
    }
    
    // Ordenar y guardar
    const cleanedScores = uniqueScores
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES);
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(cleanedScores));
    console.log(`[cleanDuplicateScores] Limpieza completada. Scores antes: ${scores.length}, después: ${cleanedScores.length}`);
    return cleanedScores;
  } catch (error) {
    console.error('Error al limpiar duplicados:', error);
    return [];
  }
};

// Limpiar todos los scores (útil para desarrollo/testing)
export const clearAllScores = () => {
  try {
    localStorage.removeItem(SCORES_KEY);
    console.log('Todos los scores han sido eliminados');
    return [];
  } catch (error) {
    console.error('Error al limpiar scores:', error);
    return [];
  }
};
