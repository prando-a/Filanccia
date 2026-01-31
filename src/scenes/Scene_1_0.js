// src/scenes/Scene_1_0.js
// Escena 1-0: Casa de Marlo - Baño
// Marlo se prepara frente al espejo antes del festival

export default class Scene_1_0 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_0' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // ============================================
    // PLACEHOLDERS - ESCENARIO
    // ============================================

    // Fondo del baño
    this.add.rectangle(centerX, centerY, width, height, 0x2a3a4a);

    // Pared
    this.add.rectangle(centerX, height * 0.3, width, height * 0.4, 0x3a4a5a);

    // Espejo (rectángulo con borde)
    const espejo = this.add.rectangle(centerX, height * 0.35, 120, 160, 0x87CEEB);
    this.add.rectangle(centerX, height * 0.35, 130, 170)
      .setStrokeStyle(4, 0x8B4513);

    // Etiqueta del espejo
    this.add.text(centerX, height * 0.35 - 100, '[ESPEJO]', {
      fontSize: '12px',
      color: '#888888'
    }).setOrigin(0.5);

    // Suelo
    this.add.rectangle(centerX, height * 0.75, width, height * 0.5, 0x4a3a2a);

    // ============================================
    // PLACEHOLDER - MARLO
    // ============================================

    // Marlo (placeholder: rectángulo verde con etiqueta)
    this.marlo = this.add.container(centerX, height * 0.55);

    const marloBody = this.add.rectangle(0, 0, 40, 60, 0x4a7c4e);
    const marloHead = this.add.circle(0, -40, 18, 0xf5d0c5);
    const marloLabel = this.add.text(0, 45, 'MARLO', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.marlo.add([marloBody, marloHead, marloLabel]);

    // Estado de Marlo: 'espejo' (mirando al espejo/arriba) o 'frente' (mirando al jugador/abajo)
    this.marloState = 'espejo';

    // Indicador de dirección
    this.directionIndicator = this.add.text(centerX, height * 0.55 - 70, '↑', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // ============================================
    // PLACEHOLDER - MÁSCARA
    // ============================================

    // La máscara aparecerá durante la cinemática
    this.mascara = this.add.container(centerX + 80, height * 0.55);
    const mascaraShape = this.add.ellipse(0, 0, 30, 40, 0xffd700);
    const mascaraLabel = this.add.text(0, 30, '[MÁSCARA]', {
      fontSize: '10px',
      color: '#888888'
    }).setOrigin(0.5);
    this.mascara.add([mascaraShape, mascaraLabel]);
    this.mascara.setVisible(false); // Oculta hasta la cinemática

    // ============================================
    // UI - Indicador de escena (debug)
    // ============================================

    this.add.text(10, 10, 'ESCENA 1-0: Casa de Marlo - Baño', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    });

    // ============================================
    // CAJA DE DIÁLOGO
    // ============================================

    this.dialogueBox = this.add.container(centerX, height - 80);
    this.dialogueBox.setVisible(false);

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

  handleInput() {
    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.currentStep++;
      this.runSequence();
    }
  }

  showDialogue(speaker, text, callback) {
    this.speakerText.setText(speaker);
    this.dialogueText.setText(text);
    this.dialogueBox.setVisible(true);

    if (callback) {
      // Auto-avanzar después de mostrar
      this.waitingForInput = true;
    }
  }

  runSequence() {
    if (this.isAnimating) return;

    switch (this.currentStep) {
      case 0:
        // Pausa inicial - Marlo mirando al espejo
        this.isAnimating = true;
        this.time.delayedCall(2000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        // Madre grita (off-screen)
        this.showDialogue('Madre (off)', '¡Marlo! ¡Llegamos tarde, date prisa!', true);
        this.waitingForInput = true;
        break;

      case 2:
        // Marlo se da la vuelta
        this.isAnimating = true;
        this.marloTurn('frente', () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 3:
        // Marlo responde
        this.showDialogue('Marlo', '¡Ya voy! ¡Ya estoy listo!', true);
        this.waitingForInput = true;
        break;

      case 4:
        // Marlo vuelve a mirar al espejo
        this.isAnimating = true;
        this.marloTurn('espejo', () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 5:
        // Pausa antes de la cinemática
        this.isAnimating = true;
        this.time.delayedCall(1000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 6:
        // Cinemática: colocarse la máscara
        this.isAnimating = true;
        this.cinematicaMascara(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 7:
        // Fade out y transición a siguiente escena
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_1');
        });
        break;
    }
  }

  marloTurn(direction, callback) {
    // Animación simple: cambiar el indicador de dirección
    const newArrow = direction === 'espejo' ? '↑' : '↓';

    this.tweens.add({
      targets: this.marlo,
      scaleX: 0,
      duration: 150,
      onComplete: () => {
        this.directionIndicator.setText(newArrow);
        this.marloState = direction;

        this.tweens.add({
          targets: this.marlo,
          scaleX: 1,
          duration: 150,
          onComplete: callback
        });
      }
    });
  }

  cinematicaMascara(callback) {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // ============================================
    // FASE 1: Zoom-in hacia Marlo y el espejo
    // ============================================

    // Punto de enfoque: entre Marlo y el espejo
    const focusX = centerX;
    const focusY = height * 0.45;

    // Zoom-in de la cámara
    this.tweens.add({
      targets: this.cameras.main,
      zoom: 1.8,
      scrollX: focusX - width / 2,
      scrollY: focusY - height / 2 + 50,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        // ============================================
        // FASE 2: Colocarse la máscara (zoom aplicado)
        // ============================================

        // Mostrar texto de cinemática (ajustado para el zoom)
        const cinText = this.add.text(centerX, height * 0.15, '[ Marlo se coloca su máscara ]', {
          fontSize: '10px',
          color: '#ffd700',
          fontStyle: 'italic',
          backgroundColor: '#00000088',
          padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
          targets: cinText,
          alpha: 1,
          duration: 500
        });

        // Mostrar máscara
        this.mascara.setVisible(true);
        this.mascara.setAlpha(0);
        this.mascara.setPosition(centerX + 50, height * 0.55);

        this.tweens.add({
          targets: this.mascara,
          alpha: 1,
          duration: 500,
          delay: 500
        });

        // Mover máscara hacia Marlo
        this.tweens.add({
          targets: this.mascara,
          x: centerX,
          y: height * 0.55 - 40,
          duration: 1000,
          delay: 1200,
          ease: 'Power2',
          onComplete: () => {
            // Máscara "puesta" - cambiar color de la cabeza
            this.marlo.getAt(1).setFillStyle(0xffd700); // Cabeza ahora dorada

            // Ocultar máscara separada
            this.mascara.setVisible(false);

            // Pausa dramática
            this.time.delayedCall(1000, () => {
              // ============================================
              // FASE 3: Zoom-out y finalizar
              // ============================================

              this.tweens.add({
                targets: cinText,
                alpha: 0,
                duration: 400
              });

              this.tweens.add({
                targets: this.cameras.main,
                zoom: 1,
                scrollX: 0,
                scrollY: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                  this.time.delayedCall(500, callback);
                }
              });
            });
          }
        });
      }
    });
  }
}
