// src/scenes/Scene_Armeria.js
// Escena Armeria: Sala de armas del palacio
// Accesible desde la bodega

import SettingsUI from '../ui/SettingsUI.js';
import TypewriterText from '../utils/TypewriterText.js';

export default class Scene_Armeria extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_Armeria' });
  }

  create(data) {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // Guardar datos de carga si vienen de un save
    this.loadData = data || {};

    // ============================================
    // TILEMAP DE LA ARMERIA
    // ============================================

    this.armeriaMap = this.make.tilemap({ key: 'armeria_map' });
    const tilesetArmeria = this.armeriaMap.addTilesetImage('armeria', 'tileset_armeria');

    // Crear capa de tiles
    this.floorLayer = this.armeriaMap.createLayer('Capa de patrones 1', tilesetArmeria, 0, 0);

    // ========== ESCALA DEL MAPA (ajustar aqui) ==========
    // Tamano original del mapa: 544x352 pixels (17x11 tiles de 32px)
    const mapWidth = 544;
    const mapHeight = 352;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.min(scaleX, scaleY);

    // Opciones de escala:
    // Math.min = ver todo el mapa (barras negras)
    // Math.max = llenar pantalla (recorta bordes)
    // Valor fijo = escala especifica (ej: 1.5)
    this.mapScale = Math.min(1.0, 1.0);  // <- CAMBIAR AQUI
    // =====================================================

    // ========== OFFSET DEL MAPA (ajustar aqui) ==========
    // Centrar el mapa en pantalla
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;   // <- +/- para mover mapa horizontal
    this.mapOffsetY = (height - scaledHeight) / 2; // <- +/- para mover mapa vertical
    // ====================================================

    if (this.floorLayer) {
      this.floorLayer.setScale(this.mapScale);
      this.floorLayer.setPosition(this.mapOffsetX, this.mapOffsetY);
    }

    // ============================================
    // COLLIDERS (desde el tilemap)
    // ============================================

    this.colliders = [];
    this.exitBodegaZone = null;

    const objectLayer = this.armeriaMap.getObjectLayer('colliders');
    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
        // Skip spawn and exit_bodega - they're not colliders
        if (obj.name === 'spawn' || obj.name === 'exit_bodega') {
          return;
        }

        // ========== OFFSET COLLIDERS (ajustar aqui) ==========
        const colliderOffsetX = 0;   // <- +/- para mover colliders horizontal
        const colliderOffsetY = 0;   // <- +/- para mover colliders vertical (+ = abajo)
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

      // Buscar zona de salida a bodega
      const exitPoint = objectLayer.objects.find(obj => obj.name === 'exit_bodega');
      if (exitPoint) {
        this.exitBodegaZone = {
          x: this.mapOffsetX + exitPoint.x * this.mapScale,
          y: this.mapOffsetY + exitPoint.y * this.mapScale,
          width: (exitPoint.width || 98) * this.mapScale,
          height: (exitPoint.height || 16.667) * this.mapScale
        };
      }
    }

    // Fallback exit zone (abajo, puerta hacia bodega)
    if (!this.exitBodegaZone) {
      this.exitBodegaZone = {
        x: this.mapOffsetX + 190.667 * this.mapScale,
        y: this.mapOffsetY + 332.667 * this.mapScale,
        width: 98 * this.mapScale,
        height: 16.667 * this.mapScale
      };
    }

    // ========== DEBUG COLLIDERS (controlado desde main.js linea 40) ==========
    const DEBUG_COLLIDERS = this.game.config.physics?.arcade?.debug === true;
    if (DEBUG_COLLIDERS) {
      // Colliders en rojo
      this.colliders.forEach(col => {
        this.add.rectangle(col.x + col.width / 2, col.y + col.height / 2, col.width, col.height, 0xff0000, 0.3)
          .setDepth(998);
      });
      // Exit zone en azul
      if (this.exitBodegaZone) {
        this.add.rectangle(
          this.exitBodegaZone.x + this.exitBodegaZone.width / 2,
          this.exitBodegaZone.y + this.exitBodegaZone.height / 2,
          this.exitBodegaZone.width,
          this.exitBodegaZone.height,
          0x0000ff, 0.4
        ).setDepth(998);
      }
      console.log('Armeria - Colliders:', this.colliders.length, 'Exit:', this.exitBodegaZone);
    }
    // =======================================================================

    // ============================================
    // MARLO
    // ============================================

    // Spawn point desde JSON: (224, 265.333)
    let spawnX = this.mapOffsetX + 224 * this.mapScale;
    let spawnY = this.mapOffsetY + 265.333 * this.mapScale;

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

    // Marlo mirando al sur (hacia la salida)
    this.marlo = this.add.sprite(spawnX, spawnY, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = 'south';

    // ============================================
    // STATE FLAGS
    // ============================================

    this.globalFlags = this.loadData.globalFlags || {};
    this.rafaelloLiberado = this.globalFlags.rafaelloLiberado || false;
    this.selloRecogido = this.globalFlags.selloRecogido || false;
    this.primeraVezAtrapado = this.globalFlags.primeraVezAtrapado !== undefined
      ? this.globalFlags.primeraVezAtrapado : true; // true = aún no ha sido atrapado nunca
    this.escuchadoDialogo = this.globalFlags.escuchadoDialogo || false;
    this.estanteriaAbierta = this.rafaelloLiberado; // si ya liberó a Rafaello, la puerta ya está abierta

    this.dialogueActive = false;
    this.dialogueElements = [];
    this.atrapado = false;
    this.mostrandoAtrapado = false;
    this.optionButtonsR = [];
    this.currentOptionsR = null;
    this.selectedOptionR = 0;
    this.currentNodeR = null;
    this.rafaelloTree = null;
    this.rafaelloSelloDado = false;
    this.rafaelloKeyUpHandler = null;
    this.rafaelloKeyDownHandler = null;
    this.rafaelloKeySelectHandler = null;

    // ============================================
    // NPC RAFAELLO (placeholder azul)
    // ============================================

    // ===== RAFAELLO (ajustar posición aquí) =====
    const rafaelloPosX = 430;
    const rafaelloPosY = 155;
    // ============================================
    const rafaelloX = this.mapOffsetX + rafaelloPosX * this.mapScale;
    const rafaelloY = this.mapOffsetY + rafaelloPosY * this.mapScale;

    this.rafaello = this.add.rectangle(rafaelloX, rafaelloY, 20, 40, 0x3a6bc9)
      .setOrigin(0.5, 1)
      .setDepth(rafaelloY);

    this.rafaelloHint = this.add.text(0, 0, '[E] Hablar con Rafaello', {
      fontSize: '12px', color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // ============================================
    // GUARDIA CORRUPTO (placeholder rojo oscuro)
    // ============================================

    // Patrulla: 0=junto a Rafaello, 1=centro sala, 2=estantería (puerta secreta)
    this.guardiaWaypoints = [
      { x: this.mapOffsetX + 375 * this.mapScale, y: this.mapOffsetY + 165 * this.mapScale },
      { x: this.mapOffsetX + 265 * this.mapScale, y: this.mapOffsetY + 200 * this.mapScale },
      { x: this.mapOffsetX + 100 * this.mapScale, y: this.mapOffsetY + 175 * this.mapScale },
    ];
    this.guardiaWaypointIndex = 0;
    this.guardiaSpeed = 52;          // px/s
    this.guardiaDetectionRadius = 78;
    this.guardiaState = 'patrol';    // 'patrol' | 'exited'
    this.guardiaExitDuration = 5000; // ms ausente antes de regresar
    this.guardiaExitTimer = 0;

    // Guardia no existe si Rafaello ya fue liberado
    if (!this.rafaelloLiberado) {
      const g0 = this.guardiaWaypoints[0];
      this.guardia = this.add.rectangle(g0.x, g0.y, 20, 40, 0x8b1a1a)
        .setOrigin(0.5, 1)
        .setDepth(g0.y);
    } else {
      this.guardia = null;
      this.guardiaState = 'exited';
    }

    // ============================================
    // ESTANTERÍA / PUERTA SECRETA
    // ============================================

    // ===== ESTANTERÍA (ajustar posición aquí) =====
    const estanteriaPosX = 82;
    const estanteriaPosY = 165;
    // ==============================================
    this.estanteriaZone = {
      x: this.mapOffsetX + estanteriaPosX * this.mapScale,
      y: this.mapOffsetY + estanteriaPosY * this.mapScale,
      radius: 55
    };

    this.estanteriaHint = this.add.text(0, 0, '[E] Examinar estantería', {
      fontSize: '12px', color: '#ffffff', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // ============================================
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Armeria | [E] Interactuar | [ESC] Menu', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Hint para la salida a bodega
    this.exitHint = this.add.text(0, 0, '[E] Volver a bodega', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

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

    // Tecla E para interactuar (volver a bodega)
    this.input.keyboard.on('keydown-E', () => this.handleInteraction());

    this.marloSpeed = 150;
    this.exiting = false;
    this.nearExit = false;

    // Fade in y pensamiento de entrada
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      if (!this.rafaelloLiberado) {
        this.showThought('¿Qué está pasando? ¿Por qué el capitán de la guardia está vigilado como un rehén?');
      }
    });
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
    if (!this.exitBodegaZone) return false;
    const col = this.exitBodegaZone;
    return x > col.x && x < col.x + col.width &&
      y > col.y && y < col.y + col.height;
  }

  update() {
    if (this.exiting || this.mostrandoAtrapado) return;

    // Validar marloSpeed al inicio
    if (typeof this.marloSpeed !== 'number' || isNaN(this.marloSpeed)) {
      this.marloSpeed = 150;
    }

    const delta = this.game.loop.delta / 1000;

    // Actualizar guardia (siempre, aunque Marlo esté bloqueado)
    if (this.guardia && !this.rafaelloLiberado) {
      this.updateGuardia(delta);
    }

    // Congelar a Marlo si hay diálogo o está siendo atrapado
    if (this.dialogueActive || this.atrapado) {
      this.marlo.stop();
      this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
      this.exitHint.setVisible(false);
      this.rafaelloHint.setVisible(false);
      this.estanteriaHint.setVisible(false);
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

    const newX = this.marlo.x + vx * this.marloSpeed * delta;
    const newY = this.marlo.y + vy * this.marloSpeed * delta;

    // Protección anti-NaN
    if (isNaN(newX) || isNaN(newY)) {
      console.error('[Scene_Armeria] NaN position detected - aborting movement');
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

    // Limitar al area del mapa (544x352 pixels)
    const mapW = 544 * this.mapScale;
    const mapH = 352 * this.mapScale;
    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, this.mapOffsetX + 30, this.mapOffsetX + mapW - 30);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, this.mapOffsetY + 50, this.mapOffsetY + mapH - 20);

    this.marlo.setDepth(this.marlo.y);

    // Hint salida a bodega
    if (this.exitBodegaZone) {
      const exitCenterX = this.exitBodegaZone.x + this.exitBodegaZone.width / 2;
      const exitCenterY = this.exitBodegaZone.y + this.exitBodegaZone.height / 2;
      const distExit = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, exitCenterX, exitCenterY);
      this.nearExit = distExit < 60;
      if (this.nearExit) {
        this.exitHint.setPosition(exitCenterX, exitCenterY - 30);
        this.exitHint.setVisible(true);
      } else {
        this.exitHint.setVisible(false);
      }
    }

    // Hint Rafaello (solo si ya fue liberado)
    if (this.rafaelloLiberado && this.rafaello) {
      const distR = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.rafaello.x, this.rafaello.y);
      if (distR < 70) {
        this.rafaelloHint.setPosition(this.rafaello.x, this.rafaello.y - 50);
        this.rafaelloHint.setVisible(true);
      } else {
        this.rafaelloHint.setVisible(false);
      }
    }

    // Hint estantería (solo visible cuando el guardia ha salido y la puerta aún no está abierta)
    if (this.guardiaState === 'exited' && !this.estanteriaAbierta) {
      const distE = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.estanteriaZone.x, this.estanteriaZone.y);
      if (distE < this.estanteriaZone.radius) {
        this.estanteriaHint.setPosition(this.estanteriaZone.x, this.estanteriaZone.y - 30);
        this.estanteriaHint.setVisible(true);
      } else {
        this.estanteriaHint.setVisible(false);
      }
    } else {
      this.estanteriaHint.setVisible(false);
    }

    // Detección del guardia
    if (this.guardia && !this.rafaelloLiberado) {
      this.checkDeteccion();
    }

    // Diálogo escuchado (proximitad al guardia en waypoint 0)
    if (!this.escuchadoDialogo && !this.rafaelloLiberado) {
      this.checkEscucha();
    }
  }

  handleInteraction() {
    if (this.exiting || this.atrapado || this.dialogueActive) return;

    // Estantería / puerta secreta (solo cuando guardia está fuera)
    if (this.guardiaState === 'exited' && !this.estanteriaAbierta) {
      const distE = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.estanteriaZone.x, this.estanteriaZone.y);
      if (distE < this.estanteriaZone.radius) {
        this.interactEstanteria();
        return;
      }
    }

    // Rafaello (solo si ya fue liberado)
    if (this.rafaelloLiberado && this.rafaello) {
      const distR = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.rafaello.x, this.rafaello.y);
      if (distR < 70) {
        if (this.selloRecogido) {
          this.showThought('Rafaello: "Ahora vete. Por la puerta trasera. Y recuerda: la oscuridad no es tu enemiga. Es tu capa. Aprende a moverte en ella."');
        } else {
          this.startRafaelloDialogue();
        }
        return;
      }
    }

    // Salida a bodega
    if (this.nearExit) {
      this.volverABodega();
    }
  }

  // ==========================================
  // GUARDIA CORRUPTO — PATRULLA
  // ==========================================

  updateGuardia(delta) {
    if (this.guardiaState === 'exited') {
      this.guardiaExitTimer -= delta * 1000;
      if (this.guardiaExitTimer <= 0) {
        // Regresa desde la estantería
        this.guardiaState = 'patrol';
        this.guardiaWaypointIndex = 2;
        this.guardia.setVisible(true);
      }
      return;
    }

    const target = this.guardiaWaypoints[this.guardiaWaypointIndex];
    const dist = Phaser.Math.Distance.Between(this.guardia.x, this.guardia.y, target.x, target.y);

    if (dist < 8) {
      if (this.guardiaWaypointIndex === 2) {
        // Llegó a la estantería — sale por la puerta secreta
        this.guardia.setVisible(false);
        this.guardiaState = 'exited';
        this.guardiaExitTimer = this.guardiaExitDuration;
        this.guardiaWaypointIndex = 0;
      } else {
        this.guardiaWaypointIndex = (this.guardiaWaypointIndex + 1) % this.guardiaWaypoints.length;
      }
    } else {
      const angle = Phaser.Math.Angle.Between(this.guardia.x, this.guardia.y, target.x, target.y);
      this.guardia.x += Math.cos(angle) * this.guardiaSpeed * delta;
      this.guardia.y += Math.sin(angle) * this.guardiaSpeed * delta;
      this.guardia.setDepth(this.guardia.y);
    }
  }

  checkDeteccion() {
    if (this.guardiaState === 'exited' || this.atrapado || this.dialogueActive) return;
    const dist = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.guardia.x, this.guardia.y);
    if (dist < this.guardiaDetectionRadius) {
      this.atraparMarlo();
    }
  }

  checkEscucha() {
    if (this.escuchadoDialogo || this.dialogueActive || this.guardiaState === 'exited') return;
    // Marlo escucha si está cerca pero no tan cerca como para ser detectado,
    // y el guardia está en el waypoint 0 (junto a Rafaello)
    if (this.guardiaWaypointIndex !== 0) return;
    const distGuardia = Phaser.Math.Distance.Between(this.marlo.x, this.marlo.y, this.guardia.x, this.guardia.y);
    if (distGuardia > this.guardiaDetectionRadius && distGuardia < 160) {
      this.escuchadoDialogo = true;
      this.startOverheardDialogue();
    }
  }

  // ==========================================
  // GUARDIA CORRUPTO — DETECCIÓN Y RESPAWN
  // ==========================================

  atraparMarlo() {
    if (this.atrapado) return;
    this.atrapado = true;
    this.mostrandoAtrapado = true;
    this.marlo.stop();
    this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.mostrarMensajeAtrapado();
    });
  }

  mostrarMensajeAtrapado() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(600, 0, 0, 0);
    const msgs = [];

    // Primera vez: mostrar tutorial
    if (this.primeraVezAtrapado) {
      this.primeraVezAtrapado = false;
      msgs.push(this.add.text(width / 2, height / 2 - 35,
        'No dejes que te vean los enemigos.',
        { fontFamily: 'Arial', fontSize: '20px', color: '#ff4444', fontStyle: 'bold', align: 'center' }
      ).setOrigin(0.5).setDepth(20000));
    }

    msgs.push(this.add.text(width / 2, height / 2 + 15,
      'El guardia te ha visto...',
      { fontFamily: 'Arial', fontSize: '16px', color: '#cccccc', align: 'center' }
    ).setOrigin(0.5).setDepth(20000));

    this.time.delayedCall(2500, () => {
      msgs.forEach(m => m.destroy());
      this.respawnMarlo();
    });
  }

  respawnMarlo() {
    // Volver al spawn point
    const objectLayer = this.armeriaMap.getObjectLayer('colliders');
    let spawnX = this.mapOffsetX + 224 * this.mapScale;
    let spawnY = this.mapOffsetY + 265 * this.mapScale;
    if (objectLayer) {
      const sp = objectLayer.objects.find(o => o.name === 'spawn');
      if (sp) {
        spawnX = this.mapOffsetX + sp.x * this.mapScale;
        spawnY = this.mapOffsetY + sp.y * this.mapScale;
      }
    }
    this.marlo.x = spawnX;
    this.marlo.y = spawnY;
    this.marloDirection = 'south';
    this.marlo.setTexture('marlo_idle_south');

    // Resetear guardia al primer waypoint
    const g0 = this.guardiaWaypoints[0];
    this.guardia.x = g0.x;
    this.guardia.y = g0.y;
    this.guardia.setVisible(true);
    this.guardiaState = 'patrol';
    this.guardiaWaypointIndex = 0;

    this.atrapado = false;
    this.mostrandoAtrapado = false;
  }

  // ==========================================
  // DIÁLOGO ESCUCHADO (guardia ↔ Rafaello)
  // ==========================================

  startOverheardDialogue() {
    this.dialogueActive = true;
    this.marlo.stop();
    this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    this.overheardLines = [
      { speaker: 'Guardia',  text: 'El Comité quiere silencio, capitán. Esta noche no existió nada. Un accidente. Un desgraciado tropiezo.' },
      { speaker: 'Rafaello', text: 'Encontré el sello del gabinete privado en el suelo, manchado. Eso no puede "no existir".' },
      { speaker: 'Guardia',  text: '(VOZ BAJA, TENSA) Entregue el sello o esto se complica para usted. Para mí también. ¿Entiende? No son solo sus veinte años los que penden de un hilo.' },
      { speaker: 'Rafaello', text: 'Llevo veinte años sirviendo a este palacio. Juré lealtad a la verdad, no al silencio.' },
      { speaker: 'Guardia',  text: '(UN SUSPIRO CANSADO) Y querrá veinte más. O una pensión. O un funeral digno. Piénselo. No estamos luchando contra un hombre; estamos nadando contra la corriente de todo un sistema.' },
      { speaker: 'Rafaello', text: '...' },
      { speaker: 'Guardia',  text: 'Bien. Haré otra ronda. Cuando vuelva, más le vale tener una respuesta que podamos los dos digerir.' },
    ];
    this.overheardIndex = 0;
    this.showOverheardLine();
  }

  showOverheardLine() {
    this.clearDialogue();
    const line = this.overheardLines[this.overheardIndex];
    if (!line) {
      this.endOverheardDialogue();
      return;
    }

    const { width } = this.scale;
    const color = line.speaker === 'Guardia' ? '#cc4444' : '#7ba3c4';

    const bubble = this.add.text(width / 2, 185, `${line.speaker}: "${line.text}"`, {
      fontFamily: 'Arial', fontSize: '16px', color: color,
      backgroundColor: '#000000cc', padding: { x: 14, y: 8 },
      wordWrap: { width: 520 }, align: 'center'
    }).setOrigin(0.5).setDepth(10000);
    this.dialogueElements.push(bubble);

    const hint = this.add.text(width / 2, bubble.y + bubble.height / 2 + 20, '[Espacio] Continuar', {
      fontFamily: 'Arial', fontSize: '12px', color: '#888888', fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(10000);
    this.dialogueElements.push(hint);

    this.input.keyboard.once('keydown-SPACE', () => {
      if (this.dialogueActive) {
        this.overheardIndex++;
        this.showOverheardLine();
      }
    });
  }

  endOverheardDialogue() {
    this.clearDialogue();
    this.dialogueActive = false;
    this.showThought('Rafaello está retenido. Necesito encontrar la forma de llegar hasta él.');
  }

  // ==========================================
  // ESTANTERÍA / PUERTA SECRETA
  // ==========================================

  interactEstanteria() {
    if (!this.globalFlags.botonRecogido) {
      this.showThought('Hay un mecanismo extraño en la madera... necesito algo que encaje.');
      return;
    }
    // El botón de ópalo encaja con el símbolo de la cerradura
    this.estanteriaAbierta = true;
    this.rafaelloLiberado = true;
    if (this.guardia) this.guardia.setVisible(false); // Guardia ya no regresa
    this.showThought('El botón de ópalo encaja perfectamente. La estantería se mueve...');
    this.time.delayedCall(3500, () => {
      this.showThought('Rafaello: "¿Quién eres tú? No importa... gracias."');
    });
  }

  // ==========================================
  // FEEDBACK VISUAL
  // ==========================================

  clearDialogue() {
    // Limpiar typewriter
    if (this._typewriter) { this._typewriter.destroy(); this._typewriter = null; }
    if (this._skipHandler) {
      this.input.keyboard.off('keydown-SPACE', this._skipHandler);
      this.input.off('pointerdown', this._skipHandler);
      this._skipHandler = null;
    }

    if (this.dialogueElements) {
      this.dialogueElements.forEach(el => el.destroy());
      this.dialogueElements = [];
    }
  }

  showThought(text) {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    this.clearDialogue();
    const { width } = this.scale;
    const bubble = this.add.text(width / 2, 165, text, {
      fontFamily: 'Arial', fontSize: '16px', color: '#aaffaa', fontStyle: 'italic',
      backgroundColor: '#000000aa', padding: { x: 12, y: 8 },
      wordWrap: { width: 500 }, align: 'center'
    }).setOrigin(0.5).setDepth(20000);
    this.dialogueElements.push(bubble);
    this.time.delayedCall(3000, () => {
      this.clearDialogue();
      this.dialogueActive = false;
    });
  }

  // ==========================================
  // DIÁLOGOS DE RAFAELLO (Árbol de decisiones)
  // ==========================================

  startRafaelloDialogue() {
    this.dialogueActive = true;
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_west');
    this.dialogueElements = [];
    this.optionButtonsR = [];
    this.rafaelloSelloDado = false;

    this.rafaelloTree = {
      intro: {
        speaker: 'Rafaello',
        text: '(Se frota las muñecas, mira a Marlo con mezcla de incredulidad y alivio)\nTú no eres de los guardias. Ni de los sirvientes. Tu ropa es de calle.',
        options: [
          { text: 'No. Soy Marlo. Vi lo que pasó. Giacomo y Piccolo me hablaron del hombre sin rostro.', next: 'respuesta_a' },
          { text: 'Sé que el Comité quiere silenciar el asesinato. Que hay miedo.', next: 'respuesta_b' }
        ]
      },
      respuesta_a: {
        speaker: 'Rafaello',
        text: '(ASIENTE, LENTAMENTE) Esos dos... Giacomo el sombrío, Piccolo el fantasma. Siguen vivos. Bien. Entonces no solo eres curioso; tienes suerte. O algo te protege.',
        next: 'prueba'
      },
      respuesta_b: {
        speaker: 'Rafaello',
        text: 'El Comité tiene miedo. El miedo hace cosas feas a las instituciones. Las convierte en jaulas de oro con cerraduras oxidadas. Pero el miedo es un arma de doble filo. También hace que los hombres hablen cuando deberían callar.',
        next: 'prueba'
      },
      prueba: {
        speaker: 'Rafaello',
        text: 'Permíteme una pregunta, Marlo. Por mi propia paz. Strappavolti deja una firma, un aire. Pero solo un objeto físico le pertenece de verdad. De lo que has encontrado... ¿cuál?',
        options: [
          { text: 'Una moneda de oro con el perfil del Duque anterior.', next: 'falla' },
          { text: 'Un guante de terciopelo oscuro, forrado en seda gris.', next: 'acierta' },
          { text: 'Una pluma de máscara de carnaval, teñida de azul noche.', next: 'falla' }
        ]
      },
      falla: {
        speaker: 'Rafaello',
        text: '(SU EXPRESIÓN SE ENDURECE, CON DECEPCIÓN)\nNo estás listo. O yo no estoy listo para confiar. Vuelve cuando las piezas encajen por sí solas en tu cabeza. Por favor.',
        next: null
      },
      acierta: {
        speaker: 'Rafaello',
        text: '(UN DESTELLO DE RECONOCIMIENTO PROFUNDO)\nLo sabías. No es deducción. Es... conexión. Hay algo en ti que él teme. Y al mismo tiempo, algo que admira. Ese guante no es un trofeo; es un recordatorio. Para él, y ahora para ti.',
        next: 'sello'
      },
      sello: {
        speaker: 'Rafaello',
        text: '(SACA UN PEQUEÑO OBJETO ENVUELTO EN PAÑO DE LINO)\nToma. El sello de lacre del gabinete privado. La llave de una puerta que nadie quiere abrir.',
        next: 'despedida'
      },
      despedida: {
        speaker: 'Rafaello',
        text: 'Haz algo con él. Yo ya no puedo moverme. Mis pasos están contados. Pero los tuyos... los tuyos aún son invisibles para ellos. Usa esa invisibilidad.',
        next: null
      }
    };

    this.showDialogueNodeRafaello('intro');
  }

  showDialogueNodeRafaello(nodeKey) {
    // Limpiar diálogo anterior
    this.clearDialogue();
    if (this.rafaelloKeyUpHandler) this.input.keyboard.off('keydown-UP', this.rafaelloKeyUpHandler);
    if (this.rafaelloKeyDownHandler) this.input.keyboard.off('keydown-DOWN', this.rafaelloKeyDownHandler);
    if (this.rafaelloKeySelectHandler) {
      this.input.keyboard.off('keydown-ENTER', this.rafaelloKeySelectHandler);
      this.input.keyboard.off('keydown-SPACE', this.rafaelloKeySelectHandler);
    }
    this.rafaelloKeyUpHandler = null;
    this.rafaelloKeyDownHandler = null;
    this.rafaelloKeySelectHandler = null;

    this.currentNodeR = nodeKey;
    const node = this.rafaelloTree[nodeKey];
    if (!node) {
      this.endRafaelloDialogue();
      return;
    }

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.65).setOrigin(0).setDepth(10000);
    this.dialogueElements.push(overlay);

    const boxWidth = 520;
    const boxX = (width - boxWidth) / 2;
    const boxY = 100;

    const tempText = this.add.text(0, 0, node.text, {
      fontFamily: 'Arial', fontSize: '17px', lineSpacing: 8, wordWrap: { width: boxWidth - 40 }
    }).setVisible(false);
    const textHeight = tempText.height;
    tempText.destroy();

    const headerHeight = 45;
    const optionsHeight = node.options ? (node.options.length * 40 + 20) : 38;
    const totalBoxHeight = headerHeight + textHeight + optionsHeight + 15;

    // Color dorado/bronce para Rafaello (capitán de guardia)
    const dialogueBox = this.add.rectangle(boxX + boxWidth / 2, boxY + totalBoxHeight / 2, boxWidth, totalBoxHeight, 0x1a1208, 0.96)
      .setStrokeStyle(2, 0xc49a3c).setDepth(10001);
    this.dialogueElements.push(dialogueBox);

    const speakerTxt = this.add.text(boxX + 20, boxY + 12, `${node.speaker}:`, {
      fontFamily: 'Arial', fontSize: '17px', color: '#c49a3c', fontStyle: 'bold'
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
      onComplete: () => this._showRafaelloNodeControls(node, nodeKey, boxX, boxWidth, optionsStartY)
    });

    this._skipHandler = () => {
      if (this._typewriter && this._typewriter.isTyping) this._typewriter.skip();
    };
    this.input.keyboard.on('keydown-SPACE', this._skipHandler);
    this.input.on('pointerdown', this._skipHandler);
  }

  _showRafaelloNodeControls(node, nodeKey, boxX, boxWidth, optionsStartY) {
    if (this._skipHandler) {
      this.input.keyboard.off('keydown-SPACE', this._skipHandler);
      this.input.off('pointerdown', this._skipHandler);
      this._skipHandler = null;
    }

    if (node.options) {
      this.selectedOptionR = 0;
      this.currentOptionsR = node.options;
      this.optionButtonsR = [];

      node.options.forEach((opt, i) => {
        const optY = optionsStartY + i * 40;
        const optBtn = this.add.text(boxX + 30, optY, `➤ ${opt.text}`, {
          fontFamily: 'Arial', fontSize: '15px', color: '#c49a3c',
          backgroundColor: '#2a1e08', padding: { x: 8, y: 5 }
        }).setDepth(10002).setInteractive()
          .on('pointerover', () => { this.selectedOptionR = i; this.updateOptionHighlightRafaello(); })
          .on('pointerdown', () => this.selectOptionRafaello());

        this.dialogueElements.push(optBtn);
        this.optionButtonsR.push(optBtn);
      });

      this.updateOptionHighlightRafaello();

      this.rafaelloKeyUpHandler = () => { this.selectedOptionR = Math.max(0, this.selectedOptionR - 1); this.updateOptionHighlightRafaello(); };
      this.rafaelloKeyDownHandler = () => { this.selectedOptionR = Math.min(node.options.length - 1, this.selectedOptionR + 1); this.updateOptionHighlightRafaello(); };
      this.rafaelloKeySelectHandler = () => this.selectOptionRafaello();

      this.input.keyboard.on('keydown-UP', this.rafaelloKeyUpHandler);
      this.input.keyboard.on('keydown-DOWN', this.rafaelloKeyDownHandler);
      this.input.keyboard.on('keydown-ENTER', this.rafaelloKeySelectHandler);
      this.input.keyboard.on('keydown-SPACE', this.rafaelloKeySelectHandler);
    } else {
      if (nodeKey === 'sello') {
        this.rafaelloSelloDado = true;
      }

      const continueTxt = this.add.text(boxX + boxWidth - 110, optionsStartY, '[Continuar]', {
        fontFamily: 'Arial', fontSize: '13px', color: '#888888', fontStyle: 'italic'
      }).setDepth(10002).setInteractive().on('pointerdown', () => this.nextRafaelloNode());
      this.dialogueElements.push(continueTxt);

      this.input.keyboard.once('keydown-SPACE', () => {
        if (this.dialogueActive) this.nextRafaelloNode();
      });
    }
  }

  nextRafaelloNode() {
    const node = this.rafaelloTree?.[this.currentNodeR];
    if (!node || !node.next) {
      this.endRafaelloDialogue();
    } else {
      this.showDialogueNodeRafaello(node.next);
    }
  }

  updateOptionHighlightRafaello() {
    if (!this.optionButtonsR) return;
    this.optionButtonsR.forEach((btn, i) => {
      if (i === this.selectedOptionR) {
        btn.setStyle({ color: '#ffffff', backgroundColor: '#3d2f10' });
      } else {
        btn.setStyle({ color: '#c49a3c', backgroundColor: '#2a1e08' });
      }
    });
  }

  selectOptionRafaello() {
    if (!this.currentOptionsR || this.selectedOptionR < 0) return;
    const opt = this.currentOptionsR[this.selectedOptionR];
    if (opt) {
      this.showDialogueNodeRafaello(opt.next);
    }
  }

  endRafaelloDialogue() {
    // Limpiar teclado
    if (this.rafaelloKeyUpHandler) this.input.keyboard.off('keydown-UP', this.rafaelloKeyUpHandler);
    if (this.rafaelloKeyDownHandler) this.input.keyboard.off('keydown-DOWN', this.rafaelloKeyDownHandler);
    if (this.rafaelloKeySelectHandler) {
      this.input.keyboard.off('keydown-ENTER', this.rafaelloKeySelectHandler);
      this.input.keyboard.off('keydown-SPACE', this.rafaelloKeySelectHandler);
    }
    this.rafaelloKeyUpHandler = null;
    this.rafaelloKeyDownHandler = null;
    this.rafaelloKeySelectHandler = null;
    this.clearDialogue();
    this.dialogueActive = false;

    if (this.rafaelloSelloDado) {
      this.selloRecogido = true;
      this.time.delayedCall(500, () => {
        this.showThought('El sello de lacre... frío y pesado en mi mano. La llave de una puerta que nadie quiere abrir.');
      });
    }
  }

  volverABodega() {
    if (this.exiting) return;
    this.exiting = true;

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega', { fromArmeria: true, globalFlags: this.getMergedGlobalFlags() });
    });
  }

  getMergedGlobalFlags() {
    return {
      ...this.globalFlags,
      rafaelloLiberado: this.rafaelloLiberado,
      selloRecogido: this.selloRecogido,
      escuchadoDialogo: this.escuchadoDialogo,
      primeraVezAtrapado: this.primeraVezAtrapado,
    };
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC');
    this.input.keyboard.off('keydown-E');
    this.input.keyboard.off('keydown-SPACE');
    if (this.rafaelloKeyUpHandler) this.input.keyboard.off('keydown-UP', this.rafaelloKeyUpHandler);
    if (this.rafaelloKeyDownHandler) this.input.keyboard.off('keydown-DOWN', this.rafaelloKeyDownHandler);
    if (this.rafaelloKeySelectHandler) {
      this.input.keyboard.off('keydown-ENTER', this.rafaelloKeySelectHandler);
      this.input.keyboard.off('keydown-SPACE', this.rafaelloKeySelectHandler);
    }
    this.tweens.killAll();
  }

  getSaveData() {
    return {
      rafaelloLiberado: this.rafaelloLiberado,
      selloRecogido: this.selloRecogido,
      escuchadoDialogo: this.escuchadoDialogo,
      primeraVezAtrapado: this.primeraVezAtrapado,
    };
  }
}
