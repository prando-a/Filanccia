# Filanccia - Project Context

## Overview

- **Engine:** Phaser 3.55.2 (JS/ES6)
- **Genre:** Mystery/Adventure (Top-down)
- **Setting:** Venetian baroque city (Filanccia) during a mask carnival.
- **Protagonist:** Marlo (12), innocent/empathetic.
- **Antagonist:** Strappavolti, emotionless entity testing Marlo via murders.
- **Status:** Base infrastructure complete. Development on Scene 1-4 (Murder scene investigation).

## Architecture

- **Structure:** `index.html` (responsive) -> `Boot` -> `Preload` -> `Menu` -> `GameScene`.
- **Managers:** `BaseManager` (Dialogue, Investigation, etc).
- **Input:** `SwipeControls` (touch/mouse) + standard Keyboard.
- **Assets:** `assets/` (characters, tiles, audio).
- **Standards:** `snake_case` for assets/keys, `PascalCase` for Scenes/Managers.

## Active Debugging: Marlo Disappearing in Scene 1-4

- **Issue:** Marlo disappears 1s after loading a save in the Palace Hall.
- **Status:** Investigating `marloSpeed` (now forced to 150), Z-order conflicts (depth), and potential Tween/State machine races.
- **Logs:** Active in `fromSave` flow to monitor alpha/visible/position/tweens.

## Guidelines

- **Reference:** Use `referencia/` (5 Días con Dio) for Y-sorting, Occluders, and Dialogue patterns.
- **Workflow:** Implement via placeholders first; logic before art.
- **Coding:** Always comment in Spanish. Maintain consistent depth layering.
