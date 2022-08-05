import { useContext, useEffect } from "react";
import KeyboardContext from "./KeyboardContext";
import { Event } from "./types";

const useKeys = (
  keys: string[],
  onEvent = (event: Event, keysDown: string[]) => {}
) => {
  const keyboard = useContext(KeyboardContext);
  useEffect(() => {
    if (keyboard === null) {
      throw new Error("useKeys can only be used inside KeyboardProvider");
    }

    const handleKeyUp = (event: Event) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        onEvent(
          event,
          keyboard.getKeysDown().filter((key) => keys.includes(key))
        );
      }
    };
    const handleKeyDown = (event: Event) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        onEvent(
          event,
          keyboard.getKeysDown().filter((key) => keys.includes(key))
        );
      }
    };
    keyboard.on("keyup", handleKeyUp);
    keyboard.on("keydown", handleKeyDown);
    return () => {
      keyboard.off("keyup", handleKeyUp);
      keyboard.off("keydown", handleKeyDown);
    };
  }, [keys, onEvent, keyboard]);
};

export default useKeys;
