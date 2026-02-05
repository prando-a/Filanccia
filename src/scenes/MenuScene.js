// src/scenes/MenuScene.js
// Main menu scene

import SwipeControls from '../input/SwipeControls.js';
import SettingsUI from '../ui/SettingsUI.js';
import SaveManager from '../managers/SaveManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    const bg = this.add.image(centerX, centerY, 'menu_bg');
    bg.setDisplaySize(width, height);

    // Cargar volumen guardado
    const savedVolume = localStorage.getItem('filanccia_volume');
    this.currentVolume = savedVolume ? parseFloat(savedVolume) : 0.5;

    // Música de fondo (si no está ya sonando)
    if (!this.sound.get('bso_main')?.isPlaying) {
      this.music = this.sound.add('bso_main', {
        loop: true,
        volume: this.currentVolume
      });
      this.music.play();
    } else {
      // Si ya está sonando, aplicar el volumen guardado
      this.sound.get('bso_main').setVolume(this.currentVolume);
    }

    // Title banner
    const banner = this.add.image(centerX, centerY - 80, 'title_banner')
      .setOrigin(0.5)
      .setScale(2);

    // Subtle banner animation
    this.tweens.add({
      targets: banner,
      y: banner.y - 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Verificar si hay partida guardada
    const hasSave = SaveManager.hasSave();

    // ============================================
    // BOTÓN NUEVA PARTIDA
    // ============================================
    this.newGameBtn = this.add.text(centerX, centerY + 170, '[ NUEVA PARTIDA ]', {
      fontFamily: 'GameFont, Arial',
      fontSize: '24px',
      color: '#ffd700',
      backgroundColor: '#333333',
      padding: { x: 20, y: 12 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.newGameBtn.on('pointerover', () => {
      this.newGameBtn.setStyle({ color: '#ffffff', backgroundColor: '#555555' });
    });

    this.newGameBtn.on('pointerout', () => {
      this.newGameBtn.setStyle({ color: '#ffd700', backgroundColor: '#333333' });
    });

    this.newGameBtn.on('pointerdown', () => {
      this.handleNewGame();
    });

    // ============================================
    // BOTÓN CONTINUAR
    // ============================================
    this.continueBtn = this.add.text(centerX, centerY + 230, '[ CONTINUAR ]', {
      fontFamily: 'GameFont, Arial',
      fontSize: '24px',
      color: hasSave ? '#ffd700' : '#666666',
      backgroundColor: hasSave ? '#333333' : '#222222',
      padding: { x: 20, y: 12 }
    })
      .setOrigin(0.5);

    if (hasSave) {
      this.continueBtn.setInteractive({ useHandCursor: true });

      this.continueBtn.on('pointerover', () => {
        this.continueBtn.setStyle({ color: '#ffffff', backgroundColor: '#555555' });
      });

      this.continueBtn.on('pointerout', () => {
        this.continueBtn.setStyle({ color: '#ffd700', backgroundColor: '#333333' });
      });

      this.continueBtn.on('pointerdown', () => {
        this.continueGame();
      });
    }

    // Texto indicador si no hay partida guardada
    if (!hasSave) {
      this.add.text(centerX, centerY + 270, '(No hay partida guardada)', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#666666'
      }).setOrigin(0.5);
    }

    // ============================================
    // DIÁLOGO DE CONFIRMACIÓN (inicialmente oculto)
    // ============================================
    this.confirmDialog = this.add.container(centerX, centerY);
    this.confirmDialog.setVisible(false).setDepth(1002);

    const dialogOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    dialogOverlay.setInteractive(); // Bloquear clicks debajo

    const dialogBg = this.add.rectangle(0, 0, 350, 150, 0x2a2a2a)
      .setStrokeStyle(2, 0xffd700);

    const dialogText = this.add.text(0, -40, '¿Sobrescribir partida guardada?', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Botón SÍ
    const yesBtn = this.add.text(-60, 20, '[ SÍ ]', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#88ff88',
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    yesBtn.on('pointerover', () => yesBtn.setStyle({ backgroundColor: '#444444' }));
    yesBtn.on('pointerout', () => yesBtn.setStyle({ backgroundColor: '#333333' }));
    yesBtn.on('pointerdown', () => {
      this.confirmDialog.setVisible(false);
      SaveManager.deleteSave();
      this.startNewGame();
    });

    // Botón NO
    const noBtn = this.add.text(60, 20, '[ NO ]', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ff8888',
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    noBtn.on('pointerover', () => noBtn.setStyle({ backgroundColor: '#444444' }));
    noBtn.on('pointerout', () => noBtn.setStyle({ backgroundColor: '#333333' }));
    noBtn.on('pointerdown', () => {
      this.confirmDialog.setVisible(false);
    });

    this.confirmDialog.add([dialogOverlay, dialogBg, dialogText, yesBtn, noBtn]);

    // Keyboard support (solo para nueva partida si no hay diálogo abierto)
    this.input.keyboard.on('keydown-ENTER', () => {
      if (!this.confirmDialog.visible) {
        this.handleNewGame();
      }
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.confirmDialog.visible) {
        this.handleNewGame();
      }
    });

    // Mobile tap support - desactivado en menú para evitar conflictos con botones
    // Los botones de NUEVA PARTIDA y CONTINUAR ya tienen sus propios handlers
    this.swipe = new SwipeControls(this, {
      on: {
        tap: () => {
          // No hacer nada - los botones manejan sus propios clicks
        }
      }
    });

    // Version text
    this.add.text(width - 10, height - 10, 'v0.1.0', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#666666'
    }).setOrigin(1, 1);

    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // ESC para cerrar ajustes o diálogo
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.confirmDialog.visible) {
        this.confirmDialog.setVisible(false);
      } else if (this.settingsUI.isVisible()) {
        this.settingsUI.toggle();
      }
    });

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  handleNewGame() {
    if (SaveManager.hasSave()) {
      // Mostrar diálogo de confirmación
      this.confirmDialog.setVisible(true);
    } else {
      this.startNewGame();
    }
  }

  startNewGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('Scene_1_0');
    });
  }

  continueGame() {
    const saveData = SaveManager.load();
    if (!saveData) {
      console.error('No save data found');
      return;
    }

    // Aplicar volumen guardado
    if (saveData.volume !== undefined) {
      localStorage.setItem('filanccia_volume', saveData.volume.toString());
      const music = this.sound.get('bso_main');
      if (music) music.setVolume(saveData.volume);
    }

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      // Iniciar la escena guardada con los globalFlags
      this.scene.start(saveData.currentScene, {
        fromSave: true,
        globalFlags: saveData.globalFlags
      });
    });
  }

  // Mantener startGame para compatibilidad (alias de startNewGame)
  startGame() {
    this.handleNewGame();
  }
}
