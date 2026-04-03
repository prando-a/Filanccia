# Filanccia - Project Brain

## Session Protocol (READ THIS FIRST)

At the start of every session:

1. Read `docs/LOG.md` — last entry = current state and next task.
2. Read `docs/NARRATIVE_PROPOSAL.md` only if working on story/dialogue.
3. Read specific scene file only when asked to work on it.
4. **Do NOT read other files speculatively** — ask or check LOG first.

Delegation rule: tasks >200 lines → `mcp__deepseek__run_deepseek`. Write spec, delegate, review.

All code comments in **Spanish**. Placeholders before logic. Logic before art.

---

## Overview

- **Engine:** Phaser 3.55.2 (JS/ES6), 800x600, pixel art, top-down
- **Genre:** Mystery/Adventure
- **Setting:** Filanccia — Venetian baroque city, Carnival of Masks
- **Protagonist:** Marlo (12), innocent/empathetic
- **Antagonist:** Strappavolti ("Arranca-caras"), emotionless, tests Marlo via murders

## Architecture

- **Flow:** `index.html` → `Boot` → `Preload` → `Menu` → `GameScene` → Scenes
- **Managers:** `BaseManager` (abstract lifecycle) → Dialogue, Investigation, etc.
- **Input:** `SwipeControls` (touch/mouse) + Keyboard
- **Standards:** `snake_case` assets, `PascalCase` Scenes/Managers, comments in Spanish
- **Depth:** Consistent Y-sort
- **Dialogue:** `src/utils/TypewriterText.js` (char-by-char effect, SPACE to skip). Portrait system via `portraitMap` per scene — image on right side of box, no extra frame.

## Tools & Config

- **DeepSeek agent:** `.mcp.json` (project root) + key in `.claude/settings.local.json` under `env`. Tool: `mcp__deepseek__run_deepseek`. Skill: `/deepseek-narrative <target>`.
- **PixelLab MCP:** pixel art generation (characters, tiles, tilesets)
- **Reference impl:** `C:\Users\ismae\Desktop\Weguitos\5DiasConDio` (BeachScene for dialogue/typewriter pattern)

## Scene Map

| Scene | File | Status |
|-------|------|--------|
| 1-0 | `Scene_1_0.js` | ✅ complete (dialogue updated 2026-03-14) |
| 1-1 | `Scene_1_1.js` | ✅ complete (dialogue updated 2026-03-14) |
| 1-2 | `Scene_1_2.js` | ✅ complete (dialogue updated 2026-03-14) |
| 1-3 | `Scene_1_3.js` | ✅ complete (dialogue updated 2026-03-14) |
| 1-4 | `Scene_1_4.js` | ✅ complete (dialogue updated 2026-03-14) |
| Bodega | `Scene_Bodega.js` | ✅ complete (dialogue updated 2026-03-14) |
| Sotano | `Scene_Sotano.js` | ✅ complete (dialogue + trapos element updated 2026-03-14) |
| Armeria | `Scene_Armeria.js` | 🔧 Active — dialogue done, NPC sprites/paths/polish pending |
| 1-4 (return) | `Scene_1_4.js` | 📋 Designed — not coded |
| Armeria (return) | `Scene_Armeria.js` | 📋 Designed — not coded |

**Armeria pending:** guard sprite (replace red rect), Rafaello sprite (replace blue rect), guard waypoint tuning, patrol speed, detection radius, collision polish.

**Dialogue UX (2026-04-01):** Typewriter effect + overflow fixes applied to ALL scenes. Portrait system implemented in Scene_1_0 only (marlo_portrait, mother_portrait). Pending: roll out portraits to 1_4, Bodega, Sotano, Armeria scenes + create more portrait assets.

Dan Harmon steps 1-6 complete. Step 7 (Armeria) dialogue done, gameplay polish in progress. Steps 8 + epilogue fully designed.
All definitive scripts in `docs/NARRATIVE_PROPOSAL.md` — Section IV (implemented), Section VI (pending).
