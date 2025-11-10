import { House, CaretLeft, CaretRight } from 'phosphor-react';
import { useState } from 'react';
import { colors } from '../styles/colors';
import IconButton from '../components/IconButton';
import inicioImg from '../assets/inicio.png';
import finImg from '../assets/finjuego.png';
import flechasImg from '../assets/FlechasMovimiento.png';
import RotarImg from '../assets/Rotar.png';
import fastImg from '../assets/fast.png';

/**
 * Vista de instrucciones con carrusel
 */
const InstructionsView = ({ hoveredButton, setHoveredButton, onNavigate }) => {
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
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
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
        onClick={() => onNavigate('menu')}
        onMouseEnter={() => setHoveredButton('home-instructions')}
        onMouseLeave={() => setHoveredButton(null)}
        position={{ top: '30px', left: '30px' }}
      >
        <House size={32} weight="bold" color={colors.textPrimary} />
      </IconButton>

      {/* Título */}
      <h1
        style={{
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
          lineHeight: '1.5',
          marginBottom: '30px',
        }}
      >
        HOW TO<br />PLAY
      </h1>

      {/* Imagen con texto (carrusel) */}
      <div
        style={{
          width: '90%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <img
          src={slides[currentSlide].img}
          alt="Instrucción del juego"
          style={{
            width: '100%',
            maxHeight: '50vh',
            objectFit: 'contain',
            border: `2px solid ${colors.secondary}`,
            borderRadius: '12px',
            boxShadow: `0 0 20px ${colors.hover}`,
            marginBottom: '15px',
          }}
        />

        <p
          style={{
            color: colors.textPrimary,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '10px',
            textAlign: 'center',
            backgroundColor: '#000',
            border: `1px solid ${colors.secondary}`,
            borderRadius: '12px',
            padding: '15px',
            boxShadow: `0 0 15px ${colors.secondary}`,
            width: '90%',
            lineHeight: '1.5',
          }}
        >
          {slides[currentSlide].text}
        </p>

        {/* Flechas de navegación */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 10px',
          }}
        >
          <CaretLeft
            size={32}
            color={colors.textPrimary}
            onClick={prevSlide}
            style={{ cursor: 'pointer', filter: `drop-shadow(0 0 5px ${colors.secondary})` }}
          />
          <CaretRight
            size={32}
            color={colors.textPrimary}
            onClick={nextSlide}
            style={{ cursor: 'pointer', filter: `drop-shadow(0 0 5px ${colors.secondary})` }}
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
