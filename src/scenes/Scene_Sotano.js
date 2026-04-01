// src/scenes/Scene_Sotano.js
// Escena Sótano: Área secreta bajo la bodega
// Accesible a través de la trampilla

import SettingsUI from '../ui/SettingsUI.js';
import TypewriterText from '../utils/TypewriterText.js';

export default class Scene_Sotano extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_Sotano' });
  }

  create(data) {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // Guardar datos de carga si vienen de un save
    this.loadData = data || {};

    // ============================================
    // TILEMAP DEL SÓTANO
    // ============================================

    this.sotanoMap = this.make.tilemap({ key: 'sotano_map' });
    const tilesetSotano = this.sotanoMap.addTilesetImage('sotano', 'tileset_sotano');

    // Crear capa de tiles
    this.floorLayer = this.sotanoMap.createLayer('Capa de patrones 1', tilesetSotano, 0, 0);

    // ========== ESCALA DEL MAPA (ajustar aquí) ==========
    const mapWidth = this.sotanoMap.widthInPixels || 512;   // 512px
    const mapHeight = this.sotanoMap.heightInPixels || 320; // 320px
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;

    // Opciones de escala:
    // Math.min = ver todo el mapa (barras negras)
    // Math.max = llenar pantalla (recorta bordes)
    // Valor fijo = escala específica (ej: 1.5)
    this.mapScale = Math.min(1.1, 1.1);  // ← CAMBIAR AQUÍ
    // =====================================================

    // Centrar el mapa
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;
    this.mapOffsetY = (height - scaledHeight) / 2;

    if (this.floorLayer) {
      this.floorLayer.setScale(this.mapScale);
      this.floorLayer.setPosition(this.mapOffsetX, this.mapOffsetY);
    }

    // ============================================
    // COLLIDERS (desde el tilemap si existen)
    // ============================================

    this.colliders = [];
    this.exitZone = null;

    const objectLayer = this.sotanoMap.getObjectLayer('colliders');
    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
        if (obj.name === 'spawn' || obj.name === 'exit') {
          return;
        }

        // ========== OFFSET COLLIDERS (ajustar aquí) ==========
        const colliderOffsetX = 0;   // ← +/- para mover colliders horizontal
        const colliderOffsetY = 22;  // ← +/- para mover colliders vertical (+ = abajo)
        // ======================================================

        const scaledX = this.mapOffsetX + obj.x * this.mapScale + colliderOffsetX;
        const scaledY = this.mapOffsetY + obj.y * this.mapScale + colliderOffsetY;
        const scaledW = obj.width * this.mapScale;
        const scaledH = obj.height * this.mapScale;

        this.colliders.push({
          x: scaledX,
          y: scaledY,
          width: scaledW,
          height: scaledH
        });
      });

      // Buscar zona de salida
      const exitPoint = objectLayer.objects.find(obj => obj.name === 'exit');
      if (exitPoint) {
        this.exitZone = {
          x: this.mapOffsetX + exitPoint.x * this.mapScale,
          y: this.mapOffsetY + exitPoint.y * this.mapScale,
          width: (exitPoint.width || 40) * this.mapScale,
          height: (exitPoint.height || 40) * this.mapScale
        };
      }
    }

    // Fallback exit zone (arriba, donde está la trampilla)
    if (!this.exitZone) {
      this.exitZone = {
        x: centerX - 30,
        y: this.mapOffsetY,
        width: 60,
        height: 40
      };
    }

    // ========== DEBUG COLLIDERS (controlado desde main.js línea 40) ==========
    const DEBUG_COLLIDERS = this.game.config.physics?.arcade?.debug === true;
    if (DEBUG_COLLIDERS) {
      // Colliders en rojo
      this.colliders.forEach(col => {
        this.add.rectangle(col.x + col.width / 2, col.y + col.height / 2, col.width, col.height, 0xff0000, 0.3)
          .setDepth(998);
      });
      // Exit zone en azul
      if (this.exitZone) {
        this.add.rectangle(this.exitZone.x + this.exitZone.width / 2, this.exitZone.y + this.exitZone.height / 2,
          this.exitZone.width, this.exitZone.height, 0x0000ff, 0.4).setDepth(998);
      }
    }
    // =======================================================================

    // ============================================
    // MARLO
    // ============================================

    let spawnX = centerX;
    let spawnY = this.mapOffsetY + 150;  // Fallback más abajo

    if (objectLayer) {
      const spawnPoint = objectLayer.objects.find(obj => obj.name === 'spawn');
      if (spawnPoint) {
        spawnX = this.mapOffsetX + spawnPoint.x * this.mapScale;
        spawnY = this.mapOffsetY + spawnPoint.y * this.mapScale;
      }
    }

    // DEBUG: Marcar spawn point en verde
    if (DEBUG_COLLIDERS) {
      this.add.circle(spawnX, spawnY, 10, 0x00ff00, 0.8).setDepth(999);
    }

    this.marlo = this.add.sprite(spawnX, spawnY, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = 'south';

    // ============================================
    // ESCALERA (sprite para subir a la bodega)
    // ============================================

    // ========== ESCALERA (ajustar posición aquí) ==========
    const escaleraPosX = 350;    // Posición X (0-512) - cerca del exit
    const escaleraPosY = 70;     // Posición Y (0-320) - arriba
    const escaleraScale = 1;   // Escala del sprite
    // ======================================================

    const escaleraX = this.mapOffsetX + escaleraPosX * this.mapScale;
    const escaleraY = this.mapOffsetY + escaleraPosY * this.mapScale;

    this.escalera = this.add.image(escaleraX, escaleraY, 'escalera_item')
      .setScale(this.mapScale * escaleraScale)
      .setDepth(10);

    // Zona de interacción - usar exitZone del JSON (no la posición del sprite)
    if (this.exitZone) {
      this.escaleraZone = {
        x: this.exitZone.x + this.exitZone.width / 2,
        y: this.exitZone.y + this.exitZone.height / 2,
        radius: 80  // Radio amplio para detectar cerca del exit
      };
    } else {
      // Fallback al sprite de escalera
      this.escaleraZone = {
        x: escaleraX,
        y: escaleraY,
        radius: 60
      };
    }

    // ============================================
    // STATE FLAGS
    // ============================================

    this.globalFlags = this.loadData.globalFlags || {};
    this.piccoloHablado = this.globalFlags.piccoloHablado || false;
    this.botonRecogido = this.globalFlags.botonRecogido || false;
    this.marcasExaminadas = false;

    // ============================================
    // NPC PICCOLO
    // ============================================

    // ========== NPC PICCOLO (ajustar posición aquí) ==========
    const piccoloPosX = 80;  // Izquierda
    const piccoloPosY = 240; // Abajo
    const piccoloX = this.mapOffsetX + piccoloPosX * this.mapScale;
    const piccoloY = this.mapOffsetY + piccoloPosY * this.mapScale;

    this.piccolo = this.add.image(piccoloX, piccoloY, 'piccolo_idle')
      .setOrigin(0.5, 1)
      .setScale(this.mapScale)
      .setDepth(piccoloY)
      .setScale(1.2);
    this.hintDistance = 90; // Distancia para activar hints

    this.piccoloHint = this.add.text(0, 0, '[E] Hablar', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // ============================================
    // WALL SCRATCHES (Marcas en la pared)
    // ============================================

    // ========== MARCAS (ajustar posición aquí) ==========
    const scratchesPosX = 250;
    const scratchesPosY = 120; // Arriba en la pared
    const scratchesX = this.mapOffsetX + scratchesPosX * this.mapScale;
    const scratchesY = this.mapOffsetY + scratchesPosY * this.mapScale;

    // Zona invisible para interactuar
    this.scratchesZone = {
      x: scratchesX,
      y: scratchesY,
      radius: 60
    };

    this.scratchesHint = this.add.text(0, 0, '[E] Examinar marcas', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // ============================================
    // TRAPOS EN UN RINCÓN (nido de Piccolo)
    // ============================================

    // ========== TRAPOS (ajustar posición aquí) ==========
    const traposPosX = 390;
    const traposPosY = 255;
    const traposX = this.mapOffsetX + traposPosX * this.mapScale;
    const traposY = this.mapOffsetY + traposPosY * this.mapScale;

    this.traposZone = {
      x: traposX,
      y: traposY,
      radius: 55
    };

    this.traposHint = this.add.text(0, 0, '[E] Examinar rincón', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // ============================================
    // DIALOGUE SYSTEM (Variables)
    // ============================================

    this.dialogueActive = false;
    this.dialogueElements = [];
    this.optionButtons = [];
    this.currentOptions = null;
    this.currentNode = null;
    this.dialogueTree = null;
    this.keyUpHandler = null;
    this.keyDownHandler = null;
    this.keySelectHandler = null;

    // ============================================
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Sótano secreto | [E] Interactuar | [R] Pistas | [ESC] Menú', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Hint para la salida (escalera/trampilla arriba)
    this.exitHint = this.add.text(0, 0, '[E] Subir a la bodega', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // Inventory UI
    this.setupInventoryUI();


    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // ============================================
    // CONTROLES
    // ============================================

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    this.input.keyboard.on('keydown-ESC', () => {
      if (this.settingsUI?.isVisible()) {
        this.settingsUI.toggle();
      }
    });

    // Tecla E para interactuar (subir por la trampilla)
    this.input.keyboard.on('keydown-E', () => this.handleInteraction());

    this.input.keyboard.on('keydown-R', () => this.toggleInventory());

    this.marloSpeed = 150;
    this.exiting = false;
    this.nearExit = false;

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  checkCollision(x, y, radius = 16) {
    for (const col of this.colliders) {
      if (x + radius > col.x && x - radius < col.x + col.width &&
        y + radius > col.y && y - radius < col.y + col.height) {
        return true;
      }
    }
    return false;
  }

  checkExitZone(x, y) {
    if (!this.exitZone) return false;
    const col = this.exitZone;
    return x > col.x && x < col.x + col.width &&
      y > col.y && y < col.y + col.height;
  }

  update() {
    // Validar marloSpeed al inicio
    if (typeof this.marloSpeed !== 'number' || isNaN(this.marloSpeed)) {
      this.marloSpeed = 150;
    }

    if (this.exiting) return;

    // Si hay un diálogo o inventario activo, no procesar movimiento ni interacciones
    if (this.dialogueActive || this.inventoryVisible || this.settingsUI?.isVisible()) {
      if (this.marlo.anims.currentAnim?.key !== `marlo_idle_${this.marloDirection}`) {
        this.marlo.stop();
        this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
      }
      this.piccoloHint.setVisible(false);
      this.scratchesHint.setVisible(false);
      if (this.traposHint) this.traposHint.setVisible(false);
      if (this.exitHint) this.exitHint.setVisible(false);
      return;
    }

    // Movimiento
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    let newDirection = this.marloDirection;
    let isMoving = vx !== 0 || vy !== 0;

    if (vy < 0) newDirection = 'north';
    else if (vy > 0) newDirection = 'south';
    else if (vx < 0) newDirection = 'west';
    else if (vx > 0) newDirection = 'east';

    if (isMoving) {
      const animKey = `marlo_walk_${newDirection}`;
      if (this.marlo.anims.currentAnim?.key !== animKey) {
        this.marlo.play(animKey);
      }
    } else {
      this.marlo.stop();
      this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    }

    this.marloDirection = newDirection;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    const delta = this.game.loop.delta / 1000;
    const newX = this.marlo.x + vx * this.marloSpeed * delta;
    const newY = this.marlo.y + vy * this.marloSpeed * delta;

    // Protección anti-NaN
    if (isNaN(newX) || isNaN(newY)) {
      console.error('[Scene_Sotano] NaN position detected - aborting movement');
      return;
    }

    if (!this.checkCollision(newX, newY)) {
      this.marlo.x = newX;
      this.marlo.y = newY;
    } else {
      if (!this.checkCollision(newX, this.marlo.y)) {
        this.marlo.x = newX;
      } else if (!this.checkCollision(this.marlo.x, newY)) {
        this.marlo.y = newY;
      }
    }

    // Limitar al área del mapa (512x320 pixels)
    const mapW = 512 * this.mapScale;
    const mapH = 320 * this.mapScale;
    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, this.mapOffsetX + 30, this.mapOffsetX + mapW - 30);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, this.mapOffsetY + 50, this.mapOffsetY + mapH - 20);

    this.marlo.setDepth(this.marlo.y);

    // ==========================================
    // DISTANCIAS Y HINTS DE INTERACCIÓN
    // ==========================================

    // Piccolo
    const distPiccolo = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.piccolo.x, this.piccolo.y);
    if (distPiccolo < this.hintDistance) {
      this.piccoloHint.setPosition(this.piccolo.x, this.piccolo.y - 40);
      this.piccoloHint.setVisible(true);
    } else {
      this.piccoloHint.setVisible(false);
    }

    // Scratches (Marcas en la pared)
    const distScratches = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.scratchesZone.x, this.scratchesZone.y);
    if (distScratches < this.scratchesZone.radius) {
      this.scratchesHint.setPosition(this.scratchesZone.x, this.scratchesZone.y - 30);
      this.scratchesHint.setVisible(true);
    } else {
      this.scratchesHint.setVisible(false);
    }

    // Trapos (nido de Piccolo)
    const distTrapos = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.traposZone.x, this.traposZone.y);
    if (distTrapos < this.traposZone.radius) {
      this.traposHint.setPosition(this.traposZone.x, this.traposZone.y - 30);
      this.traposHint.setVisible(true);
    } else {
      this.traposHint.setVisible(false);
    }

    // Mostrar/ocultar hint de salida según proximidad a la escalera
    if (this.escaleraZone) {
      const distEscalera = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        this.escaleraZone.x, this.escaleraZone.y
      );

      this.nearExit = distEscalera < this.escaleraZone.radius;
      if (this.nearExit) {
        this.exitHint.setPosition(this.escaleraZone.x, this.escaleraZone.y - 50);
        this.exitHint.setVisible(true);
      } else {
        this.exitHint.setVisible(false);
      }
    }
  }

  // ==========================================
  // INTERACCIÓN CON EL ENTORNO
  // ==========================================

  handleInteraction() {
    if (this.exiting) return;
    if (this.dialogueActive || this.inventoryVisible || this.settingsUI?.isVisible()) return;

    // Piccolo
    if (this.piccolo) {
      const distPiccolo = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.piccolo.x, this.piccolo.y);
      if (distPiccolo < this.hintDistance) {
        this.interactuarPiccolo();
        return;
      }
    }

    // Marcas en la pared
    const distScratches = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.scratchesZone.x, this.scratchesZone.y);
    if (distScratches < this.scratchesZone.radius) {
      this.examinarMarcas();
      return;
    }

    // Trapos en el rincón
    const distTrapos = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.traposZone.x, this.traposZone.y);
    if (distTrapos < this.traposZone.radius) {
      this.examinarTrapos();
      return;
    }

    // Escalera de salida
    if (this.nearExit) {
      this.volverABodega();
    }
  }

  interactuarPiccolo() {
    if (this.piccoloHablado) {
      this.showSimpleDialogue("Piccolo: 'Ya te dije todo lo que sé. O todo lo que me atrevo a recordar. Aléjate. Antes de que las sombras aprendan tu nombre.'");
    } else {
      this.startPiccoloDialogue();
    }
  }

  examinarMarcas() {
    if (this.marcasExaminadas) return;
    this.marcasExaminadas = true;
    this.showThought('No es el primero... hay más marcas. Muchas más.');
    this.time.delayedCall(3500, () => {
      this.showThought('Líneas pequeñas, como las que hace un niño para medir su crecimiento. Pero estas no son de crecimiento. Son de cuenta. ¿Cuántos han pasado por aquí? ¿Cuántos han visto lo que yo estoy viendo?');
      this.time.delayedCall(3500, () => {
        this.showThought('Algunas marcas están más desgastadas. Otras, frescas. Es un registro. Un diario de piedra. Piccolo dijo que Strappavolti viene en noches especiales... cada marca es una noche. Cada noche, una ausencia.');
        this.time.delayedCall(3500, () => {
          this.showThought('En la más reciente, junto a la raya, hay una mancha oscura. No es humedad. Es como si alguien hubiera apoyado una mano temblorosa... o sangrante.');
        });
      });
    });
  }

  examinarTrapos() {
    this.showThought('Un pequeño lecho hecho de recortes de terciopelo y seda desechada. No es un nido de rata. Está ordenado, casi cuidadoso. Sobre él, un juguete: una figurita tallada en madera oscura, de un pájaro con las alas rotas. Alguien vive aquí. Alguien que intenta hacer un hogar en la herrumbre. Piccolo... ¿o alguien más antes que él?');
  }

  // ==========================================
  // FEEDBACK VISUAL Y PENSAMIENTOS
  // ==========================================

  showThought(text) {
    if (this.dialogueActive || this.inventoryVisible) return;
    this.showSimpleDialogue(text);
  }

  showSimpleDialogue(text) {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    this.clearDialogue();

    const cam = this.cameras.main;
    this.minigameDialogueBubble = this.add.text(cam.width / 2, 160, text, {
      fontFamily: 'Arial', fontSize: '16px', color: '#FFFFFF', backgroundColor: '#000000aa',
      padding: { x: 12, y: 8 }, wordWrap: { width: 500 }, align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(20000);

    this.time.delayedCall(3000, () => {
      if (this.minigameDialogueBubble) {
        this.minigameDialogueBubble.destroy();
        this.minigameDialogueBubble = null;
      }
      this.dialogueActive = false;
    });
  }

  // ==========================================
  // DIÁLOGOS DE PICCOLO (Árbol de decisiones)
  // ==========================================

  startPiccoloDialogue() {
    this.dialogueActive = true;
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_west');
    this.dialogueElements = [];
    this.optionButtons = [];

    // Árbol de diálogo: cada nodo tiene speaker, text, y options[] o next
    this.dialogueTree = {
      intro: {
        speaker: 'Piccolo',
        text: 'A veces. Las sombras son mejores compañía que la gente de arriba.',
        options: [
          { text: '¿No tienes miedo de estar solo aquí?', next: 'miedo' },
          { text: '¿Has visto algo extraño esta noche?', next: 'extrano' }
        ]
      },
      miedo: {
        speaker: 'Piccolo',
        text: '¿Miedo? El miedo vive arriba, disfrazado de máscaras y aplausos. Aquí al menos las sombras son honestas.',
        next: 'conocer_palacio'
      },
      extrano: {
        speaker: 'Piccolo',
        text: 'Todo el carnaval es extraño. Pero sí... esta noche más que otras. Esta noche huele diferente.',
        next: 'conocer_palacio'
      },
      conocer_palacio: {
        speaker: 'Piccolo',
        text: 'Conozco cada pasillo de este palacio. Lo he visto muchas veces. Al hombre sin rostro. Esta noche bajó aquí.',
        options: [
          { text: '¿Cómo es? ¿Lo reconocerías?', next: 'descripcion' },
          { text: '¿Suele bajar aquí a menudo?', next: 'patron' }
        ]
      },
      descripcion: {
        speaker: 'Piccolo',
        text: 'No tiene rostro que puedas recordar. Es como intentar recordar el vacío. Cada vez que lo ves... ya no estás seguro de lo que viste.',
        next: 'que_busca'
      },
      patron: {
        speaker: 'Piccolo',
        text: 'Siempre en noches especiales. Bodas. Funerales. Carnavales. Como si se alimentara de lo que los demás sienten.',
        next: 'que_busca'
      },
      que_busca: {
        speaker: 'Piccolo',
        text: 'No busca dinero. No busca poder. Busca algo de dentro de las personas. Algo que no se puede ver. Que no se puede tocar. Solo... sentir.',
        options: [
          { text: '¿Qué clase de cosa puede ser esa?', next: 'clase_cosa' },
          { text: '¿Y tú? ¿Te ha mirado a ti alguna vez?', next: 'vio_piccolo' }
        ]
      },
      clase_cosa: {
        speaker: 'Piccolo',
        text: 'No lo sé con palabras. Pero cuando él pasa cerca... algo en ti se siente más pequeño. Como si te mirara desde dentro.',
        next: 'boton_intro'
      },
      vio_piccolo: {
        speaker: 'Piccolo',
        text: '(Un silencio largo. El eco del agua goteando se hace más presente)\nUna vez. Hace dos carnavales. Me miró. No a los ojos... a través de ellos.\nSe quedó quieto. Luego... sonrió. O algo en él hizo la forma de una sonrisa.\nDijo: "Vacío. Como yo. Pero limpio."\nY se fue.\nNo me tocó. No me preguntó nada.\nA veces pienso que no fui descartado. Fui... archivado.',
        next: 'boton_intro'
      },
      boton_intro: {
        speaker: 'Piccolo',
        text: 'Toma. Encontré esto cuando él pasó. Es de su abrigo.',
        options: [
          { text: '¿Por qué me lo das a mí?', next: 'por_que_marlo' },
          { text: '¿Qué significa ese símbolo grabado?', next: 'simbolo' }
        ]
      },
      por_que_marlo: {
        speaker: 'Piccolo',
        text: 'Porque tú haces preguntas que tienen peso. Los otros que vinieron antes —guardias, nobles con miedo— huyeron cuando el nombre "Strappavolti" rozó el aire. Tú... inclinas la cabeza. Escuchas. Como si estuvieras buscando no solo al hombre, sino a la razón del hueco que deja.\nEso te hace diferente.\nO te hace el próximo.',
        next: 'fin'
      },
      simbolo: {
        speaker: 'Piccolo',
        text: 'No lo sé. Pero el hombre sin rostro también hace preguntas. Solo que las suyas... las hace con sangre.',
        next: 'fin'
      },
      fin: {
        speaker: 'Piccolo',
        text: 'Aléjate de las partes oscuras del palacio esta noche. Hay cosas que incluso yo evito.',
        next: null
      }
    };

    this.showDialogueNode('intro');
  }

  showDialogueNode(nodeKey) {
    this.clearDialogue();
    this.currentNode = nodeKey;
    const node = this.dialogueTree[nodeKey];
    if (!node) {
      this.endPiccoloDialogue();
      return;
    }

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.65).setOrigin(0).setDepth(10000);
    this.dialogueElements.push(overlay);

    const boxWidth = 520;
    const boxX = (width - boxWidth) / 2;
    const boxY = 100;

    // Medir altura del texto
    const tempText = this.add.text(0, 0, node.text, {
      fontFamily: 'Arial', fontSize: '17px', lineSpacing: 8, wordWrap: { width: boxWidth - 40 }
    }).setVisible(false);
    const textHeight = tempText.height;
    tempText.destroy();

    const headerHeight = 45;
    const optionsHeight = node.options ? (node.options.length * 40 + 20) : 38;
    const totalBoxHeight = headerHeight + textHeight + optionsHeight + 15;

    // Caja con color oscuro azulado (diferente a Giacomo que es dorado)
    const dialogueBox = this.add.rectangle(boxX + boxWidth / 2, boxY + totalBoxHeight / 2, boxWidth, totalBoxHeight, 0x0d1b2a, 0.96)
      .setStrokeStyle(2, 0x7ba3c4).setDepth(10001);
    this.dialogueElements.push(dialogueBox);

    // Speaker en azul grisáceo (color de Piccolo)
    const speakerTxt = this.add.text(boxX + 20, boxY + 12, `${node.speaker}:`, {
      fontFamily: 'Arial', fontSize: '17px', color: '#B0C4DE', fontStyle: 'bold'
    }).setDepth(10002);
    this.dialogueElements.push(speakerTxt);

    const contentTxt = this.add.text(boxX + 20, boxY + 42, '', {
      fontFamily: 'Arial', fontSize: '17px', color: '#E8E8E8', lineSpacing: 8, wordWrap: { width: boxWidth - 40 }
    }).setDepth(10002);
    this.dialogueElements.push(contentTxt);

    const optionsStartY = boxY + 42 + textHeight + 15;

    // Typewriter — controles aparecen al terminar
    if (this._typewriter) this._typewriter.destroy();
    this._typewriter = new TypewriterText(this, contentTxt, node.text, {
      charDelay: 30,
      onComplete: () => this._showDialogueNodeControls(node, boxX, boxWidth, optionsStartY)
    });

    this._skipHandler = () => {
      if (this._typewriter && this._typewriter.isTyping) this._typewriter.skip();
    };
    this.input.keyboard.on('keydown-SPACE', this._skipHandler);
    this.input.on('pointerdown', this._skipHandler);
  }

  _showDialogueNodeControls(node, boxX, boxWidth, optionsStartY) {
    if (this._skipHandler) {
      this.input.keyboard.off('keydown-SPACE', this._skipHandler);
      this.input.off('pointerdown', this._skipHandler);
      this._skipHandler = null;
    }

    if (node.options) {
      this.selectedOption = 0;
      this.currentOptions = node.options;
      this.optionButtons = [];

      node.options.forEach((opt, i) => {
        const optY = optionsStartY + i * 40;
        const optBtn = this.add.text(boxX + 30, optY, `➤ ${opt.text}`, {
          fontFamily: 'Arial', fontSize: '15px', color: '#7ba3c4',
          backgroundColor: '#1a2a38', padding: { x: 8, y: 5 }
        }).setDepth(10002).setInteractive()
          .on('pointerover', () => { this.selectedOption = i; this.updateOptionHighlight(); })
          .on('pointerdown', () => this.selectOption());

        this.dialogueElements.push(optBtn);
        this.optionButtons.push(optBtn);
      });

      this.updateOptionHighlight();

      this.keyUpHandler = () => { this.selectedOption = Math.max(0, this.selectedOption - 1); this.updateOptionHighlight(); };
      this.keyDownHandler = () => { this.selectedOption = Math.min(node.options.length - 1, this.selectedOption + 1); this.updateOptionHighlight(); };
      this.keySelectHandler = () => this.selectOption();

      this.input.keyboard.on('keydown-UP', this.keyUpHandler);
      this.input.keyboard.on('keydown-DOWN', this.keyDownHandler);
      this.input.keyboard.on('keydown-ENTER', this.keySelectHandler);
      this.input.keyboard.on('keydown-SPACE', this.keySelectHandler);
    } else {
      const continueTxt = this.add.text(boxX + boxWidth - 110, optionsStartY, '[Continuar]', {
        fontFamily: 'Arial', fontSize: '13px', color: '#888888', fontStyle: 'italic'
      }).setDepth(10002).setInteractive().on('pointerdown', () => this.nextPiccoloNode());
      this.dialogueElements.push(continueTxt);

      this.input.keyboard.once('keydown-SPACE', () => {
        if (this.dialogueActive) this.nextPiccoloNode();
      });
    }
  }

  nextPiccoloNode() {
    const node = this.dialogueTree?.[this.currentNode];
    if (!node || !node.next) {
      this.endPiccoloDialogue();
    } else {
      this.showDialogueNode(node.next);
    }
  }

  updateOptionHighlight() {
    if (!this.optionButtons) return;
    this.optionButtons.forEach((btn, i) => {
      if (i === this.selectedOption) {
        btn.setStyle({ color: '#ffffff', backgroundColor: '#2a3f52' });
      } else {
        btn.setStyle({ color: '#7ba3c4', backgroundColor: '#1a2a38' });
      }
    });
  }

  selectOption() {
    if (!this.currentOptions || this.selectedOption < 0) return;
    const opt = this.currentOptions[this.selectedOption];
    if (opt) {
      this.showDialogueNode(opt.next);
    }
  }

  clearDialogue() {
    // Limpiar typewriter
    if (this._typewriter) { this._typewriter.destroy(); this._typewriter = null; }
    if (this._skipHandler) {
      this.input.keyboard.off('keydown-SPACE', this._skipHandler);
      this.input.off('pointerdown', this._skipHandler);
      this._skipHandler = null;
    }

    // Limpiar listeners de teclado
    if (this.keyUpHandler) this.input.keyboard.off('keydown-UP', this.keyUpHandler);
    if (this.keyDownHandler) this.input.keyboard.off('keydown-DOWN', this.keyDownHandler);
    if (this.keySelectHandler) {
      this.input.keyboard.off('keydown-ENTER', this.keySelectHandler);
      this.input.keyboard.off('keydown-SPACE', this.keySelectHandler);
    }
    this.keyUpHandler = null;
    this.keyDownHandler = null;
    this.keySelectHandler = null;

    if (this.dialogueElements) {
      this.dialogueElements.forEach(el => el.destroy());
      this.dialogueElements = [];
    }
    this.optionButtons = [];
    this.currentOptions = null;
  }

  endPiccoloDialogue() {
    this.clearDialogue();
    this.dialogueActive = false;
    this.piccoloHablado = true;
    this.botonRecogido = true;
    this.updateInventoryView();

    // Mostramos pensamiento para dar feedback del objeto recibido y aplicamos el efecto atmosférico
    this.showThought('He conseguido un... ¿Botón de ópalo?');

    this.time.delayedCall(2500, () => {
      this.triggerFlickerEffect();
    });
  }

  triggerFlickerEffect() {
    // Apaga las luces por un instante
    this.cameras.main.setAlpha(0.2);
    this.time.delayedCall(150, () => {
      this.cameras.main.setAlpha(1);
      this.time.delayedCall(100, () => {
        this.cameras.main.setAlpha(0.1);
        this.time.delayedCall(300, () => {
          this.cameras.main.setAlpha(1);
          // Mensaje final
          this.showThought('Él sabe que estás aquí.');
        });
      });
    });
  }

  // ==========================================
  // INVENTORY UI (Botón de Ópalo)
  // ==========================================

  setupInventoryUI() {
    const { width, height } = this.scale;
    this.inventoryVisible = false;
    this.inventoryPanel = this.add.container(width / 2, height / 2).setDepth(20000).setVisible(false);

    const bg = this.add.rectangle(0, 0, 400, 300, 0x111111, 0.9).setStrokeStyle(2, 0xd0a050);
    const title = this.add.text(0, -130, 'PISTAS Y OBJETOS', {
      fontFamily: 'Arial', fontSize: '20px', color: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.itemsText = this.add.text(-170, -90, '', {
      fontFamily: 'Arial', fontSize: '16px', color: '#FFFFFF', lineSpacing: 10, wordWrap: { width: 340 }
    });

    const closeInstruction = this.add.text(0, 120, '[R] Cerrar', {
      fontFamily: 'Arial', fontSize: '14px', color: '#AAAAAA'
    }).setOrigin(0.5);

    this.inventoryPanel.add([bg, title, this.itemsText, closeInstruction]);
  }

  toggleInventory() {
    if (this.settingsUI?.isVisible() || this.dialogueActive) return;

    this.inventoryVisible = !this.inventoryVisible;
    if (this.inventoryVisible) {
      this.updateInventoryView();
      this.inventoryPanel.setVisible(true);
    } else {
      this.inventoryPanel.setVisible(false);
    }
  }

  updateInventoryView() {
    let items = '';

    // Revisamos variables de otras escenas cargadas en globalFlags por si acaso, 
    // y las propias de la escena
    if (this.globalFlags.terciopeloRecogido) {
      items += '- Trozo de terciopelo ensangrentado\n\n';
    }
    if (this.botonRecogido) {
      items += '- Botón de ópalo (abrigo oscuro)\n\n';
    }
    if (this.globalFlags.notaStrappavoltiRecogida) {
      items += '- Nota Misteriosa: "Eres curioso, pequeño. Eso es bueno."\n\n';
    }

    if (items === '') {
      items = 'No tienes ninguna pista todavía...';
    }

    if (this.itemsText) {
      this.itemsText.setText(items);
    }
  }

  // ==========================================
  // TRANSICIONES Y GUARDADO
  // ==========================================

  volverABodega() {
    if (this.exiting) return;
    this.exiting = true;

    this.tweens.killAll();
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega', { fromSotano: true, globalFlags: this.getMergedGlobalFlags() });
    });
  }

  // Combinar los flags globales previos con el estado actual
  getMergedGlobalFlags() {
    return {
      ...this.globalFlags,
      piccoloHablado: this.piccoloHablado,
      botonRecogido: this.botonRecogido,
    };
  }

  // Datos específicos de esta escena para guardar
  getSaveData() {
    return {
      piccoloHablado: this.piccoloHablado,
      botonRecogido: this.botonRecogido,
    };
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC');
    this.input.keyboard.off('keydown-E');
    this.input.keyboard.off('keydown-R');
    if (this.keyUpHandler) this.input.keyboard.off('keydown-UP', this.keyUpHandler);
    if (this.keyDownHandler) this.input.keyboard.off('keydown-DOWN', this.keyDownHandler);
    if (this.keySelectHandler) {
      this.input.keyboard.off('keydown-ENTER', this.keySelectHandler);
      this.input.keyboard.off('keydown-SPACE', this.keySelectHandler);
    }
    this.input.off('pointerdown');
    this.tweens.killAll();
  }
}
