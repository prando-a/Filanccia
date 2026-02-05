// src/ui/SettingsUI.js
// Módulo reutilizable para la UI de ajustes

import SaveManager from '../managers/SaveManager.js';

export default class SettingsUI {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    // Volumen real máximo es 0.5 (50%), displayVolume va de 0-1 (0-100% para el usuario)
    const savedVolume = parseFloat(localStorage.getItem('filanccia_volume') || '0.25');
    // Convertir volumen real (0-0.5) a volumen display (0-1)
    this.displayVolume = Math.min(savedVolume / 0.5, 1);

    this.create();
  }

  // Convertir volumen display (0-1) a volumen real (0-0.5)
  getRealVolume() {
    return this.displayVolume * 0.5;
  }

  // Obtener porcentaje para mostrar (0-100)
  getDisplayPercentage() {
    return Math.round(this.displayVolume * 100);
  }

  create() {
    const { width, height } = this.scene.scale;

    // Botón de ajustes usando imagen menu_button
    this.settingsBtn = this.scene.add.image(width - 35, 35, 'menu_button')
      .setOrigin(0.9, 0.5)
      .setScale(0.9)
      .setInteractive({ useHandCursor: true })
      .setDepth(1000)
      .setScrollFactor(0);

    this.settingsBtn.on('pointerover', () => this.settingsBtn.setTint(0xffd700));
    this.settingsBtn.on('pointerout', () => this.settingsBtn.clearTint());
    this.settingsBtn.on('pointerdown', () => this.toggle());

    // Panel de ajustes
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.panel.setVisible(false).setDepth(1001);
    this.panel.setScrollFactor(0);

    // Overlay oscuro
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setInteractive();

    // Panel principal (más alto para incluir botón de menú)
    const panelBg = this.scene.add.rectangle(0, 0, 320, 290, 0x2a2a2a)
      .setStrokeStyle(2, 0xffd700);

    // Título
    const title = this.scene.add.text(0, -105, 'AJUSTES', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // Volumen label
    const volLabel = this.scene.add.text(-130, -60, 'Volumen:', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    // Porcentaje de volumen
    this.volValueText = this.scene.add.text(110, -60, `${this.getDisplayPercentage()}%`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // Botones +/-
    const volDown = this.scene.add.text(40, -60, '[ - ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const volUp = this.scene.add.text(75, -60, '[ + ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    volDown.on('pointerdown', () => this.changeVolume(-0.1));
    volUp.on('pointerdown', () => this.changeVolume(0.1));

    // === SLIDER VISUAL ===
    const sliderWidth = 200;
    const sliderHeight = 16;
    const sliderX = -100;
    const sliderY = -25;

    // Fondo del slider
    this.sliderBg = this.scene.add.rectangle(sliderX + sliderWidth / 2, sliderY, sliderWidth, sliderHeight, 0x444444)
      .setStrokeStyle(1, 0x666666)
      .setInteractive({ useHandCursor: true });

    // Relleno del slider (parte coloreada)
    this.sliderFill = this.scene.add.rectangle(
      sliderX,
      sliderY,
      sliderWidth * this.displayVolume,
      sliderHeight - 4,
      0xffd700
    ).setOrigin(0, 0.5);

    // Handle del slider
    this.sliderHandle = this.scene.add.circle(
      sliderX + sliderWidth * this.displayVolume,
      sliderY,
      10,
      0xffffff
    ).setStrokeStyle(2, 0xffd700)
      .setInteractive({ useHandCursor: true, draggable: true });

    // Click en el slider para setear volumen
    this.sliderBg.on('pointerdown', (pointer) => {
      const localX = pointer.x - (width / 2 + sliderX);
      const newVolume = Phaser.Math.Clamp(localX / sliderWidth, 0, 1);
      this.setDisplayVolume(newVolume);
    });

    // Drag del handle
    this.scene.input.setDraggable(this.sliderHandle);
    this.sliderHandle.on('drag', (pointer, dragX) => {
      const newVolume = Phaser.Math.Clamp((dragX - sliderX) / sliderWidth, 0, 1);
      this.setDisplayVolume(newVolume);
    });

    // Labels del slider
    const sliderLabelMin = this.scene.add.text(sliderX - 15, sliderY, '0', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888'
    }).setOrigin(1, 0.5);

    const sliderLabelMax = this.scene.add.text(sliderX + sliderWidth + 15, sliderY, '100', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888'
    }).setOrigin(0, 0.5);

    // ============================================
    // BOTÓN GUARDAR (solo visible en escenas de juego, no en menú)
    // ============================================
    const isMenuScene = this.scene.scene.key === 'MenuScene';
    const canSave = !isMenuScene && SaveManager.canSaveInScene(this.scene);

    this.saveBtn = this.scene.add.text(0, 25, '[ GUARDAR ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: canSave ? '#ffffff' : '#666666',
      backgroundColor: canSave ? '#4a7c4e' : '#333333',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);

    // Ocultar botón guardar en el menú principal
    if (isMenuScene) {
      this.saveBtn.setVisible(false);
    } else if (canSave) {
      this.saveBtn.setInteractive({ useHandCursor: true });
      this.saveBtn.on('pointerover', () => this.saveBtn.setStyle({ backgroundColor: '#5a9c5e' }));
      this.saveBtn.on('pointerout', () => this.saveBtn.setStyle({ backgroundColor: '#4a7c4e' }));
      this.saveBtn.on('pointerdown', () => this.saveGame());
    }

    // Texto de confirmación/mensaje
    this.saveConfirmText = this.scene.add.text(0, 55, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#88ff88'
    }).setOrigin(0.5);

    // Mostrar mensaje si no se puede guardar (solo en escenas de juego, no en menú)
    if (!isMenuScene && !canSave) {
      this.saveConfirmText.setText('Completa esta escena para poder guardar');
      this.saveConfirmText.setStyle({ color: '#ffaa66' });
    }

    // Botón Menú Principal (solo visible en escenas de juego, no en menú)
    this.menuBtn = this.scene.add.text(0, 90, '[ MENÚ PRINCIPAL ]', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffaa00'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.menuBtn.on('pointerover', () => this.menuBtn.setStyle({ color: '#ffffff' }));
    this.menuBtn.on('pointerout', () => this.menuBtn.setStyle({ color: '#ffaa00' }));
    this.menuBtn.on('pointerdown', () => this.goToMainMenu());

    // Ocultar botón en el menú principal
    if (isMenuScene) {
      this.menuBtn.setVisible(false);
    }

    // Cerrar
    const closeBtn = this.scene.add.text(0, 115, '[ CERRAR ]', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff6666'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerover', () => closeBtn.setStyle({ color: '#ffffff' }));
    closeBtn.on('pointerout', () => closeBtn.setStyle({ color: '#ff6666' }));
    closeBtn.on('pointerdown', () => this.toggle());

    this.panel.add([
      overlay, panelBg, title,
      volLabel, volDown, volUp, this.volValueText,
      this.sliderBg, this.sliderFill, this.sliderHandle,
      sliderLabelMin, sliderLabelMax,
      this.saveBtn, this.saveConfirmText,
      this.menuBtn, closeBtn
    ]);

    // Guardar config del slider para updates
    this.sliderConfig = { x: sliderX, width: sliderWidth };
  }

  toggle() {
    this.visible = !this.visible;
    this.panel.setVisible(this.visible);

    if (this.visible) {
      // Actualizar estado del botón guardar cada vez que se abre
      this.updateSaveButtonState();
    } else {
      // Limpiar mensaje solo si no es el mensaje de "no se puede guardar"
      const canSave = SaveManager.canSaveInScene(this.scene);
      if (canSave && this.saveConfirmText) {
        this.saveConfirmText.setText('');
      }
    }
  }

  updateSaveButtonState() {
    const isMenuScene = this.scene.scene.key === 'MenuScene';

    // En el menú principal, ocultar botones de guardar y menú principal
    if (isMenuScene) {
      this.saveBtn.setVisible(false);
      this.menuBtn.setVisible(false);
      this.saveConfirmText.setText('');
      return;
    }

    // En otras escenas, mostrar botón de menú
    this.menuBtn.setVisible(true);

    const canSave = SaveManager.canSaveInScene(this.scene);
    this.saveBtn.setVisible(true);

    if (canSave) {
      this.saveBtn.setStyle({
        color: '#ffffff',
        backgroundColor: '#4a7c4e'
      });
      this.saveBtn.setInteractive({ useHandCursor: true });
      this.saveBtn.removeAllListeners('pointerover');
      this.saveBtn.removeAllListeners('pointerout');
      this.saveBtn.removeAllListeners('pointerdown');
      this.saveBtn.on('pointerover', () => this.saveBtn.setStyle({ backgroundColor: '#5a9c5e' }));
      this.saveBtn.on('pointerout', () => this.saveBtn.setStyle({ backgroundColor: '#4a7c4e' }));
      this.saveBtn.on('pointerdown', () => this.saveGame());

      // Limpiar mensaje de error
      this.saveConfirmText.setText('');
      this.saveConfirmText.setStyle({ color: '#88ff88' });
    } else {
      this.saveBtn.setStyle({
        color: '#666666',
        backgroundColor: '#333333'
      });
      this.saveBtn.disableInteractive();

      this.saveConfirmText.setText('Completa esta escena para poder guardar');
      this.saveConfirmText.setStyle({ color: '#ffaa66' });
    }
  }

  isVisible() {
    return this.visible;
  }

  setDisplayVolume(newDisplayVolume) {
    this.displayVolume = Phaser.Math.Clamp(newDisplayVolume, 0, 1);
    this.updateVolumeUI();
    this.applyVolume();
  }

  changeVolume(delta) {
    this.setDisplayVolume(this.displayVolume + delta);
  }

  updateVolumeUI() {
    this.volValueText.setText(`${this.getDisplayPercentage()}%`);
    const fillWidth = this.sliderConfig.width * this.displayVolume;
    this.sliderFill.setSize(fillWidth, this.sliderFill.height);
    this.sliderHandle.setX(this.sliderConfig.x + this.sliderConfig.width * this.displayVolume);
  }

  applyVolume() {
    const realVolume = this.getRealVolume();
    const music = this.scene.sound.get('bso_main');
    if (music) music.setVolume(realVolume);
    localStorage.setItem('filanccia_volume', realVolume.toString());
  }

  saveGame() {
    // Verificar de nuevo si se puede guardar
    if (!SaveManager.canSaveInScene(this.scene)) {
      this.saveConfirmText.setText('Completa esta escena para poder guardar');
      this.saveConfirmText.setStyle({ color: '#ffaa66' });
      return;
    }

    // Usar SaveManager para guardar
    const success = SaveManager.save(this.scene);

    if (success) {
      this.saveConfirmText.setText('¡Partida guardada!');
      this.saveConfirmText.setStyle({ color: '#88ff88' });
    } else {
      this.saveConfirmText.setText('Error al guardar');
      this.saveConfirmText.setStyle({ color: '#ff6666' });
    }

    this.scene.time.delayedCall(2000, () => {
      if (this.saveConfirmText) {
        const canSave = SaveManager.canSaveInScene(this.scene);
        if (canSave) {
          this.saveConfirmText.setText('');
        }
      }
    });
  }

  goToMainMenu() {
    // Cerrar el panel primero
    this.toggle();

    // Fade out y volver al menú
    this.scene.cameras.main.fadeOut(500, 0, 0, 0);
    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.scene.start('MenuScene');
    });
  }

  destroy() {
    if (this.settingsBtn) this.settingsBtn.destroy();
    if (this.panel) this.panel.destroy();
  }
}
