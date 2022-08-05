import {
  GRAVITY,
  GROUND_LEVEL,
  GROUND_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_JUMP_SPEED,
  PLAYER_MOVEMENT_SPEED,
  PLAYER_WIDTH,
} from "./constants";

type Point = {
  x: number;
  y: number;
};

type PlayerEntity = {
  id: string;
  type: "player";
  position: Point;
  moveIntent: number;
  velocityY: number;
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

type JumpAction = {
  type: "JUMP";
  playerId: string;
};

type Action = TickAction | MoveAction | JumpAction;

export const INITIAL_STATE: Entity[] = [
  {
    id: "player",
    type: "player",
    position: { x: 0, y: GROUND_LEVEL + PLAYER_HEIGHT / 2 },
    moveIntent: 0,
    velocityY: 0,
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
            const playerRightEdge = entity.position.x + PLAYER_WIDTH / 2;
            const playerLeftEdge = entity.position.x - PLAYER_WIDTH / 2;
            const playerBottomEdge = entity.position.y - PLAYER_HEIGHT / 2;
            const playerIsOnGround =
              playerRightEdge >= -GROUND_WIDTH / 2 &&
              playerLeftEdge < GROUND_WIDTH / 2 &&
              playerBottomEdge <= GROUND_LEVEL;
            return {
              ...entity,
              position: {
                x:
                  entity.position.x +
                  action.timeDelta * PLAYER_MOVEMENT_SPEED * entity.moveIntent,
                y: Math.max(
                  entity.position.y + action.timeDelta * entity.velocityY,
                  playerIsOnGround
                    ? PLAYER_HEIGHT / 2 + GROUND_LEVEL
                    : -Infinity
                ),
              },
              velocityY: Math.max(
                entity.velocityY - action.timeDelta * GRAVITY,
                playerIsOnGround ? 0 : -Infinity
              ),
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
    case "JUMP": {
      return applyToEntityById(
        (entity) => ({ ...entity, velocityY: PLAYER_JUMP_SPEED }),
        action.playerId,
        state
      );
    }
  }
};

export default reducer;
