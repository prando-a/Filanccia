// src/scenes/Scene_1_1.js
// Escena 1-1: Camino a la Plaza
// Parallax vertical - la familia camina hacia la plaza

import SettingsUI from '../ui/SettingsUI.js';

export default class Scene_1_1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_1' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // ============================================
    // CONFIGURACIÓN
    // ============================================

    this.totalDuration = 30000; // Duración total de la escena en ms
    this.elapsedTime = 0;
    this.isEnding = false;

    // ============================================
    // CAPA 1: CIELO (estático)
    // ============================================

    // Fondo de cielo nocturno
    this.add.rectangle(centerX, height * 0.15, width, height * 0.3, 0x0a0a1a).setDepth(0);

    // Estrellas
    for (let i = 0; i < 40; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.28),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.9)
      ).setDepth(0);

      this.tweens.add({
        targets: star,
        alpha: star.alpha * 0.3,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Luna
    this.add.circle(width - 80, 50, 20, 0xffffee, 0.9).setDepth(0);

    // ============================================
    // CAPA 2: SUELO CON ADOQUINES (parallax rápido)
    // ============================================

    // Contenedor para los adoquines que se mueven
    this.groundContainer = this.add.container(0, 0).setDepth(1);

    // Crear filas de adoquines usando el tilemap
    this.createScrollingGround();

    // ============================================
    // CAPA 3: NPCs (se mueven con el suelo)
    // ============================================

    this.npcs = [];
    this.createNPCs();

    // ============================================
    // CAPA 4: FAMILIA (estática en el centro)
    // ============================================

    this.familyContainer = this.add.container(centerX, height * 0.6).setDepth(100);

    this.padre = this.add.sprite(-35, -15, 'father_idle_north').setOrigin(0.5, 1).setScale(1.3);
    this.madre = this.add.sprite(35, -15, 'mother_idle_north').setOrigin(0.5, 1).setScale(1);
    this.marlo = this.add.sprite(0, 25, 'marlo_idle_north').setOrigin(0.5, 1);

    this.familyContainer.add([this.padre, this.madre, this.marlo]);

    // Animaciones de caminar
    this.padre.play('father_walk_north');
    this.madre.play('mother_walk_north');
    this.marlo.play('marlo_walk_north');

    // Bobbing sutil
    this.tweens.add({
      targets: this.familyContainer,
      y: this.familyContainer.y - 2,
      duration: 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // ============================================
    // SECUENCIA
    // ============================================

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.time.delayedCall(500, () => {
      this.showAmbientText('Los ojos de cristal de cien máscaras siguen a nadie y a todos. La luna se enreda en los canales.');
    });

    this.time.delayedCall(7000, () => {
      this.showAmbientText('Un violín llora una tarantela entre risas ahogadas. El aire huele a dulce de almendra y humedad de piedra.');
    });

    this.time.delayedCall(13500, () => {
      this.showAmbientText('Entre dos arlequines, un espacio vacío se mueve contra la corriente de la multitud. Luego desaparece.');
    });

    this.time.delayedCall(20000, () => {
      this.showAmbientText('Las sombras de los balcones son tan profundas que podrían esconder rostros. O la ausencia de ellos.');
    });

    // Saltar escena con SPACE
    this.input.keyboard.on('keydown-SPACE', () => {
      this.endScene();
    });
  }

  createScrollingGround() {
    const { width, height } = this.scale;

    const plazaMap = this.make.tilemap({ key: 'plaza_map' });
    const tileset = plazaMap.addTilesetImage('bodega', 'tileset_bodega');

    const actualTileWidth = 21 * 32;
    const scaleX = width / actualTileWidth;

    const mapHeight = plazaMap.heightInPixels; // 640px (20 rows × 32px)
    const startY = height * 0.3;

    // Espaciar copias con solapamiento para tapar gaps de renderizado sub-pixel
    const spacing = mapHeight - 4;
    const numCopies = Math.ceil((height - startY + spacing) / spacing) + 1;

    this.groundTiles = [];
    for (let i = 0; i < numCopies; i++) {
      const tileMap = this.make.tilemap({ key: 'plaza_map' });
      const ts = tileMap.addTilesetImage('bodega', 'tileset_bodega');
      const initialY = Math.round(startY - spacing + i * spacing);
      const layer = tileMap.createLayer('Capa de patrones 1', ts, 0, initialY);
      layer.setScale(scaleX, 1);
      layer.setDepth(1);
      this.groundTiles.push(layer);
    }

    this.groundStartY = startY;
    this.groundSpacing = spacing;
    this.groundScrollSpeed = 2;
    this.groundScrollOffset = 0;
  }

  createNPCs() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const familyZone = 80;

    // Pool de 100 sprites únicos (adultos + niños, front + back)
    const npcKeys = [];
    for (let i = 1; i <= 25; i++) npcKeys.push(`crowd_npc_front_${i}`);
    for (let i = 1; i <= 25; i++) npcKeys.push(`crowd_npc_back_${i}`);
    for (let i = 26; i <= 50; i++) npcKeys.push(`crowd_npc_front_child_${i}`);
    for (let i = 26; i <= 50; i++) npcKeys.push(`crowd_npc_back_child_${i}`);
    Phaser.Utils.Array.Shuffle(npcKeys);

    // Distribuir NPCs a lo largo de todo el recorrido de scroll (sin reciclaje)
    // 30s × ~120px/s = 3600px de scroll total
    const scrollDistance = 3600;
    const minY = height * 0.35 - scrollDistance;
    const maxY = height + 200;

    for (let i = 0; i < npcKeys.length; i++) {
      let x;
      if (Phaser.Math.Between(0, 1) === 0) {
        x = Phaser.Math.Between(50, centerX - familyZone);
      } else {
        x = Phaser.Math.Between(centerX + familyZone, width - 50);
      }

      const y = Phaser.Math.FloatBetween(minY, maxY);
      const isChild = npcKeys[i].includes('child');
      const scale = isChild ? Phaser.Math.FloatBetween(0.75, 0.85) : 1;

      const npc = this.add.sprite(x, y, npcKeys[i])
        .setOrigin(0.5, 1)
        .setScale(scale)
        .setDepth(10 + y);

      this.npcs.push(npc);
    }
  }

  showAmbientText(text) {
    const { width } = this.scale;

    const ambientText = this.add.text(width / 2, 70, text, {
      fontSize: '16px',
      color: '#cccccc',
      fontStyle: 'italic',
      backgroundColor: '#00000088',
      padding: { x: 12, y: 6 },
      wordWrap: { width: width - 80 },
      align: 'center'
    }).setOrigin(0.5).setAlpha(0).setDepth(1000);

    this.tweens.add({
      targets: ambientText,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(4500, () => {
          this.tweens.add({
            targets: ambientText,
            alpha: 0,
            duration: 800,
            onComplete: () => ambientText.destroy()
          });
        });
      }
    });
  }

  update(time, delta) {
    this.elapsedTime += delta;

    // Scroll del suelo
    this.updateGround(delta);

    // Scroll de NPCs
    this.updateNPCs(delta);

    // Verificar fin de escena
    if (this.elapsedTime >= this.totalDuration) {
      this.endScene();
    }
  }

  updateGround(delta) {
    const speedFactor = delta / 16.667;
    this.groundScrollOffset += this.groundScrollSpeed * speedFactor;

    const numTiles = this.groundTiles.length;
    const totalCycle = numTiles * this.groundSpacing;

    this.groundTiles.forEach((tile, i) => {
      const basePos = i * this.groundSpacing;
      const pos = (basePos + this.groundScrollOffset) % totalCycle;
      tile.y = Math.round(this.groundStartY - this.groundSpacing + pos);
    });
  }

  updateNPCs(delta) {
    const speedFactor = delta / 16.667;

    this.npcs.forEach(npc => {
      npc.y += this.groundScrollSpeed * speedFactor;
      npc.setDepth(10 + npc.y);
    });
  }

  endScene() {
    if (this.isEnding) return;
    this.isEnding = true;

    // Detener animaciones
    this.tweens.killTweensOf(this.familyContainer);
    this.padre.stop();
    this.padre.setTexture('father_idle_north');
    this.madre.stop();
    this.madre.setTexture('mother_idle_north');
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_north');

    this.tweens.killAll();
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_1_2');
    });
  }

  shutdown() {
    this.input.keyboard.off('keydown-SPACE');
    this.input.off('pointerdown');
    this.tweens.killAll();
  }
}
