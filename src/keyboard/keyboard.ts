import { Event, EventType, Keyboard } from "./types";

const createKeyboard = (window: Window): Keyboard => {
  const listeners: {
    keyup: ((event: Event) => void)[];
    keydown: ((event: Event) => void)[];
  } = { keyup: [], keydown: [] };
  const defaultPrevented = new Set();
  let keysDown: string[] = [];

  const fireEvent = (eventName: EventType, data: Event) => {
    listeners[eventName].forEach((callback) => {
      callback(data);
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!keysDown.includes(event.code)) {
      keysDown = keysDown.concat(event.code);
      fireEvent("keydown", {
        type: "keydown",
        key: event.code,
        preventDefault: () => {
          defaultPrevented.add(event.code);
        },
      });
    }
    if (defaultPrevented.has(event.code)) {
      event.preventDefault();
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    keysDown = keysDown.filter((key) => key !== event.code);
    defaultPrevented.delete(event.code);
    fireEvent("keyup", {
      type: "keyup",
      key: event.code,
      preventDefault: event.preventDefault.bind(event),
    });
  };

  return {
    on: (eventName, callback) => {
      if (eventName === "keydown" && listeners.keydown.length === 0) {
        window.addEventListener("keydown", onKeyDown);
      } else if (eventName === "keyup" && listeners.keyup.length === 0) {
        window.addEventListener("keyup", onKeyUp);
      }

      listeners[eventName].push(callback);
    },
    off: (eventName, callback) => {
      if (eventName === "keydown" && listeners.keydown.length === 0) {
        window.removeEventListener("keydown", onKeyDown);
      } else if (eventName === "keyup" && listeners.keyup.length === 0) {
        window.removeEventListener("keyup", onKeyUp);
      }

      const index = listeners[eventName].indexOf(callback);
      listeners[eventName].splice(index, 1);
    },
    getKeysDown: () => keysDown,
  };
};

export default createKeyboard;
