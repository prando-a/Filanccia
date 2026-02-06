// src/scenes/Scene_Armeria.js
// Escena Armeria: Sala de armas del palacio
// Accesible desde la bodega

import SettingsUI from '../ui/SettingsUI.js';

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
    if (!this.exitBodegaZone) return false;
    const col = this.exitBodegaZone;
    return x > col.x && x < col.x + col.width &&
      y > col.y && y < col.y + col.height;
  }

  update() {
    if (this.exiting) return;

    // Validar marloSpeed al inicio
    if (typeof this.marloSpeed !== 'number' || isNaN(this.marloSpeed)) {
      this.marloSpeed = 150;
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

    // Mostrar/ocultar hint de salida segun proximidad a la zona de salida
    if (this.exitBodegaZone) {
      const exitCenterX = this.exitBodegaZone.x + this.exitBodegaZone.width / 2;
      const exitCenterY = this.exitBodegaZone.y + this.exitBodegaZone.height / 2;
      const distExit = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        exitCenterX, exitCenterY
      );

      // Mostrar hint cuando esta cerca (radio de 60 pixels)
      this.nearExit = distExit < 60;
      if (this.nearExit) {
        this.exitHint.setPosition(exitCenterX, exitCenterY - 30);
        this.exitHint.setVisible(true);
      } else {
        this.exitHint.setVisible(false);
      }
    }
  }

  handleInteraction() {
    // Si esta cerca de la salida, volver a bodega
    if (this.nearExit) {
      this.volverABodega();
    }
  }

  volverABodega() {
    if (this.exiting) return;
    this.exiting = true;

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega', { fromArmeria: true });
    });
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC');
    this.input.keyboard.off('keydown-E');
  }

  // Datos especificos de esta escena para guardar
  // Placeholder para futuros items/flags
  getSaveData() {
    return {};
  }
}
