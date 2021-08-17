class GamePad {
    static isConnected = false;
    static current = null;
    static previous = null;
    static GamePad = (() => {
        addEventListener("gamepadconnected", (event) => {
            GamePad.current = navigator.getGamepads()[0];
            GamePad.previous = GamePad.current;
            GamePad.isConnected = true;
        });
        addEventListener("gamepaddisconnected", (event) => {
            GamePad.isConnected = false;
        });
    })();
    static update() {
        if (GamePad.isConnected) {
            GamePad.previous = GamePad.current;
            GamePad.current = navigator.getGamepads()[0];
        }
    }
    static isDown(button) {
        return GamePad.isConnected && GamePad.current.buttons[button].pressed;
    }
    static isPressed(button) {
        return (GamePad.isConnected &&
            GamePad.current.buttons[button].pressed &&
            !GamePad.previous.buttons[button].pressed);
    }
    static value(button) {
        if (!GamePad.isConnected)
            return 0;
        else
            return GamePad.current.buttons[button].value;
    }
    static get angle() {
        if (GamePad.isConnected) {
            const x = GamePad.current.axes[0];
            const y = GamePad.current.axes[1];
            if (!(x > -0.15 && x < 0.15 && y > -0.15 && y < 0.15)) {
                const ang = Math.atan2(y, x);
                return ang;
            }
        }
        return null;
    }
}
class KeyState {
    isPressed;
    isReleased;
    constructor(isPressed, isReleased) {
        this.isPressed = isPressed;
        this.isReleased = isReleased;
    }
}
class Keyboard {
    static Keyboard = (() => {
        addEventListener("keydown", Keyboard.keyDown);
        addEventListener("keyup", Keyboard.keyUp);
    })();
    static state = {};
    static keyDown(event) {
        const state = Keyboard.state[event.code];
        if (state === undefined)
            Keyboard.state[event.code] = new KeyState(true, true);
        else
            state.isPressed = true;
    }
    static keyUp(event) {
        const state = Keyboard.state[event.code];
        state.isPressed = false;
        state.isReleased = true;
    }
    static isDown(key) {
        // returns true while the key is in the down position
        const state = Keyboard.state[key];
        if (state === undefined)
            return false;
        else
            return state.isPressed;
    }
    static isPressed(key) {
        // returns true only once when first depressed
        // must be released and re-pressed before returning true again
        const state = Keyboard.state[key];
        if (state === undefined)
            return false;
        if (state.isPressed && state.isReleased) {
            state.isReleased = false;
            return true;
        }
        else
            return false;
    }
}
export class GameInput {
    static update() {
        GamePad.update();
    }
    static get isRotateRight() {
        return Keyboard.isDown("KeyX") || GamePad.isDown(15 /* RightJoyPad */);
    }
    static get isRotateLeft() {
        return Keyboard.isDown("KeyZ") || GamePad.isDown(14 /* LeftJoyPad */);
    }
    static get angle() {
        return 0;
    }
    static get isFire() {
        return Keyboard.isPressed("Enter") || GamePad.isPressed(1 /* Right */);
    }
    static get thrust() {
        if (Keyboard.isDown("ShiftRight"))
            return 1;
        else
            return GamePad.value(7 /* RightTrigger */);
    }
    static get isHyperSpace() {
        return Keyboard.isPressed("Space") || GamePad.isPressed(2 /* Left */);
    }
    static get isTogglePaused() {
        return Keyboard.isPressed("KeyP") || GamePad.isPressed(9 /* Pause */);
    }
}
//# sourceMappingURL=gameinput.js.map