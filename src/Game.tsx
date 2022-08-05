import { useTick } from "@saitonakamura/react-pixi";
import { useEffect, useReducer } from "react";
import useSound from "use-sound";
import gunSound from "./pew1.mp3";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import reducer, { INITIAL_STATE } from "./reducer";
import Water from "./Water";

const PLAYER_ID = "player";

const LEFT_KEYS = ["ArrowLeft", "KeyA"];

const RIGHT_KEYS = ["ArrowRight", "KeyD"];

const JUMP_KEYS = ["Space", "KeyW"];

const Game = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [playGunSound] = useSound(gunSound);

  useTick(() => {
    dispatch({ type: "TICK" });
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

  useKeys(JUMP_KEYS, (event) => {
    if (event.type === "keydown") {
      dispatch({
        type: "JUMP",
        playerId: PLAYER_ID,
      });
    }
  });

  useEffect(() => {
    const handleClick = () => {
      playGunSound();
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
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
