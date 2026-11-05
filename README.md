
# Dino Chrome: Alien Edition

A custom pixel-art endless runner set on an unknown alien planet.

## Overview

Dino Chrome: Alien Edition is a browser-based endless runner.
Control an alien dinosaur, avoid dangerous obstacles, and survive
as long as possible.

## Features

- Automatic endless running gameplay
- Pixel-art alien dinosaur
- Running, jumping, ducking, and death states
- Four obstacle types:
  - Alien crystals
  - Rocks
  - Dangerous plants
  - Flying creatures
- Progressive difficulty
- Distance-based scoring
- Local best-score storage
- Main menu
- Pause and resume
- Game over screen
- Procedural alien environment
- Parallax background
- Generated sound effects and ambient music
- Keyboard, mouse, and touchscreen controls
- Responsive canvas
- No backend or account required

## Technology

- HTML5
- CSS3
- JavaScript ES Modules
- HTML Canvas
- Web Audio API
- LocalStorage

## Controls

| Input | Action |
|---|---|
| Space | Jump |
| Arrow Up | Jump |
| Arrow Down | Duck |
| Mouse click on canvas | Jump |
| Touch canvas | Jump |
| Hold DUCK button | Duck |
| P / Escape | Pause or resume |
| Enter | Start or retry |
| M | Toggle sound |

## Run Locally

Open the project folder in Visual Studio Code.

You can use the Live Server extension or run:

```bash
python -m http.server 8000
```

Open this address in your browser:

http://localhost:8000

## Storage

Best score and sound preferences are stored in browser LocalStorage.

## Project Structure

- `index.html`: Main HTML document
- `css/`: Interface and responsive styling
- `js/game.js`: Game orchestration
- `js/player.js`: Player movement and animation
- `js/obstacles.js`: Obstacles and spawning
- `js/world.js`: Alien environment
- `js/systems.js`: Collision, score, and difficulty
- `js/audio.js`: Audio generation
- `js/storage.js`: Local persistence

## Version

1.0.0

## License

Personal learning project. Add a license before distributing
or accepting external contributions.
