export class Input {
  constructor(game) {
    this.game = game;
    this.duckPointer = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    this.bindPointerControls();

    window.addEventListener("blur", () => {
      this.game.player.setDuck(false);

      if (this.game.state === "playing") {
        this.game.pause();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.game.state === "playing") {
        this.game.pause();
      }
    });
  }

  onKeyDown(event) {
    const code = event.code;

    if (["Space", "ArrowUp", "ArrowDown"].includes(code)) {
      event.preventDefault();
    }

    if (code === "Space" || code === "ArrowUp") {
      if (!event.repeat) {
        this.game.actionJump();
      }
    }

    if (code === "ArrowDown") {
      this.game.player.setDuck(true);
    }

    if ((code === "Escape" || code === "KeyP") && !event.repeat) {
      if (this.game.state === "playing") {
        this.game.pause();
      } else if (this.game.state === "paused") {
        this.game.resume();
      }
    }

    if (code === "Enter" && !event.repeat) {
      if (this.game.state === "menu" || this.game.state === "gameover") {
        this.game.start();
      }
    }

    if (code === "KeyM" && !event.repeat) {
      this.game.toggleSound();
    }
  }

  onKeyUp(event) {
    if (event.code === "ArrowDown") {
      this.game.player.setDuck(false);
    }
  }

  bindPointerControls() {
    const canvas = this.game.canvas;
    const jumpButton = document.getElementById("mobileJump");
    const duckButton = document.getElementById("mobileDuck");

    canvas.addEventListener("pointerdown", (event) => {
      if (this.game.state !== "playing") return;

      event.preventDefault();
      this.game.actionJump();
    });

    jumpButton.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.game.actionJump();
    });

    const startDuck = (event) => {
      event.preventDefault();
      this.duckPointer = event.pointerId;
      duckButton.setPointerCapture(event.pointerId);
      this.game.player.setDuck(true);
    };

    const stopDuck = (event) => {
      if (this.duckPointer !== null && event.pointerId !== this.duckPointer) {
        return;
      }

      this.duckPointer = null;
      this.game.player.setDuck(false);
    };

    duckButton.addEventListener("pointerdown", startDuck);
    duckButton.addEventListener("pointerup", stopDuck);
    duckButton.addEventListener("pointercancel", stopDuck);
    duckButton.addEventListener("lostpointercapture", stopDuck);
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
