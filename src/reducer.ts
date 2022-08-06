import cuid from "cuid";
import {
  BULLET_SPEED,
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
} from "./constants";
import { distance, Point, vectorAdd, vectorMul } from "./math";

type Player = {
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
};

type Entity = Player | Projectile | Enemy;

type State = {
  entities: Entity[];
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

const tickPhysics = (state: State): State => {
  return {
    ...state,
    entities: state.entities.map((entity) => {
      switch (entity.type) {
        case "player": {
          const playerRightEdge = entity.position.x + PLAYER_WIDTH / 2;
          const playerLeftEdge = entity.position.x - PLAYER_WIDTH / 2;
          const playerBottomEdge = entity.position.y - PLAYER_HEIGHT / 2;
          const distanceToGround =
            playerRightEdge >= -GROUND_WIDTH / 2 &&
            playerLeftEdge < GROUND_WIDTH / 2 &&
            playerBottomEdge >= GROUND_LEVEL
              ? playerBottomEdge - GROUND_LEVEL
              : Infinity;
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
              vectorMul(TIME_DELTA * BULLET_SPEED, entity.velocity)
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

const isProjectileCollidingWithPlayer = (
  projectile: Projectile,
  player: Player
): boolean => {
  return false;
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

const entityById = (
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
    const target = entityById(hit.targetId, state.entities) as Player | Enemy;
    const projectile = entityById(
      hit.projectileId,
      state.entities
    ) as Projectile;
    const projectileOwner = entityById(projectile.ownerId, state.entities) as
      | Player
      | Enemy;
    if (target.type === "enemy" && projectileOwner.type === "player") {
      return {
        ...state,
        entities: removeEntityById(
          projectile.id,
          applyToEntityById(
            (enemy) => ({
              ...enemy,
              health: (enemy as Enemy).health - PLAYER_PROJECTILE_DAMAGE,
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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      return applyDamage(tickPhysics(state));
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
      const player = state.entities.find(
        (entity) => entity.id === action.playerId
      );
      if (!player) {
        throw new Error(`Player with ID ${action.playerId} not found!`);
      }
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: cuid(),
            type: "projectile",
            position: player.position,
            velocity: vectorMul(BULLET_SPEED, action.direction),
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
          },
        ],
      };
    }
  }
};

export default reducer;
