// src/ui/SettingsUI.js
// Módulo reutilizable para la UI de ajustes

export default class SettingsUI {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.currentVolume = parseFloat(localStorage.getItem('filanccia_volume') || '0.5');

    this.create();
  }

  create() {
    const { width, height } = this.scene.scale;

    // Botón de ajustes (esquina superior derecha)
    this.settingsBtn = this.scene.add.text(width - 20, 20, '⚙', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff'
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .setDepth(1000)
      .setScrollFactor(0); // Fijo en pantalla

    this.settingsBtn.on('pointerover', () => this.settingsBtn.setColor('#ffd700'));
    this.settingsBtn.on('pointerout', () => this.settingsBtn.setColor('#ffffff'));
    this.settingsBtn.on('pointerdown', () => this.toggle());

    // Panel de ajustes
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.panel.setVisible(false).setDepth(1001);
    this.panel.setScrollFactor(0); // Fijo en pantalla

    // Overlay oscuro
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setInteractive(); // Bloquea clics

    // Panel principal
    const panelBg = this.scene.add.rectangle(0, 0, 280, 200, 0x2a2a2a)
      .setStrokeStyle(2, 0xffd700);

    // Título
    const title = this.scene.add.text(0, -75, 'AJUSTES', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // Volumen
    const volLabel = this.scene.add.text(-110, -25, 'Volumen:', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    this.volValueText = this.scene.add.text(90, -25, `${Math.round(this.currentVolume * 100)}%`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd700'
    }).setOrigin(0.5);

    const volDown = this.scene.add.text(20, -25, '[ - ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const volUp = this.scene.add.text(55, -25, '[ + ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    volDown.on('pointerdown', () => this.changeVolume(-0.1));
    volUp.on('pointerdown', () => this.changeVolume(0.1));

    // Guardar
    const saveBtn = this.scene.add.text(0, 25, '[ GUARDAR ]', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#4a7c4e',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    saveBtn.on('pointerover', () => saveBtn.setStyle({ backgroundColor: '#5a9c5e' }));
    saveBtn.on('pointerout', () => saveBtn.setStyle({ backgroundColor: '#4a7c4e' }));
    saveBtn.on('pointerdown', () => this.saveGame());

    this.saveConfirmText = this.scene.add.text(0, 55, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#88ff88'
    }).setOrigin(0.5);

    // Cerrar
    const closeBtn = this.scene.add.text(0, 80, '[ CERRAR ]', {
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
      saveBtn, this.saveConfirmText,
      closeBtn
    ]);
  }

  toggle() {
    this.visible = !this.visible;
    this.panel.setVisible(this.visible);
    if (this.saveConfirmText) this.saveConfirmText.setText('');
  }

  isVisible() {
    return this.visible;
  }

  changeVolume(delta) {
    this.currentVolume = Phaser.Math.Clamp(this.currentVolume + delta, 0, 1);
    this.volValueText.setText(`${Math.round(this.currentVolume * 100)}%`);

    const music = this.scene.sound.get('bso_main');
    if (music) music.setVolume(this.currentVolume);

    localStorage.setItem('filanccia_volume', this.currentVolume.toString());
  }

  saveGame() {
    // Recopilar datos de la escena actual si tiene método getSaveData
    let sceneData = {};
    if (typeof this.scene.getSaveData === 'function') {
      sceneData = this.scene.getSaveData();
    }

    const gameState = {
      currentScene: this.scene.scene.key,
      sceneData: sceneData,
      timestamp: Date.now(),
      volume: this.currentVolume
    };

    localStorage.setItem('filanccia_save', JSON.stringify(gameState));
    this.saveConfirmText.setText('¡Guardado!');

    this.scene.time.delayedCall(2000, () => {
      if (this.saveConfirmText) this.saveConfirmText.setText('');
    });
  }

  destroy() {
    if (this.settingsBtn) this.settingsBtn.destroy();
    if (this.panel) this.panel.destroy();
  }
}
