// src/main.js - Filanccia Game Entry Point

import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import Scene_1_0 from './scenes/Scene_1_0.js';
import Scene_1_1 from './scenes/Scene_1_1.js';
import Scene_1_2 from './scenes/Scene_1_2.js';
import Scene_1_3 from './scenes/Scene_1_3.js';
import Scene_1_4 from './scenes/Scene_1_4.js';
import Scene_Bodega from './scenes/Scene_Bodega.js';
// AnimatedTiles plugin loaded via script tag in index.html
const AnimatedTiles = window['AnimatedTiles.min'];

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
    GameScene,
    Scene_1_0,
    Scene_1_1,
    Scene_1_2,
    Scene_1_3,
    Scene_1_4,
    Scene_Bodega
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
  },
  plugins: {
    scene: [
      { key: 'animatedTiles', plugin: AnimatedTiles, mapping: 'animatedTiles' }
    ]
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
