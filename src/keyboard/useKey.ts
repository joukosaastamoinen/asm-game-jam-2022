import { useContext, useState, useEffect } from "react";
import KeyboardContext from "./KeyboardContext";
import { Event } from "./types";

const useKey = (key: string, onKeyDown = () => {}, onKeyUp = () => {}) => {
  const keyboard = useContext(KeyboardContext);
  const [keyIsDown, setKeyIsDown] = useState(false);
  useEffect(() => {
    if (keyboard === null) {
      throw new Error("useKey can only be used inside KeyboardProvider");
    }

    const handleKeyUp = (event: Event) => {
      if (event.key === key) {
        event.preventDefault();
        setKeyIsDown(false);
        onKeyUp();
      }
    };
    const handleKeyDown = (event: Event) => {
      if (event.key === key) {
        event.preventDefault();
        setKeyIsDown(true);
        onKeyDown();
      }
    };
    keyboard.on("keyup", handleKeyUp);
    keyboard.on("keydown", handleKeyDown);
    return () => {
      keyboard.off("keyup", handleKeyUp);
      keyboard.off("keydown", handleKeyDown);
    };
  }, [key, onKeyDown, onKeyUp, keyboard]);
  return keyIsDown;
};

export default useKey;
