// src/main.js - Filanccia Game Entry Point

import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Set true for collision debugging
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  audio: {
    disableWebAudio: false
  }
};

// Wait for custom font to load before starting game
async function ensureFont() {
  try {
    document.fonts.load('16px "GameFont"');
    await document.fonts.ready;
    await document.fonts.load('16px "GameFont"');
  } catch (e) {
    console.warn('Font loading skipped:', e);
  }
}

(async () => {
  await ensureFont();
  const game = new Phaser.Game(config);

  // Global game registry for shared state
  game.registry.set('debug', false);
})();
