// src/managers/SaveManager.js
// Sistema centralizado de guardado/carga de partida

export default class SaveManager {
  static SAVE_KEY = 'filanccia_save';
  static SAVE_VERSION = 1;
  static SAVEABLE_SCENES = ['Scene_1_4', 'Scene_Bodega', 'Scene_Sotano'];

  /**
   * Verifica si existe una partida guardada
   * @returns {boolean}
   */
  static hasSave() {
    const save = localStorage.getItem(this.SAVE_KEY);
    return save !== null;
  }

  /**
   * Obtiene los datos de la partida guardada
   * @returns {object|null}
   */
  static getSave() {
    const save = localStorage.getItem(this.SAVE_KEY);
    if (!save) return null;

    try {
      return JSON.parse(save);
    } catch (e) {
      console.error('Error parsing save data:', e);
      return null;
    }
  }

  /**
   * Borra la partida guardada (para nueva partida)
   */
  static deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }

  /**
   * Verifica si se puede guardar en la escena actual
   * @param {Phaser.Scene} scene - La escena actual
   * @returns {boolean}
   */
  static canSaveInScene(scene) {
    const sceneKey = scene.scene.key;

    // Verificar si es una escena guardable
    if (!this.SAVEABLE_SCENES.includes(sceneKey)) {
      return false;
    }

    // Para Scene_1_4, solo se puede guardar si freeExploration está activo
    if (sceneKey === 'Scene_1_4') {
      return scene.freeExploration === true;
    }

    return true;
  }

  /**
   * Guarda la partida actual
   * @param {Phaser.Scene} scene - La escena actual
   * @returns {boolean} - true si se guardó correctamente
   */
  static save(scene) {
    if (!this.canSaveInScene(scene)) {
      console.warn('Cannot save in this scene');
      return false;
    }

    // Obtener datos específicos de la escena si el método existe
    let sceneData = {};
    if (typeof scene.getSaveData === 'function') {
      sceneData = scene.getSaveData();
    }

    // Construir globalFlags desde el estado actual
    const globalFlags = this.buildGlobalFlags(scene, sceneData);

    // Obtener volumen actual
    const savedVolume = parseFloat(localStorage.getItem('filanccia_volume') || '0.25');

    const saveData = {
      version: this.SAVE_VERSION,
      currentScene: scene.scene.key,
      globalFlags: globalFlags,
      timestamp: Date.now(),
      volume: savedVolume
    };

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved:', saveData);
      return true;
    } catch (e) {
      console.error('Error saving game:', e);
      return false;
    }
  }

  /**
   * Construye los globalFlags desde el estado actual del juego
   * @param {Phaser.Scene} scene - La escena actual
   * @param {object} sceneData - Datos específicos de la escena
   * @returns {object}
   */
  static buildGlobalFlags(scene, sceneData) {
    const sceneKey = scene.scene.key;

    // Cargar flags existentes si hay un save previo
    const existingSave = this.getSave();
    const existingFlags = existingSave?.globalFlags || {};

    const flags = {
      ...existingFlags,  // Mantener flags previos
      freeExplorationUnlocked: false,
      notaRecogida: false
    };

    // Actualizar según la escena actual
    if (sceneKey === 'Scene_1_4') {
      flags.freeExplorationUnlocked = scene.freeExploration === true;
    } else if (sceneKey === 'Scene_Bodega') {
      flags.freeExplorationUnlocked = true;  // Si está en bodega, ya desbloqueó exploración
      flags.notaRecogida = sceneData.notaRecogida || false;
    } else if (sceneKey === 'Scene_Sotano') {
      flags.freeExplorationUnlocked = true;  // Si está en sótano, ya desbloqueó exploración
      // Mantener notaRecogida del save existente
      flags.notaRecogida = existingFlags.notaRecogida || false;
    }

    return flags;
  }

  /**
   * Carga la partida guardada
   * @returns {object|null} - Datos para iniciar la escena guardada
   */
  static load() {
    const save = this.getSave();
    if (!save) return null;

    return {
      currentScene: save.currentScene,
      globalFlags: save.globalFlags,
      volume: save.volume,
      fromSave: true
    };
  }
}
