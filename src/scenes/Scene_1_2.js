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
    // ESCENARIO - PLAZA CENTRAL DE FILANCCIA
    // ============================================

    // Cielo nocturno con degradado
    const skyGradient = this.add.graphics();
    skyGradient.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a, 1);
    skyGradient.fillRect(0, 0, width, height * 0.45);

    // Estrellas
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.3),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.9)
      );
      // Parpadeo
      this.tweens.add({
        targets: star,
        alpha: star.alpha * 0.3,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Luna
    this.add.circle(width - 80, 60, 25, 0xffffee, 0.9);
    this.add.circle(width - 70, 55, 25, 0x0a0a1a, 1); // Sombra para media luna

    // Edificios de fondo (capa lejana)
    const buildingColors = [0x1a1a2a, 0x1e1e2e, 0x222232, 0x181828];
    for (let i = 0; i < 8; i++) {
      const bx = i * 110 + 30;
      const bh = Phaser.Math.Between(120, 200);
      const color = Phaser.Math.RND.pick(buildingColors);

      // Edificio principal
      this.add.rectangle(bx, height * 0.42, 90, bh, color).setOrigin(0.5, 1);

      // Techo
      this.add.triangle(bx, height * 0.42 - bh, bx - 50, height * 0.42 - bh, bx + 50, height * 0.42 - bh, bx, height * 0.42 - bh - 30, 0x2a2a3a);

      // Ventanas iluminadas
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          const wx = bx - 20 + col * 40;
          const wy = height * 0.42 - 40 - row * 45;
          const lit = Math.random() > 0.3;
          this.add.rectangle(wx, wy, 14, 20, lit ? 0xffdd88 : 0x0a0a1a, lit ? 0.8 : 0.5);
        }
      }
    }

    // Edificios cercanos (laterales)
    // Izquierda
    this.add.rectangle(0, height * 0.5, 100, height, 0x252535).setOrigin(0, 0.5);
    this.add.rectangle(90, height * 0.5, 10, height, 0x1a1a2a).setOrigin(0, 0.5); // Sombra

    // Derecha
    this.add.rectangle(width, height * 0.5, 100, height, 0x252535).setOrigin(1, 0.5);
    this.add.rectangle(width - 90, height * 0.5, 10, height, 0x1a1a2a).setOrigin(1, 0.5); // Sombra

    // Suelo de la plaza - adoquines
    this.add.rectangle(centerX, height * 0.75, width, height * 0.55, 0x4a4a5a);

    // Patrón de adoquines
    for (let row = 0; row < 12; row++) {
      const lineY = height * 0.48 + row * 25;
      for (let col = 0; col < 20; col++) {
        const offsetX = (row % 2) * 25;
        const tileX = col * 50 + offsetX;
        this.add.rectangle(tileX, lineY, 48, 23, 0x3a3a4a).setStrokeStyle(1, 0x2a2a3a);
      }
    }

    // Decoraciones del carnaval - Banderines
    for (let i = 0; i < 12; i++) {
      const bx = 80 + i * 60;
      const colors = [0xff4444, 0xffdd44, 0x44ff44, 0x4444ff, 0xff44ff];
      const bannerColor = Phaser.Math.RND.pick(colors);

      // Cuerda
      if (i < 11) {
        this.add.line(0, 0, bx, height * 0.32, bx + 60, height * 0.34, 0x888888).setOrigin(0);
      }

      // Banderín triangular
      this.add.triangle(bx, height * 0.32, bx - 8, height * 0.32, bx + 8, height * 0.32, bx, height * 0.38, bannerColor, 0.9);
    }

    // Faroles encendidos
    for (let i = 0; i < 4; i++) {
      const fx = 150 + i * 180;
      // Poste
      this.add.rectangle(fx, height * 0.5, 6, 80, 0x3a3a3a).setOrigin(0.5, 1);
      // Farol
      this.add.rectangle(fx, height * 0.5 - 80, 20, 25, 0x4a4a4a);
      // Luz
      const light = this.add.circle(fx, height * 0.5 - 75, 8, 0xffaa44);
      // Resplandor
      this.add.circle(fx, height * 0.5 - 75, 30, 0xffaa44, 0.15);

      // Parpadeo de la luz
      this.tweens.add({
        targets: light,
        alpha: 0.6,
        duration: Phaser.Math.Between(100, 300),
        yoyo: true,
        repeat: -1,
        repeatDelay: Phaser.Math.Between(2000, 5000)
      });
    }

    // Tarima del alcalde
    this.add.rectangle(centerX, height * 0.46, 180, 15, 0x5a4a3a);
    this.add.rectangle(centerX, height * 0.48, 200, 10, 0x4a3a2a);
    this.add.rectangle(centerX, height * 0.50, 220, 8, 0x3a2a1a);

    // ============================================
    // MULTITUD
    // ============================================

    this.multitud = [];

    // Fila 1 - muy atrás (más pequeños)
    for (let i = 0; i < 16; i++) {
      const x = 30 + i * 50;
      const y = height * 0.48;
      this.createCiudadano(x, y, 0.5);
    }

    // Fila 2
    for (let i = 0; i < 14; i++) {
      const x = 55 + i * 55;
      const y = height * 0.54;
      this.createCiudadano(x, y, 0.6);
    }

    // Fila 3
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 65;
      const y = height * 0.62;
      this.createCiudadano(x, y, 0.7);
    }

    // Fila 4
    for (let i = 0; i < 10; i++) {
      const x = 60 + i * 75;
      const y = height * 0.72;
      this.createCiudadano(x, y, 0.8);
    }

    // Fila 5 - delantera (más grandes) - con hueco en el centro para el alcalde
    for (let i = 0; i < 10; i++) {
      const x = 40 + i * 80;
      // Dejar hueco en el centro para el alcalde
      if (x < centerX - 120 || x > centerX + 120) {
        const y = height * 0.84;
        this.createCiudadano(x, y, 0.95);
      }
    }

    // Fila 6 - muy adelante, en los bordes
    for (let i = 0; i < 6; i++) {
      const x = i < 3 ? 30 + i * 70 : width - 30 - (5 - i) * 70;
      const y = height * 0.95;
      this.createCiudadano(x, y, 1.0);
    }

    // ============================================
    // ALCALDE (en la tarima)
    // ============================================

    this.alcalde = this.add.container(centerX, height * 0.44);

    // Cuerpo del alcalde (más grande y distinguido)
    const alcaldeCapa = this.add.triangle(0, 15, -35, 50, 35, 50, 0, -15, 0x6a1010);
    const alcaldeBody = this.add.rectangle(0, 5, 45, 65, 0x8B0000).setOrigin(0.5, 0.5);
    const alcaldeCollar = this.add.rectangle(0, -25, 35, 10, 0xffd700); // Collar dorado
    const alcaldeHead = this.add.circle(0, -42, 20, 0xf5d0c5);
    const alcaldeMask = this.add.ellipse(0, -42, 16, 12, 0xffd700, 0.9); // Máscara dorada
    const alcaldeHat = this.add.triangle(0, -62, -18, -50, 18, -50, 0, -75, 0x4a0000);

    // Brazos levantados (gesto de discurso)
    const armLeft = this.add.rectangle(-30, -5, 12, 35, 0x8B0000).setAngle(-30);
    const armRight = this.add.rectangle(30, -5, 12, 35, 0x8B0000).setAngle(30);
    const handLeft = this.add.circle(-38, -20, 8, 0xf5d0c5);
    const handRight = this.add.circle(38, -20, 8, 0xf5d0c5);

    this.alcalde.add([alcaldeCapa, armLeft, armRight, alcaldeBody, alcaldeCollar, handLeft, handRight, alcaldeHead, alcaldeMask, alcaldeHat]);
    this.alcalde.setDepth(height * 0.44);

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
    // Elegir un NPC aleatorio de los 6 disponibles
    const npcIndex = Phaser.Math.Between(1, 6);
    const npcKey = `crowd_npc${npcIndex}`;

    const ciudadano = this.add.sprite(x, y, npcKey)
      .setScale(scale)
      .setOrigin(0.5, 1)
      .setDepth(y); // Y-sorting

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
