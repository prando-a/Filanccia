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

    // Cielo con imagen de fondo
    const bg = this.add.image(centerX, 0, 'menu_bg')
      .setOrigin(0.5, 0)
      .setDisplaySize(width, height * 0.45);

    // Suelo de la plaza - tilemap de adoquines (cubre todo el ancho)
    const plazaMap = this.make.tilemap({ key: 'plaza_map' });
    const tilesetBodega = plazaMap.addTilesetImage('bodega', 'tileset_bodega');
    const floorLayer = plazaMap.createLayer('Capa de patrones 1', tilesetBodega, 0, height * 0.45);

    // Escalar para cubrir el ancho completo
    const tileWidth = 21 * 32; // 21 columnas de 32px
    const scaleX = width / tileWidth;
    floorLayer.setScale(scaleX, 1);
    floorLayer.setDepth(0);

    // Decoraciones del carnaval - Banderines (en la línea del horizonte)
    for (let i = 0; i < 12; i++) {
      const bx = 50 + i * 70;
      const by = height * 0.42;
      const colors = [0xff4444, 0xffdd44, 0x44ff44, 0x4444ff, 0xff44ff];
      const bannerColor = Phaser.Math.RND.pick(colors);

      // Cuerda
      if (i < 11) {
        this.add.line(0, 0, bx, by, bx + 70, by + 3, 0x888888).setOrigin(0).setDepth(5);
      }

      // Banderín triangular
      this.add.triangle(bx, by, bx - 6, by, bx + 6, by, bx, by + 15, bannerColor, 0.9).setDepth(5);
    }

    // ============================================
    // ALCALDE Y TARIMA (antes de la multitud para depth correcto)
    // ============================================

    // Posición donde el alcalde está de pie (sobre los adoquines)
    const alcaldeY = height * 0.46;

    // Estructura/tarima - su parte superior donde "pisa" el alcalde
    const estructura = this.add.image(centerX, alcaldeY -140, 'mayor_estructura')
      .setOrigin(0.5, 0)
      .setDepth(10);

    // El alcalde de pie (pies en alcaldeY)
    this.alcalde = this.add.image(centerX, alcaldeY, 'mayor_stand')
      .setOrigin(0.5, 1)
      .setDepth(20);

    // Atril delante del alcalde
    const atril = this.add.image(centerX, alcaldeY, 'mayor_atril')
      .setOrigin(0.5, 1)
      .setDepth(30);

    // ============================================
    // MULTITUD
    // ============================================

    this.multitud = [];

    // Función helper para evitar el área de la tarima
    const avoidStage = (x) => x < centerX - 150 || x > centerX + 150;

    // Fila 1 - a los lados de la tarima (más pequeños)
    for (let i = 0; i < 16; i++) {
      const x = 30 + i * 50;
      if (avoidStage(x)) {
        this.createCiudadano(x, height * 0.52, 0.5);
      }
    }

    // Fila 2
    for (let i = 0; i < 14; i++) {
      const x = 55 + i * 55;
      if (avoidStage(x)) {
        this.createCiudadano(x, height * 0.58, 0.6);
      }
    }

    // Fila 3 - empieza a cerrarse
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 65;
      const skipCenter = x > centerX - 100 && x < centerX + 100;
      if (!skipCenter) {
        this.createCiudadano(x, height * 0.65, 0.7);
      }
    }

    // Fila 4 - más cerrada
    for (let i = 0; i < 10; i++) {
      const x = 60 + i * 75;
      this.createCiudadano(x, height * 0.73, 0.8);
    }

    // Fila 5 - delantera (más grandes)
    for (let i = 0; i < 10; i++) {
      const x = 40 + i * 80;
      this.createCiudadano(x, height * 0.82, 0.95);
    }

    // Fila 6 - muy adelante, en los bordes
    for (let i = 0; i < 6; i++) {
      const x = i < 3 ? 30 + i * 70 : width - 30 - (5 - i) * 70;
      const y = height * 0.95;
      this.createCiudadano(x, y, 1.0);
    }

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
    // Elegir un NPC aleatorio de los 15 disponibles
    // Usamos back porque la multitud mira hacia el alcalde (de espaldas a la cámara)
    const npcIndex = Phaser.Math.Between(1, 15);
    const npcKey = `crowd_npc_back_${npcIndex}`;

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
