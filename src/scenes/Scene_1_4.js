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
    // TILEMAP - ESCENARIO (mismo Hall que Scene_1_3)
    // ============================================

    this.map = this.make.tilemap({ key: 'palacio_map' });

    const tilesetHall = this.map.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = this.map.addTilesetImage('interior1', 'tileset_interior1');

    const allTilesets = [tilesetHall, tilesetInterior];

    // Crear la capa del tilemap
    const hallLayer = this.map.createLayer('Capa de patrones 1', allTilesets, 0, 0);

    // Escalar el mapa para que cubra la pantalla
    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    const mapScale = Math.max(scaleX, scaleY);

    hallLayer.setScale(mapScale);
    hallLayer.setDepth(0);

    // Centrar el mapa si es necesario
    if (scaleX > scaleY) {
      hallLayer.setY((height - mapHeight * mapScale) / 2);
    } else {
      hallLayer.setX((width - mapWidth * mapScale) / 2);
    }

    // Oscurecer la escena (atmósfera tensa)
    const darkOverlay = this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.3);
    darkOverlay.setDepth(1);

    // ============================================
    // CADÁVER (hijo del alcalde)
    // ============================================

    this.cadaver = this.add.container(centerX, height * 0.55);

    // Usar sprite del hijo del alcalde tumbado (o placeholder si no existe)
    const cuerpoBase = this.add.ellipse(0, 10, 80, 30, 0x3a0000);
    const cuerpo = this.add.rectangle(0, 0, 50, 25, 0x4a0000);
    // Cabeza SIN ROSTRO (círculo oscuro)
    const cabezaSinRostro = this.add.circle(-30, -5, 14, 0x1a0a0a);
    cabezaSinRostro.setStrokeStyle(2, 0x3a0000);

    this.cadaver.add([cuerpoBase, cuerpo, cabezaSinRostro]);
    this.cadaver.setDepth(height * 0.55);

    // ============================================
    // MULTITUD HORRORIZADA (usando NPCs reales)
    // ============================================

    this.multitud = [];

    // Círculo de personas alrededor del cadáver
    const radioCirculo = 120;
    for (let i = 0; i < 10; i++) {
      const angulo = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angulo) * radioCirculo;
      const y = height * 0.55 + Math.sin(angulo) * (radioCirculo * 0.5);

      if (y > height * 0.4) {
        this.createCiudadanoHorrorizado(x, y);
      }
    }

    // Más gente atrás
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 120;
      const y = height * 0.42;
      this.createCiudadanoHorrorizado(x, y, 0.8);
    }

    // ============================================
    // PLACEHOLDER - CARABINIERI
    // ============================================

    this.carabinieri = [];

    // Dos carabinieri a los lados (aparecerán después)
    this.carabiniere1 = this.createCarabiniere(100, height * 0.6);
    this.carabiniere1.setAlpha(0);

    this.carabiniere2 = this.createCarabiniere(width - 100, height * 0.6);
    this.carabiniere2.setAlpha(0);

    // ============================================
    // FAMILIA DE MARLO (sprites reales)
    // ============================================

    const familiaY = height * 0.75;

    // Padres de Marlo (al borde de la escena)
    this.padre = this.add.image(width - 175, familiaY, 'father_idle_west')
      .setOrigin(0.5, 1)
      .setDepth(familiaY);
    this.madre = this.add.image(width - 125, familiaY, 'mother_idle_west')
      .setOrigin(0.5, 1)
      .setDepth(familiaY)
      .setScale(0.9);

    // Marlo (cerca de los padres, será controlable después)
    this.marlo = this.add.sprite(width - 150, height * 0.8, 'marlo_idle_south')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.8);
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

    // Caja de pensamiento (diferente estilo)
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
    // SECUENCIA DE LA ESCENA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;
    this.gameplayMode = false;

    // Input para avanzar diálogos
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Controles de movimiento (para gameplay)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    // Iniciar secuencia con fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  createCiudadanoHorrorizado(x, y, scale = 1) {
    // Usar NPCs reales
    const npcIndex = Phaser.Math.Between(1, 15);
    const npcKey = `crowd_npc_front_${npcIndex}`;

    const ciudadano = this.add.image(x, y, npcKey)
      .setOrigin(0.5, 1)
      .setScale(scale)
      .setDepth(y + 10);

    // Temblor de horror
    this.tweens.add({
      targets: ciudadano,
      x: x + Phaser.Math.Between(-3, 3),
      duration: 100,
      yoyo: true,
      repeat: -1
    });

    this.multitud.push(ciudadano);
    return ciudadano;
  }

  createCarabiniere(x, y) {
    const carabiniere = this.add.image(x, y, 'carabiniere').setOrigin(0.5, 1);
    carabiniere.setDepth(y);
    return carabiniere;
  }

  handleInput() {
    if (this.gameplayMode) return;

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
        // Pausa inicial - escena del horror
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
        // Padres de Marlo
        this.showDialogue('Madre de Marlo', 'Tenemos que movernos, Marlo. Vamos a irnos.');
        break;

      case 7:
        // Marlo responde
        this.showDialogue('Marlo', 'Vale, pero dame un segundo, tengo que coger una cosa.');
        break;

      case 8:
        // Pensamiento de Marlo
        this.showThought('No... necesito ver eso.');
        break;

      case 9:
        // Iniciar gameplay
        this.startGameplay();
        break;
    }
  }

  carabinieriIntervienen(callback) {
    const { width, height } = this.scale;

    // Texto indicador
    const interventionText = this.add.text(width / 2, height * 0.3, '[ Los carabinieri intervienen ]', {
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

    // Dispersar multitud (mover hacia los lados)
    this.multitud.forEach((ciudadano, i) => {
      const direccion = ciudadano.x < width / 2 ? -1 : 1;
      this.tweens.add({
        targets: ciudadano,
        x: ciudadano.x + direccion * 50,
        alpha: 0.5,
        duration: 1000,
        delay: 800 + i * 100,
        ease: 'Power2'
      });
    });

    // Finalizar
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
    this.instructionText = this.add.text(width / 2, 50, 'Usa las flechas o WASD para mover a Marlo\nAcércate al cadáver para investigar', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    // Zona de interacción cerca del cadáver
    this.zonaInvestigar = this.add.circle(width / 2, height * 0.55, 60, 0xff0000, 0.1);

    // Habilitar física simple para Marlo
    this.marloSpeed = 150;
  }

  update() {
    if (!this.gameplayMode) return;

    // Movimiento de Marlo
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    // Determinar dirección y animación
    let newDirection = this.marloDirection;
    let isMoving = vx !== 0 || vy !== 0;

    if (vy < 0) newDirection = 'north';
    else if (vy > 0) newDirection = 'south';
    else if (vx < 0) newDirection = 'west';
    else if (vx > 0) newDirection = 'east';

    // Actualizar animación si cambió dirección o estado de movimiento
    if (isMoving) {
      const animKey = `marlo_walk_${newDirection}`;
      if (this.marlo.anims.currentAnim?.key !== animKey) {
        this.marlo.play(animKey);
      }
    } else {
      // Detener y mostrar idle
      this.marlo.stop();
      this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    }

    this.marloDirection = newDirection;

    // Normalizar diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    // Aplicar movimiento
    const delta = this.game.loop.delta / 1000;
    this.marlo.x += vx * this.marloSpeed * delta;
    this.marlo.y += vy * this.marloSpeed * delta;

    // Limitar a los bordes
    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, 50, 750);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, 200, 550);

    // Actualizar depth para y-sorting
    this.marlo.setDepth(this.marlo.y);

    // Verificar si Marlo llegó al cadáver
    const dist = Phaser.Math.Distance.Between(
      this.marlo.x, this.marlo.y,
      this.cadaver.x, this.cadaver.y + 30
    );

    if (dist < 70 && !this.investigando) {
      this.investigando = true;
      this.iniciarInvestigacion();
    }
  }

  iniciarInvestigacion() {
    this.gameplayMode = false;

    // Detener animación de Marlo y mostrar idle mirando al cadáver
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_north');

    // Ocultar instrucciones
    if (this.instructionText) this.instructionText.destroy();
    if (this.zonaInvestigar) this.zonaInvestigar.destroy();

    // Secuencia de investigación
    this.time.delayedCall(500, () => {
      this.showThought('El hijo del Alcalde... sin rostro...');
      this.waitingForInput = true;

      // Esperar input y luego permitir movimiento libre
      const continueExploring = () => {
        if (!this.waitingForInput) return;
        this.waitingForInput = false;
        this.thoughtBox.setVisible(false);

        // Mostrar instrucciones de exploración
        const { width } = this.scale;
        this.exploreText = this.add.text(width / 2, 50, 'Explora el salón libremente\n[Pulsa ESC para terminar]', {
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#00000088',
          padding: { x: 10, y: 5 },
          align: 'center'
        }).setOrigin(0.5).setDepth(1000);

        // Reactivar gameplay
        this.gameplayMode = true;

        // Listener para terminar la escena
        this.input.keyboard.on('keydown-ESC', () => this.finalizarEscena());
      };

      this.input.keyboard.once('keydown-SPACE', continueExploring);
      this.input.once('pointerdown', continueExploring);
    });
  }

  finalizarEscena() {
    this.gameplayMode = false;

    if (this.exploreText) this.exploreText.destroy();

    // Fade out - fin de la Parte 1
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
