// src/scenes/Scene_1_3.js
// Escena 1-3: Palacio de la Alcaldía - Hall
// Ballo Mascherato y anuncio del heredero

export default class Scene_1_3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_3' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // ============================================
    // TILEMAP - ESCENARIO (Hall del Palacio)
    // ============================================

    this.map = this.make.tilemap({ key: 'palacio_map' });

    const tilesetHall = this.map.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = this.map.addTilesetImage('interior1', 'tileset_interior1');

    const allTilesets = [tilesetHall, tilesetInterior];

    // Crear la capa del tilemap
    const hallLayer = this.map.createLayer('Capa de patrones 1', allTilesets, 0, 0);

    // Escalar el mapa para que cubra la pantalla
    const mapWidth = this.map.widthInPixels;   // 30 * 32 = 960
    const mapHeight = this.map.heightInPixels; // 20 * 32 = 640
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

    // Indicador de música (notas animadas - sobre la sala de músicos)
    this.notasMusicales = [];
    for (let i = 0; i < 3; i++) {
      const nota = this.add.text(width * 0.08 + i * 30, height * 0.18, '♪', {
        fontSize: '20px',
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0).setDepth(200);
      this.notasMusicales.push(nota);
    }

    // ============================================
    // MÚSICOS (sala superior izquierda)
    // ============================================

    const salaY = height * 0.28;
    const salaX = width * 0.12;

    // Músicos en la sala - usando NPCs variados
    this.add.image(salaX - 30, salaY, 'crowd_npc_front_3')
      .setOrigin(0.5, 1)
      .setDepth(salaY);

    this.add.image(salaX + 10, salaY - 5, 'crowd_npc_front_7')
      .setOrigin(0.5, 1)
      .setDepth(salaY);

    this.add.image(salaX + 50, salaY, 'crowd_npc_front_11')
      .setOrigin(0.5, 1)
      .setDepth(salaY);

    // ============================================
    // ALCALDE E HIJO (frente a las escaleras)
    // ============================================

    // Alcalde frente a las escaleras
    this.alcalde = this.add.image(salaX, height * 0.42, 'mayor_stand')
      .setOrigin(0.5, 1)
      .setDepth(100);

    // Hijo del Alcalde (al lado del alcalde)
    this.hijoAlcalde = this.add.image(salaX + 40, height * 0.42, 'mayor_son')
      .setOrigin(0.5, 1)
      .setDepth(100)
      .setAlpha(0.5);

    // ============================================
    // ALABARDEROS (frente a las escaleras)
    // ============================================

    const escalerasY = height * 0.42;

    // 4 Alabarderos en formación frente a las escaleras
    this.add.image(0 + 40, escalerasY + 40, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(0 + 80, escalerasY + 40, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(0 + 120, escalerasY + 40, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);

    this.add.image(0 + 160, escalerasY + 40, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);

    // ============================================
    // BAILARINES (zona amplia - más parejas)
    // ============================================

    this.bailarines = [];
    this.bailando = true;

    // Parejas de baile distribuidas en la zona amplia (derecha y abajo)
    const posicionesBaile = [
      // Esquinas (referencia)
      { x: 60, y: escalerasY + 100 },
      { x: 400, y: escalerasY + 60 },
      { x: 60, y: escalerasY + 300 },
      { x: 400, y: escalerasY + 300 },

      // Fila superior
      { x: 150, y: escalerasY + 80 },
      { x: 260, y: escalerasY + 70 },
      { x: 340, y: escalerasY + 85 },

      // Fila central superior
      { x: 100, y: escalerasY + 140 },
      { x: 200, y: escalerasY + 130 },
      { x: 300, y: escalerasY + 145 },
      { x: 370, y: escalerasY + 135 },

      // Fila central
      { x: 130, y: escalerasY + 190 },
      { x: 230, y: escalerasY + 200 },
      { x: 330, y: escalerasY + 185 },

      // Fila central inferior
      { x: 80, y: escalerasY + 240 },
      { x: 180, y: escalerasY + 250 },
      { x: 280, y: escalerasY + 245 },
      { x: 360, y: escalerasY + 255 },

      // Fila inferior
      { x: 150, y: escalerasY + 290 },
      { x: 260, y: escalerasY + 280 },
      { x: 340, y: escalerasY + 295 },
    ];

    posicionesBaile.forEach((pos, i) => {
      this.createParejaBaile(pos.x, pos.y, i);
    });

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
      this.startMusica();
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  createParejaBaile(x, y, index) {
    const pareja = this.add.container(x, y);

    // NPCs válidos para bailar (excluir guardias - npc12)
    const validNPCs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15];
    const npc1Index = validNPCs[(index * 2) % validNPCs.length];
    const npc2Index = validNPCs[(index * 2 + 1) % validNPCs.length];

    // Persona 1
    const p1 = this.add.image(-20, 0, `crowd_npc_front_${npc1Index}`)
      .setOrigin(0.5, 1)
      .setScale(0.9);

    // Persona 2
    const p2 = this.add.image(20, 0, `crowd_npc_front_${npc2Index}`)
      .setOrigin(0.5, 1)
      .setScale(0.9);

    pareja.add([p1, p2]);
    pareja.setDepth(y);

    // Animación de baile (rotación sutil)
    this.tweens.add({
      targets: pareja,
      angle: 3,
      duration: 600 + index * 50,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Movimiento lateral
    this.tweens.add({
      targets: pareja,
      x: x + 15,
      duration: 1200 + index * 100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.bailarines.push(pareja);
  }

  startMusica() {
    // Animar notas musicales
    this.notasMusicales.forEach((nota, i) => {
      this.tweens.add({
        targets: nota,
        alpha: 1,
        y: nota.y - 20,
        duration: 1000,
        delay: i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  stopMusica() {
    // Detener notas
    this.notasMusicales.forEach(nota => {
      this.tweens.killTweensOf(nota);
      this.tweens.add({
        targets: nota,
        alpha: 0,
        duration: 500
      });
    });
  }

  stopBaile() {
    this.bailando = false;

    // Detener animaciones de baile gradualmente
    this.bailarines.forEach((pareja, i) => {
      this.time.delayedCall(i * 200, () => {
        this.tweens.killTweensOf(pareja);
        this.tweens.add({
          targets: pareja,
          angle: 0,
          duration: 500,
          ease: 'Power2'
        });
      });
    });
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
        // Baile en progreso - pausa para establecer escena
        this.isAnimating = true;
        this.time.delayedCall(3000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        // La orquesta finaliza
        this.isAnimating = true;
        this.stopMusica();
        this.stopBaile();
        this.time.delayedCall(2000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 2:
        // Alcalde da el brindis
        this.showDialogue('Alcalde', 'Queridos ciudadanos, hoy no solo celebramos el centenario de Filanccia...');
        break;

      case 3:
        // Alcalde anuncia al heredero
        this.showDialogue('Alcalde', 'También anuncio que mi hijo me sucederá en el cargo.');
        break;

      case 4:
        // Presentar al hijo
        this.isAnimating = true;
        this.presentarHijo(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 5:
        // Fade out y transición
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_4');
        });
        break;
    }
  }

  presentarHijo(callback) {
    // Destacar al hijo del alcalde
    this.tweens.add({
      targets: this.hijoAlcalde,
      alpha: 1,
      scale: 1.1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        // Pausa dramática
        this.time.delayedCall(1500, callback);
      }
    });

    // Texto indicador (cerca de la sala superior izquierda)
    const { width, height } = this.scale;
    const presentText = this.add.text(width * 0.20, height * 0.35, '[ El hijo del Alcalde es presentado ]', {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'italic',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0).setDepth(500);

    this.tweens.add({
      targets: presentText,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: presentText,
            alpha: 0,
            duration: 500
          });
        });
      }
    });
  }
}
