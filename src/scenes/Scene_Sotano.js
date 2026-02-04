// src/scenes/Scene_Sotano.js
// Escena Sótano: Área secreta bajo la bodega
// Accesible a través de la trampilla

import SettingsUI from '../ui/SettingsUI.js';

export default class Scene_Sotano extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_Sotano' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // ============================================
    // TILEMAP DEL SÓTANO
    // ============================================

    this.sotanoMap = this.make.tilemap({ key: 'sotano_map' });
    const tilesetSotano = this.sotanoMap.addTilesetImage('sotano', 'tileset_sotano');

    // Crear capa de tiles
    this.floorLayer = this.sotanoMap.createLayer('Capa de patrones 1', tilesetSotano, 0, 0);

    // Calcular escala y offset
    const mapWidth = this.sotanoMap.widthInPixels || 512;
    const mapHeight = this.sotanoMap.heightInPixels || 320;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.max(scaleX, scaleY);

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

        const scaledX = this.mapOffsetX + obj.x * this.mapScale;
        const scaledY = this.mapOffsetY + obj.y * this.mapScale;
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

    // ============================================
    // MARLO
    // ============================================

    let spawnX = centerX;
    let spawnY = this.mapOffsetY + 80;

    if (objectLayer) {
      const spawnPoint = objectLayer.objects.find(obj => obj.name === 'spawn');
      if (spawnPoint) {
        spawnX = this.mapOffsetX + spawnPoint.x * this.mapScale;
        spawnY = this.mapOffsetY + spawnPoint.y * this.mapScale;
      }
    }

    this.marlo = this.add.sprite(spawnX, spawnY, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = 'south';

    // ============================================
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Sótano secreto | [ESC] para subir', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

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
      } else {
        this.volverABodega();
      }
    });

    this.marloSpeed = 150;
    this.exiting = false;

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

    // Limitar al área del mapa
    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, this.mapOffsetX + 20, this.mapOffsetX + 512 * this.mapScale - 20);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, this.mapOffsetY + 40, this.mapOffsetY + 320 * this.mapScale - 20);

    this.marlo.setDepth(this.marlo.y);

    // Verificar zona de salida
    if (this.checkExitZone(this.marlo.x, this.marlo.y)) {
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

}
