import { createContext } from "react";
import { Keyboard } from "./types";

const KeyboardContext = createContext<Keyboard | null>(null);

export default KeyboardContext;
