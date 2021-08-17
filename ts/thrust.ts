import { GameInput } from "./gameinput.js";

class Game {
  static Canvas = document.querySelector("canvas") as HTMLCanvasElement;
  static View = Game.Canvas.getContext("2d") as CanvasRenderingContext2D;
  static Game = (() => {
    addEventListener("resize", Game.resize);
  })();
  previousTimestamp: DOMHighResTimeStamp = 0;
  static frameCounter = 0;
  static isPaused: boolean = false;
  static resize(): void {
    Game.Canvas.height = window.innerHeight - 5;
    Game.Canvas.width = window.innerWidth - 1;
  }
  static get height(): number {
    return Game.Canvas.height;
  }
  static get width(): number {
    return Game.Canvas.width;
  }
  update(): void {}
  draw(): void {}
  step(timestamp: DOMHighResTimeStamp): void {
    if (Game.isPaused) {
      // check for resume
      GameInput.update();
      if (GameInput.isTogglePaused) Game.isPaused = false;
    } else {
      const framesPerSecond = 25;
      const delay = 1000 / framesPerSecond;
      const elapsed = timestamp - this.previousTimestamp;
      if (elapsed >= delay) {
        Game.frameCounter += 1;
        this.previousTimestamp = timestamp;
        GameInput.update();

        this.update();
        this.draw();
      }
    }
    requestAnimationFrame(Game.animate);
  }
  start(): void {
    Game.Canvas.height = window.innerHeight - 5;
    Game.Canvas.width = window.innerWidth - 1;
    requestAnimationFrame(Game.animate);
  }
  static animate = (timestamp: DOMHighResTimeStamp) => game.step(timestamp);

  static rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
var game = new Game();
game.start();
