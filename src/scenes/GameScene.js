// src/scenes/GameScene.js
// Main game scene template

import SwipeControls from '../input/SwipeControls.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.scale;

    // ============================================
    // TILEMAP SETUP (when you have maps)
    // ============================================
    // const map = this.make.tilemap({ key: 'map1' });
    // const tileset = map.addTilesetImage('tileset_name', 'tileset');
    // const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    // const wallsLayer = map.createLayer('Walls', tileset, 0, 0);
    // wallsLayer.setCollisionByProperty({ collides: true });

    // ============================================
    // PLAYER SETUP
    // ============================================
    // Placeholder player (replace with sprite when available)
    this.player = this.add.rectangle(width / 2, height / 2, 32, 48, 0x00ff00);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // ============================================
    // CAMERA SETUP
    // ============================================
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ============================================
    // INPUT SETUP
    // ============================================
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Virtual input for mobile
    this.virtual = { left: false, right: false, up: false, down: false, action: false };

    const setHold = (dir, isDown) => {
      this.virtual[dir] = isDown;
    };

    this.swipe = new SwipeControls(this, {
      threshold: 28,
      maxTime: 350,
      on: {
        tap: () => {
          this.virtual.action = true;
          this.time.delayedCall(120, () => this.virtual.action = false);
        },
        holdStart: (dir) => setHold(dir, true),
        holdEnd: (dir) => setHold(dir, false)
      }
    });

    // ============================================
    // COLLISION SETUP
    // ============================================
    // this.physics.add.collider(this.player, wallsLayer);

    // ============================================
    // UI SETUP
    // ============================================
    this.createUI();

    // Fade in
    this.cameras.main.fadeIn(500);
  }

  createUI() {
    // Example: Debug/info text
    this.debugText = this.add.text(10, 10, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(1000);
  }

  update() {
    const speed = 200;
    let vx = 0;
    let vy = 0;

    // Combine keyboard and virtual input
    const left = this.cursors.left.isDown || this.wasd.left.isDown || this.virtual.left;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || this.virtual.right;
    const up = this.cursors.up.isDown || this.wasd.up.isDown || this.virtual.up;
    const down = this.cursors.down.isDown || this.wasd.down.isDown || this.virtual.down;

    if (left) vx = -speed;
    else if (right) vx = speed;

    if (up) vy = -speed;
    else if (down) vy = speed;

    // Apply velocity
    this.player.body.setVelocity(vx, vy);

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      this.player.body.velocity.normalize().scale(speed);
    }

    // Update debug text
    this.debugText.setText(`Pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get Y coordinate of sprite's feet (for y-sorting)
   */
  getFeetY(sprite) {
    return sprite.y + (sprite.displayHeight ? sprite.displayHeight / 2 : 0);
  }

  /**
   * Find object in Tiled map by name
   */
  findMapObject(map, name) {
    for (const layer of map.objects || []) {
      if (!layer.objects) continue;
      const obj = layer.objects.find(o => o.name === name);
      if (obj) return obj;
    }
    return null;
  }
}
