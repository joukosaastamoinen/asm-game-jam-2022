import { useTick } from "@saitonakamura/react-pixi";
import { useReducer } from "react";
import {
  GROUND_LEVEL,
  PLAYER_HEIGHT,
  PLAYER_MOVEMENT_SPEED,
} from "./constants";
import Ground from "./Ground";
import useKeys from "./keyboard/useKeys";
import Player from "./Player";
import Water from "./Water";

type Point = {
  x: number;
  y: number;
};

type PlayerEntity = {
  id: string;
  type: "player";
  position: Point;
  moveIntent: number;
};

type Entity = PlayerEntity;

type TickAction = {
  type: "TICK";
  timeDelta: number;
};

type MoveAction = {
  type: "MOVE";
  playerId: string;
  moveIntent: number;
};

type Action = TickAction | MoveAction;

const PLAYER_ID = "player";

const LEFT_KEYS = ["ArrowLeft", "KeyA"];

const RIGHT_KEYS = ["ArrowRight", "KeyD"];

const INITIAL_STATE: Entity[] = [
  {
    id: "player",
    type: "player",
    position: { x: 0, y: GROUND_LEVEL + PLAYER_HEIGHT / 2 },
    moveIntent: 0,
  },
];

const applyToEntityById = (
  applyFn: (entity: Entity) => Entity,
  entityId: string,
  entities: Entity[]
): Entity[] => {
  return entities.map((entity) =>
    entity.id === entityId ? applyFn(entity) : entity
  );
};

const reducer = (state: Entity[], action: Action): Entity[] => {
  switch (action.type) {
    case "TICK": {
      return state.map((entity) => {
        switch (entity.type) {
          case "player": {
            return {
              ...entity,
              position: {
                ...entity.position,
                x:
                  entity.position.x +
                  action.timeDelta * PLAYER_MOVEMENT_SPEED * entity.moveIntent,
              },
            };
          }
          default: {
            return entity;
          }
        }
      });
    }
    case "MOVE": {
      return applyToEntityById(
        (entity) => ({ ...entity, moveIntent: action.moveIntent }),
        action.playerId,
        state
      );
    }
  }
};

const Game = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  useTick((delta) => {
    dispatch({ type: "TICK", timeDelta: delta });
  });
  useKeys([...LEFT_KEYS, ...RIGHT_KEYS], (_key, _eventName, keysDown) => {
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
