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
    // Idle (4 direcciones) - con máscara (por defecto)
    this.load.image('marlo_idle_south', `${charPath}/marloIdleSouth.png`);
    this.load.image('marlo_idle_east', `${charPath}/marloIdleEast.png`);
    this.load.image('marlo_idle_north', `${charPath}/marloIdleNorth.png`);
    this.load.image('marlo_idle_west', `${charPath}/marloIdleWest.png`);
    // Walk spritesheets (4 frames cada uno)
    this.load.spritesheet('marlo_walk_north', `${charPath}/marloWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_south', `${charPath}/marloWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_east', `${charPath}/marloWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('marlo_walk_west', `${charPath}/marloWalkWest.png`, { frameWidth: 64, frameHeight: 64 });
    // Sin máscara (solo Scene_1_0)
    this.load.image('marlo_unmasked_north', `${charPath}/marloWithoutMaskNorth.png`);
    this.load.image('marlo_unmasked_south', `${charPath}/marloWithoutMaskSouth.png`);
    // Animación de ponerse la máscara (16 frames)
    this.load.spritesheet('marlo_put_mask', `${charPath}/marloWearingMask.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- FATHER (Padre) -----
    this.load.image('father_idle_south', `${charPath}/fatherIdleSouth.png`);
    this.load.image('father_idle_east', `${charPath}/fatherIdleEast.png`);
    this.load.image('father_idle_north', `${charPath}/fatherIdleNorth.png`);
    this.load.image('father_idle_west', `${charPath}/fatherIdleWest.png`);
    this.load.spritesheet('father_walk_north', `${charPath}/fatherWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_south', `${charPath}/fatherWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_east', `${charPath}/fatherWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('father_walk_west', `${charPath}/fatherWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- MOTHER (Madre) -----
    this.load.image('mother_idle_south', `${charPath}/motherIdleSouth.png`);
    this.load.image('mother_idle_east', `${charPath}/motherIdleEast.png`);
    this.load.image('mother_idle_north', `${charPath}/motherIdleNorth.png`);
    this.load.image('mother_idle_west', `${charPath}/motherIdleWest.png`);
    this.load.spritesheet('mother_walk_north', `${charPath}/motherWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_south', `${charPath}/motherWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_east', `${charPath}/motherWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mother_walk_west', `${charPath}/motherWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- CARABINIERI -----
    this.load.image('carabiniere', `${charPath}/carabinieriIdleSouth.png`);

    // ----- VILLAIN (Strappavolti) -----
    this.load.image('villain_idle_south', `${charPath}/villainIdleSouth.png`);
    this.load.image('villain_idle_east', `${charPath}/villainIdleEast.png`);
    this.load.image('villain_idle_north', `${charPath}/villainIdleNorth.png`);
    this.load.image('villain_idle_west', `${charPath}/villainIdleWest.png`);
    this.load.spritesheet('villain_walk_north', `${charPath}/villainWalkNorth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_south', `${charPath}/villainWalkSouth.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_east', `${charPath}/villainWalkEast.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('villain_walk_west', `${charPath}/villainWalkWest.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- ALABARDIERI -----
    this.load.image('alabardiere', `${charPath}/alabardieriIdleSouth.png`);

    // ----- GIACOMO -----
    this.load.image('giacomo_idle', `${charPath}/giacomoSouth.png`);
    this.load.spritesheet('giacomo_nervous', `${charPath}/giacomoNervous.png`, { frameWidth: 64, frameHeight: 64 });

    // ----- PICCOLO -----
    this.load.image('piccolo_idle', `${charPath}/piccoloSouth.png`);

    // ----- ALCALDE (Mayor) -----
    this.load.image('mayor_stand', `${charPath}/town_mayor/mayor-stand.png`);
    this.load.image('mayor_son', `${charPath}/town_mayor/mayor-son.png`);
    this.load.image('mayor_son_dead', `${charPath}/town_mayor/mayor-son-dead.png`);
    this.load.image('mayor_atril', `${charPath}/town_mayor/atril.png`);
    this.load.image('mayor_estructura', `${charPath}/town_mayor/estructura.png`);

    // ----- NPCS MULTITUD (Scene 1-2) -----
    // Front-facing NPCs (facing camera)
    for (let i = 1; i <= 15; i++) {
      this.load.image(`crowd_npc_front_${i}`, `${charPath}/npcs/front/npc${i}.png`);
    }
    // Back-facing NPCs (facing away from camera)
    for (let i = 1; i <= 15; i++) {
      this.load.image(`crowd_npc_back_${i}`, `${charPath}/npcs/back/npc${i}.png`);
    }

    // ----- MÚSICOS (Scene 1-3) - Spritesheets con 4 frames de animación -----
    for (let i = 1; i <= 4; i++) {
      this.load.spritesheet(`musician_${i}`, `${charPath}/npcs/musicians/musician${i}.png`, { frameWidth: 64, frameHeight: 64 });
    }

    // ============================================
    // TILEMAPS AND TILESETS
    // ============================================

    const mapPath = 'src/assets/map';

    // Scene 1-0 (Baño de Marlo)
    this.load.tilemapTiledJSON('scene1_map', `${mapPath}/scene1.json`);
    this.load.image('tileset_interior1', `${mapPath}/interior1.png`);
    this.load.image('tileset_castleExterior', `${mapPath}/castleTilesExterior.png`);
    this.load.image('tileset_interiorTiles', `${mapPath}/InteriorTiles.png`);

    // Scene 1-1 y 1-2 (Plaza)
    this.load.tilemapTiledJSON('plaza_map', `${mapPath}/plaza.json`);
    this.load.image('tileset_bodega', `${mapPath}/bodega.gif`);
    this.load.image('plaza_lado_derecho', `${mapPath}/pzaLadoDerecho.png`);
    this.load.image('plaza_lado_izq', `${mapPath}/pzaLadoIzq.png`);

    // Scene 1-3 y 1-4 (Palacio - Hall del Baile)
    this.load.tilemapTiledJSON('palacio_map', `${mapPath}/palacio.json`);
    this.load.image('tileset_hall', `${mapPath}/hall.gif`);

    // Scene Bodega (transición desde Scene 1-4)
    this.load.tilemapTiledJSON('bodega_map', `${mapPath}/bodega.json`);
    // Bodega animated spritesheet (14 frames, 5 columns x 3 rows, 832x512 per frame)
    this.load.spritesheet('bodega_animated', `${mapPath}/bodega_animated.png`, {
      frameWidth: 832,
      frameHeight: 512
    });

    // Scene Sótano (transición desde bodega por trampilla)
    this.load.tilemapTiledJSON('sotano_map', `${mapPath}/sotano.json`);
    this.load.image('tileset_sotano', `${mapPath}/sotano.png`);

    // Scene Armería (transición desde bodega por puerta izquierda)
    this.load.tilemapTiledJSON('armeria_map', `${mapPath}/armeria.json`);
    this.load.image('tileset_armeria', `${mapPath}/armeria.gif`);

    // ============================================
    // ITEMS / OBJETOS INTERACTIVOS
    // ============================================

    this.load.image('nota_item', 'src/assets/items/nota.png');
    this.load.image('escritorio_item', 'src/assets/items/escritorio.png');
    this.load.image('trampilla_item', 'src/assets/items/trampilla.png');
    this.load.image('escalera_item', 'src/assets/items/escalera.png');

    // ============================================
    // UI / BACKGROUNDS
    // ============================================

    this.load.image('title_banner', 'src/assets/ui/banner.png');
    this.load.image('menu_bg', 'src/assets/background/bg.png');
    this.load.image('menu_button', 'src/assets/ui/menu_button.png');

    // ============================================
    // AUDIO
    // ============================================

    this.load.audio('bso_main', 'src/assets/bso/bso.mp3');
    // Sonido hint para objetos interactivos (añadir archivo hint.mp3 a src/assets/audio/)
    this.load.audio('hint_sound', 'src/assets/audio/hint.mp3');
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
    // Animación de ponerse la máscara (solo se reproduce una vez)
    this.anims.create({
      key: 'marlo_put_mask',
      frames: this.anims.generateFrameNumbers('marlo_put_mask', { start: 0, end: 15 }),
      frameRate: 8,
      repeat: 0
    });

    // ----- GIACOMO ANIMATIONS -----
    this.anims.create({
      key: 'giacomo_nervous_anim',
      frames: this.anims.generateFrameNumbers('giacomo_nervous', { start: 0, end: 15 }),
      frameRate: 4,
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

    // ----- MUSICIAN ANIMATIONS -----
    for (let i = 1; i <= 4; i++) {
      this.anims.create({
        key: `musician_${i}_play`,
        frames: this.anims.generateFrameNumbers(`musician_${i}`, { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }

    // Short delay then go to menu
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
