import { Container, Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ENEMY_RADIUS } from "./constants";
import { identityVector, vectorSub } from "./math";

type Props = {
  position: { x: number; y: number };
  damaged: boolean;
};

function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// Hack around incorrect types in react-pixi
const C = Container as any;

const Enemy = ({ position, damaged }: Props) => {
  const previousPosition = usePrevious(position);
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    if (!previousPosition) {
      return;
    }
    if (
      position.x === previousPosition.x &&
      position.y === previousPosition.y
    ) {
      return;
    }
    const direction = identityVector(vectorSub(position, previousPosition));
    if (direction.x === 0 && direction.y === 0) {
      return;
    }
    setRotation(Math.atan2(direction.x, direction.y));
  }, [position, previousPosition]);
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(damaged ? 0x4444444 : 0x000000, 1);
      // g.drawCircle(0, 0, ENEMY_RADIUS);
      g.drawRect(
        -ENEMY_RADIUS,
        -ENEMY_RADIUS,
        2 * ENEMY_RADIUS,
        2 * ENEMY_RADIUS
      );
      g.endFill();
    },
    [damaged]
  );
  return (
    <C x={position.x} y={-position.y} rotation={rotation}>
      <Graphics draw={draw} />
    </C>
  );
};

export default Enemy;
