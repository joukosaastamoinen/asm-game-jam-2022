import { Howl } from "howler";
import { useTick } from "@saitonakamura/react-pixi";
import { useEffect, useReducer } from "react";
import useSound from "use-sound";
import music from "./music1.mp3";
import gunSound from "./pew1.mp3";
import jumpSound from "./jump1.mp3";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import reducer, { INITIAL_STATE } from "./reducer";
import Water from "./Water";
import { ENEMY_SPAWN_INTERVAL, PLAYER_ID } from "./constants";
import { identityVector } from "./math";
import Bullet from "./Bullet";
import Enemy from "./Enemy";

const LEFT_KEYS = ["ArrowLeft", "KeyA"];

const RIGHT_KEYS = ["ArrowRight", "KeyD"];

const JUMP_KEYS = ["Space", "KeyW"];

const Game = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const sound = new Howl({
      src: [music],
      loop: true,
      volume: 0.5,
      autoplay: true,
    });
    return () => {
      sound.stop();
      sound.unload();
    };
  }, []);

  const [playGunSound] = useSound(gunSound, { volume: 0.5 });

  const [playJumpSound] = useSound(jumpSound, { volume: 0.5 });

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
      playJumpSound();
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
      const player = state.entities.find((entity) => entity.id === PLAYER_ID);
      if (!player) {
        return;
      }
      dispatch({
        type: "SHOOT",
        playerId: PLAYER_ID,
        direction: identityVector({
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

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "SPAWN_ENEMY" });
    }, 1000 * ENEMY_SPAWN_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Water />
      <Ground />
      {/* eslint-disable-next-line array-callback-return */}
      {state.entities.map((entity) => {
        switch (entity.type) {
          case "player": {
            return <Player key={entity.id} position={entity.position} />;
          }
          case "projectile": {
            return <Bullet key={entity.id} position={entity.position} />;
          }
          case "enemy": {
            return <Enemy key={entity.id} position={entity.position} />;
          }
        }
      })}
    </>
  );
};

export default Game;
