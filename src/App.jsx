import { useState } from 'react'
import { House, Trophy, GameController, Question } from 'phosphor-react'

function App() {
  const [currentView, setCurrentView] = useState('splash')

  const buttonStyle = {
    width: '100%',
    padding: '18px 0',
    backgroundColor: 'white',
    border: '3px solid black',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: 'normal',
    cursor: 'pointer',
    color: 'black'
  }

  const homeButtonStyle = {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '60px',
    height: '60px',
    backgroundColor: 'white',
    border: '3px solid black',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0'
  }

  const handleSplashClick = () => {
    setCurrentView('menu')
  }

  // SPLASH SCREEN - Pantalla de bienvenida
  if (currentView === 'splash') {
    return (
      <div 
        onClick={handleSplashClick}
        style={{ 
          height: '100vh', 
          maxHeight: '100vh',
          backgroundColor: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: 'black',
          marginBottom: '20px',
          animation: 'fadeIn 1s ease-in'
        }}>
          TETRIS
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#666',
          textAlign: 'center',
          marginTop: '20px',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          TAP TO START
        </p>
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: '#999'
        }}>
          v1.0.0
        </div>
      </div>
    )
  }

  // HOME - Vista del menú principal
  if (currentView === 'menu') {
    return (
      <div style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 40px',
        overflow: 'hidden'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '50px',
            color: 'black',
            margin: '0 0 50px 0'
          }}>
            TETRIS
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button style={buttonStyle} onClick={() => setCurrentView('game')}>
              <GameController size={24} weight="bold" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
              PLAY
            </button>

            <button style={buttonStyle} onClick={() => setCurrentView('highscores')}>
              <Trophy size={24} weight="bold" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
              HIGH SCORES
            </button>

            <button style={buttonStyle} onClick={() => setCurrentView('instructions')}>
              <Question size={24} weight="bold" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }} />
              INSTRUCTIONS
            </button>
          </div>
        </div>
      </div>
    )
  }

  // GAME - Vista del juego
  if (currentView === 'game') {
    return (
      <div style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button style={homeButtonStyle} onClick={() => setCurrentView('menu')}>
          <House size={32} weight="bold" color="black" />
        </button>

        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: 'black'
        }}>
          GAME
        </h1>
      </div>
    )
  }

  // HIGH SCORES - Tabla de mejores puntuaciones
  if (currentView === 'highscores') {
    return (
      <div style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button style={homeButtonStyle} onClick={() => setCurrentView('menu')}>
          <House size={32} weight="bold" color="black" />
        </button>

        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: 'black'
        }}>
          HIGH SCORES
        </h1>
      </div>
    )
  }

  // INSTRUCTIONS - Instrucciones del juego
  if (currentView === 'instructions') {
    return (
      <div style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button style={homeButtonStyle} onClick={() => setCurrentView('menu')}>
          <House size={32} weight="bold" color="black" />
        </button>

        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: 'black'
        }}>
          INSTRUCTIONS
        </h1>
      </div>
    )
  }
}

export default App
