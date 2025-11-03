# 🎮 Tetris - React Mobile App

Aplicación móvil del clásico juego Tetris desarrollada con React, optimizada para Play Store con una interfaz moderna y minimalista.

## 🎨 Características

- ✨ Interfaz minimalista con diseño limpio
- 🎯 Sistema de navegación intuitivo con 4 secciones
- � Navegación fluida con botón home circular
- 💫 Animaciones suaves y transiciones elegantes
- 📱 Diseño 100% optimizado para dispositivos móviles
- 🚫 Sin scroll - Todo visible en una pantalla
- ⚡ Desarrollado con Vite para rendimiento óptimo
- 🎨 Iconos de Phosphor para una experiencia visual consistente

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida y moderna
- **Phosphor Icons** - Sistema de iconos moderno y consistente
- **Tailwind CSS** - Framework de CSS utilitario para diseño rápido
- **PostCSS** - Procesador de CSS para transformaciones
- **Autoprefixer** - Plugin para añadir prefijos de navegadores automáticamente

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 16 o superior)
- npm o yarn

## 🚀 Instalación

1. **Clona o descarga el repositorio**

```bash
cd /Users/21neji/Documents/Tetris
```

2. **Instala las dependencias** (si aún no están instaladas)

```bash
npm install
```

## 💻 Uso

### Modo Desarrollo

Para ejecutar la aplicación en modo desarrollo con recarga en caliente:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilación para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

### Vista Previa de Producción

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

## 🎮 Funcionalidades y Navegación

La aplicación cuenta con un menú principal y 4 secciones:

### Menú Principal
- **PLAY** - Inicia una nueva partida de Tetris
- **CONTINUE** - Continúa la partida guardada
- **SETTINGS** - Configuración del juego (sonido, dificultad, etc.)
- **ABOUT** - Información sobre la aplicación y créditos

### Características de Navegación
- 🏠 **Botón Home Circular** - Ubicado en la esquina superior izquierda de cada vista
- Permite regresar al menú principal desde cualquier sección
- Diseño consistente con borde negro de 3px
- Icono de casa de Phosphor Icons

### Diseño de Botones
Cada botón del menú tiene:
- Forma ovalada (pill-shaped) con borde negro
- Fondo blanco con efecto hover gris claro
- Animación de escala al hacer clic
- Separación óptima entre elementos
- Tamaño y padding optimizados para móvil

## 📁 Estructura del Proyecto

```
Tetris/
├── src/
│   ├── App.jsx          # Componente principal con navegación y vistas
│   ├── App.css          # Estilos adicionales
│   ├── index.css        # Estilos globales y configuración de Tailwind
│   ├── main.jsx         # Punto de entrada de la aplicación
│   └── assets/          # Recursos estáticos (iconos, imágenes)
├── public/              # Archivos estáticos públicos
│   └── vite.svg         # Logo de Vite
├── index.html           # Archivo HTML principal
├── package.json         # Dependencias y scripts
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind CSS
├── postcss.config.js    # Configuración de PostCSS
├── eslint.config.js     # Configuración de ESLint
└── README.md            # Este archivo
```

## 🎨 Personalización

### Estilos

Los estilos están definidos usando estilos inline en `src/App.jsx` para mayor control:

- **Fondo de botones**: `backgroundColor: 'white'`
- **Bordes**: `border: '3px solid black'`
- **Colores al hover**: Definidos en eventos
- **Fondo de la app**: `backgroundColor: 'white'`

### Iconos

Para cambiar o añadir iconos de Phosphor:

1. Visita [phosphoricons.com](https://phosphoricons.com/)
2. Busca el icono que necesitas
3. Impórtalo en `App.jsx`:
```javascript
import { House, GameController, Gear } from 'phosphor-react'
```
4. Úsalo en tu componente:
```jsx
<House size={32} weight="bold" color="black" />
```

### Configuración de Vista Móvil

Para ajustar el diseño móvil, modifica estos valores en los estilos:

- **Altura de viewport**: `height: '100vh'`
- **Espaciado de botones**: `gap: '20px'`
- **Tamaño de fuente**: `fontSize: '18px'`
- **Padding de botones**: `padding: '18px 0'`

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Limpia la caché y reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Los iconos de Phosphor no se muestran

```bash
# Asegúrate de tener instalada la librería
npm install phosphor-react

# Verifica la importación en App.jsx
import { House } from 'phosphor-react'
```

### La app tiene scroll no deseado

Verifica que todos los contenedores tengan:
```javascript
overflow: 'hidden'
height: '100vh'
maxHeight: '100vh'
```

### Los estilos de Tailwind no se aplican

Asegúrate de que el archivo `src/index.css` contenga:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo (por defecto en http://localhost:5173)
- `npm run build` - Compila la aplicación para producción (salida en `dist/`)
- `npm run preview` - Previsualiza la compilación de producción localmente
- `npm run lint` - Ejecuta ESLint para encontrar problemas en el código

## 📱 Preparación para Play Store

Para preparar la app para publicación en Play Store:

1. **Compila la versión de producción**:
```bash
npm run build
```

2. **Empaqueta con Capacitor o Cordova** (próximo paso):
```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Añadir plataforma Android
npm install @capacitor/android
npx cap add android
```

3. **Configura los assets**:
   - Icono de la app (1024x1024px)
   - Splash screen
   - Screenshots para la store

4. **Build APK/AAB**:
```bash
npx cap sync
npx cap open android
# Usar Android Studio para generar el APK/AAB firmado
```

## 👨‍💻 Desarrollo

### Añadir Nuevas Vistas

Para agregar una nueva vista al juego:

1. **Añade un nuevo estado de vista** en `App.jsx`:
```javascript
const [currentView, setCurrentView] = useState('menu')
// Añade tu nueva vista: 'highscores', 'tutorial', etc.
```

2. **Crea el botón en el menú**:
```jsx
<button style={buttonStyle} onClick={() => setCurrentView('nuevaVista')}>
  NUEVA VISTA
</button>
```

3. **Define la vista** con su estructura:
```jsx
if (currentView === 'nuevaVista') {
  return (
    <div style={{ /* estilos de contenedor */ }}>
      <button style={homeButtonStyle} onClick={() => setCurrentView('menu')}>
        <House size={32} weight="bold" color="black" />
      </button>
      <h1>MI NUEVA VISTA</h1>
      {/* Contenido de la vista */}
    </div>
  )
}
```

### Estructura de Componentes

Actualmente la app usa un solo componente (`App.jsx`) con manejo de estado. Para escalar:

1. Crea una carpeta `src/components/`
2. Separa cada vista en su propio componente
3. Usa props para pasar la función `setCurrentView`
4. Considera usar Context API o Redux para estado global

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🎯 Próximas Características

- [ ] Implementar la lógica del juego Tetris
- [ ] Sistema de puntuación y high scores
- [ ] Diferentes niveles de dificultad
- [ ] Efectos de sonido y música
- [ ] Modo oscuro
- [ ] Guardado automático de progreso
- [ ] Estadísticas de juego
- [ ] Logros y desafíos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Para preguntas o sugerencias, no dudes en abrir un issue en el repositorio.

---

🎮 **Tetris Mobile App** - Desarrollado con ❤️ usando React, Vite y Phosphor Icons
