const enum Button {
  Down = 0,
  Right,
  Left,
  Up,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Restart,
  Pause,
  LeftJoyPressed,
  RightJoyPressed,
  UpJoyPad,
  DownJoyPad,
  LeftJoyPad,
  RightJoyPad,
}
class GamePad {
  static isConnected = false;
  static current: Gamepad | null = null;
  static previous: Gamepad | null = null;
  static GamePad = (() => {
    addEventListener("gamepadconnected", (event: GamepadEvent) => {
      GamePad.current = navigator.getGamepads()[0];
      GamePad.previous = GamePad.current;
      GamePad.isConnected = true;
    });
    addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      GamePad.isConnected = false;
    });
  })();
  static update(): void {
    if (GamePad.isConnected) {
      GamePad.previous = GamePad.current;
      GamePad.current = navigator.getGamepads()[0];
    }
  }
  static isDown(button: Button): boolean {
    return GamePad.isConnected && GamePad!.current!.buttons[button].pressed;
  }
  static isPressed(button: Button): boolean {
    return (
      GamePad.isConnected &&
      GamePad!.current!.buttons[button].pressed &&
      !GamePad!.previous!.buttons[button].pressed
    );
  }
  static value(button: Button): number {
    if (!GamePad.isConnected) return 0;
    else return GamePad!.current!.buttons[button].value;
  }
  static get angle(): number | null {
    if (GamePad.isConnected) {
      const x = GamePad.current!.axes[0];
      const y = GamePad.current!.axes[1];

      if (!(x > -0.15 && x < 0.15 && y > -0.15 && y < 0.15)) {
        const ang = Math.atan2(y, x);
        return ang;
      }
    }
    return null;
  }
}
class KeyState {
  isPressed: boolean;
  isReleased: boolean;
  constructor(isPressed: boolean, isReleased: boolean) {
    this.isPressed = isPressed;
    this.isReleased = isReleased;
  }
}
class Keyboard {
  static Keyboard = (() => {
    addEventListener("keydown", Keyboard.keyDown);
    addEventListener("keyup", Keyboard.keyUp);
  })();
  static state: any = {};
  static keyDown(event: KeyboardEvent) {
    const state = Keyboard.state[event.code];
    if (state === undefined)
      Keyboard.state[event.code] = new KeyState(true, true);
    else state.isPressed = true;
  }
  static keyUp(event: KeyboardEvent) {
    const state: KeyState = Keyboard.state[event.code];
    state.isPressed = false;
    state.isReleased = true;
  }
  static isDown(key: string): boolean {
    // returns true while the key is in the down position
    const state = Keyboard.state[key];
    if (state === undefined) return false;
    else return state.isPressed;
  }
  static isPressed(key: string): boolean {
    // returns true only once when first depressed
    // must be released and re-pressed before returning true again
    const state = Keyboard.state[key];
    if (state === undefined) return false;

    if (state.isPressed && state.isReleased) {
      state.isReleased = false;
      return true;
    } else return false;
  }
}
export class GameInput {
  static update(): void {
    GamePad.update();
  }
  static get isRotateRight(): boolean {
    return Keyboard.isDown("KeyX") || GamePad.isDown(Button.RightJoyPad);
  }
  static get isRotateLeft(): boolean {
    return Keyboard.isDown("KeyZ") || GamePad.isDown(Button.LeftJoyPad);
  }
  static get angle(): number {
    return 0;
  }
  static get isFire(): boolean {
    return Keyboard.isPressed("Enter") || GamePad.isPressed(Button.Right);
  }
  static get thrust(): number {
    if (Keyboard.isDown("ShiftRight")) return 1;
    else return GamePad.value(Button.RightTrigger);
  }
  static get isHyperSpace(): boolean {
    return Keyboard.isPressed("Space") || GamePad.isPressed(Button.Left);
  }
  static get isTogglePaused(): boolean {
    return Keyboard.isPressed("KeyP") || GamePad.isPressed(Button.Pause);
  }
}
