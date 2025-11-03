import { useState, useEffect, useRef } from 'react'
import { House, Trophy, GameController, Question, Pause, Play, ArrowCounterClockwise } from 'phosphor-react'
import logo from './assets/logo.png'
import {
  startGame,
  gameTick,
  handlePlayerAction,
  getDropSpeed,
  GAME_STATES
} from './tetrisLogic'

function App() {
  const [currentView, setCurrentView] = useState('splash')
  const [hoveredButton, setHoveredButton] = useState(null)
  
  // Estado del juego
  const [gameState, setGameState] = useState(null)
  const gameLoopRef = useRef(null)
  const [isFastMode, setIsFastMode] = useState(false)

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

  // Iniciar el juego
  const initGame = () => {
    const newGame = startGame()
    setGameState(newGame)
  }

  // Iniciar juego cuando se entra a la vista de juego
  useEffect(() => {
    if (currentView === 'game' && !gameState) {
      initGame()
    }
  }, [currentView])

  // Loop del juego - Caída automática
  useEffect(() => {
    if (!gameState || gameState.gameState !== GAME_STATES.PLAYING) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    const dropSpeed = isFastMode ? 50 : getDropSpeed(gameState.level)
    
    gameLoopRef.current = setInterval(() => {
      setGameState(prevState => gameTick(prevState))
    }, dropSpeed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState?.gameState, gameState?.level, isFastMode])

  // Manejar controles del jugador
  const handleControl = (action) => {
    if (!gameState || gameState.gameState !== GAME_STATES.PLAYING) return
    
    setGameState(prevState => handlePlayerAction(action, prevState))
  }

  // Pausar/Reanudar el juego
  const togglePause = () => {
    if (!gameState) return
    
    setGameState(prevState => ({
      ...prevState,
      gameState: prevState.gameState === GAME_STATES.PLAYING 
        ? GAME_STATES.PAUSED 
        : GAME_STATES.PLAYING
    }))
  }

  // Reiniciar el juego
  const restartGame = () => {
    setIsFastMode(false)
    initGame()
  }

  // Renderizar el tablero
  const renderBoard = () => {
    if (!gameState) return null

    const { board, currentPiece } = gameState
    
    // Crear una copia del tablero para mostrar
    const displayBoard = board.map(row => [...row])
    
    // Dibujar la pieza actual en el tablero de display
    const { shape, x, y, color } = currentPiece
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardY = y + row
          const boardX = x + col
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = color
          }
        }
      }
    }

    // Renderizar las celdas
    return displayBoard.map((row, rowIndex) => 
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          style={{
            backgroundColor: cell || colors.panel,
            border: cell ? `1px solid ${colors.background}` : `1px solid ${colors.disabled}30`,
            boxShadow: cell ? `0 0 5px ${cell}80` : 'none'
          }}
        />
      ))
    )
  }

  // Renderizar la pieza "Next"
  const renderNextPiece = () => {
    if (!gameState || !gameState.nextPiece) {
      // Mostrar bloques vacíos por defecto
      return (
        <>
          <div style={nextPreviewStyle}></div>
          <div style={nextPreviewStyle}></div>
        </>
      )
    }

    const { shape, color } = gameState.nextPiece
    const cells = []
    
    // Encontrar bloques no vacíos
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          cells.push(
            <div
              key={`next-${row}-${col}`}
              style={{
                ...nextPreviewStyle,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}80, inset 0 0 5px ${color}40`
              }}
            />
          )
        }
      }
    }
    
    // Limitar a 2 bloques para el display
    return cells.slice(0, 2).length > 0 ? cells.slice(0, 2) : (
      <>
        <div style={nextPreviewStyle}></div>
        <div style={nextPreviewStyle}></div>
      </>
    )
  }

  const nextPreviewStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: colors.disabled,
    border: `2px solid ${colors.border}`,
    boxShadow: `inset 0 0 8px ${colors.background}, 0 0 6px ${colors.border}60`,
    display: 'inline-block',
    margin: '2px'
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
    // Verificar si hay una partida en pausa
    const hasGameInProgress = gameState && gameState.gameState === GAME_STATES.PAUSED

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
                backgroundColor: (hoveredButton === 'play' || hasGameInProgress) ? colors.primary : colors.panel,
                borderColor: (hoveredButton === 'play' || hasGameInProgress) ? colors.hover : colors.border,
                boxShadow: (hoveredButton === 'play' || hasGameInProgress)
                  ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30, 6px 6px 0px ${colors.border}` 
                  : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20, 4px 4px 0px ${colors.border}`,
                transform: (hoveredButton === 'play' || hasGameInProgress) ? 'translate(-2px, -2px)' : 'translate(0, 0)',
                animation: (hoveredButton === 'play' || hasGameInProgress) ? 'buttonGlow 0.8s ease-in-out infinite' : 'slideIn 0.5s ease-out',
                animationDelay: '0s'
              }}
              onClick={() => setCurrentView('game')}
              onMouseEnter={() => setHoveredButton('play')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <GameController size={20} weight="fill" style={{ marginRight: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
              {hasGameInProgress ? 'CONTINUE' : 'PLAY'}
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
    // Verificar si el juego terminó
    const isGameOver = gameState && gameState.gameState === GAME_STATES.GAME_OVER

    // Estilo base para los paneles del marcador
    const scorePanelBase = {
      backgroundColor: colors.panel,
      border: `2px solid ${colors.border}`,
      textAlign: 'center',
      boxShadow: `0 0 10px ${colors.border}80, inset 0 0 8px ${colors.border}20`,
      fontFamily: "'Press Start 2P', cursive"
    }

    // Panel pequeño para Level (izquierda)
    const levelPanel = {
      ...scorePanelBase,
      padding: '12px 15px',
      flex: '0 0 auto',
      minWidth: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }

    // Panel pequeño para Score (derecha)
    const scorePanel = {
      ...scorePanelBase,
      padding: '12px 15px',
      flex: '0 0 auto',
      minWidth: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }

    // Panel grande y cuadrado para Next (centro)
    const nextPanel = {
      ...scorePanelBase,
      padding: '8px',
      flex: '0 0 auto',
      minWidth: '95px',
      width: '95px',
      height: '95px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const scoreLabelStyle = {
      fontSize: '7px',
      color: colors.textSecondary,
      marginBottom: '6px',
      letterSpacing: '0.5px'
    }

    const scoreValueStyle = {
      fontSize: '16px',
      color: colors.textPrimary,
      textShadow: `0 0 8px ${colors.hover}, 0 0 12px ${colors.hover}`,
      letterSpacing: '1px'
    }

    const nextLabelStyle = {
      fontSize: '8px',
      color: colors.textSecondary,
      marginBottom: '10px',
      letterSpacing: '1px'
    }

    return (
      <div style={{ 
        height: '100vh', 
        maxHeight: '100vh',
        backgroundColor: colors.background, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px',
        paddingTop: '100px',
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
          onClick={() => {
            // Pausar el juego antes de ir al menú
            if (gameState && gameState.gameState === GAME_STATES.PLAYING) {
              setGameState(prevState => ({
                ...prevState,
                gameState: GAME_STATES.PAUSED
              }))
            }
            setCurrentView('menu')
          }}
          onMouseEnter={() => setHoveredButton('home-game')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <House size={32} weight="bold" color={colors.textPrimary} />
        </button>

        {/* Logo - centrado en la pantalla, alineado con el botón home */}
        <img 
          src={logo} 
          alt="TETRIS" 
          style={{ 
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            maxWidth: '50vw',
            height: 'auto',
            imageRendering: 'pixelated',
            filter: `drop-shadow(0 0 15px ${colors.border})`
          }} 
        />

        {/* Botones de Control - Pausa y Reinicio */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          display: 'flex',
          gap: '8px'
        }}>
          {/* Botón Pausa/Reanudar */}
          <button 
            style={{
              width: '45px',
              height: '45px',
              backgroundColor: hoveredButton === 'pause' ? colors.accent : colors.panel,
              border: `3px solid ${colors.border}`,
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '0',
              transition: 'all 0.2s ease',
              boxShadow: hoveredButton === 'pause' 
                ? `0 0 20px ${colors.hover}, inset 0 0 12px ${colors.hover}30` 
                : `0 0 15px ${colors.border}80, inset 0 0 8px ${colors.border}20`
            }}
            onClick={togglePause}
            onMouseEnter={() => setHoveredButton('pause')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {gameState?.gameState === GAME_STATES.PAUSED ? (
              <Play size={24} weight="fill" color={colors.textPrimary} />
            ) : (
              <Pause size={24} weight="fill" color={colors.textPrimary} />
            )}
          </button>

          {/* Botón Reiniciar */}
          <button 
            style={{
              width: '45px',
              height: '45px',
              backgroundColor: hoveredButton === 'restart' ? colors.warning : colors.panel,
              border: `3px solid ${colors.border}`,
              borderRadius: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '0',
              transition: 'all 0.2s ease',
              boxShadow: hoveredButton === 'restart' 
                ? `0 0 20px ${colors.hover}, inset 0 0 12px ${colors.hover}30` 
                : `0 0 15px ${colors.border}80, inset 0 0 8px ${colors.border}20`
            }}
            onClick={restartGame}
            onMouseEnter={() => setHoveredButton('restart')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <ArrowCounterClockwise size={24} weight="bold" color={colors.textPrimary} />
          </button>
        </div>

        {/* Marcador Superior */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          marginTop: '5px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          padding: '0 10px'
        }}>
          {/* Panel Level (Izquierda) */}
          <div style={levelPanel}>
            <div style={scoreLabelStyle}>LEVEL</div>
            <div style={scoreValueStyle}>{gameState?.level || 1}</div>
          </div>

          {/* Panel Next (Centro - Grande y Cuadrado) */}
          <div style={nextPanel}>
            <div style={nextLabelStyle}>NEXT</div>
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '3px',
                justifyContent: 'center'
              }}>
                {renderNextPiece()}
              </div>
            </div>
          </div>

          {/* Panel Score (Derecha) */}
          <div style={scorePanel}>
            <div style={scoreLabelStyle}>SCORE</div>
            <div style={scoreValueStyle}>{gameState?.score || 0}</div>
          </div>
        </div>

        {/* Game Board */}
        <div style={{
          width: '320px',
          height: '520px',
          backgroundColor: colors.panel,
          border: `3px solid ${colors.border}`,
          boxShadow: `0 0 20px ${colors.border}80, inset 0 0 15px ${colors.background}`,
          marginBottom: '15px',
          position: 'relative'
        }}>
          {/* Grid del tablero */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(20, 1fr)',
            width: '100%',
            height: '100%',
            gap: '1px',
            padding: '2px'
          }}>
            {renderBoard()}
          </div>
        </div>

        {/* Controles */}
        <div style={{
          width: '100%',
          maxWidth: '350px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          {/* Flechas de movimiento (Izquierda y Derecha) */}
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            {/* Flecha Izquierda */}
            <button 
              onClick={() => handleControl('MOVE_LEFT')}
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: colors.panel,
                border: `3px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: '40px',
                cursor: 'pointer',
                boxShadow: `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
              ◄
            </button>

            {/* Flecha Derecha */}
            <button 
              onClick={() => handleControl('MOVE_RIGHT')}
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: colors.panel,
                border: `3px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: '40px',
                cursor: 'pointer',
                boxShadow: `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
              ►
            </button>
          </div>

          {/* Botón de Rotación (Derecha) */}
          <button 
            onClick={() => handleControl('ROTATE')}
            style={{
              flex: '1',
              height: '80px',
              backgroundColor: colors.panel,
              border: `3px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: '10px',
              fontFamily: "'Press Start 2P', cursive",
              cursor: 'pointer',
              boxShadow: `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              letterSpacing: '1px',
              marginLeft: '15px'
            }}>
            <div style={{ fontSize: '28px' }}>↻</div>
            <div>ROTATE</div>
          </button>
        </div>

        {/* Botón FAST - Barra Espaciadora */}
        <div style={{
          width: '100%',
          maxWidth: '350px',
          padding: '0 20px',
          marginTop: '15px'
        }}>
          <button 
            onMouseDown={() => setIsFastMode(true)}
            onMouseUp={() => setIsFastMode(false)}
            onMouseLeave={() => setIsFastMode(false)}
            onTouchStart={() => setIsFastMode(true)}
            onTouchEnd={() => setIsFastMode(false)}
            style={{
              width: '100%',
              height: '50px',
              backgroundColor: isFastMode ? colors.warning : colors.panel,
              border: `3px solid ${isFastMode ? colors.hover : colors.border}`,
              color: colors.textPrimary,
              fontSize: '14px',
              fontFamily: "'Press Start 2P', cursive",
              cursor: 'pointer',
              boxShadow: isFastMode 
                ? `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}40` 
                : `0 0 15px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s ease',
              letterSpacing: '3px',
              transform: isFastMode ? 'scale(0.98)' : 'scale(1)'
            }}>
            FAST ▼▼▼
          </button>
        </div>

        {/* Overlay de Pausa */}
        {gameState?.gameState === GAME_STATES.PAUSED && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-in'
          }}>
            <div style={{
              backgroundColor: colors.panel,
              border: `6px solid ${colors.accent}`,
              padding: '35px 45px',
              boxShadow: `0 0 40px ${colors.accent}, inset 0 0 20px ${colors.accent}30`,
              textAlign: 'center',
              animation: 'popIn 0.3s ease-out',
              maxWidth: '90%'
            }}>
              <h2 style={{
                fontSize: '28px',
                color: colors.accent,
                fontFamily: "'Press Start 2P', cursive",
                letterSpacing: '3px',
                marginBottom: '30px',
                textShadow: `0 0 20px ${colors.accent}`,
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                PAUSED
              </h2>

              {/* Grid decorativo */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 25px)',
                gap: '5px',
                marginBottom: '30px',
                justifyContent: 'center'
              }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    width: '25px',
                    height: '6px',
                    backgroundColor: colors.panel,
                    border: `2px solid ${colors.accent}`,
                    boxShadow: `0 0 8px ${colors.accent}60`
                  }} />
                ))}
              </div>

              {/* Botones */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%'
              }}>
                {/* Botón Reanudar */}
                <button
                  onClick={togglePause}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    backgroundColor: colors.panel,
                    border: `4px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: '11px',
                    fontFamily: "'Press Start 2P', cursive",
                    cursor: 'pointer',
                    boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
                    letterSpacing: '2px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.accent
                    e.target.style.borderColor = colors.hover
                    e.target.style.boxShadow = `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.panel
                    e.target.style.borderColor = colors.border
                    e.target.style.boxShadow = `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`
                  }}
                >
                  <Play size={16} weight="fill" />
                  RESUME
                </button>

                {/* Botón Volver al Menú */}
                <button
                  onClick={() => setCurrentView('menu')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    backgroundColor: colors.panel,
                    border: `4px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: '11px',
                    fontFamily: "'Press Start 2P', cursive",
                    cursor: 'pointer',
                    boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
                    letterSpacing: '2px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.secondary
                    e.target.style.borderColor = colors.hover
                    e.target.style.boxShadow = `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.panel
                    e.target.style.borderColor = colors.border
                    e.target.style.boxShadow = `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`
                  }}
                >
                  <House size={16} weight="fill" />
                  MENU
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pop-up de Game Over */}
        {isGameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{
              backgroundColor: colors.panel,
              border: `6px solid ${colors.warning}`,
              padding: '40px 50px',
              boxShadow: `0 0 40px ${colors.warning}, inset 0 0 20px ${colors.warning}30`,
              textAlign: 'center',
              animation: 'popIn 0.4s ease-out',
              maxWidth: '90%'
            }}>
              {/* Título GAME OVER */}
              <h1 style={{
                fontSize: '32px',
                color: colors.warning,
                fontFamily: "'Press Start 2P', cursive",
                letterSpacing: '3px',
                marginBottom: '30px',
                textShadow: `0 0 20px ${colors.warning}, 0 0 30px ${colors.warning}`,
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                GAME<br/>OVER
              </h1>

              {/* Grid decorativo */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 30px)',
                gap: '6px',
                marginBottom: '25px',
                justifyContent: 'center'
              }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    width: '30px',
                    height: '8px',
                    backgroundColor: colors.panel,
                    border: `2px solid ${colors.warning}`,
                    boxShadow: `0 0 8px ${colors.warning}60`
                  }} />
                ))}
              </div>

              {/* Estadísticas finales */}
              <div style={{
                marginBottom: '30px'
              }}>
                <div style={{
                  fontSize: '10px',
                  color: colors.textSecondary,
                  fontFamily: "'Press Start 2P', cursive",
                  marginBottom: '10px',
                  letterSpacing: '1px'
                }}>
                  FINAL SCORE
                </div>
                <div style={{
                  fontSize: '24px',
                  color: colors.hover,
                  fontFamily: "'Press Start 2P', cursive",
                  marginBottom: '20px',
                  textShadow: `0 0 15px ${colors.hover}`,
                  letterSpacing: '2px'
                }}>
                  {gameState?.score || 0}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: colors.textSecondary,
                  fontFamily: "'Press Start 2P', cursive",
                  letterSpacing: '1px'
                }}>
                  LEVEL {gameState?.level || 1}
                </div>
              </div>

              {/* Botón para volver al menú */}
              <button
                onClick={() => {
                  setGameState(null)
                  setCurrentView('menu')
                }}
                style={{
                  width: '100%',
                  padding: '15px 25px',
                  backgroundColor: colors.panel,
                  border: `4px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: '12px',
                  fontFamily: "'Press Start 2P', cursive",
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`,
                  letterSpacing: '2px',
                  transition: 'all 0.2s ease',
                  marginTop: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.primary
                  e.target.style.borderColor = colors.hover
                  e.target.style.boxShadow = `0 0 25px ${colors.hover}, inset 0 0 15px ${colors.hover}30`
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.panel
                  e.target.style.borderColor = colors.border
                  e.target.style.boxShadow = `0 0 20px ${colors.border}80, inset 0 0 10px ${colors.border}20`
                }}
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        )}
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
