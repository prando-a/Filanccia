# Diagnóstico: Marlo Desaparece al Cargar Partida en Scene_1_4

## Resumen del Problema

**Síntoma:** Cuando se carga una partida guardada en Scene_1_4 (escena del palacio tras el asesinato), Marlo aparece visualmente durante aproximadamente 1 segundo y luego desaparece. El jugador no puede ver ni controlar a Marlo.

**Contexto:**
- La partida se guarda cuando el jugador está en modo `freeExploration` (exploración libre del palacio)
- Al cargar, se ejecuta el flujo `fromSave` en el `create()` de Scene_1_4
- Logs previos mostraban: `visible: true`, `active: true` - pero Marlo no se veía

---

## Flujo de Código Cuando `fromSave = true`

### 1. `create()` se ejecuta:
```javascript
// Línea 165 - Marlo se crea en posición inicial (esquina derecha, con la familia)
this.marlo = this.add.sprite(width - 200, height * 0.75, 'marlo_idle_west')
  .setOrigin(0.5, 1)
  .setDepth(height * 0.75);  // depth ≈ 450
```

### 2. Se detecta `fromSave = true` (línea 268-269):
```javascript
const fromSave = this.loadData.fromSave === true && this.loadData.globalFlags?.freeExplorationUnlocked === true;
```

### 3. Se inicia fadeIn y callback (líneas 286-293):
```javascript
this.cameras.main.fadeIn(1000, 0, 0, 0);
this.cameras.main.once('camerafadeincomplete', () => {
  this.marlo.x = centerX;          // Reposiciona al centro
  this.marlo.y = height * 0.7;     // ≈ 420
  this.marlo.setDepth(900);        // Depth alto
  this.investigando = true;
  this.startFreeExploration();
});
```

### 4. Durante el fadeIn (1000ms), OTROS ELEMENTOS SE CREAN:

#### Multitud con tweens infinitos (líneas 125-133, 317-326):
```javascript
// 8 ciudadanos alrededor del cadáver con tweens de temblor
this.tweens.add({
  targets: ciudadano,
  x: x + Phaser.Math.Between(-2, 2),
  duration: 100,
  yoyo: true,
  repeat: -1  // ⚠️ INFINITO
});
```

#### Carabinieri (líneas 139-148):
```javascript
this.carabiniere1 = this.add.image(...).setAlpha(0);  // Alpha 0 inicial
this.carabiniere2 = this.add.image(...).setAlpha(0);
```

### 5. `update()` se ejecuta cada frame:
```javascript
// Línea 627-631 - Actualiza depth basado en Y
if (this.freeExploration) {
  this.marlo.setDepth(Math.max(this.marlo.y, 500));
} else {
  this.marlo.setDepth(this.marlo.y);
}
```

---

## Sospechas Principales (Ordenadas por Probabilidad)

### 1. ⚠️ `marloSpeed` NO ESTABA DEFINIDO (Corregido en esta sesión)

**El problema:** `marloSpeed` se define SOLO en `startGameplay()` (línea 531), pero el flujo `fromSave` NO pasa por `startGameplay()`.

```javascript
// startGameplay() - línea 531
this.marloSpeed = 150;
```

En el flujo fromSave, se llama directamente a `startFreeExploration()` sin definir `marloSpeed`.

**Impacto:** En `update()`, el cálculo de movimiento sería:
```javascript
const newX = this.marlo.x + vx * this.marloSpeed * delta;
// Si marloSpeed = undefined → newX = this.marlo.x + vx * undefined * delta = NaN
```

**Estado actual:** He añadido `this.marloSpeed = 150` en el callback fromSave.

---

### 2. ⚠️ Posible conflicto con TWEENS de la multitud

Los ciudadanos tienen tweens con `repeat: -1` (infinitos). Aunque los targets deberían ser los ciudadanos, es posible que:

- Algún bug de Phaser esté afectando otros sprites
- Algún tween esté mal configurado y afecte a Marlo por error

**Verificación:** Los logs añadidos ahora reportan todos los tweens activos en `startFreeExploration()`.

---

### 3. ⚠️ Problema de Z-Order / Depth

Aunque Marlo tiene depth=900 inicialmente, el `update()` lo actualiza cada frame a:
```javascript
Math.max(this.marlo.y, 500)  // ≈ 500 si y=420
```

**Elementos que podrían cubrir a Marlo:**
- `dialogueBox` y `thoughtBox`: depth = 1000
- `interactPrompt`: depth = 1001
- `freeExploreText`: depth = 1000

**PERO** estos son UI y no deberían cubrir el área de juego...

---

### 4. ⚠️ Posible problema con ALPHA

El sprite de Marlo podría estar recibiendo un alpha incorrecto desde:
- Un tween erróneo
- Una herencia de algún container
- Un efecto de cámara

**Verificación:** Los logs ahora monitorean el alpha cada 100ms.

---

### 5. ⚠️ Posible problema con la TEXTURA

Si `setTexture('marlo_idle_west')` o alguna animación falla, el sprite podría quedar sin textura visible.

En `update()`:
```javascript
this.marlo.setTexture(`marlo_idle_${this.marloDirection}`);
```

Si `marloDirection` no está definido o tiene un valor incorrecto, la textura no existiría.

---

### 6. ⚠️ Posible re-ejecución de código de secuencia

Variables de estado al cargar:
```javascript
this.currentStep = 0;
this.isAnimating = false;
this.waitingForInput = false;
this.gameplayMode = false;
this.investigando = false;  // Se pone true en el callback
this.freeExploration = false;  // Se pone true en startFreeExploration
```

Si algún evento o callback ejecuta `runSequence()` o `carabinieriIntervienen()` por error, estos podrían mover a Marlo o afectar su visibilidad.

---

## Elementos de la Escena y sus Depths

| Elemento | Depth | Notas |
|----------|-------|-------|
| floorLayer | 0 | Tilemap del suelo |
| cadaver | ~210 | height * 0.35 |
| ciudadanos (multitud) | ~250-350 | Basado en Y, con tweens |
| carabiniere1/2 | ~300 | height * 0.5, alpha=0 inicial |
| padre/madre | ~420 | height * 0.7 |
| Marlo inicial | ~450 | height * 0.75 |
| **Marlo tras carga** | **500-900** | Math.max(y, 500) o 900 |
| interventionText | 500 | Solo durante secuencia |
| dialogueBox | 1000 | UI |
| thoughtBox | 1000 | UI |
| freeExploreText | 1000 | UI |
| interactPrompt | 1001 | UI |

---

## Logs Añadidos para Diagnóstico

1. **Al crear Marlo** - Estado completo del sprite
2. **Al entrar en bloque fromSave** - Estado antes del fadeIn
3. **Al completar fadeIn** - Estado antes y después de reposicionar
4. **En `startFreeExploration()`** - Estado y lista de tweens activos
5. **En `update()` cada 60 frames** - Estado periódico
6. **Watcher cada 100ms por 5 segundos** - Monitoreo continuo solo cuando fromSave=true
7. **Detección de problemas** - Alerta si alpha<1 o visible=false

---

## Preguntas para Claude Opus

1. ¿Podría el cálculo de `newX`/`newY` con `marloSpeed = undefined` causar que Marlo se posicione en coordenadas NaN, haciéndolo invisible?

2. ¿Existe algún bug conocido en Phaser 3 donde tweens con `repeat: -1` puedan afectar sprites que no son sus targets?

3. ¿El método `setTexture()` podría fallar silenciosamente si se llama antes de que la textura esté completamente lista?

4. ¿Podría haber un race condition entre el callback de `camerafadeincomplete` y el loop de `update()`?

5. ¿El floorLayer del tilemap podría tener un depth inesperado que cubra sprites incluso con depth alto?

---

## Próximos Pasos Sugeridos

1. **Ejecutar el juego** y revisar los logs en la consola
2. **Buscar el patrón exacto** de cuándo Marlo cambia de estado
3. **Verificar si es un problema de posición** (NaN) o de visibilidad (alpha/visible)
4. **Probar desactivar los tweens de la multitud** temporalmente
5. **Añadir un debug visual** - rectángulo rojo en la posición donde debería estar Marlo

---

## Código Relevante Modificado

### Callback fromSave (ahora incluye):
- `marloSpeed = 150` (antes faltaba)
- `setVisible(true)` forzado
- `setAlpha(1)` forzado
- Logs extensivos
