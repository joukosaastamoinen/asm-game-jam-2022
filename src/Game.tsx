import { GROUND_LEVEL, PLAYER_HEIGHT } from "./constants";
import Ground from "./Ground";
import Player from "./Player";
import Water from "./Water";

const INITIAL_STATE = [
  {
    id: "player",
    type: "player",
    position: { x: 0, y: GROUND_LEVEL + PLAYER_HEIGHT / 2 },
  },
];

const Game = () => {
  return (
    <>
      <Water />
      <Ground />
      {INITIAL_STATE.map((entity) => {
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
