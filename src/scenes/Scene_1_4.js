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
    // PLACEHOLDERS - ESCENARIO (mismo Hall)
    // ============================================

    // Fondo del hall (más oscuro, atmósfera tensa)
    this.add.rectangle(centerX, centerY, width, height, 0x1a0a0a);

    // Pared de fondo
    this.add.rectangle(centerX, height * 0.25, width, height * 0.35, 0x2a1010);

    // Cortinas laterales
    this.add.rectangle(50, height * 0.4, 80, height * 0.6, 0x5a0000).setOrigin(0.5, 0.5);
    this.add.rectangle(width - 50, height * 0.4, 80, height * 0.6, 0x5a0000).setOrigin(0.5, 0.5);

    // Candelabros (más tenues)
    for (let i = 0; i < 3; i++) {
      const cx = 200 + i * 200;
      this.add.circle(cx, 80, 25, 0xaa8800, 0.5);
    }

    // Suelo
    this.add.rectangle(centerX, height * 0.75, width, height * 0.5, 0x2a2a3a);

    // ============================================
    // PLACEHOLDER - CADÁVER
    // ============================================

    this.cadaver = this.add.container(centerX, height * 0.55);

    // Cuerpo en el suelo
    const cuerpoBase = this.add.ellipse(0, 10, 80, 30, 0x3a0000);
    const cuerpo = this.add.rectangle(0, 0, 50, 25, 0x4a0000);
    // Cabeza SIN ROSTRO (círculo oscuro)
    const cabezaSinRostro = this.add.circle(-30, -5, 14, 0x1a0a0a);
    cabezaSinRostro.setStrokeStyle(2, 0x3a0000);

    // Etiqueta
    const cadaverLabel = this.add.text(0, 35, '[VÍCTIMA - SIN ROSTRO]', {
      fontSize: '10px',
      color: '#ff0000'
    }).setOrigin(0.5);

    this.cadaver.add([cuerpoBase, cuerpo, cabezaSinRostro, cadaverLabel]);

    // ============================================
    // PLACEHOLDER - MULTITUD HORRORIZADA
    // ============================================

    this.multitud = [];

    // Círculo de personas alrededor del cadáver
    const radioCirculo = 120;
    for (let i = 0; i < 10; i++) {
      const angulo = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angulo) * radioCirculo;
      const y = height * 0.55 + Math.sin(angulo) * (radioCirculo * 0.5);

      if (y > height * 0.4) { // Solo los que están "delante"
        this.createCiudadanoHorrorizado(x, y);
      }
    }

    // Más gente atrás
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 120;
      const y = height * 0.42;
      this.createCiudadanoHorrorizado(x, y, 0.7);
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
    // PLACEHOLDER - FAMILIA DE MARLO
    // ============================================

    // Padres de Marlo (al borde de la escena)
    this.padresMarlo = this.add.container(width - 150, height * 0.75);

    const padre = this.createPersonaSimple(-25, 0, 0x3a5a7a, 'PADRE');
    const madre = this.createPersonaSimple(25, 0, 0x7a3a5a, 'MADRE');

    this.padresMarlo.add([padre, madre]);

    // Marlo (cerca de los padres, será controlable después)
    this.marlo = this.add.container(width - 150, height * 0.8);
    const marloBody = this.add.rectangle(0, 0, 32, 48, 0x4a7c4e);
    const marloHead = this.add.circle(0, -32, 14, 0xf5d0c5);
    const marloMascara = this.add.ellipse(0, -32, 10, 8, 0xffd700);
    const marloLabel = this.add.text(0, 38, 'MARLO', {
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.marlo.add([marloBody, marloHead, marloMascara, marloLabel]);
    this.marlo.setDepth(height * 0.8);

    // ============================================
    // UI - Indicador de escena (debug)
    // ============================================

    this.debugText = this.add.text(10, 10, 'ESCENA 1-4: El Asesinato', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    }).setDepth(1000);

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
    const colors = [0x2a3a4a, 0x3a2a4a, 0x4a3a2a, 0x2a4a3a];
    const color = Phaser.Math.RND.pick(colors);

    const ciudadano = this.add.container(x, y);
    const body = this.add.rectangle(0, 0, 25, 40, color);
    const head = this.add.circle(0, -25, 10, 0xf5d0c5);
    const mascara = this.add.ellipse(0, -25, 8, 6, 0xffd700, 0.8);

    // Brazos levantados (horror)
    const brazoIzq = this.add.rectangle(-15, -15, 6, 20, color).setAngle(-30);
    const brazoDer = this.add.rectangle(15, -15, 6, 20, color).setAngle(30);

    ciudadano.add([body, brazoIzq, brazoDer, head, mascara]);
    ciudadano.setScale(scale);
    ciudadano.setDepth(y);

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

  createCarabiniere(x, y) {
    const carabiniere = this.add.container(x, y);

    const body = this.add.rectangle(0, 0, 30, 50, 0x00008B); // Azul oscuro
    const head = this.add.circle(0, -32, 12, 0xf5d0c5);
    const sombrero = this.add.rectangle(0, -45, 25, 10, 0x000040);
    const label = this.add.text(0, 40, '[CARABINIERE]', {
      fontSize: '8px',
      color: '#8888ff'
    }).setOrigin(0.5);

    carabiniere.add([body, head, sombrero, label]);
    carabiniere.setDepth(y);

    return carabiniere;
  }

  createPersonaSimple(x, y, color, label) {
    const container = this.add.container(x, y);

    const body = this.add.rectangle(0, 0, 28, 45, color);
    const head = this.add.circle(0, -28, 11, 0xf5d0c5);
    const mascara = this.add.ellipse(0, -28, 8, 6, 0xcccccc, 0.8);
    const labelText = this.add.text(0, 35, label, {
      fontSize: '9px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    container.add([body, head, mascara, labelText]);
    return container;
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

    // Actualizar debug text
    this.debugText.setText('ESCENA 1-4: GAMEPLAY - Mueve a Marlo');

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

    // Ocultar instrucciones
    if (this.instructionText) this.instructionText.destroy();
    if (this.zonaInvestigar) this.zonaInvestigar.destroy();

    this.debugText.setText('ESCENA 1-4: Investigación');

    // Secuencia de investigación
    this.time.delayedCall(500, () => {
      this.showThought('El hijo del Alcalde... sin rostro...');
      this.waitingForInput = true;

      // Esperar input y luego terminar
      const finishScene = () => {
        if (!this.waitingForInput) return;
        this.waitingForInput = false;
        this.thoughtBox.setVisible(false);

        // Fade out - fin de la Parte 1
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          // Volver al menú (fin del contenido actual)
          this.scene.start('MenuScene');
        });
      };

      this.input.keyboard.once('keydown-SPACE', finishScene);
      this.input.once('pointerdown', finishScene);
    });
  }
}
