// src/scenes/Scene_1_4.js
// Escena 1-4: El Asesinato
// El hijo del Alcalde es encontrado muerto, sin rostro

import SettingsUI from '../ui/SettingsUI.js';

export default class Scene_1_4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_4' });
  }

  create(data) {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Guardar datos de carga si vienen de un save
    this.loadData = data || {};

    // ============================================
    // TILEMAP DEL PALACIO (mismo que Scene 1-3)
    // ============================================

    this.palacioMap = this.make.tilemap({ key: 'palacio_map' });
    const tilesetHall = this.palacioMap.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = this.palacioMap.addTilesetImage('interior1', 'tileset_interior1');

    // Crear capa de tiles
    this.floorLayer = this.palacioMap.createLayer('Capa de patrones 1', [tilesetHall, tilesetInterior], 0, 0);

    // Escalar para cubrir pantalla
    const mapWidth = this.palacioMap.widthInPixels;
    const mapHeight = this.palacioMap.heightInPixels;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    this.mapScale = Math.max(scaleX, scaleY);
    this.floorLayer.setScale(this.mapScale);

    // Centrar el mapa
    const scaledWidth = mapWidth * this.mapScale;
    const scaledHeight = mapHeight * this.mapScale;
    this.mapOffsetX = (width - scaledWidth) / 2;
    this.mapOffsetY = (height - scaledHeight) / 2;
    this.floorLayer.setPosition(this.mapOffsetX, this.mapOffsetY);
    this.floorLayer.setDepth(0);

    // ============================================
    // COLLIDERS (desde el tilemap)
    // ============================================

    this.colliders = [];
    this.bodegaZone = null;

    const objectLayer = this.palacioMap.getObjectLayer('colliders');

    if (objectLayer) {
      objectLayer.objects.forEach(obj => {
        const scaledX = this.mapOffsetX + obj.x * this.mapScale;
        const scaledY = this.mapOffsetY + obj.y * this.mapScale;
        const scaledW = obj.width * this.mapScale;
        const scaledH = obj.height * this.mapScale;

        if (obj.name === 'bodega') {
          this.bodegaZone = {
            x: scaledX,
            y: scaledY,
            width: scaledW,
            height: scaledH
          };
        } else {
          this.colliders.push({
            x: scaledX,
            y: scaledY,
            width: scaledW,
            height: scaledH
          });
        }
      });

      // Debug: mostrar colliders visualmente (solo si debug está activado)
      if (this.game.config.physics?.arcade?.debug === true) {
        this.colliders.forEach(col => {
          this.add.rectangle(col.x + col.width / 2, col.y + col.height / 2, col.width, col.height, 0x0000ff, 0.3)
            .setDepth(999);
        });
        if (this.bodegaZone) {
          this.add.rectangle(
            this.bodegaZone.x + this.bodegaZone.width / 2,
            this.bodegaZone.y + this.bodegaZone.height / 2,
            this.bodegaZone.width,
            this.bodegaZone.height,
            0x00ff00, 0.3
          ).setDepth(999);
        }
      }
    }

    // ============================================
    // DETERMINAR MODO ANTES DE CREAR ELEMENTOS
    // ============================================

    const fromBodega = this.loadData.fromBodega === true;
    const fromSave = this.loadData.fromSave === true && this.loadData.globalFlags?.freeExplorationUnlocked === true;
    const isResuming = fromBodega || fromSave;

    // ============================================
    // CADÁVER
    // ============================================

    this.cadaver = this.add.image(centerX, height * 0.35, 'mayor_son_dead')
      .setOrigin(0.5, 0.5)
      .setDepth(height * 0.35);

    // ============================================
    // MULTITUD HORRORIZADA
    // ============================================

    this.multitud = [];

    const radioCirculo = 100;
    for (let i = 0; i < 8; i++) {
      const angulo = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angulo) * radioCirculo;
      const y = height * 0.35 + Math.sin(angulo) * (radioCirculo * 0.6) + 50;

      if (y > height * 0.3) {
        this.createCiudadanoHorrorizado(x, y, isResuming);
      }
    }

    // Si estamos retomando, dispersar la multitud inmediatamente
    if (isResuming) {
      this.multitud.forEach(ciudadano => {
        this.tweens.killTweensOf(ciudadano);
        const direccion = ciudadano.x < centerX ? -1 : 1;
        ciudadano.x += direccion * 50;
        ciudadano.setAlpha(0.5);
      });
    }

    // ============================================
    // CARABINIERI
    // ============================================

    this.carabiniere1 = this.add.image(centerX - 80, height * 0.5, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.5);

    this.carabiniere2 = this.add.image(centerX + 80, height * 0.5, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(height * 0.5)
      .setFlipX(true);

    // Estado visual según modo
    if (isResuming) {
      this.carabiniere1.setAlpha(1);
      this.carabiniere2.setAlpha(1);
    } else {
      this.carabiniere1.setAlpha(0);
      this.carabiniere2.setAlpha(0);
    }

    // ============================================
    // FAMILIA DE MARLO (solo en secuencia inicial)
    // ============================================

    if (!isResuming) {
      this.padre = this.add.image(width - 200, height * 0.7, 'father_idle_west')
        .setOrigin(0.5, 1)
        .setDepth(height * 0.7)
        .setScale(1.15);

      this.madre = this.add.image(width - 220, height * 0.7, 'mother_idle_west')
        .setOrigin(0.5, 1)
        .setDepth(height * 0.7)
        .setScale(0.80);
    }

    // ============================================
    // MARLO
    // ============================================

    if (isResuming) {
      // Posición central para exploración
      this.marlo = this.add.sprite(centerX, height * 0.7, 'marlo_idle_south')
        .setOrigin(0.5, 1)
        .setDepth(900);
      this.marloDirection = 'south';
    } else {
      // Posición con familia para secuencia
      this.marlo = this.add.sprite(width - 200, height * 0.75, 'marlo_idle_west')
        .setOrigin(0.5, 1)
        .setDepth(height * 0.75);
      this.marloDirection = 'west';
    }

    // SIEMPRE definir marloSpeed en create()
    this.marloSpeed = 150;

    // ============================================
    // CAJA DE DIÁLOGO
    // ============================================

    this.dialogueBox = this.add.container(centerX, height - 80);
    this.dialogueBox.setVisible(false).setDepth(1000);

    const boxBg = this.add.rectangle(0, 0, width - 60, 120, 0x000000, 0.9);
    boxBg.setStrokeStyle(2, 0xffffff);

    this.speakerText = this.add.text(-width / 2 + 50, -40, '', {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold'
    });

    this.dialogueText = this.add.text(-width / 2 + 50, -15, '', {
      fontSize: '18px',
      color: '#ffffff',
      wordWrap: { width: width - 100 }
    });

    this.continueHint = this.add.text(width / 2 - 70, 40, '[ESPACIO]', {
      fontSize: '12px',
      color: '#888888'
    });

    this.dialogueBox.add([boxBg, this.speakerText, this.dialogueText, this.continueHint]);

    // Caja de pensamiento
    this.thoughtBox = this.add.container(centerX, height - 80);
    this.thoughtBox.setVisible(false).setDepth(1000);

    const thoughtBg = this.add.rectangle(0, 0, width - 60, 100, 0x000000, 0.7);
    thoughtBg.setStrokeStyle(2, 0x4a7c4e);

    this.thoughtText = this.add.text(0, 0, '', {
      fontSize: '18px',
      color: '#aaffaa',
      fontStyle: 'italic',
      align: 'center'
    }).setOrigin(0.5);

    this.thoughtBox.add([thoughtBg, this.thoughtText]);

    // ============================================
    // ESTADO DE LA ESCENA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;
    this.gameplayMode = false;
    this.investigando = false;
    this.freeExploration = false;

    // Input para diálogos
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Controles de movimiento
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    // ESC para finalizar (solo en exploración libre)
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.freeExploration) {
        this.finalizarEscena();
      }
    });

    // E para interactuar (entrar a la bodega)
    this.input.keyboard.on('keydown-E', () => {
      if (this.freeExploration && this.nearBodega) {
        this.entrarBodega();
      }
    });

    // Prompt de interacción "E"
    this.interactPrompt = this.add.container(0, 0);
    const promptBg = this.add.rectangle(0, 0, 80, 30, 0x000000, 0.8).setStrokeStyle(2, 0xffd700);
    const promptText = this.add.text(0, 0, '[E] Entrar', {
      fontSize: '12px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.interactPrompt.add([promptBg, promptText]);
    this.interactPrompt.setVisible(false).setDepth(1001);
    this.nearBodega = false;
    this.enteringBodega = false;

    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // ============================================
    // INICIAR SEGÚN MODO DE ENTRADA
    // ============================================

    if (fromBodega) {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        if (this.bodegaZone) {
          this.marlo.x = this.bodegaZone.x + this.bodegaZone.width / 2;
          this.marlo.y = this.bodegaZone.y + this.bodegaZone.height + 30;
          this.marlo.setDepth(this.marlo.y);
        }
        this.marlo.setVisible(true);
        this.marlo.setAlpha(1);
        this.investigando = true;
        this.startFreeExploration();
      });
    } else if (fromSave) {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        this.marlo.setVisible(true);
        this.marlo.setAlpha(1);
        this.investigando = true;
        this.startFreeExploration();
      });
    } else {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeincomplete', () => {
        this.time.delayedCall(500, () => this.runSequence());
      });
    }
  }

  getSaveData() {
    return {
      freeExploration: this.freeExploration
    };
  }

  createCiudadanoHorrorizado(x, y, skipTween = false) {
    const npcIndex = Phaser.Math.Between(1, 15);
    const ciudadano = this.add.image(x, y, `crowd_npc_front_${npcIndex}`)
      .setOrigin(0.5, 1)
      .setDepth(y);

    // Temblor de horror (solo si no estamos retomando)
    if (!skipTween) {
      this.tweens.add({
        targets: ciudadano,
        x: x + Phaser.Math.Between(-2, 2),
        duration: 100,
        yoyo: true,
        repeat: -1
      });
    }

    this.multitud.push(ciudadano);
    return ciudadano;
  }

  handleInput() {
    if (this.investigando && this.waitingForInput) {
      this.handleThoughtInput();
      return;
    }

    if (this.gameplayMode || this.freeExploration) return;

    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.thoughtBox.setVisible(false);
      this.currentStep++;
      this.runSequence();
    }
  }

  showDialogue(speaker, text) {
    this.speakerText.setText(speaker);
    this.dialogueText.setText(text);
    this.dialogueBox.setVisible(true);
    this.waitingForInput = true;
  }

  showThought(text) {
    this.thoughtText.setText(`"${text}"`);
    this.thoughtBox.setVisible(true);
    this.waitingForInput = true;
  }

  runSequence() {
    if (this.isAnimating) return;

    switch (this.currentStep) {
      case 0:
        this.isAnimating = true;
        this.time.delayedCall(1500, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 1:
        this.showDialogue('Ciudadano', '¡Ha muerto! ¡El hijo del Alcalde ha muerto!');
        break;

      case 2:
        this.showDialogue('Ciudadana', '¡No puede ser! ¡Estaba con nosotros hace apenas unos minutos!');
        break;

      case 3:
        this.showDialogue('Ciudadano', '¡Dios mío! ¡Es horrible! ¡Mirad la sangre!');
        break;

      case 4:
        this.showDialogue('Ciudadana', '¡Su rostro! ¡Le han arrancado el rostro!');
        break;

      case 5:
        this.showDialogue('Ciudadano', '¡Un demonio! ¡Ha sido obra de un demonio!');
        break;

      case 6:
        this.showDialogue('Ciudadana', '¡Los guardias! ¡Que alguien llame a los guardias!');
        break;

      case 7:
        this.isAnimating = true;
        this.carabinieriIntervienen(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 8:
        this.showDialogue('Madre de Marlo', 'Marlo, tenemos que salir de aquí inmediatamente. Esto no es seguro.');
        break;

      case 9:
        this.showDialogue('Padre de Marlo', 'Tu madre tiene razón. Vámonos de aquí, hijo.');
        break;

      case 10:
        this.showDialogue('Marlo', 'Esperad... necesito un momento.');
        break;

      case 11:
        this.showDialogue('Madre de Marlo', '¡Marlo! No es momento para curiosear. Un hombre ha muerto.');
        break;

      case 12:
        this.showDialogue('Marlo', 'Lo sé, mamá. Es solo que... algo no está bien aquí.');
        break;

      case 13:
        this.showDialogue('Padre de Marlo', 'Claro que no está bien. Han asesinado al heredero del Alcalde en pleno carnaval.');
        break;

      case 14:
        this.showDialogue('Marlo', 'No, me refiero a... el rostro. ¿Por qué llevarse su rostro?');
        break;

      case 15:
        this.showDialogue('Madre de Marlo', 'No lo sé y no quiero saberlo. Nos vamos ahora mismo.');
        break;

      case 16:
        this.showDialogue('Marlo', 'Dadme un segundo. Olvidé algo en el salón... enseguida os alcanzo.');
        break;

      case 17:
        this.showDialogue('Padre de Marlo', 'No tardes, Marlo. Te esperamos en la entrada.');
        break;

      case 18:
        this.showThought('No puedo irme así. Necesito ver esto de cerca.');
        break;

      case 19:
        this.startGameplay();
        break;
    }
  }

  carabinieriIntervienen(callback) {
    const { width, height } = this.scale;

    const interventionText = this.add.text(width / 2, height * 0.2, '[ Los carabinieri intervienen ]', {
      fontSize: '14px',
      color: '#8888ff',
      fontStyle: 'italic',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0).setDepth(500);

    this.tweens.add({
      targets: interventionText,
      alpha: 1,
      duration: 500
    });

    this.tweens.add({
      targets: [this.carabiniere1, this.carabiniere2],
      alpha: 1,
      duration: 800,
      delay: 500
    });

    this.multitud.forEach((ciudadano, i) => {
      const direccion = ciudadano.x < this.scale.width / 2 ? -1 : 1;
      this.tweens.add({
        targets: ciudadano,
        x: ciudadano.x + direccion * 50,
        alpha: 0.5,
        duration: 1000,
        delay: 800 + i * 100,
        ease: 'Power2'
      });
    });

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: interventionText,
        alpha: 0,
        duration: 500,
        onComplete: callback
      });
    });
  }

  startGameplay() {
    this.gameplayMode = true;

    const { width, height } = this.scale;

    // Ocultar padres (se han ido)
    if (this.padre) this.padre.setVisible(false);
    if (this.madre) this.madre.setVisible(false);

    this.instructionText = this.add.text(width / 2, 30, 'Usa las flechas o WASD para moverte\nAcércate al cadáver para investigar', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);

    this.zonaInvestigar = this.add.circle(this.cadaver.x, this.cadaver.y + 30, 50, 0xff0000, 0.1);
  }

  checkCollision(x, y, radius = 20) {
    const bodyTop = y - 40;

    for (const col of this.colliders) {
      if (x + radius > col.x && x - radius < col.x + col.width &&
        y > col.y && bodyTop < col.y + col.height) {
        return true;
      }
    }
    return false;
  }

  checkBodegaZone(x, y) {
    if (!this.bodegaZone) return false;
    const col = this.bodegaZone;
    return x > col.x - 10 && x < col.x + col.width + 10 &&
      y > col.y - 10 && y < col.y + col.height + 30;
  }

  update() {
    // Validar marloSpeed al inicio
    if (typeof this.marloSpeed !== 'number' || isNaN(this.marloSpeed)) {
      this.marloSpeed = 150;
    }

    if (!this.gameplayMode && !this.freeExploration) return;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

    let newDirection = this.marloDirection;
    let isMoving = vx !== 0 || vy !== 0;

    if (vy < 0) newDirection = 'north';
    else if (vy > 0) newDirection = 'south';
    else if (vx < 0) newDirection = 'west';
    else if (vx > 0) newDirection = 'east';

    if (isMoving) {
      const animKey = `marlo_walk_${newDirection}`;
      if (this.marlo.anims.currentAnim?.key !== animKey) {
        this.marlo.play(animKey);
      }
    } else {
      this.marlo.stop();
      this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
    }

    this.marloDirection = newDirection;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    const delta = this.game.loop.delta / 1000;
    const newX = this.marlo.x + vx * this.marloSpeed * delta;
    const newY = this.marlo.y + vy * this.marloSpeed * delta;

    // Protección anti-NaN
    if (isNaN(newX) || isNaN(newY)) {
      console.error('[Scene_1_4] NaN position detected - aborting movement');
      return;
    }

    if (!this.checkCollision(newX, newY)) {
      this.marlo.x = newX;
      this.marlo.y = newY;
    } else {
      if (!this.checkCollision(newX, this.marlo.y)) {
        this.marlo.x = newX;
      } else if (!this.checkCollision(this.marlo.x, newY)) {
        this.marlo.y = newY;
      }
    }

    this.marlo.x = Phaser.Math.Clamp(this.marlo.x, 50, 750);
    this.marlo.y = Phaser.Math.Clamp(this.marlo.y, 100, 580);

    if (this.freeExploration) {
      this.marlo.setDepth(Math.max(this.marlo.y, 500));
    } else {
      this.marlo.setDepth(this.marlo.y);
    }

    if (this.gameplayMode && !this.investigando) {
      const dist = Phaser.Math.Distance.Between(
        this.marlo.x, this.marlo.y,
        this.cadaver.x, this.cadaver.y + 30
      );

      if (dist < 60) {
        this.investigando = true;
        this.iniciarInvestigacion();
      }
    }

    if (this.freeExploration) {
      const nearBodega = this.checkBodegaZone(this.marlo.x, this.marlo.y);
      if (nearBodega && !this.nearBodega) {
        this.nearBodega = true;
        this.interactPrompt.setVisible(true);
        this.interactPrompt.setPosition(this.marlo.x, this.marlo.y - 60);
      } else if (!nearBodega && this.nearBodega) {
        this.nearBodega = false;
        this.interactPrompt.setVisible(false);
      } else if (nearBodega) {
        this.interactPrompt.setPosition(this.marlo.x, this.marlo.y - 60);
      }
    }
  }

  iniciarInvestigacion() {
    this.gameplayMode = false;

    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_north');

    if (this.instructionText) this.instructionText.destroy();
    if (this.zonaInvestigar) this.zonaInvestigar.destroy();

    this.investigationStep = 0;
    this.runInvestigationSequence();
  }

  runInvestigationSequence() {
    switch (this.investigationStep) {
      case 0:
        this.time.delayedCall(500, () => {
          this.showThought('El hijo del Alcalde... sin vida, sin rostro. Esto es una pesadilla.');
          this.investigationStep++;
        });
        break;
      case 1:
        this.showThought('Hace apenas unos minutos estaba en el escenario, recibiendo aplausos...');
        this.investigationStep++;
        break;
      case 2:
        this.showThought('¿Quién podría hacer algo tan horrible? ¿Y por qué arrancarle el rostro?');
        this.investigationStep++;
        break;
      case 3:
        this.showThought('En el carnaval todos llevamos máscaras para ocultar quiénes somos...');
        this.investigationStep++;
        break;
      case 4:
        this.showThought('Pero él... ya no tiene nada que ocultar. Le han quitado todo.');
        this.investigationStep++;
        break;
      case 5:
        this.showThought('Esto no es un crimen común. Hay algo ritual, algo simbólico en todo esto.');
        this.investigationStep++;
        break;
      case 6:
        this.showThought('Los carabinieri no van a descubrir nada. Nunca lo hacen.');
        this.investigationStep++;
        break;
      case 7:
        this.showThought('Tengo que investigar por mi cuenta. Quizás en la bodega encuentre alguna pista...');
        this.investigationStep++;
        break;
      case 8:
        this.thoughtBox.setVisible(false);
        this.startFreeExploration();
        break;
    }
  }

  handleThoughtInput() {
    if (this.investigando && this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.thoughtBox.setVisible(false);
      this.runInvestigationSequence();
    }
  }

  startFreeExploration() {
    this.freeExploration = true;

    const { width } = this.scale;

    // Destruir texto anterior si existe
    if (this.freeExploreText) {
      this.freeExploreText.destroy();
    }

    this.freeExploreText = this.add.text(width / 2, 30, 'Explora el palacio libremente | [ESC] para terminar', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);
  }

  entrarBodega() {
    if (this.enteringBodega) return;
    this.enteringBodega = true;

    this.freeExploration = false;

    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_Bodega');
    });
  }

  finalizarEscena() {
    this.freeExploration = false;

    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}
