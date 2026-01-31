// src/scenes/Scene_1_2.js
// Escena 1-2: Plaza Central (placeholder)

export default class Scene_1_2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_2' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Fondo placeholder
    this.add.rectangle(centerX, centerY, width, height, 0x1a2a3a);

    // Texto de escena
    this.add.text(centerX, centerY - 50, 'ESCENA 1-2', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY, 'Plaza Central', {
      fontSize: '24px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 50, '[ Por implementar ]', {
      fontSize: '16px',
      color: '#666666',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Indicador debug
    this.add.text(10, 10, 'ESCENA 1-2: Plaza Central (placeholder)', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    });

    // Instrucción para volver
    this.add.text(centerX, height - 50, 'Presiona ESPACIO para volver al menú', {
      fontSize: '14px',
      color: '#888888'
    }).setOrigin(0.5);

    // Input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });

    this.input.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }
}
