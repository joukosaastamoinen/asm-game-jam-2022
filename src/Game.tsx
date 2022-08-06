import { useReducer } from "react";
import reducer, { INITIAL_STATE } from "./reducer";
import Level from "./Level";
import { Stage } from "@saitonakamura/react-pixi";
import KeyboardProvider from "./keyboard/KeyboardProvider";
import useKeyboard from "./keyboard/useKeyboard";

type Props = {
  canvasWidth: number;
  canvasHeight: number;
};

const Game = ({ canvasWidth, canvasHeight }: Props) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const keyboard = useKeyboard();

  return (
    <Stage
      options={{ backgroundColor: 0xffcc99 }}
      width={canvasWidth}
      height={canvasHeight}
    >
      <KeyboardProvider keyboard={keyboard}>
        <Level
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          state={state}
          dispatch={dispatch}
        />
      </KeyboardProvider>
    </Stage>
  );
};

export default Game;
