import {
  GROUND_LEVEL,
  PLAYER_HEIGHT,
  PLAYER_MOVEMENT_SPEED,
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

export const INITIAL_STATE: Entity[] = [
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

export default reducer;
