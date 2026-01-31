// src/managers/BaseManager.js
// Base class for game managers (minigames, dialogue systems, etc.)
// Pattern: Scene-Injected Manager

export default class BaseManager {
  /**
   * @param {Phaser.Scene} scene - Reference to the parent scene
   */
  constructor(scene) {
    this.scene = scene;

    // State
    this.active = false;

    // UI elements tracking (for cleanup)
    this.elements = [];
  }

  /**
   * Start the manager
   * Override in subclass
   */
  start() {
    this.active = true;
    this.elements = [];
  }

  /**
   * Update loop - call from scene's update()
   * Override in subclass
   */
  update() {
    if (!this.active) return;
    // Implement in subclass
  }

  /**
   * Clean up all elements
   */
  cleanup() {
    this.elements.forEach(el => {
      if (el && el.destroy) {
        el.destroy();
      }
    });
    this.elements = [];
  }

  /**
   * End the manager and return to normal gameplay
   * Override in subclass for custom behavior
   */
  end() {
    this.cleanup();
    this.active = false;
  }

  /**
   * Add element to tracking list
   * @param {Phaser.GameObjects.GameObject} element
   */
  addElement(element) {
    this.elements.push(element);
    return element;
  }

  /**
   * Show floating feedback text
   */
  showFeedback(x, y, text, color = '#ffffff') {
    const feedback = this.scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(20000);

    this.scene.tweens.add({
      targets: feedback,
      y: y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => feedback.destroy()
    });

    return feedback;
  }
}
