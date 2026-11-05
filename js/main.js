import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");

if (!canvas) {
  throw new Error("Game canvas not found.");
}

const game = new Game(canvas);

window.addEventListener("beforeunload", () => {
  game.destroy();
});
