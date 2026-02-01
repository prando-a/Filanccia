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
    const tilesetBodega = this.bodegaMap.addTilesetImage('bodega', 'tileset_bodega');

    // Crear capa de tiles
    this.floorLayer = this.bodegaMap.createLayer('Capa de patrones 1', tilesetBodega, 0, 0);

    // Escalar para cubrir pantalla (bodega es 832x512)
    const mapWidth = this.bodegaMap.widthInPixels;
    const mapHeight = this.bodegaMap.heightInPixels;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.max(scaleX, scaleY);
    this.floorLayer.setScale(this.mapScale);

    // Centrar el mapa
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;
    this.mapOffsetY = (height - scaledHeight) / 2;
    this.floorLayer.setPosition(this.mapOffsetX, this.mapOffsetY);

    // Atmósfera oscura
    this.floorLayer.setTint(0x666666);

    // ============================================
    // COLLIDERS (desde el tilemap)
    // ============================================

    this.colliders = [];
    this.exitZone = null;

    const objectLayer = this.bodegaMap.getObjectLayer('colliders');
    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
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
    }

    // Zona de salida (parte superior del mapa, cerca de donde entramos)
    this.exitZone = {
      x: this.mapOffsetX + 342 * this.mapScale,
      y: this.mapOffsetY,
      width: 40 * this.mapScale,
      height: 30 * this.mapScale
    };

    // ============================================
    // MARLO
    // ============================================

    // Marlo aparece en la parte superior (donde está la entrada desde el palacio)
    this.marlo = this.add.sprite(centerX, 80, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = 'south';

    // ============================================
    // ELEMENTOS DE LA BODEGA
    // ============================================

    // Barriles y cajas (decoración con colisión visual)
    this.createBarrel(150, 200);
    this.createBarrel(180, 220);
    this.createBarrel(600, 300);
    this.createCrate(250, 400);
    this.createCrate(550, 450);

    // Objeto interactivo: nota misteriosa
    this.notaMisteriosa = this.add.container(400, 350);
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

  createBarrel(x, y) {
    const barrel = this.add.container(x, y);
    const base = this.add.ellipse(0, 10, 30, 15, 0x4a3020);
    const body = this.add.rectangle(0, 0, 25, 30, 0x5a4030);
    const top = this.add.ellipse(0, -10, 25, 12, 0x6a5040);
    barrel.add([base, body, top]);
    barrel.setDepth(y);

    // Añadir como collider
    this.colliders.push({
      x: x - 15,
      y: y - 15,
      width: 30,
      height: 30
    });

    return barrel;
  }

  createCrate(x, y) {
    const crate = this.add.container(x, y);
    const body = this.add.rectangle(0, 0, 35, 35, 0x6a5a40);
    body.setStrokeStyle(2, 0x4a3a20);
    const cross1 = this.add.rectangle(0, 0, 30, 4, 0x4a3a20);
    const cross2 = this.add.rectangle(0, 0, 4, 30, 0x4a3a20);
    crate.add([body, cross1, cross2]);
    crate.setDepth(y);

    // Añadir como collider
    this.colliders.push({
      x: x - 17,
      y: y - 17,
      width: 35,
      height: 35
    });

    return crate;
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
