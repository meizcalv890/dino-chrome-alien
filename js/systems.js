import { CONFIG } from "./config.js";

export function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export class Difficulty {
  constructor() {
    this.elapsed = 0;
    this.speed = CONFIG.DIFFICULTY.START_SPEED;
  }

  reset() {
    this.elapsed = 0;
    this.speed = CONFIG.DIFFICULTY.START_SPEED;
  }

  update(dt) {
    this.elapsed += dt;

    const increase = Math.floor(
      this.elapsed / CONFIG.DIFFICULTY.INCREASE_INTERVAL,
    );

    this.speed = Math.min(
      CONFIG.DIFFICULTY.START_SPEED +
        increase * CONFIG.DIFFICULTY.SPEED_INCREASE,
      CONFIG.DIFFICULTY.MAX_SPEED,
    );
  }
}

export class Score {
  constructor() {
    this.distance = 0;
    this.value = 0;
  }

  reset() {
    this.distance = 0;
    this.value = 0;
  }

  update(dt, speed) {
    this.distance += speed * dt;
    this.value = Math.floor(this.distance / 10);
  }
}
