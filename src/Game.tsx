import { useReducer } from "react";
import reducer, { INITIAL_STATE } from "./reducer";
import Level from "./Level";

type Props = {
  canvasWidth: number;
  canvasHeight: number;
};

const Game = ({ canvasWidth, canvasHeight }: Props) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <Level
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      state={state}
      dispatch={dispatch}
    />
  );
};

export default Game;
