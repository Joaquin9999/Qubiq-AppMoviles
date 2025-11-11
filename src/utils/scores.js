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
    
    // Añadir la nueva puntuación con la fecha/hora actual
    const newScore = {
      ...scoreData,
      date: new Date().toISOString(),
      id: Date.now() // Usamos el timestamp como ID único
    };
    
    // Ordenar las puntuaciones (de mayor a menor) y mantener solo las mejores
    const updatedScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES);
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
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
