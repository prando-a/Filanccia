// src/scenes/MenuScene.js
// Main menu scene

import SwipeControls from '../input/SwipeControls.js';
import SettingsUI from '../ui/SettingsUI.js';

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

    // Start button
    const startBtn = this.add.text(centerX, centerY + 200, '[ COMENZAR ]', {
      fontFamily: 'GameFont, Arial',
      fontSize: '28px',
      color: '#ffd700',
      backgroundColor: '#333333',
      padding: { x: 20, y: 12 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startBtn.on('pointerover', () => {
      startBtn.setStyle({ color: '#ffffff', backgroundColor: '#555555' });
    });

    startBtn.on('pointerout', () => {
      startBtn.setStyle({ color: '#ffd700', backgroundColor: '#333333' });
    });

    startBtn.on('pointerdown', () => {
      this.startGame();
    });

    // Keyboard support
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());

    // Mobile tap support
    this.swipe = new SwipeControls(this, {
      on: {
        tap: () => this.startGame()
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

    // ESC para cerrar ajustes
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.settingsUI.isVisible()) {
        this.settingsUI.toggle();
      }
    });

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('Scene_Sotano');
    });
  }
}
