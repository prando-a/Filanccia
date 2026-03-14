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
- **Depth:** Consistent Y-sort — see `referencia/` for pattern

## Tools & Config

- **DeepSeek agent:** `.claude/.mcp.json` + `DEEPSEEK_API_KEY` in `.env` (already set)
- **PixelLab MCP:** pixel art generation (characters, tiles, tilesets)
- **Reference impl:** `referencia/` (5 Días con Dio) — Y-sorting, Occluders, Dialogue

## Scene Map

| Scene | Location | Status |
|-------|----------|--------|
| 1-0 | Marlo's bathroom | ✅ |
| 1-1 | Street to plaza | ✅ |
| 1-2 | Central plaza (Mayor's speech) | ✅ |
| 1-3 | Palace Hall (Ballo Mascherato) | ✅ |
| 1-4 | Palace Hall — murder discovered, investigation begins | ✅ |
| Bodega | Wine cellar — explorable after murder | 🔧 Active |
| Sotano | Underground/basement — explorable after murder | 🔧 Active |
| Armeria | Armory — explorable after murder | 🔧 Active |

Dan Harmon steps 1-4 complete. Steps 5-8 in design — player explores Bodega/Sotano/Armeria after murder.
See `docs/NARRATIVE_PROPOSAL.md` for full scripts, characters, pending decisions. Edit it after decisions and chages made.
