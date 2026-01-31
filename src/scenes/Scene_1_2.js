// src/scenes/Scene_1_2.js
// Escena 1-2: Plaza Central
// El Alcalde da el discurso inaugural del carnaval

export default class Scene_1_2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_2' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // ============================================
    // PLACEHOLDERS - ESCENARIO
    // ============================================

    // Cielo nocturno
    this.add.rectangle(centerX, height * 0.2, width, height * 0.4, 0x0a0a1a);

    // Edificios de fondo
    for (let i = 0; i < 6; i++) {
      const bx = i * 150 + 50;
      const bh = Phaser.Math.Between(150, 250);
      this.add.rectangle(bx, height * 0.4, 120, bh, 0x1a1a2a).setOrigin(0.5, 1);

      // Ventanas iluminadas
      for (let w = 0; w < 4; w++) {
        const wx = bx + Phaser.Math.Between(-40, 40);
        const wy = height * 0.4 - Phaser.Math.Between(30, bh - 20);
        this.add.rectangle(wx, wy, 12, 15, 0xffdd88, 0.7);
      }
    }

    // Suelo de la plaza
    this.add.rectangle(centerX, height * 0.75, width, height * 0.5, 0x3a3a4a);

    // Patrón de adoquines
    for (let i = 0; i < 10; i++) {
      const lineY = height * 0.55 + i * 30;
      this.add.rectangle(centerX, lineY, width - 50, 2, 0x2a2a3a);
    }

    // ============================================
    // PLACEHOLDER - MULTITUD
    // ============================================

    this.multitud = [];

    // Fila trasera (más pequeños, más arriba)
    for (let i = 0; i < 12; i++) {
      const x = 50 + i * 65;
      const y = height * 0.5;
      this.createCiudadano(x, y, 0.6);
    }

    // Fila media
    for (let i = 0; i < 10; i++) {
      const x = 80 + i * 75;
      const y = height * 0.58;
      this.createCiudadano(x, y, 0.75);
    }

    // Fila delantera (más grandes, más abajo) - con hueco en el centro
    for (let i = 0; i < 8; i++) {
      const x = 60 + i * 95;
      // Dejar hueco en el centro para el alcalde
      if (x < centerX - 100 || x > centerX + 100) {
        const y = height * 0.68;
        this.createCiudadano(x, y, 0.9);
      }
    }

    // ============================================
    // PLACEHOLDER - ALCALDE
    // ============================================

    this.alcalde = this.add.container(centerX, height * 0.52);

    // Plataforma/tarima
    const tarima = this.add.rectangle(0, 30, 100, 20, 0x4a3a2a);

    // Cuerpo del alcalde (más grande y distinguido)
    const alcaldeBody = this.add.rectangle(0, 0, 50, 70, 0x8B0000); // Rojo oscuro
    const alcaldeHead = this.add.circle(0, -45, 22, 0xf5d0c5);
    const alcaldeCapa = this.add.triangle(0, 10, -30, 40, 30, 40, 0, -20, 0x4a0000);

    // Etiqueta
    const alcaldeLabel = this.add.text(0, 55, 'ALCALDE', {
      fontSize: '12px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.alcalde.add([tarima, alcaldeCapa, alcaldeBody, alcaldeHead, alcaldeLabel]);

    // ============================================
    // UI - Indicador de escena (debug)
    // ============================================

    this.add.text(10, 10, 'ESCENA 1-2: Plaza Central', {
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
    // SECUENCIA DE LA ESCENA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;

    // Input para avanzar diálogos
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Iniciar secuencia con fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  createCiudadano(x, y, scale) {
    const colors = [0x2a3a4a, 0x3a2a4a, 0x4a3a2a, 0x2a4a3a, 0x3a3a5a];
    const color = Phaser.Math.RND.pick(colors);

    const ciudadano = this.add.container(x, y);
    const body = this.add.rectangle(0, 0, 25, 40, color);
    const head = this.add.circle(0, -25, 10, 0xf5d0c5);
    // Máscara (todos llevan máscara en el carnaval)
    const mascara = this.add.ellipse(0, -25, 8, 6, 0xffd700, 0.8);

    ciudadano.add([body, head, mascara]);
    ciudadano.setScale(scale);
    ciudadano.setDepth(y); // Y-sorting

    // Movimiento sutil de la multitud
    this.tweens.add({
      targets: ciudadano,
      y: y + Phaser.Math.Between(-2, 2),
      duration: Phaser.Math.Between(800, 1200),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.multitud.push(ciudadano);
  }

  handleInput() {
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
        // Pausa inicial - establecer escena
        this.isAnimating = true;
        this.time.delayedCall(1000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        // Primer diálogo del Alcalde
        this.showDialogue('Alcalde', '¡Bienvenidos, queridos filenccianos! Hoy celebramos el centenario de nuestra ciudad...');
        break;

      case 2:
        // Segundo diálogo del Alcalde
        this.showDialogue('Alcalde', '¡QUE COMIENCE EL CARNAVAL!');
        break;

      case 3:
        // Fade out y transición
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_3');
        });
        break;
    }
  }
}
