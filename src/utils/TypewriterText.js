/**
 * Efecto typewriter para texto de diálogo.
 * Muestra el texto carácter a carácter con opción de saltar con ESPACIO/click.
 */
export default class TypewriterText {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text} textObject - Objeto de texto de Phaser (se vaciará)
   * @param {string} fullText - Texto completo a mostrar
   * @param {object} [options]
   * @param {number} [options.charDelay=30] - ms entre caracteres
   * @param {function} [options.onComplete] - Callback al terminar de escribir
   */
  constructor(scene, textObject, fullText, options = {}) {
    this.scene = scene;
    this.textObject = textObject;
    this.fullText = fullText;
    this.charDelay = options.charDelay || 30;
    this.onComplete = options.onComplete || null;
    this.isTyping = true;
    this._completed = false;
    this._timer = null;

    this.textObject.setText('');
    this._typeNextChar();
  }

  _typeNextChar() {
    if (this._completed) return;
    const len = this.textObject.text.length;
    if (len < this.fullText.length) {
      this.textObject.setText(this.fullText.substring(0, len + 1));
      this._timer = this.scene.time.delayedCall(this.charDelay, () => this._typeNextChar());
    } else {
      this._finish();
    }
  }

  /**
   * Salta al texto completo. Retorna true si había texto pendiente.
   */
  skip() {
    if (this._completed) return false;
    if (this._timer) this._timer.destroy();
    this.textObject.setText(this.fullText);
    this._finish();
    return true;
  }

  _finish() {
    if (this._completed) return;
    this._completed = true;
    this.isTyping = false;
    if (this.onComplete) this.onComplete();
  }

  destroy() {
    this._completed = true;
    this.isTyping = false;
    if (this._timer) this._timer.destroy();
  }
}
