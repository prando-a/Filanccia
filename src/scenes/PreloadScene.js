// src/scenes/PreloadScene.js
// Asset loading scene with progress bar

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Loading text
    const loadingText = this.add.text(centerX, centerY - 50, 'Cargando...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Progress bar background
    const barBg = this.add.rectangle(centerX, centerY, 400, 30, 0x333333);

    // Progress bar fill
    const barFill = this.add.rectangle(centerX - 198, centerY, 0, 26, 0x00ff00);
    barFill.setOrigin(0, 0.5);

    // Percentage text
    const percentText = this.add.text(centerX, centerY + 50, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Update progress bar
    this.load.on('progress', (value) => {
      barFill.width = 396 * value;
      percentText.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
      loadingText.setText('Listo!');
    });

    // ============================================
    // LOAD ALL GAME ASSETS HERE
    // ============================================

    // Example: Character sprites
    // this.load.spritesheet('player', 'assets/images/characters/player.png', {
    //   frameWidth: 64,
    //   frameHeight: 64
    // });

    // Example: Tilesets
    // this.load.image('tileset', 'assets/images/tiles/tileset.png');

    // Example: Tilemaps
    // this.load.tilemapTiledJSON('map1', 'assets/maps/map1.json');

    // Example: UI elements
    // this.load.image('button', 'assets/images/ui/button.png');

    // Example: Audio
    // this.load.audio('bgm', 'assets/audio/bgm.mp3');
    // this.load.audio('sfx_click', 'assets/audio/click.wav');
  }

  create() {
    // Create global animations here
    // Example:
    // this.anims.create({
    //   key: 'player_idle',
    //   frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    //   frameRate: 8,
    //   repeat: -1
    // });

    // Short delay then go to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
