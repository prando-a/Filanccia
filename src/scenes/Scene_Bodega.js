// src/scenes/Scene_Bodega.js
// Escena Bodega: Área secreta del palacio
// Marlo explora la bodega en busca de pistas

import SettingsUI from '../ui/SettingsUI.js';

export default class Scene_Bodega extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_Bodega' });
  }

  create(data) {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // Guardar si venimos del sótano
    this.fromSotano = data?.fromSotano || false;

    // ============================================
    // TILEMAP DATA (solo para colliders, spawn, exit)
    // ============================================

    this.bodegaMap = this.make.tilemap({ key: 'bodega_map' });

    // Calcular escala y offset basados en el tamaño del mapa
    const mapWidth = 832;  // Tamaño original del mapa
    const mapHeight = 512;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.min(scaleX, scaleY);

    // Centrar el mapa
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;
    this.mapOffsetY = (height - scaledHeight + 50) / 2;

    // ============================================
    // MAPA ANIMADO (spritesheet)
    // ============================================

    // Crear animación del mapa (14 frames)
    this.anims.create({
      key: 'bodega_anim',
      frames: this.anims.generateFrameNumbers('bodega_animated', { start: 0, end: 13 }),
      frameRate: 8,  // 8 FPS - ajusta según se vea bien
      repeat: -1     // Loop infinito
    });

    // Crear sprite del mapa animado
    this.animatedMap = this.add.sprite(centerX, height / 2, 'bodega_animated')
      .setOrigin(0.5, 0.5)
      .setScale(this.mapScale)
      .setDepth(0)
      .play('bodega_anim');

    // Atmósfera oscura (desactivada - descomentar para activar)
    // this.darknessOverlay = this.add.rectangle(centerX, height / 2, width, height, 0x000000, 0.2)
    //   .setDepth(1);

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
    // POSICIONES DE ELEMENTOS (calculadas primero para spawn)
    // ============================================

    // Posición de la trampilla (necesaria para spawn si venimos del sótano)
    const trampillaPosX = 200;    // Posición X (0-832)
    const trampillaPosY = 400;    // Posición Y (0-512)
    const trampillaX = this.mapOffsetX + trampillaPosX * this.mapScale;
    const trampillaY = this.mapOffsetY + trampillaPosY * this.mapScale;

    // ============================================
    // MARLO (usar spawn point del tilemap)
    // ============================================

    // Buscar el punto de spawn en el tilemap
    let spawnX = centerX;
    let spawnY = height * 0.75;
    let startDirection = 'north';

    // Si venimos del sótano, aparecer cerca de la trampilla
    if (this.fromSotano) {
      spawnX = trampillaX;
      spawnY = trampillaY + 40;  // Un poco debajo de la trampilla
      startDirection = 'south';  // Mirando hacia abajo (acaba de subir)
      console.log('Spawning from sotano near trampilla:', spawnX, spawnY);
    } else {
      const objectsLayer = this.bodegaMap.getObjectLayer('colliders');
      if (objectsLayer) {
        const spawnPoint = objectsLayer.objects.find(obj => obj.name === 'spawn');
        if (spawnPoint) {
          spawnX = this.mapOffsetX + spawnPoint.x * this.mapScale;
          spawnY = this.mapOffsetY + spawnPoint.y * this.mapScale;
          console.log('Spawn point found:', spawnX, spawnY);
        }
      }
    }

    this.marlo = this.add.sprite(spawnX, spawnY, `marlo_idle_${startDirection}`)
      .setOrigin(0.5, 1)
      .setDepth(500);
    this.marloDirection = startDirection;

    // ============================================
    // ELEMENTOS DECORATIVOS (escritorio, trampilla)
    // ============================================

    // ========== ESCRITORIO (ajustar posición aquí) ==========
    const escritorioPosX = 620;   // Posición X (0-832)
    const escritorioPosY = 100;   // Posición Y (0-512)
    const escritorioScale = 1.2;  // Escala
    // ========================================================

    const escritorioX = this.mapOffsetX + escritorioPosX * this.mapScale;
    const escritorioY = this.mapOffsetY + escritorioPosY * this.mapScale;

    this.escritorio = this.add.image(escritorioX, escritorioY, 'escritorio_item')
      .setScale(this.mapScale * escritorioScale)
      .setDepth(escritorioY);  // Y-sorting

    // ========== TRAMPILLA (posición definida arriba) ==========
    const trampillaScale = 1.0;   // Escala
    // ==========================================================

    this.trampilla = this.add.image(trampillaX, trampillaY, 'trampilla_item')
      .setScale(this.mapScale * trampillaScale)
      .setDepth(5)  // Bajo, está en el suelo
      .setInteractive({ useHandCursor: true });

    // Zona de interacción de la trampilla
    this.trampillaZone = {
      x: trampillaX,
      y: trampillaY,
      radius: 50  // Distancia para interactuar
    };

    // ============================================
    // ELEMENTOS INTERACTIVOS
    // ============================================

    // ========== NOTA MISTERIOSA (encima del escritorio) ==========
    const notaPosX = 620;      // Misma X que el escritorio
    const notaPosY = 90;      // Un poco más arriba (encima del escritorio)
    const notaScale = 0.8;     // Escala de la nota
    // =============================================================

    const notaX = this.mapOffsetX + notaPosX * this.mapScale;
    const notaY = this.mapOffsetY + notaPosY * this.mapScale;

    // Sprite de la nota (generado con PixelLab) - SIN glow
    this.notaMisteriosa = this.add.image(notaX, notaY, 'nota_item')
      .setScale(this.mapScale * notaScale)
      .setDepth(escritorioY + 1);  // Justo encima del escritorio

    this.notaRecogida = false;
    this.hintSoundPlayed = false;  // Para que el sonido solo suene una vez
    this.hintDistance = 100;       // Distancia para activar el hint sonoro

    // Cargar sonido hint (si existe)
    try {
      this.hintSound = this.sound.add('hint_sound', { volume: 0.5 });
    } catch (e) {
      console.warn('Hint sound not loaded - add hint.mp3 to src/assets/audio/');
      this.hintSound = null;
    }

    // ============================================
    // UI
    // ============================================

    this.instructionText = this.add.text(centerX, 30, 'Explora la bodega | [E] Interactuar | [ESC] Menú', {
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
    // HINTS DE INTERACCIÓN
    // ============================================

    // Hint para la nota
    this.notaHint = this.add.text(0, 0, '[E] Leer nota', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // Hint para la trampilla
    this.trampillaHint = this.add.text(0, 0, '[E] Usar trampilla', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(1002).setVisible(false);

    // Hint para la salida
    this.exitHint = this.add.text(0, 0, 'Salir al palacio', {
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
      } else {
        this.volverAlPalacio();
      }
    });
    // Tecla E para interactuar
    this.input.keyboard.on('keydown-E', () => this.handleInteraction());
    this.input.on('pointerdown', (pointer) => {
      // No interactuar si el panel de ajustes está abierto
      if (!this.settingsUI?.isVisible()) {
        this.handleInteraction();
      }
    });

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
        return;
      }
    }

    // Verificar si está cerca de la trampilla
    const distTrampilla = Phaser.Math.Distance.Between(
      this.marlo.x, this.marlo.y,
      this.trampillaZone.x, this.trampillaZone.y
    );

    if (distTrampilla < this.trampillaZone.radius) {
      this.irASotano();
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

    // ============================================
    // ACTUALIZAR HINTS DE PROXIMIDAD
    // ============================================

    // Hint de la nota
    if (!this.notaRecogida && this.notaMisteriosa) {
      const distToNota = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        this.notaMisteriosa.x, this.notaMisteriosa.y
      );

      if (distToNota < 60) {
        this.notaHint.setPosition(this.notaMisteriosa.x, this.notaMisteriosa.y - 40);
        this.notaHint.setVisible(true);

        // Hint sonoro (solo una vez)
        if (!this.hintSoundPlayed && distToNota < this.hintDistance) {
          this.hintSoundPlayed = true;
          if (this.hintSound) {
            this.hintSound.play();
          }
        }
      } else {
        this.notaHint.setVisible(false);
      }
    } else {
      this.notaHint.setVisible(false);
    }

    // Hint de la trampilla
    const distTrampilla = Phaser.Math.Distance.Between(
      this.marlo.x, this.marlo.y,
      this.trampillaZone.x, this.trampillaZone.y
    );

    if (distTrampilla < this.trampillaZone.radius) {
      this.trampillaHint.setPosition(this.trampillaZone.x, this.trampillaZone.y - 30);
      this.trampillaHint.setVisible(true);
    } else {
      this.trampillaHint.setVisible(false);
    }

    // Hint de la salida
    if (this.exitZone) {
      const exitCenterX = this.exitZone.x + this.exitZone.width / 2;
      const exitCenterY = this.exitZone.y + this.exitZone.height / 2;
      const distExit = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        exitCenterX, exitCenterY
      );

      if (distExit < 60) {
        this.exitHint.setPosition(exitCenterX, exitCenterY - 30);
        this.exitHint.setVisible(true);
      } else {
        this.exitHint.setVisible(false);
      }
    }

    // Verificar zona de salida (auto-salir al entrar)
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

  irASotano() {
    if (this.exiting) return;
    this.exiting = true;

    // Mostrar pensamiento antes de bajar
    this.showThought('Una trampilla... ¿Qué habrá abajo?');

    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Scene_Sotano');
      });
    });
  }

  // Datos específicos de esta escena para guardar
  getSaveData() {
    return {
      notaRecogida: this.notaRecogida
    };
  }
}
