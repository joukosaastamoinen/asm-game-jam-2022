import { useTick } from "@saitonakamura/react-pixi";
import { useEffect, useReducer } from "react";
import useSound from "use-sound";
import gunSound from "./pew1.mp3";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import reducer, { INITIAL_STATE } from "./reducer";
import Water from "./Water";
import { PLAYER_ID } from "./constants";
import { vectorAbs } from "./math";
import Bullet from "./Bullet";

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
    const handleClick = (event: MouseEvent) => {
      playGunSound();
      const clickCoordinates = {
        x: event.clientX - window.innerWidth / 2,
        y: -(event.clientY - window.innerHeight / 2 - 200),
      };
      const player = state.find((entity) => entity.id === PLAYER_ID);
      if (!player) {
        throw new Error("No player!");
      }
      dispatch({
        type: "SHOOT",
        playerId: PLAYER_ID,
        direction: vectorAbs({
          x: clickCoordinates.x - player.position.x,
          y: clickCoordinates.y - player.position.y,
        }),
      });
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
      {/* eslint-disable-next-line array-callback-return */}
      {state.map((entity) => {
        switch (entity.type) {
          case "player": {
            return <Player key={entity.id} position={entity.position} />;
          }
          case "bullet": {
            return <Bullet key={entity.id} position={entity.position} />;
          }
        }
      })}
    </>
  );
};

export default Game;
