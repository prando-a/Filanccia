// src/scenes/MenuScene.js
// Main menu scene

import SwipeControls from '../input/SwipeControls.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background
    this.add.rectangle(centerX, centerY, width, height, 0x1a1a2e);

    // Title
    const title = this.add.text(centerX, centerY - 100, 'FILANCCIA', {
      fontFamily: 'GameFont, Arial',
      fontSize: '64px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtle title animation
    this.tweens.add({
      targets: title,
      y: title.y - 10,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Start button
    const startBtn = this.add.text(centerX, centerY + 50, '[ COMENZAR ]', {
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

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  startGame() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('Scene_1_0');
    });
  }
}
