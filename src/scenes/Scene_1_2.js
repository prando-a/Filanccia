// src/scenes/Scene_1_2.js
// Escena 1-2: Plaza Central
// El Alcalde da el discurso inaugural del carnaval

import SettingsUI from '../ui/SettingsUI.js';
import TypewriterText from '../utils/TypewriterText.js';

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
      .setDisplaySize(width, height * 0.30);

    // Edificios a los lados de la plaza
    this.add.image(0, (height * 0.45) -30, 'plaza_lado_izq')
      .setOrigin(0, 1)
      .setDepth(2)
      .setScale(3);

    this.add.image(width, (height * 0.45) -30, 'plaza_lado_derecho')
      .setOrigin(1, 1)
      .setDepth(2)
      .setScale(3);

    // Suelo de la plaza - tilemap de adoquines (cubre todo el ancho)
    const plazaMap = this.make.tilemap({ key: 'plaza_map' });
    const tilesetBodega = plazaMap.addTilesetImage('bodega', 'tileset_bodega');
    const floorLayer = plazaMap.createLayer('Capa de patrones 1', tilesetBodega, 0, height * 0.25);

    // Escalar para cubrir el ancho completo
    const tileWidth = 21 * 32; // 21 columnas de 32px
    const scaleX = width / tileWidth;
    floorLayer.setScale(scaleX, 1);
    floorLayer.setDepth(0);


    // ============================================
    // ALCALDE Y TARIMA (antes de la multitud para depth correcto)
    // ============================================

    // Posición donde el alcalde está de pie (sobre los adoquines)
    const alcaldeY = height * 0.46;

    // Estructura/tarima - su parte superior donde "pisa" el alcalde
    const estructura = this.add.image(centerX, alcaldeY -140, 'mayor_estructura')
      .setOrigin(0.5, 0)
      .setDepth(10)
      .setScale(1.1);

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
    this.buildCrowdPool();

    // Función helper para evitar el área de la tarima
    const avoidStage = (x) => x < centerX - 150 || x > centerX + 150;

    // Fila 2
    for (let i = 0; i < 24; i++) {
      const x = 55 + i * 35;
      if (avoidStage(x)) {
        this.createCiudadano(x, height * 0.58, 0.8);
      }
    }

    // Fila 3 - empieza a cerrarse
    for (let i = 0; i < 22; i++) {
      const x = 40 + i * 45;
      const skipCenter = x > centerX - 100 && x < centerX + 100;
      if (!skipCenter) {
        this.createCiudadano(x, height * 0.65, 0.8);
      }
    }

    // Fila 4 - más cerrada
    for (let i = 0; i < 20; i++) {
      const x = 60 + i * 40;
      this.createCiudadano(x, height * 0.73, 0.9);
    }

    // Fila 5 - delantera (más grandes)
    for (let i = 0; i < 20; i++) {
      const x = 40 + i * 80;
      this.createCiudadano(x, height * 0.82, 0.95);
    }

    // Fila 6 - muy adelante, en los bordes
    for (let i = 0; i < 20; i++) {
      const x = i < 3 ? 30 + i * 40 : width - 30 - (5 - i) * 70;
      const y = height * 0.95;
      this.createCiudadano(x, y, 1.0);
    }

    // ============================================
    // FAMILIA (Marlo, Padre, Madre)
    // ============================================

    const familiaY = height * 0.65;
    const familiaX = centerX + 65;

    this.padre = this.add.sprite(familiaX - 30, familiaY, 'father_idle_north')
      .setOrigin(0.5, 1)
      .setDepth(familiaY);

    this.madre = this.add.sprite(familiaX + 30, familiaY, 'mother_idle_north')
      .setOrigin(0.5, 1)
      .setDepth(familiaY)
      .setScale(0.80);

    this.marlo = this.add.sprite(familiaX, familiaY + 15, 'marlo_idle_north')
      .setOrigin(0.5, 1)
      .setDepth(familiaY + 15);

    // ============================================
    // CAJA DE DIÁLOGO
    // ============================================

    this.dialogueBox = this.add.container(centerX, height - 95);
    this.dialogueBox.setVisible(false).setDepth(1000);

    const boxBg = this.add.rectangle(0, 0, width - 60, 150, 0x000000, 0.85);
    boxBg.setStrokeStyle(2, 0xffffff);

    this.speakerText = this.add.text(-width / 2 + 50, -55, '', {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold'
    });

    this.dialogueText = this.add.text(-width / 2 + 50, -30, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 100 }
    });

    this.continueHint = this.add.text(width / 2 - 70, 55, '[ESPACIO]', {
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

    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // Iniciar secuencia con fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  buildCrowdPool() {
    // Pool mezclado con ratio ~2:1 adultos:niños, sin repeticiones
    const adults = [];
    for (let i = 1; i <= 50; i++) adults.push(`crowd_npc_back_${i}`);
    const children = [];
    for (let i = 26; i <= 50; i++) children.push(`crowd_npc_back_child_${i}`);

    Phaser.Utils.Array.Shuffle(adults);
    Phaser.Utils.Array.Shuffle(children);

    // Intercalar: 2 adultos, 1 niño
    const pool = [];
    let ai = 0, ci = 0;
    while (ai < adults.length || ci < children.length) {
      if (ai < adults.length) pool.push(adults[ai++]);
      if (ai < adults.length) pool.push(adults[ai++]);
      if (ci < children.length) pool.push(children[ci++]);
    }

    this._crowdPool = pool;
    this._crowdIndex = 0;
  }

  createCiudadano(x, y, scale) {
    // Tomar el siguiente NPC del pool sin repeticiones
    const npcKey = this._crowdPool[this._crowdIndex % this._crowdPool.length];
    this._crowdIndex++;

    const isChild = npcKey.includes('child');
    const finalScale = isChild ? scale * 0.8 : scale;

    const ciudadano = this.add.sprite(x, y, npcKey)
      .setScale(finalScale)
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
    // Si el typewriter está escribiendo, saltar al final
    if (this._typewriter && this._typewriter.isTyping) {
      this._typewriter.skip();
      return;
    }

    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.currentStep++;
      this.runSequence();
    }
  }

  showDialogue(speaker, text) {
    this.speakerText.setText(speaker);
    this.dialogueBox.setVisible(true);
    this.continueHint.setVisible(false);

    if (this._typewriter) this._typewriter.destroy();
    this._typewriter = new TypewriterText(this, this.dialogueText, text, {
      charDelay: 30,
      onComplete: () => {
        this.continueHint.setVisible(true);
        this.waitingForInput = true;
      }
    });
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
        this.showDialogue('Alcalde', '¡Filanccianos! ¡Mirad a vuestro alrededor! Cien años de historia os contemplan desde cada mascarón, desde cada piedra.');
        break;

      case 2:
        this.showDialogue('Alcalde', 'Esta noche, el carnaval nos recuerda su gran lección: bajo la careta, el noble y el pescador son iguales. ¡Qué hermosa ficción para mantener la paz!');
        break;

      case 3:
        this.showDialogue('Alcalde', 'Celebramos, sí, pero también renovamos nuestro pacto: lealtad a la ciudad, obediencia a su ley, fe en quien os guía. Mirad a vuestros hijos, el verdadero futuro...');
        break;

      case 4:
        this.showDialogue('Alcalde', '...el futuro que debemos proteger a cualquier precio. ¡Y para eso, os espero en el palacio! Tengo palabras que darán forma a los próximos cien años.');
        break;

      case 5:
        this.showDialogue('Alcalde', '¡Que la máscara oculte vuestras dudas y el vino ahogue vuestros temores! ¡QUE COMIENCE EL CARNAVAL!');
        break;

      case 6:
        // Fade out y transición
        this.tweens.killAll();
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_3');
        });
        break;
    }
  }

  shutdown() {
    this.input.keyboard.off('keydown-SPACE');
    this.input.off('pointerdown');
    this.tweens.killAll();
  }
}
