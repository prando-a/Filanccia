// src/scenes/Scene_Bodega.js
// Escena Bodega: Área secreta del palacio
// Marlo explora la bodega en busca de pistas

export default class Scene_Bodega extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_Bodega' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // ============================================
    // TILEMAP DE LA BODEGA
    // ============================================

    this.bodegaMap = this.make.tilemap({ key: 'bodega_map' });

    // Debug: verificar que el tilemap se cargó
    console.log('Bodega map loaded:', this.bodegaMap);
    console.log('Map layers:', this.bodegaMap.layers.map(l => l.name));
    console.log('Map tilesets:', this.bodegaMap.tilesets.map(t => t.name));

    const tilesetBodega = this.bodegaMap.addTilesetImage('bodega', 'tileset_bodega');
    console.log('Tileset added:', tilesetBodega);

    // Crear capa de tiles
    this.floorLayer = this.bodegaMap.createLayer('Capa de patrones 1', tilesetBodega, 0, 0);
    console.log('Floor layer created:', this.floorLayer);

    // Valores por defecto para el caso en que no se cree la capa
    const mapWidth = this.bodegaMap.widthInPixels || 832;
    const mapHeight = this.bodegaMap.heightInPixels || 512;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.max(scaleX, scaleY);

    // Centrar el mapa
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;
    this.mapOffsetY = (height - scaledHeight) / 2;

    if (this.floorLayer) {
      // Escalar para cubrir pantalla
      this.floorLayer.setScale(this.mapScale);
      this.floorLayer.setPosition(this.mapOffsetX, this.mapOffsetY);
    } else {
      // Fallback: crear fondo oscuro si el tilemap no se carga
      console.warn('Could not create floor layer, using fallback background');
      this.add.rectangle(centerX, height / 2, width, height, 0x1a1a2e);
    }

    // Atmósfera oscura usando overlay (compatible con todas las versiones)
    this.darknessOverlay = this.add.rectangle(centerX, height / 2, width, height, 0x000000, 0.3)
      .setDepth(1);

    // ============================================
    // COLLIDERS (desde el tilemap)
    // ============================================

    this.colliders = [];
    this.exitZone = null;

    const objectLayer = this.bodegaMap.getObjectLayer('colliders');
    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
        // Skip spawn and exit points - they're not colliders
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
      console.log('Bodega colliders loaded:', this.colliders.length);

      // Debug: mostrar colliders visualmente (solo si debug está activado)
      if (this.game.config.physics.arcade?.debug) {
        this.colliders.forEach(col => {
          this.add.rectangle(col.x + col.width / 2, col.y + col.height / 2, col.width, col.height, 0x0000ff, 0.3)
            .setDepth(999);
        });
      }
    }

    // Zona de salida (cerca del spawn, parte inferior del mapa según tu diseño)
    // Buscar si hay un objeto "exit" en el tilemap, si no usar posición cerca del spawn
    let exitFound = false;
    if (objectLayer) {
      const exitPoint = objectLayer.objects.find(obj => obj.name === 'exit');
      if (exitPoint) {
        this.exitZone = {
          x: this.mapOffsetX + exitPoint.x * this.mapScale,
          y: this.mapOffsetY + exitPoint.y * this.mapScale,
          width: (exitPoint.width || 40) * this.mapScale,
          height: (exitPoint.height || 40) * this.mapScale
        };
        exitFound = true;
        console.log('Exit zone found:', this.exitZone);
      }
    }

    // Fallback: zona de salida cerca del spawn (parte inferior)
    if (!exitFound) {
      this.exitZone = {
        x: this.mapOffsetX + 350 * this.mapScale,
        y: this.mapOffsetY + 580 * this.mapScale,
        width: 80 * this.mapScale,
        height: 40 * this.mapScale
      };
    }

    // ============================================
    // MARLO (usar spawn point del tilemap)
    // ============================================

    // Buscar el punto de spawn en el tilemap
    let spawnX = centerX;
    let spawnY = height * 0.75;

    const objectsLayer = this.bodegaMap.getObjectLayer('colliders');
    if (objectsLayer) {
      const spawnPoint = objectsLayer.objects.find(obj => obj.name === 'spawn');
      if (spawnPoint) {
        spawnX = this.mapOffsetX + spawnPoint.x * this.mapScale;
        spawnY = this.mapOffsetY + spawnPoint.y * this.mapScale;
        console.log('Spawn point found:', spawnX, spawnY);
      }
    }

    this.marlo = this.add.sprite(spawnX, spawnY, 'marlo_idle_north')
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = 'north';

    // ============================================
    // ELEMENTOS INTERACTIVOS
    // ============================================

    // Objeto interactivo: nota misteriosa (posición ajustada al centro del mapa)
    const notaX = this.mapOffsetX + 500 * this.mapScale;
    const notaY = this.mapOffsetY + 300 * this.mapScale;
    this.notaMisteriosa = this.add.container(notaX, notaY);
    const notaGlow = this.add.circle(0, 0, 20, 0xffff00, 0.2);
    const notaSprite = this.add.rectangle(0, 0, 15, 20, 0xf5f5dc);
    this.notaMisteriosa.add([notaGlow, notaSprite]);
    this.notaMisteriosa.setDepth(340);

    // Animación de brillo
    this.tweens.add({
      targets: notaGlow,
      alpha: 0.4,
      scale: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    this.notaRecogida = false;

    // ============================================
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Explora la bodega | [ESC] para volver al palacio', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Caja de pensamiento
    this.thoughtBox = this.add.container(centerX, height - 80);
    this.thoughtBox.setVisible(false).setDepth(1000);

    const thoughtBg = this.add.rectangle(0, 0, width - 60, 100, 0x000000, 0.7);
    thoughtBg.setStrokeStyle(2, 0x4a7c4e);

    this.thoughtText = this.add.text(0, 0, '', {
      fontSize: '18px',
      color: '#aaffaa',
      fontStyle: 'italic',
      align: 'center'
    }).setOrigin(0.5);

    this.thoughtBox.add([thoughtBg, this.thoughtText]);

    // ============================================
    // CONTROLES
    // ============================================

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    this.input.keyboard.on('keydown-ESC', () => this.volverAlPalacio());
    this.input.keyboard.on('keydown-SPACE', () => this.handleInteraction());
    this.input.on('pointerdown', () => this.handleInteraction());

    this.marloSpeed = 150;
    this.waitingForInput = false;
    this.exiting = false;

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  handleInteraction() {
    if (this.waitingForInput) {
      this.waitingForInput = false;
      this.thoughtBox.setVisible(false);
      return;
    }

    // Verificar si está cerca de la nota
    if (!this.notaRecogida) {
      const dist = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        this.notaMisteriosa.x, this.notaMisteriosa.y
      );

      if (dist < 50) {
        this.recogerNota();
      }
    }
  }

  recogerNota() {
    this.notaRecogida = true;

    // Animación de recoger
    this.tweens.add({
      targets: this.notaMisteriosa,
      alpha: 0,
      scale: 0.5,
      y: this.notaMisteriosa.y - 30,
      duration: 500,
      onComplete: () => {
        this.notaMisteriosa.destroy();
      }
    });

    // Mostrar pensamiento
    this.time.delayedCall(600, () => {
      this.showThought('Una nota... "El rostro es la llave. La máscara es la prisión."');
    });
  }

  showThought(text) {
    this.thoughtText.setText(`"${text}"`);
    this.thoughtBox.setVisible(true);
    this.waitingForInput = true;
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
    if (this.waitingForInput || this.exiting) return;

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

    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, 50, 750);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, 60, 580);

    this.marlo.setDepth(this.marlo.y);

    // Verificar zona de salida
    if (this.checkExitZone(this.marlo.x, this.marlo.y)) {
      this.volverAlPalacio();
    }
  }

  volverAlPalacio() {
    if (this.exiting) return;
    this.exiting = true;

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Volver a Scene_1_4 en modo exploración libre
      this.scene.start('Scene_1_4', { fromBodega: true });
    });
  }
}
