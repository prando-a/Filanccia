// src/scenes/Scene_1_1.js
// Escena 1-1: Camino a la Plaza
// Marlo camina con sus padres hacia la plaza (parallax vertical)

export default class Scene_1_1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Scene_1_1' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // ============================================
    // CONFIGURACIÓN DEL PARALLAX
    // ============================================

    // Altura total del "recorrido" virtual
    this.totalScrollHeight = 1200;
    this.scrollProgress = 0;
    this.scrollSpeed = 0.3; // Velocidad del scroll automático

    // ============================================
    // CAPAS DE PARALLAX (de atrás hacia adelante)
    // ============================================

    // Capa 0: Cielo nocturno (fondo estático)
    this.skyLayer = this.add.rectangle(centerX, height / 2, width, height, 0x0a0a1a);

    // Estrellas en el cielo
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.4),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.8)
      );
      // Parpadeo sutil
      this.tweens.add({
        targets: star,
        alpha: star.alpha * 0.5,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Capa 1: Edificios lejanos (parallax lento)
    this.farBuildings = this.add.container(0, 0);
    this.createFarBuildings();

    // Capa 2: Edificios cercanos (parallax medio)
    this.nearBuildings = this.add.container(0, 0);
    this.createNearBuildings();

    // Capa 3: Calle/suelo (parallax rápido)
    this.streetLayer = this.add.container(0, 0);
    this.createStreet();

    // ============================================
    // PERSONAJES (se mueven con la calle)
    // ============================================

    // Contenedor de la familia
    this.familyContainer = this.add.container(centerX, height * 0.65);

    // Padres (adelante) - usando sprites reales con animación de caminar
    this.padre = this.add.sprite(-30, -20, 'father_idle_north').setOrigin(0.5, 1).setScale(1.3);
    this.madre = this.add.sprite(30, -20, 'mother_idle_north').setOrigin(0.5, 1).setScale(1);

    // Marlo (detrás de los padres)
    this.marlo = this.add.sprite(0, 30, 'marlo_idle_north').setOrigin(0.5, 1);

    this.familyContainer.add([this.padre, this.madre, this.marlo]);

    // Iniciar animaciones de caminar
    this.padre.play('father_walk_north');
    this.madre.play('mother_walk_north');
    this.marlo.play('marlo_walk_north');

    // Animación de caminar (bobbing sutil)
    this.tweens.add({
      targets: this.familyContainer,
      y: this.familyContainer.y - 3,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // ============================================
    // UI - Indicador de escena (debug)
    // ============================================

    this.add.text(10, 10, 'ESCENA 1-1: Camino a la Plaza', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    }).setDepth(1000);

    // ============================================
    // ELEMENTOS AMBIENTALES
    // ============================================

    // Faroles que pasan (aparecen y desaparecen)
    this.faroles = [];
    this.nextFarolTime = 0;

    // Otras personas caminando (siluetas)
    this.crearTranseuntes();

    // ============================================
    // SECUENCIA DE LA ESCENA
    // ============================================

    this.scenePhase = 'scrolling'; // 'scrolling', 'arriving', 'transition'
    this.autoScroll = true;

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Texto inicial
    this.time.delayedCall(1500, () => {
      this.showAmbientText('Las calles de Filanccia rebosan de gente...');
    });

    // Input para saltar (debug)
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.scenePhase === 'scrolling') {
        this.scrollProgress = this.totalScrollHeight; // Saltar al final
      }
    });
  }

  createFarBuildings() {
    const { width, height } = this.scale;

    // Siluetas de edificios lejanos (color más oscuro)
    const buildingColor = 0x1a1a2a;

    for (let i = 0; i < 8; i++) {
      const bw = Phaser.Math.Between(60, 120);
      const bh = Phaser.Math.Between(100, 200);
      const bx = i * 120 - 50;
      const by = height * 0.35;

      const building = this.add.rectangle(bx, by, bw, bh, buildingColor).setOrigin(0.5, 1);

      // Algunas ventanas iluminadas
      const numWindows = Phaser.Math.Between(2, 5);
      for (let w = 0; w < numWindows; w++) {
        const wx = bx + Phaser.Math.Between(-bw / 3, bw / 3);
        const wy = by - Phaser.Math.Between(20, bh - 20);
        const windowLight = this.add.rectangle(wx, wy, 8, 10, 0xffdd88, 0.6);
        this.farBuildings.add(windowLight);
      }

      this.farBuildings.add(building);
    }
  }

  createNearBuildings() {
    const { width, height } = this.scale;

    // Edificios más cercanos a los lados
    const leftColor = 0x2a2a3a;
    const rightColor = 0x2a2a3a;

    // Izquierda
    const leftBuilding = this.add.rectangle(-20, height * 0.5, 150, height, leftColor).setOrigin(0, 0.5);
    this.nearBuildings.add(leftBuilding);

    // Detalles izquierda (ventanas, puertas)
    for (let i = 0; i < 4; i++) {
      const wy = height * 0.3 + i * 80;
      const window = this.add.rectangle(50, wy, 30, 40, 0x0a0a1a);
      window.setStrokeStyle(2, 0x4a4a5a);
      this.nearBuildings.add(window);
    }

    // Derecha
    const rightBuilding = this.add.rectangle(width + 20, height * 0.5, 150, height, rightColor).setOrigin(1, 0.5);
    this.nearBuildings.add(rightBuilding);

    // Detalles derecha
    for (let i = 0; i < 4; i++) {
      const wy = height * 0.3 + i * 80;
      const window = this.add.rectangle(width - 50, wy, 30, 40, 0x0a0a1a);
      window.setStrokeStyle(2, 0x4a4a5a);
      this.nearBuildings.add(window);
    }
  }

  createStreet() {
    const { width, height } = this.scale;

    // Suelo de adoquines
    const street = this.add.rectangle(width / 2, height * 0.85, width, height * 0.35, 0x3a3a4a);
    this.streetLayer.add(street);

    // Líneas de adoquines (se moverán con parallax)
    this.adoquines = [];
    for (let i = 0; i < 8; i++) {
      const lineY = height * 0.7 + i * 25;
      const line = this.add.rectangle(width / 2, lineY, width - 100, 2, 0x2a2a3a);
      this.adoquines.push(line);
      this.streetLayer.add(line);
    }
  }

  crearTranseuntes() {
    // Siluetas de personas caminando en la misma dirección
    this.transeuntes = [];

    for (let i = 0; i < 5; i++) {
      const tx = Phaser.Math.Between(100, 700);
      const ty = Phaser.Math.Between(this.scale.height * 0.55, this.scale.height * 0.75);
      const scale = Phaser.Math.FloatBetween(0.5, 0.8);

      const transeunte = this.add.container(tx, ty);
      const body = this.add.rectangle(0, 0, 20, 35, 0x1a1a2a, 0.7);
      const head = this.add.circle(0, -22, 8, 0x2a2a3a, 0.7);
      transeunte.add([body, head]);
      transeunte.setScale(scale);
      transeunte.setDepth(ty); // Y-sorting básico

      // Bobbing
      this.tweens.add({
        targets: transeunte,
        y: ty - 2,
        duration: Phaser.Math.Between(350, 450),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.transeuntes.push(transeunte);
    }
  }

  showAmbientText(text) {
    const { width } = this.scale;

    const ambientText = this.add.text(width / 2, 80, text, {
      fontSize: '16px',
      color: '#cccccc',
      fontStyle: 'italic',
      backgroundColor: '#00000066',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setAlpha(0).setDepth(1000);

    this.tweens.add({
      targets: ambientText,
      alpha: 1,
      duration: 800,
      onComplete: () => {
        this.time.delayedCall(3000, () => {
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
    if (this.scenePhase === 'scrolling' && this.autoScroll) {
      // Incrementar progreso del scroll
      this.scrollProgress += this.scrollSpeed * (delta / 16);

      // Aplicar parallax a las capas
      this.applyParallax();

      // Mover líneas de adoquines para efecto de movimiento
      this.updateAdoquines(delta);

      // Verificar si llegamos al final
      if (this.scrollProgress >= this.totalScrollHeight) {
        this.scenePhase = 'arriving';
        this.onArrival();
      }
    }
  }

  applyParallax() {
    const progress = this.scrollProgress / this.totalScrollHeight;

    // Capa lejana: se mueve poco
    this.farBuildings.y = progress * 30;

    // Capa cercana: se mueve más
    this.nearBuildings.y = progress * 60;

    // Los transeúntes se mueven ligeramente hacia abajo (nos "adelantan")
    this.transeuntes.forEach((t, i) => {
      t.y += 0.05 * (i + 1);
    });
  }

  updateAdoquines(delta) {
    const { height } = this.scale;

    this.adoquines.forEach((line, i) => {
      line.y += 0.5;

      // Reciclar líneas que salen de pantalla
      if (line.y > height) {
        line.y = height * 0.68;
      }
    });
  }

  onArrival() {
    // Detener animación de caminar
    this.tweens.killTweensOf(this.familyContainer);

    // Detener animaciones de sprites y mostrar idle
    this.padre.stop();
    this.padre.setTexture('father_idle_north');
    this.madre.stop();
    this.madre.setTexture('mother_idle_north');
    this.marlo.stop();
    this.marlo.setTexture('marlo_idle_north');

    this.scenePhase = 'transition';

    // Fade out directo
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Scene_1_2');
    });
  }
}
