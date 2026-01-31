# Filanccia - Project Context

> **Propósito de este archivo:** Contexto completo para continuar el desarrollo en futuras sesiones sin acceso a conversaciones previas. LEER COMPLETO antes de hacer cambios.

---

## Quick Reference

| Key | Value |
|-----|-------|
| Motor | Phaser 3.55.2 |
| Lenguaje | JavaScript (ES6 modules) |
| Resolución | 800x600 (aspect ratio 4:3) |
| Comando | `npm start` (http-server:8080) |
| Idioma UI | Español |
| Estado | Infraestructura base - sin assets |

---

## Origen del Proyecto

Este proyecto fue inicializado extrayendo la **infraestructura técnica** del proyecto de referencia "5 Días con Dio" (ubicado en `referencia/`). Se tomó:

- Configuración de Phaser 3
- Sistema de escenas
- Controles táctiles (SwipeControls)
- Patrón de managers para sistemas complejos
- Configuración responsive del HTML/CSS
- Estructura de carpetas

**NO se copió** contenido específico del juego de referencia (sprites, diálogos, lógica de juego). Todo el código en `src/` es nuevo y genérico.

---

## Descripción del Proyecto

**Filanccia** es un juego de misterio/aventura ambientado en una ciudad italiana ficticia durante un festival de carnaval.

### Concepto (extraído de GAME_STORY.md - incompleto)

- **Protagonista:** Marlo, un joven
- **Setting:** Ciudad de Filanccia, festival del centenario
- **Evento inicial:** Asesinato en la plaza - víctima sin rostro
- **Conflicto:** Marlo decide investigar por su cuenta
- **Villano:** Se interesa en Marlo por su empatía/inocencia
- **Tema:** La empatía de Marlo vs. la falta de emociones del villano

**Nota:** La historia está incompleta. El archivo GAME_STORY.md contiene notas en borrador.

---

## Estructura de Archivos Completa

```
Filanccia/
├── index.html                  # HTML + CSS responsive
├── package.json                # { phaser: 3.55.2, http-server: 14.1.1 }
├── .gitignore                  # node_modules, dist, .DS_Store, etc.
├── context.md                  # ESTE ARCHIVO
│
├── src/
│   ├── main.js                 # Entry point, config Phaser
│   │
│   ├── scenes/
│   │   ├── BootScene.js        # Escena 1: init mínimo
│   │   ├── PreloadScene.js     # Escena 2: carga assets + progress bar
│   │   ├── MenuScene.js        # Escena 3: menú principal
│   │   └── GameScene.js        # Escena 4: template de gameplay
│   │
│   ├── input/
│   │   └── SwipeControls.js    # Clase para input táctil/móvil
│   │
│   ├── managers/
│   │   └── BaseManager.js      # Clase base para subsistemas
│   │
│   └── entities/               # (vacío) para clases de personajes
│
├── assets/
│   ├── images/
│   │   ├── characters/         # Sprites de personajes
│   │   ├── tiles/              # Tilesets para Tiled
│   │   └── ui/                 # Fondos, botones, UI
│   ├── maps/                   # JSONs exportados de Tiled
│   ├── fonts/                  # .ttf personalizadas
│   └── audio/                  # .mp3, .wav, .ogg
│
└── info/                       # Documentación y referencias
    ├── story/
    │   ├── GAME_DESIGN.md      # Historia y diseño del juego
    │   └── media-ref/          # Imágenes de referencia visual
    │
    └── reference/              # Proyecto "5 Días con Dio" completo
        └── (ver sección "Proyecto de Referencia")
```

---

## Configuración HTML (index.html)

```html
<!-- Características clave -->
- Contenedor #game-container: 800x600, centrado
- CSS responsive: en pantallas < 900px adapta manteniendo 4:3
- touch-action: none (evita scroll/zoom en móvil)
- Fuente personalizada: GameFont (assets/fonts/gameFont.ttf)
- Phaser cargado desde CDN: cdn.jsdelivr.net/npm/phaser@3.55.2
- Entry point: <script type="module" src="./src/main.js">
```

---

## Configuración Phaser Completa (main.js)

```javascript
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  pixelArt: true,                    // Sin antialiasing
  scene: [BootScene, PreloadScene, MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },             // Top-down, sin gravedad
      debug: false                   // Cambiar a true para ver hitboxes
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,          // Escala manteniendo aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {
    disableWebAudio: false
  }
};
```

---

## Escenas Actuales - Detalle

### 1. BootScene
**Archivo:** `src/scenes/BootScene.js`
**Propósito:** Inicialización mínima antes de cargar assets
```javascript
// Solo configura registry y pasa a PreloadScene
this.game.registry.set('gameStarted', false);
this.scene.start('PreloadScene');
```

### 2. PreloadScene
**Archivo:** `src/scenes/PreloadScene.js`
**Propósito:** Cargar TODOS los assets con barra de progreso visual
- Barra de progreso: rectángulo que se llena de 0% a 100%
- Texto de porcentaje
- **IMPORTANTE:** Aquí se agregan todos los `this.load.xxx()`

### 3. MenuScene
**Archivo:** `src/scenes/MenuScene.js`
**Propósito:** Menú principal
- Fondo: rectángulo color `0x1a1a2e`
- Título: "FILANCCIA" con animación flotante
- Botón: "[ COMENZAR ]" con hover effects
- Input: click, ENTER, SPACE, o tap táctil
- Transición: fade out → GameScene

### 4. GameScene
**Archivo:** `src/scenes/GameScene.js`
**Propósito:** Template para escenas de gameplay
- **Player:** Rectángulo verde 32x48 (placeholder)
- **Movimiento:** Flechas + WASD + táctil, velocidad 200
- **Cámara:** Sigue al player con lerp 0.1
- **Debug:** Texto mostrando posición X,Y
- **Helpers incluidos:** `getFeetY()`, `findMapObject()`

---

## Sistema de Input Completo

### SwipeControls (src/input/SwipeControls.js)

```javascript
// Constructor
new SwipeControls(scene, {
  threshold: 30,    // Píxeles mínimos para detectar movimiento
  maxTime: 400,     // ms máximo para considerar "swipe rápido"
  on: {
    tap: () => {},           // Toque sin movimiento
    left: () => {},          // Swipe rápido izquierda
    right: () => {},         // Swipe rápido derecha
    up: () => {},            // Swipe rápido arriba
    down: () => {},          // Swipe rápido abajo
    holdStart: (dir) => {},  // Inicio de arrastre continuo
    holdEnd: (dir) => {}     // Fin de arrastre continuo
  }
});

// Métodos
swipe.destroy();  // Limpia event listeners
```

### Patrón de Input Unificado

```javascript
// En create():
this.cursors = this.input.keyboard.createCursorKeys();
this.wasd = this.input.keyboard.addKeys({
  up: 'W', down: 'S', left: 'A', right: 'D'
});
this.virtual = { left: false, right: false, up: false, down: false, action: false };

// En update():
const left = this.cursors.left.isDown || this.wasd.left.isDown || this.virtual.left;
const right = this.cursors.right.isDown || this.wasd.right.isDown || this.virtual.right;
// ... etc
```

---

## Patrón: Scene-Injected Manager

Para sistemas complejos (diálogos, minijuegos, investigación), crear managers separados:

### BaseManager (src/managers/BaseManager.js)

```javascript
class BaseManager {
  constructor(scene) {
    this.scene = scene;      // Referencia a la escena padre
    this.active = false;     // Estado activo/inactivo
    this.elements = [];      // Elementos UI para cleanup
  }

  start() { this.active = true; this.elements = []; }
  update() { /* override */ }
  cleanup() { this.elements.forEach(el => el.destroy()); this.elements = []; }
  end() { this.cleanup(); this.active = false; }
  addElement(el) { this.elements.push(el); return el; }
  showFeedback(x, y, text, color) { /* texto flotante animado */ }
}
```

### Uso en Escena

```javascript
import DialogueManager from '../managers/DialogueManager.js';

create() {
  this.dialogueManager = new DialogueManager(this);
}

update() {
  if (this.dialogueManager.active) {
    this.dialogueManager.update();
    return; // Bloquea input normal durante diálogo
  }
  // ... gameplay normal
}

// Para activar:
this.dialogueManager.start(dialogueData);
```

---

## Proyecto de Referencia (referencia/)

El directorio `referencia/` contiene "5 Días con Dio", un visual novel completo. **Consultar para:**

### Archivos Clave de Referencia:
| Archivo | Útil para |
|---------|-----------|
| `referencia/src/scenes/BeachScene.js` | Sistema de diálogos con opciones |
| `referencia/src/scenes/ApartmentScene.js` | Tilemaps, colisiones, y-sorting, occluders |
| `referencia/src/scenes/minigames/IliaMinigame.js` | Ejemplo de manager de minijuego |
| `referencia/src/scenes/minigames/GhostMinigame.js` | Otro ejemplo de manager |
| `referencia/context.md` | Documentación detallada del proyecto |

### Patrones Útiles del Proyecto de Referencia:

**Y-Sorting con Occluders:**
```javascript
// Los occluders son imágenes que tapan al jugador según Y
// Se cargan desde capa "Occluders" del mapa Tiled
// Depth = posición Y del borde inferior
```

**Sistema de Diálogos:**
```javascript
// Array de pasos con texto y opciones
this.dialogueConfig = [
  { text: "...", options: [
    { text: "Opción 1", affinity: +2, response: "..." },
    { text: "Opción 2", affinity: -1, response: "..." }
  ]}
];
```

**Animaciones con Duración Variable:**
```javascript
const frames = [];
for (let i = 0; i < 16; i++) {
  frames.push({
    key: 'spritesheet',
    frame: i,
    duration: isPauseFrame(i) ? Phaser.Math.Between(600, 1800) : 120
  });
}
```

---

## Constantes Recomendadas

Basado en el proyecto de referencia, usar estos valores estándar:

```javascript
// Tamaño de sprites de personajes
const FRAME_W = 64;
const FRAME_H = 64;

// Hitbox del cuerpo (para colisiones)
const BODY_W = 18;
const BODY_H = 22;
const BODY_Y_OFFSET = 6;

// Velocidades
const WALK_SPEED = 145;      // Exploración
const RUN_SPEED = 200;       // Si se implementa correr

// Profundidades (depth)
const DEPTH_FLOOR = 0;
const DEPTH_WALLS = 1;
const DEPTH_CHARACTERS = 4;  // Dinámico con y-sorting
const DEPTH_UI = 10000;
const DEPTH_OVERLAY = 11000;
```

---

## Cómo Continuar el Desarrollo

### Próximos Pasos Sugeridos (en orden):

1. **Definir escenas/localizaciones** del juego
   - Lista de lugares que Marlo visitará
   - Orden/flujo entre escenas

2. **Crear sistema de placeholders**
   - Clase Placeholder para personajes (rectángulo + nombre)
   - Zonas marcadas en escenas ("aquí va X")

3. **Implementar DialogueManager**
   - Basarse en BeachScene.js de referencia
   - Caja de diálogo, texto typewriter, opciones

4. **Primera escena jugable**
   - Casa de Marlo o Plaza del festival
   - Marlo placeholder + movimiento + algún diálogo

5. **Sistema de investigación** (según diseño del juego)

---

## Cómo Agregar Nueva Escena

```javascript
// 1. Crear src/scenes/PlazaScene.js
export default class PlazaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlazaScene' });
  }

  create() {
    // Setup
  }

  update() {
    // Loop
  }
}

// 2. En src/main.js, agregar import y al array:
import PlazaScene from './scenes/PlazaScene.js';

const config = {
  scene: [BootScene, PreloadScene, MenuScene, GameScene, PlazaScene]
};

// 3. Para navegar a la escena:
this.scene.start('PlazaScene');
```

---

## Cómo Agregar Assets

### En PreloadScene.js, dentro de preload():

```javascript
// Spritesheets (personajes animados)
this.load.spritesheet('marlo', 'assets/images/characters/marlo.png', {
  frameWidth: 64, frameHeight: 64
});

// Imágenes estáticas
this.load.image('plaza_bg', 'assets/images/ui/plaza_bg.png');

// Tilesets para Tiled
this.load.image('tileset_ciudad', 'assets/images/tiles/ciudad.png');

// Mapas de Tiled
this.load.tilemapTiledJSON('mapa_plaza', 'assets/maps/plaza.json');

// Audio
this.load.audio('musica_festival', 'assets/audio/festival.mp3');
this.load.audio('sfx_paso', 'assets/audio/footstep.wav');
```

### Crear animaciones en PreloadScene.create():

```javascript
this.anims.create({
  key: 'marlo_idle_down',
  frames: [{ key: 'marlo', frame: 0 }],
  frameRate: 1,
  repeat: -1
});

this.anims.create({
  key: 'marlo_walk_down',
  frames: this.anims.generateFrameNumbers('marlo', { start: 0, end: 5 }),
  frameRate: 10,
  repeat: -1
});
```

---

## Convención de Direcciones de Sprites

Todos los sprites de personajes siguen este patrón de nomenclatura:

### Sprites Idle (archivos 1-4)

| Archivo | Dirección | Descripción |
|---------|-----------|-------------|
| `character1.png` | south | Mirando hacia la cámara |
| `character2.png` | east | Mirando hacia la derecha |
| `character3.png` | north | De espaldas a la cámara |
| `character4.png` | west | Mirando hacia la izquierda |

### Spritesheets de Caminar

Los archivos de animación de caminar usan sus nombres originales directamente:

- `characterWalkNorth.png` → animación caminando hacia arriba
- `characterWalkSouth.png` → animación caminando hacia abajo
- `characterWalkEast.png` → animación caminando hacia la derecha
- `characterWalkWest.png` → animación caminando hacia la izquierda

### Ejemplo en PreloadScene.js

```javascript
// ----- MARLO -----
// Idle (4 direcciones)
this.load.image('marlo_idle_south', `${charPath}/marlo1.png`);
this.load.image('marlo_idle_east', `${charPath}/marlo2.png`);
this.load.image('marlo_idle_north', `${charPath}/marlo3.png`);
this.load.image('marlo_idle_west', `${charPath}/marlo4.png`);

// Walk spritesheets (4 frames, 64x64 cada uno)
this.load.spritesheet('marlo_walk_north', `${charPath}/marloWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
this.load.spritesheet('marlo_walk_south', `${charPath}/marloWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
this.load.spritesheet('marlo_walk_east', `${charPath}/marloWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
this.load.spritesheet('marlo_walk_west', `${charPath}/marloWalkWest.png`, { frameWidth: 64, frameHeight: 64 });
```

### Personajes con este patrón

- **marlo** (protagonista)
- **father** (padre de Marlo)
- **mother** (madre de Marlo)
- **villain** (Strappavolti)

**Nota:** Carabiniere y Alabardiere solo tienen un sprite idle (`carabinieri1.png`, `alabardieri1.png`).

---

## Convenciones de Código

- **Nombres de escenas:** PascalCase terminando en "Scene" (PlazaScene, CasaMarloScene)
- **Keys de assets:** snake_case (marlo_idle, plaza_bg)
- **Keys de animaciones:** snake_case (marlo_walk_down, npc_hablar)
- **Managers:** PascalCase terminando en "Manager" (DialogueManager)
- **Comentarios:** En español
- **Textos UI:** En español

---

## Estado Actual

### ✅ Completado
- Estructura de proyecto
- Configuración Phaser + HTML responsive
- Sistema de escenas (Boot → Preload → Menu → Game)
- Controles teclado + táctil (SwipeControls)
- Menú funcional con transiciones
- Template de gameplay con player placeholder
- Patrón BaseManager
- Helpers (y-sorting, findMapObject)

### ⏳ Pendiente
- [ ] Lista de escenas del juego
- [ ] Sistema de diálogos (DialogueManager)
- [ ] Sistema de placeholders visuales
- [ ] Personaje Marlo
- [ ] Primera escena del juego
- [ ] NPCs
- [ ] Sistema de pistas/investigación
- [ ] Assets gráficos
- [ ] Audio

---

## Ejecución

```bash
cd /Users/crom/Desktop/Filanccia
npm install        # Primera vez
npm start          # Inicia servidor en :8080
# Abrir http://localhost:8080
```

---

## Notas Importantes

1. **Sin assets aún:** Todo funciona con placeholders (rectángulos)
2. **GAME_STORY.md incompleto:** La historia está en borrador, no usarla como fuente definitiva
3. **Referencia disponible:** El proyecto referencia/ tiene ~5500 líneas de código funcional como ejemplo
4. **Móvil-ready:** SwipeControls ya está integrado, probar en móvil
5. **Placeholders primero:** Desarrollar lógica antes de tener arte final

---

*Última actualización: Enero 2026*
*Estado: Infraestructura base completa, esperando definición de escenas y contenido*
