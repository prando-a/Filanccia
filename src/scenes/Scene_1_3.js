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
    // TILEMAP DEL PALACIO
    // ============================================

    const palacioMap = this.make.tilemap({ key: 'palacio_map' });
    const tilesetHall = palacioMap.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = palacioMap.addTilesetImage('interior1', 'tileset_interior1');

    // Crear capa de tiles
    const floorLayer = palacioMap.createLayer('Capa de patrones 1', [tilesetHall, tilesetInterior], 0, 0);

    // Escalar para cubrir pantalla (palacio es 960x640, pantalla es 800x600)
    const mapWidth = palacioMap.widthInPixels;
    const mapHeight = palacioMap.heightInPixels;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    const mapScale = Math.max(scaleX, scaleY);
    floorLayer.setScale(mapScale);

    // Centrar el mapa
    const scaledWidth = mapWidth * mapScale;
    const scaledHeight = mapHeight * mapScale;
    floorLayer.setPosition((width - scaledWidth) / 2, (height - scaledHeight) / 2);

    // ============================================
    // MÚSICOS (sala superior izquierda)
    // ============================================

    const salaX = 120;
    const salaY = height * 0.22;

    this.add.image(salaX - 40, salaY, 'musician_1').setOrigin(0.5, 1).setDepth(salaY);
    this.add.image(salaX, salaY, 'musician_2').setOrigin(0.5, 1).setDepth(salaY);
    this.add.image(salaX + 40, salaY, 'musician_3').setOrigin(0.5, 1).setDepth(salaY);
    this.add.image(salaX + 80, salaY, 'musician_4').setOrigin(0.5, 1).setDepth(salaY);

    // Indicador de música (notas animadas)
    this.notasMusicales = [];
    for (let i = 0; i < 3; i++) {
      const nota = this.add.text(salaX - 20 + i * 40, salaY - 50, '♪', {
        fontSize: '20px',
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0).setDepth(500);
      this.notasMusicales.push(nota);
    }

    // ============================================
    // ALCALDE E HIJO (frente a las escaleras)
    // ============================================

    const escalerasY = height * 0.38;

    // Alabarderos (4 frente a las escaleras)
    this.add.image(centerX - 100, escalerasY, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(centerX - 50, escalerasY, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(centerX + 50, escalerasY, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);

    this.add.image(centerX + 100, escalerasY, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);

    // Carabinieri a los lados
    this.add.image(centerX - 150, escalerasY, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(centerX + 150, escalerasY, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);

    // Alcalde (en el escenario, centrado)
    this.alcalde = this.add.image(centerX + 30, escalerasY - 20, 'mayor_stand')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY + 10);

    // Hijo del Alcalde (al lado del alcalde, semi-oculto inicialmente)
    this.hijoAlcalde = this.add.image(centerX - 30, escalerasY - 15, 'mayor_son')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY + 10)
      .setAlpha(0.5);

    // ============================================
    // BAILARINES (zona amplia del salón)
    // ============================================

    this.bailarines = [];
    this.bailando = true;

    // Zona de baile definida por esquinas
    const zonaMinX = 60;
    const zonaMaxX = 740;
    const zonaMinY = escalerasY + 60;
    const zonaMaxY = escalerasY + 300;

    // Crear parejas de baile distribuidas
    const posicionesBaile = [];

    // Fila 1 (más cerca de las escaleras)
    for (let x = zonaMinX + 50; x < zonaMaxX - 50; x += 90) {
      posicionesBaile.push({ x: x, y: zonaMinY + 20 });
    }

    // Fila 2
    for (let x = zonaMinX + 80; x < zonaMaxX - 80; x += 85) {
      posicionesBaile.push({ x: x, y: zonaMinY + 80 });
    }

    // Fila 3
    for (let x = zonaMinX + 60; x < zonaMaxX - 60; x += 95) {
      posicionesBaile.push({ x: x, y: zonaMinY + 140 });
    }

    // Fila 4 (más al fondo)
    for (let x = zonaMinX + 100; x < zonaMaxX - 100; x += 100) {
      posicionesBaile.push({ x: x, y: zonaMinY + 200 });
    }

    // Fila 5 (última fila)
    for (let x = zonaMinX + 70; x < zonaMaxX - 70; x += 110) {
      posicionesBaile.push({ x: x, y: zonaMaxY - 20 });
    }

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

    // Texto indicador
    const { width, height } = this.scale;
    const presentText = this.add.text(width / 2, height * 0.35, '[ El hijo del Alcalde es presentado ]', {
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
