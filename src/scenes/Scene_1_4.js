// src/scenes/Scene_1_4.js
// Escena 1-4: El Asesinato
// El hijo del Alcalde es encontrado muerto, sin rostro

export default class Scene_1_4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_4' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // ============================================
    // TILEMAP DEL PALACIO (mismo que Scene 1-3)
    // ============================================

    this.palacioMap = this.make.tilemap({ key: 'palacio_map' });
    const tilesetHall = this.palacioMap.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = this.palacioMap.addTilesetImage('interior1', 'tileset_interior1');

    // Crear capa de tiles
    this.floorLayer = this.palacioMap.createLayer('Capa de patrones 1', [tilesetHall, tilesetInterior], 0, 0);

    // Escalar para cubrir pantalla
    const mapWidth = this.palacioMap.widthInPixels;
    const mapHeight = this.palacioMap.heightInPixels;
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


    // ============================================
    // COLLIDERS (desde el tilemap)
    // ============================================

    this.colliders = [];
    this.bodegaZone = null;

    const objectLayer = this.palacioMap.getObjectLayer('colliders');
    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
        // Escalar posiciones según el mapa
        const scaledX = this.mapOffsetX + obj.x * this.mapScale;
        const scaledY = this.mapOffsetY + obj.y * this.mapScale;
        const scaledW = obj.width * this.mapScale;
        const scaledH = obj.height * this.mapScale;

        if (obj.name === 'bodega') {
          // Zona de transición a la bodega
          this.bodegaZone = {
            x: scaledX,
            y: scaledY,
            width: scaledW,
            height: scaledH
          };
        } else {
          // Collider normal
          this.colliders.push({
            x: scaledX,
            y: scaledY,
            width: scaledW,
            height: scaledH
          });
        }
      });
    }

    // ============================================
    // CADÁVER (donde estaba el hijo del alcalde)
    // ============================================

    this.cadaver = this.add.container(centerX, height * 0.35);

    // Cuerpo en el suelo (sprite del hijo pero rotado/en el suelo)
    const cuerpoBase = this.add.ellipse(0, 10, 80, 30, 0x3a0000, 0.5);
    const cuerpo = this.add.image(0, 0, 'mayor_son')
      .setOrigin(0.5, 0.5)
      .setAngle(90)
      .setTint(0x666666);

    this.cadaver.add([cuerpoBase, cuerpo]);
    this.cadaver.setDepth(height * 0.35);

    // ============================================
    // MULTITUD HORRORIZADA
    // ============================================

    this.multitud = [];

    // Círculo de personas alrededor del cadáver
    const radioCirculo = 100;
    for (let i = 0; i < 8; i++) {
      const angulo = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angulo) * radioCirculo;
      const y = height * 0.35 + Math.sin(angulo) * (radioCirculo * 0.6) + 50;

      if (y > height * 0.3) {
        this.createCiudadanoHorrorizado(x, y);
      }
    }

    // ============================================
    // CARABINIERI
    // ============================================

    this.carabiniere1 = this.add.image(centerX - 80, height * 0.5, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.5)
      .setAlpha(0);

    this.carabiniere2 = this.add.image(centerX + 80, height * 0.5, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.5)
      .setFlipX(true)
      .setAlpha(0);

    // ============================================
    // FAMILIA DE MARLO
    // ============================================

    this.padre = this.add.image(width - 200, height * 0.7, 'father_idle_west')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.7);

    this.madre = this.add.image(width - 220, height * 0.7, 'mother_idle_west')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.7)
      .setScale(0.80);

    // Marlo (será controlable después)
    this.marlo = this.add.sprite(width - 200, height * 0.75, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.75);
    this.marloDirection = 'south';

    // ============================================
    // CAJA DE DIÁLOGO
    // ============================================

    this.dialogueBox = this.add.container(centerX, height - 80);
    this.dialogueBox.setVisible(false).setDepth(1000);

    const boxBg = this.add.rectangle(0, 0, width - 60, 120, 0x000000, 0.9);
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
    // ESTADO DE LA ESCENA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;
    this.gameplayMode = false;
    this.investigando = false;
    this.freeExploration = false;

    // Input para diálogos
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Controles de movimiento
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    // ESC para finalizar (solo en exploración libre)
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.freeExploration) {
        this.finalizarEscena();
      }
    });

    // Verificar si venimos de la bodega
    const data = this.scene.settings.data || {};

    if (data.fromBodega) {
      // Volver directamente a exploración libre
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        // Posicionar a Marlo cerca de la zona de la bodega
        if (this.bodegaZone) {
          this.marlo.x = this.bodegaZone.x + this.bodegaZone.width / 2;
          this.marlo.y = this.bodegaZone.y + this.bodegaZone.height + 30;
        }
        this.investigando = true;
        this.startFreeExploration();
      });
    } else {
      // Iniciar con fade in y secuencia normal
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        this.time.delayedCall(500, () => this.runSequence());
      });
    }
  }

  createCiudadanoHorrorizado(x, y) {
    const npcIndex = Phaser.Math.Between(1, 15);
    const ciudadano = this.add.image(x, y, `crowd_npc_front_${npcIndex}`)
      .setOrigin(0.5, 1)
      .setDepth(y);

    // Temblor de horror
    this.tweens.add({
      targets: ciudadano,
      x: x + Phaser.Math.Between(-2, 2),
      duration: 100,
      yoyo: true,
      repeat: -1
    });

    this.multitud.push(ciudadano);
    return ciudadano;
  }

  handleInput() {
    if (this.gameplayMode || this.freeExploration) return;

    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.thoughtBox.setVisible(false);
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

  showThought(text) {
    this.thoughtText.setText(`"${text}"`);
    this.thoughtBox.setVisible(true);
    this.waitingForInput = true;
  }

  runSequence() {
    if (this.isAnimating) return;

    switch (this.currentStep) {
      case 0:
        // Pausa inicial
        this.isAnimating = true;
        this.time.delayedCall(1500, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        this.showDialogue('Ciudadano', '¡Ha muerto!');
        break;

      case 2:
        this.showDialogue('Ciudadano', '¡No es posible!');
        break;

      case 3:
        this.showDialogue('Ciudadano', '¡Por Dios!');
        break;

      case 4:
        this.showDialogue('Ciudadano', '¡No tiene rostro!');
        break;

      case 5:
        // Carabinieri intervienen
        this.isAnimating = true;
        this.carabinieriIntervienen(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 6:
        this.showDialogue('Madre de Marlo', 'Tenemos que movernos, Marlo. Vamos a irnos.');
        break;

      case 7:
        this.showDialogue('Marlo', 'Vale, pero dame un segundo, tengo que coger una cosa.');
        break;

      case 8:
        this.showThought('No... necesito ver eso.');
        break;

      case 9:
        this.startGameplay();
        break;
    }
  }

  carabinieriIntervienen(callback) {
    const { width, height } = this.scale;

    const interventionText = this.add.text(width / 2, height * 0.2, '[ Los carabinieri intervienen ]', {
      fontSize: '14px',
      color: '#8888ff',
      fontStyle: 'italic',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0).setDepth(500);

    this.tweens.add({
      targets: interventionText,
      alpha: 1,
      duration: 500
    });

    // Aparecer carabinieri
    this.tweens.add({
      targets: [this.carabiniere1, this.carabiniere2],
      alpha: 1,
      duration: 800,
      delay: 500
    });

    // Dispersar multitud
    this.multitud.forEach((ciudadano, i) => {
      const direccion = ciudadano.x < this.scale.width / 2 ? -1 : 1;
      this.tweens.add({
        targets: ciudadano,
        x: ciudadano.x + direccion * 50,
        alpha: 0.5,
        duration: 1000,
        delay: 800 + i * 100,
        ease: 'Power2'
      });
    });

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: interventionText,
        alpha: 0,
        duration: 500,
        onComplete: callback
      });
    });
  }

  startGameplay() {
    this.gameplayMode = true;

    const { width, height } = this.scale;

    // Instrucciones
    this.instructionText = this.add.text(width / 2, 30, 'Usa las flechas o WASD para moverte\nAcércate al cadáver para investigar', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Zona de interacción cerca del cadáver
    this.zonaInvestigar = this.add.circle(this.cadaver.x, this.cadaver.y + 30, 50, 0xff0000, 0.1);

    this.marloSpeed = 150;
  }

  checkCollision(x, y, radius = 16) {
    // Verificar colisión con los colliders del mapa
    for (const col of this.colliders) {
      if (x + radius > col.x && x - radius < col.x + col.width &&
          y + radius > col.y && y - radius < col.y + col.height) {
        return true;
      }
    }
    return false;
  }

  checkBodegaZone(x, y) {
    if (!this.bodegaZone) return false;
    const col = this.bodegaZone;
    return x > col.x && x < col.x + col.width &&
           y > col.y && y < col.y + col.height;
  }

  update() {
    if (!this.gameplayMode && !this.freeExploration) return;

    // Movimiento de Marlo
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    // Determinar dirección
    let newDirection = this.marloDirection;
    let isMoving = vx !== 0 || vy !== 0;

    if (vy < 0) newDirection = 'north';
    else if (vy > 0) newDirection = 'south';
    else if (vx < 0) newDirection = 'west';
    else if (vx > 0) newDirection = 'east';

    // Actualizar animación
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

    // Normalizar diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    // Calcular nueva posición
    const delta = this.game.loop.delta / 1000;
    const newX = this.marlo.x + vx * this.marloSpeed * delta;
    const newY = this.marlo.y + vy * this.marloSpeed * delta;

    // Solo verificar colisiones durante exploración libre
    // Durante la fase inicial (ir al cadáver), permitir movimiento libre
    if (this.freeExploration) {
      // Verificar colisiones antes de mover
      if (!this.checkCollision(newX, newY)) {
        this.marlo.x = newX;
        this.marlo.y = newY;
      } else {
        // Intentar deslizar por paredes
        if (!this.checkCollision(newX, this.marlo.y)) {
          this.marlo.x = newX;
        } else if (!this.checkCollision(this.marlo.x, newY)) {
          this.marlo.y = newY;
        }
      }
    } else {
      // Sin colisiones durante la fase inicial
      this.marlo.x = newX;
      this.marlo.y = newY;
    }

    // Limitar a los bordes de la pantalla
    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, 50, 750);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, 100, 580);

    // Actualizar depth para y-sorting
    this.marlo.setDepth(this.marlo.y);

    // En modo gameplay inicial, verificar si llegó al cadáver
    if (this.gameplayMode && !this.investigando) {
      const dist = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        this.cadaver.x, this.cadaver.y + 30
      );

      if (dist < 60) {
        this.investigando = true;
        this.iniciarInvestigacion();
      }
    }

    // En exploración libre, verificar zona de la bodega
    if (this.freeExploration && this.checkBodegaZone(this.marlo.x, this.marlo.y)) {
      this.entrarBodega();
    }
  }

  iniciarInvestigacion() {
    this.gameplayMode = false;

    // Detener animación
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_north');

    // Ocultar UI de gameplay
    if (this.instructionText) this.instructionText.destroy();
    if (this.zonaInvestigar) this.zonaInvestigar.destroy();

    // Secuencia de investigación
    this.time.delayedCall(500, () => {
      this.showThought('El hijo del Alcalde... sin rostro...');
      this.waitingForInput = true;

      const continueExploring = () => {
        if (!this.waitingForInput) return;
        this.waitingForInput = false;
        this.thoughtBox.setVisible(false);

        // Activar exploración libre
        this.startFreeExploration();
      };

      this.input.keyboard.once('keydown-SPACE', continueExploring);
      this.input.once('pointerdown', continueExploring);
    });
  }

  startFreeExploration() {
    this.freeExploration = true;

    const { width } = this.scale;

    // Instrucciones actualizadas
    this.freeExploreText = this.add.text(width / 2, 30, 'Explora el palacio libremente\n[ESC] para terminar | Busca la entrada a la bodega', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Indicador de la zona de la bodega (opcional, visual)
    if (this.bodegaZone) {
      this.bodegaIndicator = this.add.rectangle(
        this.bodegaZone.x + this.bodegaZone.width / 2,
        this.bodegaZone.y + this.bodegaZone.height / 2,
        this.bodegaZone.width,
        this.bodegaZone.height,
        0x00ff00, 0.2
      ).setDepth(1);

      // Parpadeo sutil
      this.tweens.add({
        targets: this.bodegaIndicator,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }
  }

  entrarBodega() {
    if (this.enteringBodega) return;
    this.enteringBodega = true;

    this.freeExploration = false;

    // Fade out y transición a la bodega
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega');
    });
  }

  finalizarEscena() {
    this.freeExploration = false;

    // Fade out - fin de la escena
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
