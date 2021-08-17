import { GameInput } from "./gameinput.js";
class Game {
    static Canvas = document.querySelector("canvas");
    static View = Game.Canvas.getContext("2d");
    static Game = (() => {
        addEventListener("resize", Game.resize);
    })();
    previousTimestamp = 0;
    static frameCounter = 0;
    static isPaused = false;
    static resize() {
        Game.Canvas.height = window.innerHeight - 5;
        Game.Canvas.width = window.innerWidth - 1;
    }
    static get height() {
        return Game.Canvas.height;
    }
    static get width() {
        return Game.Canvas.width;
    }
    update() { }
    draw() { }
    step(timestamp) {
        if (Game.isPaused) {
            // check for resume
            GameInput.update();
            if (GameInput.isTogglePaused)
                Game.isPaused = false;
        }
        else {
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
    start() {
        Game.Canvas.height = window.innerHeight - 5;
        Game.Canvas.width = window.innerWidth - 1;
        requestAnimationFrame(Game.animate);
    }
    static animate = (timestamp) => game.step(timestamp);
    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
var game = new Game();
game.start();
//# sourceMappingURL=thrust.js.map