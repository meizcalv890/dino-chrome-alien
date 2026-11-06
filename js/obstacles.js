import { CONFIG } from "./config.js";

export class Obstacle {
  constructor(type, x, groundY) {
    this.type = type;
    this.x = x;
    this.groundY = groundY;
    this.animation = Math.random() * 10;

    if (type === "crystal") {
      this.width = 32;
      this.height = 54;
    } else if (type === "rock") {
      this.width = 48;
      this.height = 32;
    } else if (type === "plant") {
      this.width = 42;
      this.height = 48;
    } else {
      this.width = 46;
      this.height = 30;
    }

    this.y =
      type === "flyer"
        ? groundY - 50 - Math.random() * 20
        : groundY - this.height;
  }

  update(dt, speed) {
    this.x -= speed * dt;
    this.animation += dt * 7;
  }

  getHitbox() {
    const inset = this.type === "flyer" ? 7 : 5;

    return {
      x: this.x + inset,
      y: this.y + inset,
      width: this.width - inset * 2,
      height: this.height - inset * 2,
    };
  }

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);

    if (this.type === "crystal") {
      this.drawCrystal(ctx, x, y);
    } else if (this.type === "rock") {
      this.drawRock(ctx, x, y);
    } else if (this.type === "plant") {
      this.drawPlant(ctx, x, y);
    } else {
      this.drawFlyer(ctx, x, y);
    }
  }

  drawCrystal(ctx, x, y) {
    ctx.fillStyle = "#3b7e45";
    ctx.beginPath();
    ctx.moveTo(x + 16, y);
    ctx.lineTo(x + 31, y + 19);
    ctx.lineTo(x + 23, y + 54);
    ctx.lineTo(x + 8, y + 54);
    ctx.lineTo(x, y + 19);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = CONFIG.COLORS.lime;
    ctx.beginPath();
    ctx.moveTo(x + 16, y + 5);
    ctx.lineTo(x + 22, y + 20);
    ctx.lineTo(x + 16, y + 43);
    ctx.lineTo(x + 9, y + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d8f5d0";
    ctx.fillRect(x + 13, y + 12, 4, 10);
  }

  drawRock(ctx, x, y) {
    ctx.fillStyle = "#526653";
    ctx.fillRect(x + 5, y + 13, 38, 19);
    ctx.fillRect(x + 11, y + 5, 25, 10);
    ctx.fillRect(x, y + 20, 10, 12);

    ctx.fillStyle = "#91a68e";
    ctx.fillRect(x + 15, y + 8, 10, 3);
    ctx.fillRect(x + 7, y + 17, 7, 3);
  }

  drawPlant(ctx, x, y) {
    ctx.fillStyle = "#355c35";
    ctx.fillRect(x + 17, y + 22, 8, 26);

    ctx.fillStyle = "#75d64b";
    ctx.fillRect(x + 2, y + 13, 18, 8);
    ctx.fillRect(x + 5, y + 5, 8, 14);
    ctx.fillRect(x + 22, y + 15, 18, 8);
    ctx.fillRect(x + 29, y + 7, 8, 14);

    ctx.fillStyle = "#c5ff76";
    ctx.fillRect(x + 8, y + 8, 4, 5);
    ctx.fillRect(x + 31, y + 10, 4, 5);
  }

  drawFlyer(ctx, x, y) {
    const wing = Math.sin(this.animation) * 5;

    ctx.fillStyle = "#75d64b";
    ctx.fillRect(x + 11, y + 10, 26, 13);
    ctx.fillRect(x + 5, y + 13, 10, 8);
    ctx.fillRect(x + 33, y + 13, 8, 8);

    ctx.fillStyle = "#a4d9b5";
    ctx.fillRect(x + 16, y + 5 + wing, 9, 8);
    ctx.fillRect(x + 25, y + 5 - wing, 9, 8);

    ctx.fillStyle = "#c5ff76";
    ctx.fillRect(x + 29, y + 12, 4, 4);
  }
}

export class ObstacleSpawner {
  constructor() {
    this.obstacles = [];
    this.nextSpawn = 420;
  }

  reset() {
    this.obstacles = [];
    this.nextSpawn = 420;
  }

  update(dt, speed, elapsed) {
    this.nextSpawn -= speed * dt;

    if (this.nextSpawn <= 0) {
      const type = this.chooseType(elapsed);

      this.obstacles.push(
        new Obstacle(type, CONFIG.WIDTH + 30, CONFIG.GROUND_Y),
      );

      const minGap = Math.max(CONFIG.OBSTACLES.MIN_GAP, speed * 0.88);

      const maxGap = Math.max(CONFIG.OBSTACLES.MAX_GAP, speed * 1.18);

      this.nextSpawn = minGap + Math.random() * (maxGap - minGap);
    }

    for (const obstacle of this.obstacles) {
      obstacle.update(dt, speed);
    }

    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > -20,
    );
  }

  chooseType(elapsed) {
    const roll = Math.random();

    if (elapsed > 8 && roll > 0.72) {
      return "flyer";
    }

    if (roll > 0.55) return "plant";
    if (roll > 0.3) return "rock";

    return "crystal";
  }

  draw(ctx) {
    for (const obstacle of this.obstacles) {
      obstacle.draw(ctx);
    }
  }
}
