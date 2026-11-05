import { CONFIG } from "./config.js";

const RUN_FRAMES = [
  [
    "....GGGG....",
    "...GLLLLG...",
    "..GLLGLLLG..",
    "..GLLLLLLG..",
    "...GGGGGG...",
    "....GGGG....",
    "...G....G...",
    "..GG....GG..",
    ".GG......GG.",
  ],
  [
    "....GGGG....",
    "...GLLLLG...",
    "..GLLGLLLG..",
    "..GLLLLLLG..",
    "...GGGGGG...",
    "....GGGG....",
    "..GG......G.",
    "......GGGG..",
    ".....GG.....",
  ],
];

const DUCK_FRAME = [
  "............",
  "............",
  "..GGGGGGG...",
  ".GLLLLLLLGG.",
  "GLLGLLGLLLGG",
  "GLLLLLLLLLLG",
  ".GGGGGGGGGG.",
];

const DEAD_FRAME = [
  "....GGGG....",
  "...GLLLLG...",
  "..GLLGLLLG..",
  "..GLLLLLLG..",
  "...GGGGGG...",
  "....GGGG....",
  "...G....G...",
  "..GG....GG..",
];

export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = CONFIG.PLAYER.X;
    this.width = CONFIG.PLAYER.WIDTH;
    this.height = CONFIG.PLAYER.HEIGHT;
    this.y = CONFIG.GROUND_Y - this.height;

    this.velocityY = 0;
    this.grounded = true;
    this.ducking = false;
    this.dead = false;

    this.animationTimer = 0;
    this.frame = 0;
    this.deathRotation = 0;
  }

  jump() {
    if (!this.grounded || this.dead) return false;

    this.grounded = false;
    this.ducking = false;
    this.velocityY = CONFIG.PLAYER.JUMP_FORCE;

    return true;
  }

  setDuck(active) {
    if (this.dead) return;

    this.ducking = Boolean(active);
  }

  update(dt) {
    if (this.dead) return;

    if (!this.grounded) {
      const multiplier = this.ducking ? CONFIG.PLAYER.DUCK_FALL_MULTIPLIER : 1;

      this.velocityY += CONFIG.PLAYER.GRAVITY * multiplier * dt;
      this.y += this.velocityY * dt;

      const floor = CONFIG.GROUND_Y - this.height;

      if (this.y >= floor) {
        this.y = floor;
        this.velocityY = 0;
        this.grounded = true;
      }
    }

    this.animationTimer += dt;

    if (this.animationTimer >= 0.11) {
      this.frame = (this.frame + 1) % 2;
      this.animationTimer = 0;
    }
  }

  getHitbox() {
    const duckingOnGround = this.ducking && this.grounded;
    const boxHeight = duckingOnGround ? CONFIG.PLAYER.DUCK_HEIGHT : this.height;

    return {
      x: this.x + 8,
      y: this.y + this.height - boxHeight + 5,
      width: this.width - 14,
      height: boxHeight - 9,
    };
  }

  die() {
    this.dead = true;
    this.ducking = false;
  }

  draw(ctx) {
    const pixel = 4;
    let sprite;

    if (this.dead) {
      sprite = DEAD_FRAME;
    } else if (this.ducking && this.grounded) {
      sprite = DUCK_FRAME;
    } else {
      sprite = RUN_FRAMES[this.frame];
    }

    const rows = sprite.length;
    const cols = sprite[0].length;
    const spriteWidth = cols * pixel;
    const spriteHeight = rows * pixel;

    const drawX = Math.round(this.x + (this.width - spriteWidth) / 2);

    const drawY = Math.round(this.y + this.height - spriteHeight);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = sprite[row][col];

        if (value === ".") continue;

        ctx.fillStyle =
          value === "G" ? CONFIG.COLORS.green : CONFIG.COLORS.lime;

        ctx.fillRect(drawX + col * pixel, drawY + row * pixel, pixel, pixel);
      }
    }

    // Eye
    ctx.fillStyle = this.dead ? "#080d09" : "#080d09";
    ctx.fillRect(drawX + 8 * pixel, drawY + 2 * pixel, pixel, pixel);

    // Small alien glow
    if (!this.dead) {
      ctx.fillStyle = "#c5ff76";
      ctx.fillRect(drawX + 4 * pixel, drawY + 1 * pixel, pixel, pixel);
    }
  }
}
