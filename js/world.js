import { CONFIG } from "./config.js";

export class World {
  constructor() {
    this.distance = 0;

    this.stars = Array.from({ length: 65 }, (_, i) => ({
      x: (i * 157 + 37) % CONFIG.WIDTH,
      y: (i * 61 + 13) % 225,
      size: i % 5 === 0 ? 2 : 1,
    }));

    this.hills = [
      { x: 0, width: 250, height: 55 },
      { x: 210, width: 300, height: 78 },
      { x: 490, width: 250, height: 48 },
      { x: 720, width: 330, height: 68 },
    ];
  }

  update(dt, speed) {
    this.distance += speed * dt;
  }

  draw(ctx) {
    this.drawSky(ctx);
    this.drawPlanet(ctx);
    this.drawHills(ctx);
    this.drawGround(ctx);
  }

  drawSky(ctx) {
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    for (const star of this.stars) {
      const twinkle = Math.sin(this.distance * 0.002 + star.x) > 0.7;

      ctx.fillStyle = twinkle ? "#d8f5d0" : "#789b7b";

      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // Distant tiny lights
    ctx.fillStyle = "#75d64b";
    ctx.fillRect(90, 155, 2, 2);
    ctx.fillRect(410, 105, 2, 2);
    ctx.fillRect(890, 175, 2, 2);
  }

  drawPlanet(ctx) {
    ctx.fillStyle = "#263c27";
    ctx.beginPath();
    ctx.arc(755, 105, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#355c35";
    ctx.fillRect(710, 77, 22, 5);
    ctx.fillRect(776, 124, 18, 5);
    ctx.fillRect(739, 153, 10, 4);

    ctx.fillStyle = "#75d64b";
    ctx.fillRect(720, 95, 5, 3);
    ctx.fillRect(789, 84, 7, 3);
  }

  drawHills(ctx) {
    const offset = (this.distance * 0.12) % 960;

    ctx.fillStyle = "#17271a";

    for (const hill of this.hills) {
      let x = hill.x - offset;

      while (x < CONFIG.WIDTH) {
        ctx.beginPath();
        ctx.moveTo(x, CONFIG.GROUND_Y);
        ctx.lineTo(x + hill.width * 0.45, CONFIG.GROUND_Y - hill.height);
        ctx.lineTo(x + hill.width, CONFIG.GROUND_Y);
        ctx.closePath();
        ctx.fill();

        x += 960;
      }
    }

    ctx.fillStyle = "#203622";
    ctx.fillRect(0, CONFIG.GROUND_Y - 3, CONFIG.WIDTH, 3);
  }

  drawGround(ctx) {
    const y = CONFIG.GROUND_Y;

    ctx.fillStyle = "#19251a";
    ctx.fillRect(0, y, CONFIG.WIDTH, CONFIG.HEIGHT - y);

    ctx.fillStyle = "#75d64b";
    ctx.fillRect(0, y, CONFIG.WIDTH, 2);

    const offset = this.distance % 48;

    ctx.fillStyle = "#3b573a";

    for (let x = -48; x < CONFIG.WIDTH + 48; x += 48) {
      const position = x - offset;

      ctx.fillRect(position, y + 17, 14, 2);
      ctx.fillRect(position + 22, y + 34, 5, 2);
    }

    // Bioluminescent ground details
    ctx.fillStyle = "#75d64b";
    for (let x = 50; x < CONFIG.WIDTH; x += 180) {
      const px = x - ((this.distance * 0.5) % 180);
      ctx.fillRect(px, y + 48, 3, 3);
    }
  }
}
