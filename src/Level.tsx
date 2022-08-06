import { Howl } from "howler";
import { Container, Sprite, useTick } from "@saitonakamura/react-pixi";
import { useEffect } from "react";
import useSound from "use-sound";
import music from "./music2.mp3";
import gunSound from "./pew1.mp3";
import jumpSound from "./jump1.mp3";
import sky from "./sky.png";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import { Action, entityById, Player as PlayerT, State } from "./reducer";
import water from "./water.png";
import {
  ENEMY_INITIAL_HEALTH,
  ENEMY_SPAWN_INTERVAL,
  PLAYER_ID,
  WATER_LEVEL,
} from "./constants";
import { identityVector } from "./math";
import Projectile from "./Projectile";
import Enemy from "./Enemy";
import HealthMeter from "./HealthMeter";
import Wreck from "./Wreck";

type Props = {
  canvasWidth: number;
  canvasHeight: number;
  state: State;
  dispatch: React.Dispatch<Action>;
};

const LEFT_KEYS = ["ArrowLeft", "KeyA"];

const RIGHT_KEYS = ["ArrowRight", "KeyD"];

const JUMP_KEYS = ["Space", "KeyW"];

// Hack around incorrect types in react-pixi
const C = Container as any;

const Level = ({ canvasWidth, canvasHeight, state, dispatch }: Props) => {
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
  }, [dispatch]);

  const player = entityById(PLAYER_ID, state.entities) as PlayerT | undefined;

  return (
    <>
      <Sprite
        image={sky}
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
      />
      <HealthMeter
        x={canvasWidth / 2 - 100}
        y={20}
        width={200}
        height={6}
        health={player ? (player as PlayerT).health : 0}
      />
      <C position={[canvasWidth / 2, canvasHeight / 2 + 200]}>
        <Sprite
          image={water}
          x={-canvasWidth / 2}
          y={-WATER_LEVEL}
          width={canvasWidth}
          height={(221 / 960) * canvasWidth}
        />
        {state.entities.map((entity) => {
          switch (entity.type) {
            case "projectile": {
              return (
                <Projectile
                  key={entity.id}
                  position={entity.position}
                  rotation={Math.atan2(entity.velocity.x, entity.velocity.y)}
                  variant={entity.ownerId === PLAYER_ID ? "blue" : "red"}
                />
              );
            }
            case "enemy": {
              return (
                <Enemy
                  key={entity.id}
                  position={entity.position}
                  damaged={entity.health < 0.7 * ENEMY_INITIAL_HEALTH}
                />
              );
            }
            case "wreck": {
              return <Wreck key={entity.id} position={entity.position} />;
            }
            default: {
              return null;
            }
          }
        })}
        <Ground />
        {player && (
          <Player
            key={player.id}
            position={player.position}
            moveIntent={player.moveIntent}
          />
        )}
      </C>
    </>
  );
};

export default Level;
