import { useTick } from "@saitonakamura/react-pixi";
import { useReducer } from "react";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import reducer, { INITIAL_STATE } from "./reducer";
import Water from "./Water";

const PLAYER_ID = "player";

const LEFT_KEYS = ["ArrowLeft", "KeyA"];

const RIGHT_KEYS = ["ArrowRight", "KeyD"];

const Game = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  useTick((delta) => {
    dispatch({ type: "TICK", timeDelta: delta });
  });
  useKeys([...LEFT_KEYS, ...RIGHT_KEYS], (_, keysDown) => {
    dispatch({
      type: "MOVE",
      playerId: PLAYER_ID,
      moveIntent:
        (RIGHT_KEYS.some((key) => keysDown.includes(key)) ? 1 : 0) -
        (LEFT_KEYS.some((key) => keysDown.includes(key)) ? 1 : 0),
    });
  });
  return (
    <>
      <Water />
      <Ground />
      {state.map((entity) => {
        switch (entity.type) {
          case "player": {
            return <Player key={entity.id} position={entity.position} />;
          }
          default: {
            throw new Error(`Unknown entity type ${entity.type}`);
          }
        }
      })}
    </>
  );
};

export default Game;
