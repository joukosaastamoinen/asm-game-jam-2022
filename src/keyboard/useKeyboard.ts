import { useContext } from "react";
import KeyboardContext from "./KeyboardContext";
import { Keyboard } from "./types";

const useKeyboard = (): Keyboard => {
  const keyboard = useContext(KeyboardContext);
  if (!keyboard) {
    throw new Error("useKeyboard can only be used inside KeyboardContext");
  }
  return keyboard;
};

export default useKeyboard;
