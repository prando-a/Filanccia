// src/scenes/Scene_1_0.js
// Escena 1-0: Casa de Marlo - Baño
// Marlo se prepara frente al espejo antes del festival

export default class Scene_1_0 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_0' });
  }

  create() {
    const { width, height } = this.scale;

    // ============================================
    // TILEMAP - ESCENARIO
    // ============================================

    this.map = this.make.tilemap({ key: 'scene1_map' });

    const tilesetInterior = this.map.addTilesetImage('interior1', 'tileset_interior1');
    const tilesetExterior = this.map.addTilesetImage('castleTilesExterior', 'tileset_castleExterior');

    this.floorLayer = this.map.createLayer('floor', [tilesetInterior, tilesetExterior], 0, 0);

    // ============================================
    // COLLIDERS
    // ============================================

    this.colliders = this.physics.add.staticGroup();

    const colliderObjects = this.map.getObjectLayer('colliders');
    if (colliderObjects) {
      colliderObjects.objects.forEach(obj => {
        const collider = this.add.rectangle(
          obj.x + obj.width / 2,
          obj.y + obj.height / 2,
          obj.width,
          obj.height
        );
        this.physics.add.existing(collider, true);
        this.colliders.add(collider);
      });
    }

    // ============================================
    // PUNTO DE SPAWN
    // ============================================

    const objectsLayer = this.map.getObjectLayer('objects');
    let spawnX = 138;
    let spawnY = 165;

    if (objectsLayer) {
      const spawnPoint = objectsLayer.objects.find(obj => obj.name === 'player_spawn');
      if (spawnPoint) {
        spawnX = spawnPoint.x + (spawnPoint.width || 0) / 2;
        spawnY = spawnPoint.y + (spawnPoint.height || 0) / 2;
      }
    }

    this.spawnX = spawnX;
    this.spawnY = spawnY;

    // ============================================
    // MARLO (sprite con física)
    // ============================================

    this.marlo = this.physics.add.sprite(spawnX, spawnY, 'marlo_idle_north')
      .setOrigin(0.5, 0.5);

    // Ajustar el collider del jugador (más pequeño que el sprite)
    this.marlo.body.setSize(20, 12);
    this.marlo.body.setOffset(22, 48);

    this.marlo.setCollideWorldBounds(true);
    this.physics.add.collider(this.marlo, this.colliders);

    this.marloState = 'espejo';
    this.marloDirection = 'north';

    // ============================================
    // MADRE (aparece desde mother_spawn)
    // ============================================

    // Obtener mother_spawn del mapa
    let motherSpawnX = 516;
    let motherSpawnY = 338;

    if (objectsLayer) {
      const motherSpawn = objectsLayer.objects.find(obj => obj.name === 'mother_spawn');
      if (motherSpawn) {
        motherSpawnX = motherSpawn.x + (motherSpawn.width || 0) / 2;
        motherSpawnY = motherSpawn.y + (motherSpawn.height || 0) / 2;
      }
    }

    this.motherSpawnX = motherSpawnX;
    this.motherSpawnY = motherSpawnY;

    // La madre empieza fuera de pantalla (más a la derecha del spawn)
    this.madre = this.add.sprite(motherSpawnX + 80, motherSpawnY, 'mother_idle_west')
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    // ============================================
    // PLACEHOLDER - MÁSCARA
    // ============================================

    this.mascara = this.add.container(spawnX + 50, spawnY);
    const mascaraShape = this.add.ellipse(0, 0, 30, 40, 0xffd700);
    const mascaraLabel = this.add.text(0, 30, '[MÁSCARA]', {
      fontSize: '10px',
      color: '#888888'
    }).setOrigin(0.5);
    this.mascara.add([mascaraShape, mascaraLabel]);
    this.mascara.setVisible(false);
    this.mascara.setDepth(10);

    // ============================================
    // ZONA DE SALIDA (para gameplay)
    // ============================================

    // Zona de salida en la puerta (mother_spawn)
    this.zonaSalida = this.add.rectangle(
      motherSpawnX,
      motherSpawnY,
      80, 60,
      0x00ff00, 0
    );
    this.physics.add.existing(this.zonaSalida, true);

    // ============================================
    // CÁMARA
    // ============================================

    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;

    if (mapWidth < width || mapHeight < height) {
      this.cameras.main.setBounds(0, 0, Math.max(mapWidth, width), Math.max(mapHeight, height));
      this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
    } else {
      this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }

    // ============================================
    // UI
    // ============================================

    this.debugText = this.add.text(10, 10, 'ESCENA 1-0: Casa de Marlo - Baño', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 2, y: 1 }
    }).setScrollFactor(0).setDepth(1000);

    // ============================================
    // CAJA DE DIÁLOGO
    // ============================================

    this.dialogueBox = this.add.container(width / 2, height - 80);
    this.dialogueBox.setVisible(false).setScrollFactor(0).setDepth(1000);

    const boxBg = this.add.rectangle(0, 0, width - 60, 120, 0x000000, 0.85);
    boxBg.setStrokeStyle(2, 0xffffff);

    this.speakerText = this.add.text(-width / 2 + 50, -40, '', {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold'
    });

    this.dialogueText = this.add.text(-width / 2 + 50, -15, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 100 }
    });

    this.continueHint = this.add.text(width / 2 - 70, 40, '[ESPACIO]', {
      fontSize: '12px',
      color: '#888888'
    });

    this.dialogueBox.add([boxBg, this.speakerText, this.dialogueText, this.continueHint]);

    // ============================================
    // CONTROLES
    // ============================================

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    // ============================================
    // SECUENCIA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;
    this.gameplayMode = false;

    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Iniciar con fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  handleInput() {
    if (this.gameplayMode) return;

    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.currentStep++;
      this.runSequence();
    }
  }

  showDialogue(speaker, text) {
    this.speakerText.setText(speaker);
    this.dialogueText.setText(text);
    this.dialogueBox.setVisible(true);
    this.waitingForInput = true;
  }

  runSequence() {
    if (this.isAnimating) return;

    switch (this.currentStep) {
      case 0:
        // Pausa inicial - Marlo mirando al espejo
        this.isAnimating = true;
        this.time.delayedCall(2000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        // Madre aparece en la entrada
        this.isAnimating = true;
        this.madreAparece(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 2:
        // Madre habla
        this.showDialogue('Madre', '¡Marlo! ¡Llegamos tarde, date prisa!');
        break;

      case 3:
        // Marlo se da la vuelta hacia la madre
        this.isAnimating = true;
        this.marloTurn('frente', () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 4:
        // La madre sale del lugar
        this.isAnimating = true;
        this.madreSale(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 5:
        // Marlo responde (madre ya se fue)
        this.showDialogue('Marlo', '¡Ya voy! ¡Ya estoy listo!');
        break;

      case 6:
        // Marlo vuelve a mirar al espejo
        this.isAnimating = true;
        this.marloTurn('espejo', () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 7:
        // Pausa antes de la cinemática
        this.isAnimating = true;
        this.time.delayedCall(500, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 8:
        // Cinemática: colocarse la máscara
        this.isAnimating = true;
        this.cinematicaMascara(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 9:
        // Iniciar gameplay
        this.startGameplay();
        break;
    }
  }

  madreAparece(callback) {
    this.madre.setVisible(true);
    // Empieza en la puerta (spawn) y camina hacia arriba hacia Marlo
    this.madre.setPosition(this.motherSpawnX, this.motherSpawnY);

    this.madre.play('mother_walk_north');

    this.tweens.add({
      targets: this.madre,
      y: this.motherSpawnY - 80,
      duration: 800,
      ease: 'Linear',
      onComplete: () => {
        this.madre.stop();
        this.madre.setTexture('mother_idle_north');
        this.time.delayedCall(200, callback);
      }
    });
  }

  madreSale(callback) {
    // Madre se da la vuelta y sale hacia la puerta (sur)
    this.madre.setTexture('mother_idle_south');

    this.time.delayedCall(300, () => {
      this.madre.play('mother_walk_south');

      this.tweens.add({
        targets: this.madre,
        y: this.motherSpawnY + 20,
        duration: 800,
        ease: 'Linear',
        onComplete: () => {
          this.madre.setVisible(false);
          callback();
        }
      });
    });
  }

  marloTurn(direction, callback) {
    const newTexture = direction === 'espejo' ? 'marlo_idle_north' : 'marlo_idle_south';

    // Cambio directo de textura sin animación de giro
    this.marlo.setTexture(newTexture);
    this.marloState = direction;
    this.marloDirection = direction === 'espejo' ? 'north' : 'south';

    // Pequeña pausa para que se note el cambio
    this.time.delayedCall(100, callback);
  }

  cinematicaMascara(callback) {
    const { width, height } = this.scale;

    const focusX = this.marlo.x;
    const focusY = this.marlo.y - 30;

    this.tweens.add({
      targets: this.cameras.main,
      zoom: 2,
      scrollX: focusX - width / 2,
      scrollY: focusY - height / 2,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        const cinText = this.add.text(focusX, focusY - 60, '[ Marlo se coloca su máscara ]', {
          fontSize: '8px',
          color: '#ffd700',
          fontStyle: 'italic',
          backgroundColor: '#00000088',
          padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setAlpha(0).setDepth(100);

        this.tweens.add({
          targets: cinText,
          alpha: 1,
          duration: 500
        });

        this.mascara.setVisible(false);
        this.mascara.setAlpha(0);
        this.mascara.setPosition(this.marlo.x + 30, this.marlo.y);

        this.tweens.add({
          targets: this.mascara,
          alpha: 1,
          duration: 500,
          delay: 500
        });

        this.tweens.add({
          targets: this.mascara,
          x: this.marlo.x,
          y: this.marlo.y - 20,
          duration: 1000,
          delay: 1200,
          ease: 'Power2',
          onComplete: () => {
            this.mascara.setVisible(false);

            this.time.delayedCall(1000, () => {
              this.tweens.add({
                targets: cinText,
                alpha: 0,
                duration: 400
              });

              const mapCenterX = this.map.widthInPixels / 2;
              const mapCenterY = this.map.heightInPixels / 2;

              this.tweens.add({
                targets: this.cameras.main,
                zoom: 1,
                scrollX: mapCenterX - width / 2,
                scrollY: mapCenterY - height / 2,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                  this.time.delayedCall(500, callback);
                }
              });
            });
          }
        });
      }
    });
  }

  startGameplay() {
    this.gameplayMode = true;

    this.debugText.setText('ESCENA 1-0: GAMEPLAY - Sal del baño');

    // Instrucciones
    this.instructionText = this.add.text(
      this.scale.width / 2, 50,
      'Usa las flechas o WASD para mover a Marlo\nSal por la puerta',
      {
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 5 },
        align: 'center'
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);

    // Marlo mira hacia la salida (sur)
    this.marlo.setTexture('marlo_idle_south');
    this.marloDirection = 'south';

    // Detector de salida
    this.physics.add.overlap(this.marlo, this.zonaSalida, () => {
      if (!this.exiting) {
        this.exiting = true;
        this.exitScene();
      }
    });
  }

  exitScene() {
    this.gameplayMode = false;

    if (this.instructionText) this.instructionText.destroy();

    // Marlo camina hacia la salida (hacia el sur, la puerta)
    this.marlo.setVelocity(0);
    this.marlo.play('marlo_walk_south');

    this.tweens.add({
      targets: this.marlo,
      y: this.motherSpawnY + 20,
      duration: 600,
      onComplete: () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_1');
        });
      }
    });
  }

  update() {
    if (!this.gameplayMode) {
      this.marlo.setVelocity(0);
      return;
    }

    // Movimiento de Marlo
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    const speed = 120;
    let newDirection = this.marloDirection;
    const isMoving = vx !== 0 || vy !== 0;

    if (vy < 0) newDirection = 'north';
    else if (vy > 0) newDirection = 'south';
    else if (vx < 0) newDirection = 'west';
    else if (vx > 0) newDirection = 'east';

    if (isMoving) {
      const animKey = `marlo_walk_${newDirection}`;
      if (this.marlo.anims.currentAnim?.key !== animKey) {
        this.marlo.play(animKey);
      }
      this.marloDirection = newDirection;

      // Normalizar diagonal
      if (vx !== 0 && vy !== 0) {
        vx *= 0.707;
        vy *= 0.707;
      }

      this.marlo.setVelocity(vx * speed, vy * speed);
    } else {
      this.marlo.setVelocity(0);
      this.marlo.stop();
      this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    }
  }
}