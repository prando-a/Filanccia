// src/scenes/BootScene.js
// Initial boot scene - minimal assets for loading screen

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load only essential assets needed for the loading screen
    // Example: loading bar graphics, logo, etc.
    // this.load.image('logo', 'assets/images/ui/logo.png');
  }

  create() {
    // Initialize any global game settings here
    this.game.registry.set('gameStarted', false);

    // Proceed to preload scene
    this.scene.start('PreloadScene');
  }
}
