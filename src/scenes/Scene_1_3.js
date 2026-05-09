// src/scenes/Scene_1_3.js
// Escena 1-3: Palacio de la Alcaldía - Hall
// Ballo Mascherato y anuncio del heredero

import SettingsUI from '../ui/SettingsUI.js';
import TypewriterText from '../utils/TypewriterText.js';

export default class Scene_1_3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_3' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // ============================================
    // TILEMAP DEL PALACIO
    // ============================================

    const palacioMap = this.make.tilemap({ key: 'palacio_map' });
    const tilesetHall = palacioMap.addTilesetImage('hall', 'tileset_hall');
    const tilesetInterior = palacioMap.addTilesetImage('interior1', 'tileset_interior1');

    // Crear capa de tiles
    const floorLayer = palacioMap.createLayer('Capa de patrones 1', [tilesetHall, tilesetInterior], 0, 0);

    // Escalar para cubrir pantalla (palacio es 960x640, pantalla es 800x600)
    const mapWidth = palacioMap.widthInPixels;
    const mapHeight = palacioMap.heightInPixels;
    const scaleX = width / mapWidth;
    const scaleY = height / mapHeight;
    const mapScale = Math.max(scaleX, scaleY);
    floorLayer.setScale(mapScale);

    // Centrar el mapa
    const scaledWidth = mapWidth * mapScale;
    const scaledHeight = mapHeight * mapScale;
    floorLayer.setPosition((width - scaledWidth) / 2, (height - scaledHeight) / 2);

    // ============================================
    // MÚSICOS (sala superior izquierda) - con animación
    // ============================================

    const salaX = 120;
    const salaY = height * 0.22;

    this.musicians = [];
    const musicianPositions = [
      { x: salaX - 80, y: salaY + 35 },
      { x: salaX - 40, y: salaY + 35 },
      { x: salaX + 0, y: salaY + 35 },
      { x: salaX + 40, y: salaY + 35 }
    ];

    for (let i = 0; i < 4; i++) {
      const musician = this.add.sprite(musicianPositions[i].x, musicianPositions[i].y, `musician_${i + 1}`)
        .setOrigin(0.5, 1)
        .setDepth(salaY)
        .setScale(0.9);
      musician.play(`musician_${i + 1}_play`);
      this.musicians.push(musician);
    }

    // Indicador de música (notas animadas)
    this.notasMusicales = [];
    for (let i = 0; i < 3; i++) {
      const nota = this.add.text(salaX - 20 + i * 40, salaY - 50, '♪', {
        fontSize: '20px',
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0).setDepth(500);
      this.notasMusicales.push(nota);
    }

    // ============================================
    // ALCALDE E HIJO (frente a las escaleras)
    // ============================================

    const escalerasY = height * 0.38;

    // Alabarderos (4 frente a las escaleras)
    this.add.image(centerX - 130, escalerasY + 25, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setScale(1.05);

    this.add.image(centerX - 90, escalerasY + 25, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setScale(1.05);

    this.add.image(centerX - 10, escalerasY + 25, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true)
      .setScale(1.05);

    this.add.image(centerX + 30, escalerasY + 25, 'alabardiere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true)
      .setScale(1.05);

    /*
    // Carabinieri a los lados
    this.add.image(centerX - 170, escalerasY + 20, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY);

    this.add.image(centerX + 150, escalerasY + 20, 'carabiniere')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY)
      .setFlipX(true);
    */

    // Alcalde (en el escenario, centrado)
    this.alcalde = this.add.image(centerX - 30, escalerasY - 30, 'mayor_stand')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY + 10)
      .setScale(0.9);

    // Hijo del Alcalde (al lado del alcalde, semi-oculto inicialmente)
    this.hijoAlcalde = this.add.image(centerX - 70, escalerasY - 35, 'mayor_son')
      .setOrigin(0.5, 1)
      .setDepth(escalerasY + 10)
      .setAlpha(0.8)
      .setScale(0.9);

    // ============================================
    // BAILARINES + ESPECTADORES (sin repeticiones)
    // ============================================

    this.bailarines = [];
    this.espectadores = [];
    this.bailando = true;

    // Pool de sprites adultos (24: npc1..npc25 excepto npc12 que es guardia)
    // y pool de niños (25: npc26..npc50). Shuffle + pop garantiza cero
    // repeticiones.
    const poolAdultos = [];
    for (let i = 1; i <= 25; i++) {
      if (i !== 12) poolAdultos.push(`crowd_npc_front_${i}`);
    }
    const poolNinos = [];
    for (let i = 26; i <= 50; i++) {
      poolNinos.push(`crowd_npc_front_child_${i}`);
    }
    Phaser.Utils.Array.Shuffle(poolAdultos);
    Phaser.Utils.Array.Shuffle(poolNinos);

    // -------------------- AJUSTES DE LA PISTA --------------------
    // Cada entrada = una fila de parejas. Modifica count/spacing/offsetX/y
    // para reorganizar la pista de baile.
    // 11 parejas × 2 adultos = 22 adultos (quedan 2 para espectadores).
    const filasBaile = [
      { y: escalerasY + 95, count: 3, spacing: 105, offsetX: 85 },
      { y: escalerasY + 160, count: 3, spacing: 110, offsetX: 115 },
      { y: escalerasY + 220, count: 3, spacing: 105, offsetX: 75 },
      { y: escalerasY + 280, count: 2, spacing: 130, offsetX: 165 }
    ];
    // Ruido aleatorio (en px) para romper la alineación perfecta de cada fila.
    const jitterBaile = { x: 18, y: 10 };
    // -------------------------------------------------------------

    let parejaIndex = 0;
    filasBaile.forEach(fila => {
      for (let i = 0; i < fila.count; i++) {
        const baseX = fila.offsetX + i * fila.spacing;
        const jitX = Phaser.Math.Between(-jitterBaile.x, jitterBaile.x);
        const jitY = Phaser.Math.Between(-jitterBaile.y, jitterBaile.y);
        const keyA = poolAdultos.shift();
        const keyB = poolAdultos.shift();
        if (!keyA || !keyB) break;
        this.createParejaBaile(baseX + jitX, fila.y + jitY, parejaIndex, keyA, keyB);
        parejaIndex++;
      }
    });

    // -------------------- ESPECTADORES (fuera de pista) --------------------
    // Posiciones individuales. Edita x/y o añade/quita entradas.
    //   `child: true`  usa el pool de niños (escala 0.75).
    // Rango seguro: y in [escalerasY+80, escalerasY+300]  (y in [308, 528] en
    // pantalla). Por encima queda tras el escenario; por debajo cae fuera del
    // suelo renderizado.
    const espectadoresPos = [
      // Cluster izq superior (frente al escenario, izquierda de la pista)
      { x: 30, y: escalerasY + 30 },
      { x: 55, y: escalerasY + 30, child: true },
      // Cluster der superior (entre la pista y la barra)
      { x: 520, y: escalerasY + 50 },
      { x: 545, y: escalerasY + 50, child: true },
      // Lateral derecho (media altura, a la derecha de filas 2 y 3)
      { x: 420, y: escalerasY + 180 },
      { x: 430, y: escalerasY + 270, child: true },
      // Grupo inferior (debajo de la fila 4, separados lateralmente)
      { x: 80, y: escalerasY + 340, child: true },
      { x: 390, y: escalerasY + 340 }
    ];
    // -----------------------------------------------------------------------

    espectadoresPos.forEach(pos => {
      const key = pos.child ? poolNinos.shift() : poolAdultos.shift();
      if (!key) return;
      const scale = pos.child ? 0.75 : 0.9;
      const spectator = this.add.image(pos.x, pos.y, key)
        .setOrigin(0.5, 1)
        .setDepth(pos.y)
        .setScale(scale);
      // Leve balanceo ocioso
      this.tweens.add({
        targets: spectator,
        y: pos.y + Phaser.Math.Between(-2, 2),
        duration: Phaser.Math.Between(1400, 2200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.espectadores.push(spectator);
    });

    // -------------------- INVITADOS DE ESPALDAS A LA BARRA --------------------
    // Sprites del pool back/ (npc47, npc48) ubicados arriba a la derecha,
    // como invitados pidiendo en la barra. Posiciones absolutas — edita aquí.
    const invitadosBarra = [
      { x: 500, y: escalerasY - 85, key: 'crowd_npc_back_47', scale: 0.88 },
      { x: 545, y: escalerasY - 90, key: 'crowd_npc_back_48', scale: 0.88 }
    ];
    invitadosBarra.forEach(inv => {
      const s = this.add.image(inv.x, inv.y, inv.key)
        .setOrigin(0.5, 1)
        .setDepth(inv.y)
        .setScale(inv.scale);
      // Leve balanceo ocioso (igual que el resto de espectadores)
      this.tweens.add({
        targets: s,
        y: inv.y + Phaser.Math.Between(-2, 2),
        duration: Phaser.Math.Between(1400, 2200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.espectadores.push(s);
    });
    // -------------------------------------------------------------------------

    // ============================================
    // FAMILIA DE MARLO (espectadores, lado derecho del salón)
    // Reutiliza los puntos `marlo_spawn`, `father_spawn`, `mother_spawn`
    // del tilemap (los mismos que Scene_1_4) para que la posición sea
    // consistente con esa escena y con cualquier resolución.
    // ============================================

    const mapOffsetX = (width - scaledWidth) / 2;
    const mapOffsetY = (height - scaledHeight) / 2;
    const familiaObjects = palacioMap.getObjectLayer('colliders');
    let padreSpawn = null;
    let madreSpawn = null;
    let marloSpawn = null;
    if (familiaObjects) {
      familiaObjects.objects.forEach(obj => {
        const sx = mapOffsetX + obj.x * mapScale;
        const sy = mapOffsetY + obj.y * mapScale;
        const sw = obj.width * mapScale;
        const sh = obj.height * mapScale;
        // Centro-inferior del rect = pies del personaje (origen 0.5, 1)
        if (obj.name === 'father_spawn') {
          padreSpawn = { x: sx + sw / 2, y: sy + sh };
        } else if (obj.name === 'mother_spawn') {
          madreSpawn = { x: sx + sw / 2, y: sy + sh };
        } else if (obj.name === 'marlo_spawn') {
          marloSpawn = { x: sx + sw / 2, y: sy + sh };
        }
      });
    }

    if (padreSpawn) {
      this.padre = this.add.image(padreSpawn.x, padreSpawn.y, 'father_idle_south')
        .setOrigin(0.5, 1)
        .setDepth(padreSpawn.y)
        .setScale(1.1);
    }
    if (madreSpawn) {
      this.madre = this.add.image(madreSpawn.x, madreSpawn.y, 'mother_idle_east')
        .setOrigin(0.5, 1)
        .setDepth(madreSpawn.y)
        .setScale(0.8);
    }
    if (marloSpawn) {
      this.marlo = this.add.image(marloSpawn.x, marloSpawn.y, 'marlo_idle_west')
        .setOrigin(0.5, 1)
        .setDepth(marloSpawn.y)
        .setScale(0.9);;
    }

    // ============================================
    // CAJA DE DIÁLOGO (estilo Scene_1_2: con retrato a la derecha)
    // ============================================

    this.dialogueBox = this.add.container(centerX, height - 75);
    this.dialogueBox.setVisible(false).setDepth(1000);

    const boxBg = this.add.rectangle(0, 0, width - 100, 120, 0x000000, 0.75);
    boxBg.setStrokeStyle(2, 0x8b6a4b);

    // Retrato del hablante (lado derecho de la caja, sin marco extra)
    this.portraitImage = this.add.image(290, 0, 'marlo_portrait').setScale(2);
    this.portraitImage.setVisible(false);

    // Mapa de retratos por nombre de hablante. Si una clave no tiene textura
    // cargada, ese diálogo se muestra sin retrato (sin romper la escena).
    // Para activar un retrato: 1) crea el png; 2) cárgalo en PreloadScene;
    // 3) asegúrate de que la clave aquí coincida.
    this.portraitMap = {
      'Noble Anciano': 'old_noble_portrait',
      'Dama Joven': 'young_noble_lady_portrait',
      'Otro Noble': 'young_noble_man_portrait',
      'Comerciante': 'comerciante_portrait',
      'Dama Anciana': 'dama_anciana_portrait',
      'Alcalde': 'mayor_portrait',
      'Noble': 'noble_portrait',
      'Dama': 'dama_portrait',
      'Ciudadano': 'ciudadano_portrait',
      'Hijo del Alcalde': 'mayor_son_portrait'
    };

    this.speakerText = this.add.text(-width / 2 + 70, -42, '', {
      fontSize: '13px',
      color: '#ffd700',
      fontStyle: 'bold'
    });

    this.dialogueText = this.add.text(-width / 2 + 70, -22, '', {
      fontSize: '14px',
      color: '#ffffff',
      wordWrap: { width: width - 160 }
    });

    this.continueHint = this.add.text(-width / 2 + 70, 40, '[ESPACIO]', {
      fontSize: '10px',
      color: '#888888'
    });

    this.dialogueBox.add([boxBg, this.portraitImage, this.speakerText, this.dialogueText, this.continueHint]);

    // ============================================
    // SECUENCIA DE LA ESCENA
    // ============================================

    this.currentStep = 0;
    this.isAnimating = false;
    this.waitingForInput = false;

    // Input para avanzar diálogos
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
    this.input.on('pointerdown', () => this.handleInput());

    // Settings UI
    this.settingsUI = new SettingsUI(this);

    // Iniciar secuencia con fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeincomplete', () => {
      this.startMusica();
      this.time.delayedCall(500, () => this.runSequence());
    });
  }

  createParejaBaile(x, y, index, keyA, keyB) {
    const pareja = this.add.container(x, y);

    // Los sprites vienen del pool shuffled (sin repeticiones)
    const p1 = this.add.image(-20, 0, keyA)
      .setOrigin(0.5, 1)
      .setScale(0.9);

    const p2 = this.add.image(20, 0, keyB)
      .setOrigin(0.5, 1)
      .setScale(0.9);

    pareja.add([p1, p2]);
    pareja.setDepth(y);

    // Animación de baile (rotación sutil)
    this.tweens.add({
      targets: pareja,
      angle: 3,
      duration: 600 + index * 50,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Movimiento lateral
    this.tweens.add({
      targets: pareja,
      x: x + 15,
      duration: 1200 + index * 100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.bailarines.push(pareja);
  }

  startMusica() {
    // Animar notas musicales
    this.notasMusicales.forEach((nota, i) => {
      this.tweens.add({
        targets: nota,
        alpha: 1,
        y: nota.y - 20,
        duration: 1000,
        delay: i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  stopMusica() {
    // Detener notas
    this.notasMusicales.forEach(nota => {
      this.tweens.killTweensOf(nota);
      this.tweens.add({
        targets: nota,
        alpha: 0,
        duration: 500
      });
    });
  }

  stopBaile() {
    this.bailando = false;

    // Detener animaciones de baile gradualmente
    this.bailarines.forEach((pareja, i) => {
      this.time.delayedCall(i * 200, () => {
        this.tweens.killTweensOf(pareja);
        this.tweens.add({
          targets: pareja,
          angle: 0,
          duration: 500,
          ease: 'Power2'
        });
      });
    });
  }

  handleInput() {
    // Si el typewriter está escribiendo, saltar al final
    if (this._typewriter && this._typewriter.isTyping) {
      this._typewriter.skip();
      return;
    }

    if (this.waitingForInput && !this.isAnimating) {
      this.waitingForInput = false;
      this.dialogueBox.setVisible(false);
      this.currentStep++;
      this.runSequence();
    }
  }

  showDialogue(speaker, text, portraitOverride) {
    const { width } = this.scale;
    const portraitKey = portraitOverride || this.portraitMap[speaker];

    // Mostrar retrato solo si la textura existe (permite iterar añadiendo
    // retratos uno a uno sin romper la escena).
    if (portraitKey && this.textures.exists(portraitKey)) {
      this.portraitImage.setTexture(portraitKey);
      this.portraitImage.setVisible(true);
      this.dialogueText.setWordWrapWidth(width - 280);
    } else {
      this.portraitImage.setVisible(false);
      this.dialogueText.setWordWrapWidth(width - 160);
    }

    this.speakerText.setText(speaker);
    this.dialogueBox.setVisible(true);
    this.continueHint.setVisible(false);

    if (this._typewriter) this._typewriter.destroy();
    this._typewriter = new TypewriterText(this, this.dialogueText, text, {
      charDelay: 30,
      onComplete: () => {
        this.continueHint.setVisible(true);
        this.waitingForInput = true;
      }
    });
  }

  runSequence() {
    if (this.isAnimating) return;

    switch (this.currentStep) {
      case 0:
        // Baile en progreso - pausa para establecer escena
        this.isAnimating = true;
        this.time.delayedCall(3000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      // ============================================
      // CONVERSACIÓN DURANTE EL BAILE
      // ============================================

      case 1:
        this.showDialogue('Noble Anciano', 'Otro baile, otro discurso. Mis rodillas solo aguantan por el buen vino del Alcalde.');
        break;

      case 2:
        this.showDialogue('Dama Joven', 'Dicen que el anuncio no es de sucesión, sino de purga. Alguien ha estado husmeando en los libros del puerto.');
        break;

      case 3:
        this.showDialogue('Otro Noble', '¡Tonterías! Es para presentar a su hijo. Un muchacho blando como el pan de ayer. La ciudad necesita puño de hierro, no terciopelo.');
        break;

      case 4:
        this.showDialogue('Comerciante', 'Sea lo que sea, los precios del azafrán subirán mañana. Siempre suben tras sus "anuncios importantes".');
        break;

      case 5:
        this.showDialogue('Dama Anciana', '¿Veis a Rafaello, el capitán? Mira al balcón, no al Alcalde. Algo tiene atado en la sombra.');
        break;

      case 6:
        // Pausa para disfrutar del baile
        this.isAnimating = true;
        this.time.delayedCall(2000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 7:
        // La orquesta finaliza
        this.isAnimating = true;
        this.stopMusica();
        this.stopBaile();
        this.time.delayedCall(2000, () => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      // ============================================
      // DISCURSO DEL ALCALDE
      // ============================================

      case 8:
        this.showDialogue('Alcalde', '¡Estimados invitados! Por favor, un momento de atención...');
        break;

      case 9:
        this.showDialogue('Alcalde', 'Hace cien años, nuestros ancestros fundaron esta ciudad con un sueño.');
        break;

      case 10:
        this.showDialogue('Alcalde', 'Un sueño de prosperidad, de cultura, de una vida mejor para todos.');
        break;

      case 11:
        this.showDialogue('Alcalde', 'Esta noche celebramos no solo ese sueño, sino su realización.');
        break;

      case 12:
        this.showDialogue('Alcalde', 'Filanccia ha florecido bajo el liderazgo de mi familia durante generaciones.');
        break;

      case 13:
        this.showDialogue('Alcalde', 'Pero todo líder debe pensar en el futuro. En quién continuará su obra.');
        break;

      case 14:
        this.showDialogue('Alcalde', 'He gobernado esta ciudad durante veinte años, y ha sido el mayor honor de mi vida.');
        break;

      case 15:
        this.showDialogue('Alcalde', 'Pero ha llegado el momento de preparar la transición hacia una nueva era.');
        break;

      case 16:
        this.showDialogue('Alcalde', 'Por ello, esta noche, ante todos vosotros, anuncio oficialmente...');
        break;

      case 17:
        this.showDialogue('Alcalde', '¡Que mi hijo será mi sucesor como Alcalde de Filanccia!');
        break;

      // ============================================
      // PRESENTACIÓN DEL HIJO
      // ============================================

      case 18:
        // Presentar al hijo
        this.isAnimating = true;
        this.presentarHijo(() => {
          this.isAnimating = false;
          this.currentStep++;
          this.runSequence();
        });
        break;

      case 19:
        this.showDialogue('Alcalde', '¡Él llevará el legado de nuestra familia y guiará a Filanccia hacia su próximo siglo de gloria!');
        break;

      // ============================================
      // REACCIONES DE LA MULTITUD
      // ============================================

      case 20:
        this.showDialogue('Noble', '¡Bravo! ¡Una elección excelente!');
        break;

      case 21:
        this.showDialogue('Dama', '¡El joven señor será un gran líder! ¡Lo lleva en la sangre!');
        break;

      case 22:
        this.showDialogue('Ciudadano', '¡Viva el futuro Alcalde! ¡Viva Filanccia!');
        break;

      case 23:
        this.showDialogue('Noble', 'La dinastía continúa. Filanccia está en buenas manos.');
        break;

      case 24:
        // Murmullo de un escéptico
        this.showDialogue('Voz entre la multitud', '...aunque algunos dicen que es demasiado joven para el cargo...');
        break;

      case 25:
        this.showDialogue('Otra voz', '¡Silencio! No es momento para dudas. Es una noche de celebración.');
        break;

      // ============================================
      // DISCURSO DEL HIJO DEL ALCALDE
      // ============================================

      case 26:
        this.showDialogue('Hijo del Alcalde', '(VOZ CLARA, UN TEMBLOR LEVE) Padre... ciudadanos. Solo he querido, siempre, escuchar el rumor de los canales y vuestras voces con el mismo respeto. Prometo... ser digno de esta máscara que me entregáis.');
        break;

      case 27:
        this.showDialogue('Hijo del Alcalde', 'Sé que tengo grandes zapatos que llenar. Mi padre ha sido un líder ejemplar.');
        break;

      case 28:
        this.showDialogue('Hijo del Alcalde', 'Pero os prometo que dedicaré cada día de mi vida al servicio de Filanccia.');
        break;

      case 29:
        this.showDialogue('Hijo del Alcalde', 'Continuaré las tradiciones que nos han hecho grandes...');
        break;

      case 30:
        this.showDialogue('Hijo del Alcalde', 'Y trabajaré para construir un futuro aún más brillante para todos nosotros.');
        break;

      case 31:
        this.showDialogue('Hijo del Alcalde', '¡Por Filanccia! ¡Por el centenario! ¡Y por los próximos cien años de prosperidad!');
        break;

      // ============================================
      // APLAUSOS FINALES
      // ============================================

      case 32:
        this.showDialogue('Multitud', '¡¡¡VIVA!!! ¡¡¡VIVA EL FUTURO ALCALDE!!!');
        break;

      case 33:
        this.showDialogue('Alcalde', '¡Y ahora, que continúe la celebración! ¡Que la música no pare hasta el amanecer!');
        break;

      case 34:
        // Fade out y transición
        this.tweens.killAll();
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Scene_1_4');
        });
        break;
    }
  }

  presentarHijo(callback) {
    // Destacar al hijo del alcalde
    this.tweens.add({
      targets: this.hijoAlcalde,
      alpha: 1,
      scale: 1.1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        // Pausa dramática
        this.time.delayedCall(1500, callback);
      }
    });

    // Texto indicador
    const { width, height } = this.scale;
    const presentText = this.add.text(width / 2, height * 0.35, '[ El hijo del Alcalde es presentado ]', {
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'italic',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0).setDepth(500);

    this.tweens.add({
      targets: presentText,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: presentText,
            alpha: 0,
            duration: 500
          });
        });
      }
    });

    // Observación de Marlo - Strappavolti ya estaba en la sala
    this.time.delayedCall(800, () => {
      const marloObs = this.add.text(width / 2, height * 0.52,
        '"Entre todas las máscaras que miran al escenario,\nhay una, tras una columna, que no se mueve.\nNo respira. Solo espera."', {
        fontSize: '13px',
        color: '#aaffaa',
        fontStyle: 'italic',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 },
        align: 'center'
      }).setOrigin(0.5).setAlpha(0).setDepth(500);

      this.tweens.add({
        targets: marloObs,
        alpha: 1,
        duration: 600,
        onComplete: () => {
          this.time.delayedCall(3500, () => {
            this.tweens.add({
              targets: marloObs,
              alpha: 0,
              duration: 600,
              onComplete: () => marloObs.destroy()
            });
          });
        }
      });
    });
  }

  shutdown() {
    this.input.keyboard.off('keydown-SPACE');
    this.input.off('pointerdown');
    this.tweens.killAll();
  }
}
