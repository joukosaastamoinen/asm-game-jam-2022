import { useReducer } from "react";
import { GROUND_LEVEL, PLAYER_HEIGHT } from "./constants";
import Ground from "./Ground";
import Player from "./Player";
import Water from "./Water";

type BaseEntity = {
  id: string;
  type: string;
};

type Point = {
  x: number;
  y: number;
};

type PlayerEntity = BaseEntity & {
  id: string;
  type: "player";
  position: Point;
};

type Entity = PlayerEntity;

type Action = {};

const INITIAL_STATE: Entity[] = [
  {
    id: "player",
    type: "player",
    position: { x: 0, y: GROUND_LEVEL + PLAYER_HEIGHT / 2 },
  },
];

const reducer = (state: Entity[], action: Action): Entity[] => {
  return state;
};

const Game = () => {
  const [state] = useReducer(reducer, INITIAL_STATE);
  return (
    <>
      <Water />
      <Ground />
      {state.map((entity) => {
        switch (entity.type) {
          case "player": {
            return <Player position={entity.position} />;
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
