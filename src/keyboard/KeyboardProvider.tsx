import KeyboardContext from "./KeyboardContext";
import { Keyboard } from "./types";

type Props = {
  keyboard: Keyboard;
  children?: React.ReactNode;
};

const KeyboardProvider = ({ keyboard, children }: Props) => {
  return (
    <KeyboardContext.Provider value={keyboard}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardProvider;
