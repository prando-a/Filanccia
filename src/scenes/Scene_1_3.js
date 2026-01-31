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
    // PLACEHOLDERS - ESCENARIO (Hall del Palacio)
    // ============================================

    // Fondo del hall (paredes elegantes)
    this.add.rectangle(centerX, centerY, width, height, 0x2a1a1a);

    // Pared de fondo con decoración
    this.add.rectangle(centerX, height * 0.25, width, height * 0.35, 0x3a2020);

    // Cortinas laterales
    this.add.rectangle(50, height * 0.4, 80, height * 0.6, 0x8B0000).setOrigin(0.5, 0.5);
    this.add.rectangle(width - 50, height * 0.4, 80, height * 0.6, 0x8B0000).setOrigin(0.5, 0.5);

    // Candelabros (círculos dorados)
    for (let i = 0; i < 3; i++) {
      const cx = 200 + i * 200;
      this.add.circle(cx, 80, 25, 0xffd700, 0.8);
      // Luz del candelabro
      this.add.circle(cx, 80, 40, 0xffff00, 0.1);
    }

    // Suelo del salón (mármol)
    this.add.rectangle(centerX, height * 0.75, width, height * 0.5, 0x4a4a5a);

    // Patrón del suelo
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const tx = 50 + i * 100;
        const ty = height * 0.55 + j * 40;
        this.add.rectangle(tx, ty, 90, 35, (i + j) % 2 === 0 ? 0x3a3a4a : 0x5a5a6a);
      }
    }

    // ============================================
    // PLACEHOLDER - ORQUESTA
    // ============================================

    this.orquesta = this.add.container(centerX, height * 0.18);

    // Plataforma de la orquesta
    const plataformaOrquesta = this.add.rectangle(0, 20, 300, 30, 0x4a3020);

    // Músicos (simplificados)
    for (let i = 0; i < 5; i++) {
      const mx = -80 + i * 40;
      const musico = this.add.rectangle(mx, 0, 20, 35, 0x1a1a1a);
      const cabeza = this.add.circle(mx, -22, 8, 0xf5d0c5);
      this.orquesta.add([musico, cabeza]);
    }

    // Etiqueta
    const orquestaLabel = this.add.text(0, 45, '[ORQUESTA]', {
      fontSize: '10px',
      color: '#888888'
    }).setOrigin(0.5);

    this.orquesta.add([plataformaOrquesta, orquestaLabel]);

    // Indicador de música (notas animadas)
    this.notasMusicales = [];
    for (let i = 0; i < 3; i++) {
      const nota = this.add.text(centerX - 60 + i * 60, height * 0.12, '♪', {
        fontSize: '20px',
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0);
      this.notasMusicales.push(nota);
    }

    // ============================================
    // PLACEHOLDER - BAILARINES
    // ============================================

    this.bailarines = [];
    this.bailando = true;

    // Crear parejas de baile
    const posicionesBaile = [
      { x: 150, y: height * 0.55 },
      { x: 300, y: height * 0.6 },
      { x: 450, y: height * 0.55 },
      { x: 600, y: height * 0.6 },
      { x: 220, y: height * 0.7 },
      { x: 380, y: height * 0.72 },
      { x: 540, y: height * 0.7 },
    ];

    posicionesBaile.forEach((pos, i) => {
      this.createParejaBaile(pos.x, pos.y, i);
    });

    // ============================================
    // PLACEHOLDER - ALCALDE E HIJO
    // ============================================

    // Alcalde (a un lado, observando)
    this.alcalde = this.add.container(width - 120, height * 0.5);
    const alcaldeBody = this.add.rectangle(0, 0, 45, 65, 0x8B0000);
    const alcaldeHead = this.add.circle(0, -42, 18, 0xf5d0c5);
    const alcaldeCapa = this.add.triangle(0, 8, -25, 35, 25, 35, 0, -15, 0x4a0000);
    const alcaldeLabel = this.add.text(0, 50, 'ALCALDE', {
      fontSize: '10px',
      color: '#ffd700'
    }).setOrigin(0.5);
    this.alcalde.add([alcaldeCapa, alcaldeBody, alcaldeHead, alcaldeLabel]);

    // Hijo del Alcalde (oculto inicialmente)
    this.hijoAlcalde = this.add.container(width - 180, height * 0.52);
    const hijoBody = this.add.rectangle(0, 0, 35, 50, 0x4a0000);
    const hijoHead = this.add.circle(0, -32, 14, 0xf5d0c5);
    const hijoMascara = this.add.ellipse(0, -32, 10, 8, 0xffd700);
    const hijoLabel = this.add.text(0, 40, 'HIJO', {
      fontSize: '10px',
      color: '#ffd700'
    }).setOrigin(0.5);
    this.hijoAlcalde.add([hijoBody, hijoHead, hijoMascara, hijoLabel]);
    this.hijoAlcalde.setAlpha(0.3); // Visible pero no destacado

    // ============================================
    // UI - Indicador de escena (debug)
    // ============================================

    this.add.text(10, 10, 'ESCENA 1-3: Palacio - Hall', {
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
      this.startMusica();
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  createParejaBaile(x, y, index) {
    const pareja = this.add.container(x, y);

    // Colores variados para las parejas
    const colores = [0x2a3a6a, 0x6a2a3a, 0x3a6a2a, 0x5a3a5a, 0x3a5a5a, 0x6a5a2a, 0x4a4a6a];
    const color1 = colores[index % colores.length];
    const color2 = colores[(index + 3) % colores.length];

    // Persona 1
    const p1 = this.add.container(-15, 0);
    const body1 = this.add.rectangle(0, 0, 22, 38, color1);
    const head1 = this.add.circle(0, -24, 9, 0xf5d0c5);
    const mascara1 = this.add.ellipse(0, -24, 7, 5, 0xffd700, 0.8);
    p1.add([body1, head1, mascara1]);

    // Persona 2
    const p2 = this.add.container(15, 0);
    const body2 = this.add.rectangle(0, 0, 22, 38, color2);
    const head2 = this.add.circle(0, -24, 9, 0xf5d0c5);
    const mascara2 = this.add.ellipse(0, -24, 7, 5, 0xc0c0c0, 0.8);
    p2.add([body2, head2, mascara2]);

    pareja.add([p1, p2]);
    pareja.setDepth(y);

    // Animación de baile
    this.tweens.add({
      targets: pareja,
      angle: 5,
      duration: 600 + index * 50,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: pareja,
      x: x + 10,
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
