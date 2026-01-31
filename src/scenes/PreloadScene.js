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

    const charPath = 'src/assets/characters';

    // ----- MARLO -----
    // Idle (4 direcciones)
    this.load.image('marlo_idle_south', `${charPath}/marlo1.png`);
    this.load.image('marlo_idle_west', `${charPath}/marlo2.png`);
    this.load.image('marlo_idle_east', `${charPath}/marlo3.png`);
    this.load.image('marlo_idle_north', `${charPath}/marlo4.png`);
    // Walk spritesheets (4 frames cada uno)
    this.load.spritesheet('marlo_walk_north', `${charPath}/marloWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_south', `${charPath}/marloWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_east', `${charPath}/marloWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_west', `${charPath}/marloWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- FATHER (Padre) -----
    this.load.image('father_idle_south', `${charPath}/father1.png`);
    this.load.image('father_idle_west', `${charPath}/father2.png`);
    this.load.image('father_idle_east', `${charPath}/father3.png`);
    this.load.image('father_idle_north', `${charPath}/father4.png`);
    this.load.spritesheet('father_walk_north', `${charPath}/fatherWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_south', `${charPath}/fatherWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_east', `${charPath}/fatherWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_west', `${charPath}/fatherWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- MOTHER (Madre) -----
    this.load.image('mother_idle_south', `${charPath}/mother1.png`);
    this.load.image('mother_idle_west', `${charPath}/mother2.png`);
    this.load.image('mother_idle_east', `${charPath}/mother3.png`);
    this.load.image('mother_idle_north', `${charPath}/mother4.png`);
    this.load.spritesheet('mother_walk_north', `${charPath}/motherWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_south', `${charPath}/motherWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_east', `${charPath}/motherWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_west', `${charPath}/motherWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- CARABINIERI -----
    this.load.image('carabiniere', `${charPath}/carabinieri1.png`);

    // ----- VILLAIN (Strappavolti) -----
    this.load.image('villain_idle_south', `${charPath}/villain1.png`);
    this.load.image('villain_idle_west', `${charPath}/villain2.png`);
    this.load.image('villain_idle_east', `${charPath}/villain3.png`);
    this.load.image('villain_idle_north', `${charPath}/villain4.png`);
    this.load.spritesheet('villain_walk_north', `${charPath}/villainWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_south', `${charPath}/villainWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_east', `${charPath}/villainWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_west', `${charPath}/villainWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- ALABARDIERI -----
    this.load.image('alabardiere', `${charPath}/alabardieri1.png`);
  }

  create() {
    // ============================================
    // CREATE GLOBAL ANIMATIONS
    // ============================================

    // ----- MARLO ANIMATIONS -----
    this.anims.create({
      key: 'marlo_walk_north',
      frames: this.anims.generateFrameNumbers('marlo_walk_north', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'marlo_walk_south',
      frames: this.anims.generateFrameNumbers('marlo_walk_south', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'marlo_walk_east',
      frames: this.anims.generateFrameNumbers('marlo_walk_east', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'marlo_walk_west',
      frames: this.anims.generateFrameNumbers('marlo_walk_west', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // ----- FATHER ANIMATIONS -----
    this.anims.create({
      key: 'father_walk_north',
      frames: this.anims.generateFrameNumbers('father_walk_north', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'father_walk_south',
      frames: this.anims.generateFrameNumbers('father_walk_south', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'father_walk_east',
      frames: this.anims.generateFrameNumbers('father_walk_east', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'father_walk_west',
      frames: this.anims.generateFrameNumbers('father_walk_west', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // ----- MOTHER ANIMATIONS -----
    this.anims.create({
      key: 'mother_walk_north',
      frames: this.anims.generateFrameNumbers('mother_walk_north', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'mother_walk_south',
      frames: this.anims.generateFrameNumbers('mother_walk_south', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'mother_walk_east',
      frames: this.anims.generateFrameNumbers('mother_walk_east', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'mother_walk_west',
      frames: this.anims.generateFrameNumbers('mother_walk_west', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // ----- VILLAIN ANIMATIONS -----
    this.anims.create({
      key: 'villain_walk_north',
      frames: this.anims.generateFrameNumbers('villain_walk_north', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'villain_walk_south',
      frames: this.anims.generateFrameNumbers('villain_walk_south', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'villain_walk_east',
      frames: this.anims.generateFrameNumbers('villain_walk_east', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'villain_walk_west',
      frames: this.anims.generateFrameNumbers('villain_walk_west', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // Short delay then go to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
