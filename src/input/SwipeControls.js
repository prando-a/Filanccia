// src/input/SwipeControls.js
// Touch/Swipe input handler for mobile support

export default class SwipeControls {
  /**
   * @param {Phaser.Scene} scene
   * @param {{
   *   threshold?: number,
   *   maxTime?: number,
   *   on?: {
   *     left?: Function,
   *     right?: Function,
   *     up?: Function,
   *     down?: Function,
   *     tap?: Function,
   *     holdStart?: (dir: 'left'|'right'|'up'|'down') => void,
   *     holdEnd?: (dir: 'left'|'right'|'up'|'down') => void
   *   }
   * }} opts
   */
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.threshold = opts.threshold ?? 30;
    this.maxTime = opts.maxTime ?? 400;
    this.on = opts.on ?? {};

    this.startX = 0;
    this.startY = 0;
    this.startT = 0;
    this.moved = false;
    this.currentDirection = null;

    // Multi-touch support
    scene.input.addPointer(2);

    scene.input.on('pointerdown', (p) => {
      this.startX = p.downX;
      this.startY = p.downY;
      this.startT = p.downTime;
      this.moved = false;
    });

    scene.input.on('pointermove', (p) => {
      if (!p.isDown) return;

      const dx = p.position.x - this.startX;
      const dy = p.position.y - this.startY;

      if (!this.moved) {
        this.moved = (Math.abs(dx) > this.threshold || Math.abs(dy) > this.threshold);
      }

      if (!this.moved) return;

      // Determine dominant direction
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      let newDirection = null;

      if (ax > ay) {
        if (ax >= this.threshold) newDirection = dx > 0 ? 'right' : 'left';
      } else {
        if (ay >= this.threshold) newDirection = dy > 0 ? 'down' : 'up';
      }

      if (newDirection !== this.currentDirection) {
        // End previous hold
        if (this.currentDirection && this.on.holdEnd) {
          this.on.holdEnd(this.currentDirection);
        }
        this.currentDirection = newDirection;
        // Start new hold
        if (this.currentDirection && this.on.holdStart) {
          this.on.holdStart(this.currentDirection);
        }
      }
    });

    scene.input.on('pointerup', (p) => {
      // Close active hold
      if (this.currentDirection && this.on.holdEnd) {
        this.on.holdEnd(this.currentDirection);
      }
      const hadDirection = this.currentDirection;
      this.currentDirection = null;

      // Short swipes/tap
      const dt = p.upTime - this.startT;
      const dx = p.upX - this.startX;
      const dy = p.upY - this.startY;

      if (dt > this.maxTime) return;

      const ax = Math.abs(dx);
      const ay = Math.abs(dy);

      if (!this.moved) {
        this.on.tap?.();
        return;
      }

      if (hadDirection) return;

      if (ax > ay) {
        if (ax >= this.threshold) (dx > 0 ? this.on.right : this.on.left)?.();
      } else {
        if (ay >= this.threshold) (dy > 0 ? this.on.down : this.on.up)?.();
      }
    });
  }

  destroy() {
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointermove');
    this.scene.input.off('pointerup');
  }
}
