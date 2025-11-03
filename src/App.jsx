import { useState } from 'react'
import { House, Trophy, GameController, Question } from 'phosphor-react'
import logo from './assets/logo.png'

function App() {
  const [currentView, setCurrentView] = useState('splash')
  const [hoveredButton, setHoveredButton] = useState(null)

  // Paleta de colores
  const colors = {
    background: '#0A0A0A',        // Negro profundo
    panel: '#1B1C1E',             // Azul grisáceo oscuro
    border: '#B026FF',            // Púrpura neón vibrante
    primary: '#FF595E',           // Rojo coral
    secondary: '#1982C4',         // Azul neón
    hover: '#00FFFF',             // Cian brillante
    disabled: '#555A60',          // Gris metálico
    textPrimary: '#FFFFFF',       // Blanco puro
    textSecondary: '#C5C6C7',     // Gris claro
    accent: '#FF7A00',            // Naranja vibrante
    warning: '#FF1053'            // Rosa neón
  }

  const buttonStyle = {
    width: '100%',
    padding: '18px 20px',
    backgroundColor: colors.panel,
    border: `4px solid ${colors.border}`,
    borderRadius: '0px',
    fontSize: '14px',
    fontWeight: 'normal',
    cursor: 'pointer',
    color: colors.textPrimary,
    transition: 'all 0.2s ease',
    boxShadow: `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
    fontFamily: "'Press Start 2P', cursive",
    letterSpacing: '2px',
    textTransform: 'uppercase',
    imageRendering: 'pixelated',
    animation: 'slideIn 0.5s ease-out'
  }

  const homeButtonStyle = {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '60px',
    height: '60px',
    backgroundColor: colors.panel,
    border: `4px solid ${colors.border}`,
    borderRadius: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0',
    transition: 'all 0.2s ease',
    boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
    animation: 'pixelBounce 2s ease-in-out infinite'
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
          backgroundColor: colors.background, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
        {/* Marco retro tipo tablero de Tetris */}
        <div style={{
          border: `6px solid ${colors.border}`,
          padding: '40px 60px',
          backgroundColor: colors.background,
          boxShadow: `0 0 30px ${colors.border}, inset 0 0 20px ${colors.border}30`,
          position: 'relative'
        }}>
          {/* Grid decorativo superior */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 40px)',
            gap: '8px',
            marginBottom: '30px',
            justifyContent: 'center'
          }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: '40px',
                height: '10px',
                backgroundColor: colors.panel,
                border: `2px solid ${colors.border}`,
                boxShadow: `0 0 8px ${colors.border}60`
              }} />
            ))}
          </div>

          <img 
            src={logo} 
            alt="TETRIS" 
            style={{ 
              width: '300px',
              maxWidth: '80vw',
              height: 'auto',
              marginBottom: '30px',
              animation: 'fadeIn 1s ease-in',
              imageRendering: 'pixelated',
              filter: `drop-shadow(0 0 20px ${colors.border})`
            }} 
          />

          {/* Grid decorativo inferior */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 40px)',
            gap: '8px',
            marginTop: '30px',
            marginBottom: '20px',
            justifyContent: 'center'
          }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: '40px',
                height: '10px',
                backgroundColor: colors.panel,
                border: `2px solid ${colors.border}`,
                boxShadow: `0 0 8px ${colors.border}60`
              }} />
            ))}
          </div>
        </div>

        <p style={{ 
          fontSize: '12px', 
          color: colors.hover,
          textAlign: 'center',
          marginTop: '40px',
          animation: 'pulse 2s ease-in-out infinite',
          textShadow: `0 0 10px ${colors.hover}`,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '2px'
        }}>
          TAP TO START
        </p>
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          color: colors.textSecondary,
          fontFamily: "'Press Start 2P', cursive"
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
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 40px',
        overflow: 'hidden'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <img 
            src={logo} 
            alt="TETRIS" 
            style={{ 
              width: '280px',
              maxWidth: '70vw',
              height: 'auto',
              margin: '0 auto 50px auto',
              display: 'block',
              imageRendering: 'pixelated',
              filter: `drop-shadow(0 0 20px ${colors.border})`
            }} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button 
              style={{
                ...buttonStyle,
                backgroundColor: hoveredButton === 'play' ? colors.primary : colors.panel,
                borderColor: hoveredButton === 'play' ? colors.hover : colors.border,
                boxShadow: hoveredButton === 'play' 
                  ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30, 6px 6px 0px ${colors.border}` 
                  : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20, 4px 4px 0px ${colors.border}`,
                transform: hoveredButton === 'play' ? 'translate(-2px, -2px)' : 'translate(0, 0)',
                animation: hoveredButton === 'play' ? 'buttonGlow 0.8s ease-in-out infinite' : 'slideIn 0.5s ease-out',
                animationDelay: '0s'
              }}
              onClick={() => setCurrentView('game')}
              onMouseEnter={() => setHoveredButton('play')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <GameController size={20} weight="fill" style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
              PLAY
            </button>

            <button 
              style={{
                ...buttonStyle,
                backgroundColor: hoveredButton === 'scores' ? colors.secondary : colors.panel,
                borderColor: hoveredButton === 'scores' ? colors.hover : colors.border,
                boxShadow: hoveredButton === 'scores' 
                  ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30, 6px 6px 0px ${colors.border}` 
                  : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20, 4px 4px 0px ${colors.border}`,
                transform: hoveredButton === 'scores' ? 'translate(-2px, -2px)' : 'translate(0, 0)',
                animation: hoveredButton === 'scores' ? 'buttonGlow 0.8s ease-in-out infinite' : 'slideIn 0.6s ease-out',
                animationDelay: '0.1s'
              }}
              onClick={() => setCurrentView('highscores')}
              onMouseEnter={() => setHoveredButton('scores')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Trophy size={20} weight="fill" style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
              SCORES
            </button>

            <button 
              style={{
                ...buttonStyle,
                backgroundColor: hoveredButton === 'instructions' ? colors.secondary : colors.panel,
                borderColor: hoveredButton === 'instructions' ? colors.hover : colors.border,
                boxShadow: hoveredButton === 'instructions' 
                  ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30, 6px 6px 0px ${colors.border}` 
                  : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20, 4px 4px 0px ${colors.border}`,
                transform: hoveredButton === 'instructions' ? 'translate(-2px, -2px)' : 'translate(0, 0)',
                animation: hoveredButton === 'instructions' ? 'buttonGlow 0.8s ease-in-out infinite' : 'slideIn 0.7s ease-out',
                animationDelay: '0.2s'
              }}
              onClick={() => setCurrentView('instructions')}
              onMouseEnter={() => setHoveredButton('instructions')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Question size={20} weight="fill" style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
              HELP
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
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button 
          style={{
            ...homeButtonStyle,
            backgroundColor: hoveredButton === 'home-game' ? colors.secondary : colors.panel,
            borderColor: hoveredButton === 'home-game' ? colors.hover : colors.border,
            boxShadow: hoveredButton === 'home-game' ? `0 0 20px ${colors.hover}` : `0 0 15px ${colors.border}60`
          }}
          onClick={() => setCurrentView('menu')}
          onMouseEnter={() => setHoveredButton('home-game')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <House size={32} weight="bold" color={colors.textPrimary} />
        </button>

        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'normal', 
          textAlign: 'center',
          color: colors.textPrimary,
          textShadow: `
            2px 2px 0px ${colors.primary},
            4px 4px 0px ${colors.accent},
            0 0 20px ${colors.primary}
          `,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '3px'
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
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button 
          style={{
            ...homeButtonStyle,
            backgroundColor: hoveredButton === 'home-scores' ? colors.secondary : colors.panel,
            borderColor: hoveredButton === 'home-scores' ? colors.hover : colors.border,
            boxShadow: hoveredButton === 'home-scores' ? `0 0 20px ${colors.hover}` : `0 0 15px ${colors.border}60`
          }}
          onClick={() => setCurrentView('menu')}
          onMouseEnter={() => setHoveredButton('home-scores')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <House size={32} weight="bold" color={colors.textPrimary} />
        </button>

        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'normal', 
          textAlign: 'center',
          color: colors.textPrimary,
          textShadow: `
            2px 2px 0px ${colors.accent},
            4px 4px 0px ${colors.secondary},
            0 0 20px ${colors.accent}
          `,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '2px',
          lineHeight: '1.5'
        }}>
          HIGH<br/>SCORES
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
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <button 
          style={{
            ...homeButtonStyle,
            backgroundColor: hoveredButton === 'home-instructions' ? colors.secondary : colors.panel,
            borderColor: hoveredButton === 'home-instructions' ? colors.hover : colors.border,
            boxShadow: hoveredButton === 'home-instructions' ? `0 0 20px ${colors.hover}` : `0 0 15px ${colors.border}60`
          }}
          onClick={() => setCurrentView('menu')}
          onMouseEnter={() => setHoveredButton('home-instructions')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <House size={32} weight="bold" color={colors.textPrimary} />
        </button>

        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'normal', 
          textAlign: 'center',
          color: colors.textPrimary,
          textShadow: `
            2px 2px 0px ${colors.secondary},
            4px 4px 0px ${colors.hover},
            0 0 20px ${colors.secondary}
          `,
          fontFamily: "'Press Start 2P', cursive",
          letterSpacing: '2px',
          lineHeight: '1.5'
        }}>
          HOW TO<br/>PLAY
        </h1>
      </div>
    )
  }
}

export default App
