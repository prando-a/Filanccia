// src/scenes/Scene_Sotano.js
// Escena Sótano: Área secreta bajo la bodega
// Accesible a través de la trampilla

import SettingsUI from '../ui/SettingsUI.js';

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
      console.log('Sotano - Colliders:', this.colliders.length, 'Exit:', this.exitZone);
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
        console.log('Spawn point from JSON:', spawnPoint.x, spawnPoint.y, '-> Screen:', spawnX, spawnY);
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
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Sótano secreto | [E] Interactuar | [ESC] Menú', {
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
    if (this.exiting) return;

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

  handleInteraction() {
    // Si está cerca de la salida, subir a la bodega
    if (this.nearExit) {
      this.volverABodega();
    }
  }

  volverABodega() {
    if (this.exiting) return;
    this.exiting = true;

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega', { fromSotano: true });
    });
  }

  // Datos específicos de esta escena para guardar
  // Placeholder para futuros items/flags
  getSaveData() {
    return {};
  }
}
