import { House, CaretLeft, CaretRight } from 'phosphor-react';
import { useState } from 'react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import inicioImg from '../assets/inicio.png';
import finImg from '../assets/finjuego.png';
import flechasImg from '../assets/FlechasMovimiento.png';
import RotarImg from '../assets/Rotar.png';
import fastImg from '../assets/fast.png';
import logo from '../assets/logo.png';
import { useAudio } from '../contexts/AudioContext';

/**
 * Vista de instrucciones con carrusel
 */
const InstructionsView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
  const { playButtonClick } = useAudio();
  const slides = [

    {
      img: inicioImg,
      text: "Se deben colocar las piezas de manera horizontal sin dejar espacios en el cuadro. Cuando una línea se completa, desaparece y ganas puntos.",
    },


    {
      img: flechasImg,
      text: "Por medio de las flechas < > puede mover las figuras a los lados.",
    },

    {
      img: RotarImg,
      text: "El botón de rotación puede girar la figura para acomodarla a su preferencia.",
    },

    {
      img: fastImg,
      text: "(FAST) es para que la pieza pueda desplazarse mas rapido a la posición",

    },

    {
      img: finImg,
      text: "El juego termina cuando las piezas se acumulan y llegan hasta arriba del cuadro.",
    },


  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    playButtonClick();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    playButtonClick();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* Botón de inicio */}
      <IconButton
        size="large"
        variant="secondary"
        isHovered={hoveredButton === 'home-instructions'}
        onClick={() => {
          playButtonClick();
          onNavigate('menu');
        }}
        onMouseEnter={() => setHoveredButton('home-instructions')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Logo */}
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

      {/* Imagen con texto (carrusel) */}
      <div
        style={{
          width: '90%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          marginTop: '100px',
        }}
      >
        {/* Contenedor de imagen con tamaño fijo */}
        <div
          style={{
            width: '100%',
            height: '45vh', // Altura fija para todas las imágenes
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${colors.secondary}`,
            borderRadius: '12px',
            boxShadow: `0 0 20px ${colors.hover}`,
            marginBottom: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          <img
            src={slides[currentSlide].img}
            alt="Instrucción del juego"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Contenedor de texto con tamaño fijo */}
        <div
          style={{
            color: colors.textPrimary,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '13px', // Aumentado de 10px a 13px
            textAlign: 'center',
            backgroundColor: '#000',
            border: `3px solid ${colors.secondary}`,
            borderRadius: '12px',
            padding: '25px', // Aumentado de 15px a 25px
            boxShadow: `0 0 15px ${colors.secondary}`,
            width: '90%',
            minHeight: '180px', // Altura mínima fija para el cuadro de texto
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.8', // Aumentado de 1.5 a 1.8
          }}
        >
          {slides[currentSlide].text}
        </div>

        {/* Flechas de navegación */}
        <div
          style={{
            position: 'absolute',
            top: '35%', // Ajustado para centrar en la imagen
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 10px',
            pointerEvents: 'none', // Permitir clicks solo en las flechas
          }}
        >
          <CaretLeft
            size={40} // Aumentado de 32 a 40
            color={colors.textPrimary}
            onClick={prevSlide}
            style={{ 
              cursor: 'pointer', 
              filter: `drop-shadow(0 0 8px ${colors.secondary})`,
              pointerEvents: 'auto'
            }}
          />
          <CaretRight
            size={40} // Aumentado de 32 a 40
            color={colors.textPrimary}
            onClick={nextSlide}
            style={{ 
              cursor: 'pointer', 
              filter: `drop-shadow(0 0 8px ${colors.secondary})`,
              pointerEvents: 'auto'
            }}
          />
        </div>

        {/* Indicadores de posición */}
        <div style={{ marginTop: '15px', display: 'flex', gap: '8px' }}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor:
                  index === currentSlide ? colors.secondary : colors.textSecondary,
                transition: '0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionsView;
