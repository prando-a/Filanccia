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

- **DeepSeek agent:** `.mcp.json` (project root) + key in `.claude/settings.local.json` under `env`. Tool: `mcp__deepseek__run_deepseek`. Skill: `/deepseek-narrative <target>`.
- **PixelLab MCP:** pixel art generation (characters, tiles, tilesets)
- **Reference impl:** `referencia/` (5 Días con Dio) — Y-sorting, Occluders, Dialogue

## Scene Map

| Scene | File | Status |
|-------|------|--------|
| 1-0 | `Scene_1_0.js` | ✅ logic — ✍️ dialogue update needed |
| 1-1 | `Scene_1_1.js` | ✅ logic — ✍️ dialogue update needed |
| 1-2 | `Scene_1_2.js` | ✅ logic — ✍️ dialogue update needed |
| 1-3 | `Scene_1_3.js` | ✅ logic — ✍️ dialogue update needed |
| 1-4 | `Scene_1_4.js` | ✅ logic — ✍️ dialogue update needed |
| Bodega | `Scene_Bodega.js` | ✅ logic — ✍️ dialogue update needed |
| Sotano | `Scene_Sotano.js` | ✅ logic — ✍️ dialogue update needed |
| Armeria | `Scene_Armeria.js` | 🔧 bugs + ✍️ Rafaello tree not yet implemented |
| 1-4 (return) | `Scene_1_4.js` | 📋 Designed — not coded |
| Armeria (return) | `Scene_Armeria.js` | 📋 Designed — not coded |

**✍️ = definitive dialogue in `docs/NARRATIVE_PROPOSAL.md` differs from current code.**

Dan Harmon steps 1-6 complete. Step 7 (Armeria) in progress. Steps 7-8 + epilogue fully designed.
All definitive scripts (enriched by DeepSeek 2026-03-14) in `docs/NARRATIVE_PROPOSAL.md` — read Section IV for implemented scenes, Section VI for pending ones.
