# Journey to the Number One Ditch

A retro Zelda-style (GBA / Minish Cap) adventure starring Nate, built for the family.
Father Eggmas has escaped the thrift store and wants to turn the Number One Ditch
in Chesapeake, VA into the Number *Two* Ditch.

## Play

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8123
```

| Key | Action |
| --- | --- |
| Arrows / WASD | Move |
| Z / Space | Swing rock hammer, talk, confirm |
| X | Use the item set to X |
| Enter | Pause menu (equip items, save) |
| M | Mute |

Progress saves automatically when you go through a door, and from the pause menu (press X).

## Sharing

Turn on GitHub Pages for this repo (Settings → Pages → deploy from the `main` branch, root folder).
The game runs as plain static files with no build step.

## Project layout

| File | What's in it |
| --- | --- |
| `src/content.js` | Cast (sprite looks), items, music, maps and all dialogue/story scripts |
| `src/art.js` | Pixel art generator: characters, tiles, buildings, props, icons |
| `src/entities.js` | Nate, NPCs, enemies (the Sixes), pickups, chests, signs |
| `src/script.js` | Dialogue boxes, choices, cutscene commands |
| `src/world.js` | Tile maps, collision, rendering |
| `src/ui.js` | HUD and pause menu |
| `src/main.js` | Title, intro, game loop, saving |
| `src/core.js` / `src/font.js` | Input, sound, music and the pixel font |

To change how someone looks, edit their entry in `G.CAST` in `src/content.js`.
