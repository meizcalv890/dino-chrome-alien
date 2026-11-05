import { CONFIG } from "./config.js";
import { Storage } from "./storage.js";
import { AudioManager } from "./audio.js";
import { Player } from "./player.js";
import { ObstacleSpawner } from "./obstacles.js";
import { World } from "./world.js";
import { Difficulty, Score, intersects } from "./systems.js";
import { Input } from "./input.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.state = "menu";
    this.lastTime = 0;
    this.animationFrame = null;

    this.player = new Player();
    this.world = new World();
    this.spawner = new ObstacleSpawner();
    this.difficulty = new Difficulty();
    this.score = new Score();

    this.audio = new AudioManager(Storage.getSoundEnabled());
    this.soundEnabled = Storage.getSoundEnabled();

    this.bestScore = Storage.getBest();

    this.bindUI();
    this.updateSoundButton();
    this.updateBestDisplay();

    this.input = new Input(this);

    this.resize();

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    this.resizeObserver.observe(this.canvas);

    this.loop = this.loop.bind(this);
    this.animationFrame = requestAnimationFrame(this.loop);

    this.render();
    this.showState("menu");
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.round(CONFIG.WIDTH * dpr);
    this.canvas.height = Math.round(CONFIG.HEIGHT * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindUI() {
    document
      .getElementById("playButton")
      .addEventListener("click", () => this.start());

    document
      .getElementById("retryButton")
      .addEventListener("click", () => this.start());

    document
      .getElementById("resumeButton")
      .addEventListener("click", () => this.resume());

    document
      .getElementById("pauseMenuButton")
      .addEventListener("click", () => this.returnToMenu());

    document
      .getElementById("gameOverMenuButton")
      .addEventListener("click", () => this.returnToMenu());

    document
      .getElementById("soundButton")
      .addEventListener("click", () => this.toggleSound());
  }

  showState(state) {
    this.state = state;

    const menu = document.getElementById("menuOverlay");
    const pause = document.getElementById("pauseOverlay");
    const gameOver = document.getElementById("gameOverOverlay");
    const hud = document.getElementById("hud");
    const status = document.getElementById("statusText");
    const message = document.getElementById("runMessage");

    menu.classList.toggle("hidden", state !== "menu");
    pause.classList.toggle("hidden", state !== "paused");
    gameOver.classList.toggle("hidden", state !== "gameover");

    hud.classList.toggle("hidden", state === "menu");

    const labels = {
      menu: ["SYSTEM STANDBY", "READY FOR DEPLOYMENT"],
      playing: ["EXPEDITION ACTIVE", "SURVIVE THE PLANET"],
      paused: ["EXPEDITION PAUSED", "SIGNAL TEMPORARILY HALTED"],
      gameover: ["SIGNAL LOST", "EXPEDITION TERMINATED"],
    };

    status.textContent = labels[state][0];
    message.textContent = labels[state][1];
  }

  async start() {
    await this.audio.initialize();

    this.player.reset();
    this.world = new World();
    this.spawner.reset();
    this.difficulty.reset();
    this.score.reset();

    this.showState("playing");

    this.audio.startMusic();

    this.updateScoreDisplay();
    this.render();
  }

  pause() {
    if (this.state !== "playing") return;

    this.player.setDuck(false);
    this.audio.stopMusic();
    this.showState("paused");
  }

  async resume() {
    if (this.state !== "paused") return;

    await this.audio.initialize();
    this.audio.startMusic();
    this.showState("playing");
  }

  returnToMenu() {
    this.audio.stopMusic();
    this.player.reset();
    this.spawner.reset();
    this.score.reset();

    this.showState("menu");
    this.updateScoreDisplay();
    this.render();
  }

  actionJump() {
    if (this.state !== "playing") return;

    if (this.player.jump()) {
      this.audio.jump();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;

    Storage.setSoundEnabled(this.soundEnabled);
    this.audio.setEnabled(this.soundEnabled);

    this.updateSoundButton();

    if (this.soundEnabled && this.state === "playing") {
      this.audio.startMusic();
    } else {
      this.audio.stopMusic();
    }
  }

  updateSoundButton() {
    const button = document.getElementById("soundButton");

    button.textContent = this.soundEnabled ? "♫" : "♪";
    button.setAttribute(
      "aria-label",
      this.soundEnabled ? "Mute sound" : "Enable sound",
    );
  }

  updateBestDisplay() {
    document.getElementById("bestValue").textContent = String(
      this.bestScore,
    ).padStart(5, "0");
  }

  updateScoreDisplay() {
    document.getElementById("scoreValue").textContent = String(
      this.score.value,
    ).padStart(5, "0");
  }

  update(dt) {
    if (this.state !== "playing") return;

    this.difficulty.update(dt);

    this.player.update(dt);
    this.world.update(dt, this.difficulty.speed);

    this.spawner.update(dt, this.difficulty.speed, this.difficulty.elapsed);

    this.score.update(dt, this.difficulty.speed);

    this.updateScoreDisplay();

    this.checkCollisions();

    if (this.score.value > this.bestScore) {
      this.bestScore = Storage.saveBest(this.score.value);
      this.updateBestDisplay();
    }
  }

  checkCollisions() {
    const playerBox = this.player.getHitbox();

    for (const obstacle of this.spawner.obstacles) {
      if (intersects(playerBox, obstacle.getHitbox())) {
        this.endGame();
        return;
      }
    }
  }

  endGame() {
    if (this.state !== "playing") return;

    this.player.die();
    this.audio.stopMusic();
    this.audio.collision();

    this.bestScore = Storage.saveBest(this.score.value);

    document.getElementById("finalScore").textContent = String(
      this.score.value,
    ).padStart(5, "0");

    document.getElementById("finalBest").textContent = String(
      this.bestScore,
    ).padStart(5, "0");

    this.updateBestDisplay();
    this.showState("gameover");
  }

  loop(timestamp) {
    if (!this.lastTime) {
      this.lastTime = timestamp;
    }

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.animationFrame = requestAnimationFrame(this.loop);
  }

  render() {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    this.world.draw(ctx);
    this.spawner.draw(ctx);
    this.player.draw(ctx);

    if (this.state === "menu") {
      this.drawMenuDecoration(ctx);
    }
  }

  drawMenuDecoration(ctx) {
    ctx.fillStyle = "#75d64b";
    ctx.globalAlpha = 0.45;

    ctx.fillRect(75, 250, 3, 3);
    ctx.fillRect(835, 220, 3, 3);
    ctx.fillRect(870, 250, 2, 2);

    ctx.globalAlpha = 1;
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);

    this.audio.destroy();
    this.input.destroy();
    this.resizeObserver.disconnect();
  }
}
