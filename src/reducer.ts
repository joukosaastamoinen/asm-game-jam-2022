import cuid from "cuid";
import {
  PLAYER_PROJECTILE_SPEED,
  ENEMY_INITIAL_HEALTH,
  ENEMY_SPEED,
  GRAVITY,
  GROUND_LEVEL,
  GROUND_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_ID,
  PLAYER_JUMP_SPEED,
  PLAYER_INITIAL_HEALTH,
  PLAYER_MOVEMENT_SPEED,
  PLAYER_WIDTH,
  ENEMY_RADIUS,
  PLAYER_PROJECTILE_DAMAGE,
  ENEMY_FIRING_INTERVAL,
  ENEMY_PROJECTILE_SPEED,
  PROJECTILE_RADIUS,
  ENEMY_PROJECTILE_DAMAGE,
  WRECK_FALL_DELAY,
  WRECK_AREA_HORIZONTAL_DIVISIONS,
  WRECK_AREA_VERTICAL_DIVISIONS,
  WRECK_AREA_LEFT,
  WRECK_AREA_RIGHT,
  WRECK_AREA_TOP,
  WRECK_AREA_BOTTOM,
} from "./constants";
import {
  distance,
  identityVector,
  Point,
  vectorAdd,
  vectorLength,
  vectorMul,
  vectorSub,
} from "./math";

export type Player = {
  id: string;
  type: "player";
  position: Point;
  moveIntent: number;
  velocityY: number;
  health: number;
};

type Projectile = {
  id: string;
  type: "projectile";
  position: Point;
  velocity: Point;
  ownerId: string;
};

type Enemy = {
  id: string;
  type: "enemy";
  position: Point;
  health: number;
  timeSinceLastFired: number;
};

type Wreck = {
  id: string;
  type: "wreck";
  position: Point;
  velocityY: number;
  lifetime: number; // in seconds
};

type Entity = Player | Projectile | Enemy | Wreck;

type State = {
  entities: Entity[];
  slots: (string | null)[][];
};

type TickAction = {
  type: "TICK";
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

type ShootAction = {
  type: "SHOOT";
  playerId: string;
  direction: Point;
};

type SpawnEnemyAction = {
  type: "SPAWN_ENEMY";
};

type Action =
  | TickAction
  | MoveAction
  | JumpAction
  | ShootAction
  | SpawnEnemyAction;

const TIME_DELTA = 1 / 60;

export const INITIAL_STATE: State = {
  entities: [
    {
      id: PLAYER_ID,
      type: "player",
      position: { x: 0, y: GROUND_LEVEL + PLAYER_HEIGHT / 2 },
      moveIntent: 0,
      velocityY: 0,
      health: PLAYER_INITIAL_HEALTH,
    },
  ],
  slots: [...Array(WRECK_AREA_HORIZONTAL_DIVISIONS)].map(() =>
    Array(WRECK_AREA_VERTICAL_DIVISIONS).fill(null)
  ),
};

const applyToEntityById = (
  applyFn: (entity: Entity) => Entity,
  entityId: string,
  entities: Entity[]
): Entity[] => {
  return entities.map((entity) =>
    entity.id === entityId ? applyFn(entity) : entity
  );
};

const calculateSlotPosition = (i: number, j: number) => {
  const wreckAreaWidth = WRECK_AREA_RIGHT - WRECK_AREA_LEFT;
  const wreckAreaHeight = WRECK_AREA_TOP - WRECK_AREA_BOTTOM;
  const slotWidth = wreckAreaWidth / WRECK_AREA_HORIZONTAL_DIVISIONS;
  const slotHeight = wreckAreaHeight / WRECK_AREA_VERTICAL_DIVISIONS;
  return {
    x:
      WRECK_AREA_LEFT +
      (i / WRECK_AREA_HORIZONTAL_DIVISIONS) * wreckAreaWidth +
      slotWidth / 2,
    y:
      WRECK_AREA_BOTTOM +
      (j / WRECK_AREA_VERTICAL_DIVISIONS) * wreckAreaHeight +
      slotHeight / 2,
  };
};

const findLastIndex = <T>(
  predicateFn: (el: T) => boolean,
  arr: T[]
): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicateFn(arr[i])) {
      return i;
    }
  }
  return -1;
};

const playerDistanceToNearestPlatform = (
  player: Player,
  state: State
): number => {
  const playerRightEdge = player.position.x + PLAYER_WIDTH / 2;
  const playerLeftEdge = player.position.x - PLAYER_WIDTH / 2;
  const playerBottomEdge = player.position.y - PLAYER_HEIGHT / 2;
  const distanceToGround =
    playerRightEdge >= -GROUND_WIDTH / 2 &&
    playerLeftEdge < GROUND_WIDTH / 2 &&
    playerBottomEdge >= GROUND_LEVEL
      ? playerBottomEdge - GROUND_LEVEL
      : Infinity;
  const column = Math.floor(
    ((player.position.x - WRECK_AREA_LEFT) /
      (WRECK_AREA_RIGHT - WRECK_AREA_LEFT)) *
      WRECK_AREA_HORIZONTAL_DIVISIONS
  );
  if (column < 0 || column >= WRECK_AREA_HORIZONTAL_DIVISIONS) {
    return distanceToGround;
  }
  const wreckAreaHeight = WRECK_AREA_TOP - WRECK_AREA_BOTTOM;
  const row = findLastIndex(
    (slot) => slot !== null,
    state.slots[column].slice(
      0,
      Math.floor(
        ((playerBottomEdge - WRECK_AREA_BOTTOM) / wreckAreaHeight) *
          WRECK_AREA_VERTICAL_DIVISIONS
      )
    )
  );
  if (row === -1) {
    return distanceToGround;
  }
  const slotHeight = wreckAreaHeight / WRECK_AREA_VERTICAL_DIVISIONS;
  const slotPosition = calculateSlotPosition(column, row);
  const slotTopEdge = slotPosition.y + slotHeight / 2;
  return playerBottomEdge - slotTopEdge;
};

const tickPhysics = (state: State): State => {
  const wreckIdToSlot = new Map<string, { i: number; j: number }>();
  for (let i = 0; i < state.slots.length; i++) {
    for (let j = 0; j < state.slots[i].length; j++) {
      const value = state.slots[i][j];
      if (value !== null) {
        wreckIdToSlot.set(value, { i, j });
      }
    }
  }
  return {
    ...state,
    entities: state.entities.map((entity) => {
      switch (entity.type) {
        case "player": {
          const distanceToGround = playerDistanceToNearestPlatform(
            entity,
            state
          );
          return {
            ...entity,
            position: {
              x:
                entity.position.x +
                TIME_DELTA * PLAYER_MOVEMENT_SPEED * entity.moveIntent,
              y:
                entity.position.y +
                Math.max(
                  TIME_DELTA * entity.velocityY,
                  -Math.max(0, distanceToGround)
                ),
            },
            velocityY: Math.max(
              entity.velocityY - TIME_DELTA * GRAVITY,
              distanceToGround <= 0 ? 0 : -Infinity
            ),
          };
        }
        case "projectile": {
          return {
            ...entity,
            position: vectorAdd(
              entity.position,
              vectorMul(TIME_DELTA * PLAYER_PROJECTILE_SPEED, entity.velocity)
            ),
          };
        }
        case "enemy": {
          return {
            ...entity,
            position: vectorAdd(entity.position, {
              x: 0,
              y: -TIME_DELTA * ENEMY_SPEED,
            }),
          };
        }
        case "wreck": {
          if (entity.lifetime < WRECK_FALL_DELAY) {
            return {
              ...entity,
              lifetime: entity.lifetime + TIME_DELTA,
            };
          }
          return {
            ...entity,
            velocityY: entity.velocityY + TIME_DELTA * GRAVITY,
            position: (function () {
              const slot = wreckIdToSlot.get(entity.id);
              if (!slot) {
                return vectorAdd(
                  entity.position,
                  vectorMul(TIME_DELTA * entity.velocityY, { x: 0, y: -1 })
                );
              }
              const slotPosition = calculateSlotPosition(slot.i, slot.j);
              const distanceToTarget = distance(entity.position, slotPosition);
              if (distanceToTarget === 0) {
                return entity.position;
              }
              const direction = identityVector(
                vectorSub(slotPosition, entity.position)
              );
              return vectorAdd(
                entity.position,
                vectorMul(
                  Math.min(TIME_DELTA * entity.velocityY, distanceToTarget),
                  direction
                )
              );
            })(),
            lifetime: entity.lifetime + TIME_DELTA,
          };
        }
        default: {
          return entity;
        }
      }
    }),
  };
};

type ProjectileCollision = {
  projectileId: string;
  targetId: string;
};

// From: http://jeffreythompson.org/collision-detection/circle-rect.php
const isCircleAndRectangleIntersecting = (
  cx: number,
  cy: number,
  radius: number,
  top: number,
  right: number,
  bottom: number,
  left: number
) => {
  // temporary variables to set edges for testing
  let testX = cx;
  let testY = cy;

  // which edge is closest?
  if (cx < left) testX = left; // test left edge
  else if (cx > right) testX = right; // right edge
  if (cy < bottom) testY = bottom; // bottom edge
  else if (cy > top) testY = top; // top edge

  // get distance from closest edges
  const distX = cx - testX;
  const distY = cy - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
};

const isProjectileCollidingWithPlayer = (
  projectile: Projectile,
  player: Player
): boolean => {
  return isCircleAndRectangleIntersecting(
    projectile.position.x,
    projectile.position.y,
    PROJECTILE_RADIUS,
    player.position.y + PLAYER_HEIGHT / 2,
    player.position.x + PLAYER_WIDTH / 2,
    player.position.y - PLAYER_HEIGHT / 2,
    player.position.x - PLAYER_WIDTH / 2
  );
};

const isProjectileCollidingWithEnemy = (
  projectile: Projectile,
  enemy: Enemy
): boolean => {
  return distance(projectile.position, enemy.position) < ENEMY_RADIUS;
};

const isColliding = (
  projectile: Projectile,
  entity: Player | Enemy
): boolean => {
  return entity.type === "player"
    ? isProjectileCollidingWithPlayer(projectile, entity)
    : isProjectileCollidingWithEnemy(projectile, entity);
};

const findProjectileHits = (state: State): ProjectileCollision[] => {
  return state.entities.reduce((acc, entity) => {
    if (entity.type === "projectile") {
      acc.push(
        ...state.entities
          .filter(
            (otherEntity) =>
              (otherEntity.type === "player" || otherEntity.type === "enemy") &&
              isColliding(entity, otherEntity)
          )
          .map(
            (otherEntity): ProjectileCollision => ({
              projectileId: entity.id,
              targetId: otherEntity.id,
            })
          )
      );
    }
    return acc;
  }, [] as ProjectileCollision[]);
};

export const entityById = (
  entityId: string,
  entities: Entity[]
): Entity | undefined => {
  return entities.find((entity) => entity.id === entityId);
};

const removeEntityById = (
  entityToRemoveId: string,
  entities: Entity[]
): Entity[] => {
  return entities.filter((entity) => entity.id !== entityToRemoveId);
};

const applyDamage = (state: State): State => {
  const projectileHits = findProjectileHits(state);
  return projectileHits.reduce((acc, hit) => {
    const target = entityById(hit.targetId, state.entities);
    if (!target) {
      return acc;
    }
    const projectile = entityById(hit.projectileId, state.entities);
    if (!projectile || projectile.type !== "projectile") {
      return acc;
    }
    const projectileOwner = entityById(projectile.ownerId, state.entities);
    if (!projectileOwner) {
      return acc;
    }
    if (target.type === "enemy" && projectileOwner.type === "player") {
      return {
        ...state,
        entities: removeEntityById(
          projectile.id,
          applyToEntityById(
            () => ({
              ...target,
              health: target.health - PLAYER_PROJECTILE_DAMAGE,
            }),
            target.id,
            state.entities
          )
        ),
      };
    } else if (target.type === "player" && projectileOwner.type === "enemy") {
      return {
        ...state,
        entities: removeEntityById(
          projectile.id,
          applyToEntityById(
            () => ({
              ...target,
              health: target.health - ENEMY_PROJECTILE_DAMAGE,
            }),
            target.id,
            state.entities
          )
        ),
      };
    }
    return acc;
  }, state);
};

const isWreck = (entity: Entity): entity is Wreck => entity.type === "wreck";

const assignWrecksToSlots = (state: State): State => {
  const wrecks: Wreck[] = state.entities
    .filter(isWreck)
    .filter((wreck) => wreck.lifetime === 0);
  return {
    ...state,
    slots: wrecks.reduce((newSlots, wreck) => {
      const column = Math.floor(
        ((wreck.position.x - WRECK_AREA_LEFT) /
          (WRECK_AREA_RIGHT - WRECK_AREA_LEFT)) *
          WRECK_AREA_HORIZONTAL_DIVISIONS
      );
      const highestPossibleRow = Math.floor(
        ((wreck.position.y - WRECK_AREA_BOTTOM) /
          (WRECK_AREA_TOP - WRECK_AREA_BOTTOM)) *
          WRECK_AREA_VERTICAL_DIVISIONS
      );
      if (column < 0 || column >= WRECK_AREA_HORIZONTAL_DIVISIONS) {
        return newSlots;
      }
      const row = newSlots[column].findIndex((el) => el === null);
      if (row > -1 && row <= highestPossibleRow) {
        return [
          ...newSlots.slice(0, column),
          [
            ...newSlots[column].slice(0, row),
            wreck.id,
            ...newSlots[column].slice(row + 1),
          ],
          ...newSlots.slice(column + 1),
        ];
      }
      return newSlots;
    }, state.slots),
  };
};

const commenceDeath = (state: State): State => {
  return {
    ...state,
    entities: state.entities
      .map((entity) => {
        if (entity.type === "enemy" && entity.health <= 0) {
          const wreck: Wreck = {
            id: entity.id,
            type: "wreck",
            position: entity.position,
            lifetime: 0,
            velocityY: 0,
          };
          return wreck;
        }
        return entity;
      })
      .filter((entity) => {
        if (entity.type === "player" && entity.health <= 0) {
          return false;
        }
        return true;
      }),
  };
};

const processEnemyShooting = (state: State): State => {
  return {
    ...state,
    entities: state.entities.reduce((newEntities, entity) => {
      if (entity.type !== "enemy") {
        return newEntities;
      }
      const player = newEntities.find((e) => e.type === "player");
      if (entity.timeSinceLastFired > ENEMY_FIRING_INTERVAL && player) {
        return applyToEntityById(
          () => ({
            ...entity,
            timeSinceLastFired: 0,
          }),
          entity.id,
          [
            ...newEntities,
            {
              id: cuid(),
              type: "projectile",
              position: entity.position,
              velocity: vectorMul(
                ENEMY_PROJECTILE_SPEED,
                identityVector(vectorSub(player.position, entity.position))
              ),
              ownerId: entity.id,
            },
          ]
        );
      }
      return applyToEntityById(
        () => ({
          ...entity,
          timeSinceLastFired: (entity.timeSinceLastFired += TIME_DELTA),
        }),
        entity.id,
        newEntities
      );
    }, state.entities),
  };
};

const cleanUp = (state: State): State => {
  return {
    ...state,
    entities: state.entities.filter((entity) => {
      if (
        (entity.type === "projectile" || entity.type === "wreck") &&
        vectorLength(entity.position) > 1500
      ) {
        return false;
      }
      return true;
    }),
  };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      return processEnemyShooting(
        applyDamage(
          tickPhysics(cleanUp(assignWrecksToSlots(commenceDeath(state))))
        )
      );
    }
    case "MOVE": {
      return {
        ...state,
        entities: applyToEntityById(
          (entity) => ({ ...entity, moveIntent: action.moveIntent }),
          action.playerId,
          state.entities
        ),
      };
    }
    case "JUMP": {
      const player = entityById(action.playerId, state.entities) as
        | Player
        | undefined;
      if (!player || playerDistanceToNearestPlatform(player, state) > 0) {
        return state;
      }
      return {
        ...state,
        entities: applyToEntityById(
          (entity) => ({ ...entity, velocityY: PLAYER_JUMP_SPEED }),
          action.playerId,
          state.entities
        ),
      };
    }
    case "SHOOT": {
      const player = entityById(action.playerId, state.entities) as
        | Player
        | undefined;
      if (!player) {
        return state;
      }
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: cuid(),
            type: "projectile",
            position: player.position,
            velocity: vectorMul(PLAYER_PROJECTILE_SPEED, action.direction),
            ownerId: player.id,
          },
        ],
      };
    }
    case "SPAWN_ENEMY": {
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: cuid(),
            type: "enemy",
            position: {
              x: Math.random() * 1000 - 500,
              y: 600,
            },
            health: ENEMY_INITIAL_HEALTH,
            timeSinceLastFired: ENEMY_FIRING_INTERVAL,
          },
        ],
      };
    }
  }
};

export default reducer;
