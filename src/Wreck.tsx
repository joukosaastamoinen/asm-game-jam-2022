import { Container, Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback, useState } from "react";
import { ENEMY_RADIUS } from "./constants";

type Props = {
  position: { x: number; y: number };
};

// Hack around incorrect types in react-pixi
const C = Container as any;

const Wreck = ({ position }: Props) => {
  const [rotation] = useState(() => Math.PI * Math.random());
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(2, 0x4444444, 1, 0);
    g.beginFill(0xbbbbbb, 1);
    g.drawCircle(0, 0, 0.9 * ENEMY_RADIUS);
    g.drawRect(-ENEMY_RADIUS, -ENEMY_RADIUS, 5, 2 * ENEMY_RADIUS);
    g.drawRect(ENEMY_RADIUS - 5, -ENEMY_RADIUS, 5, 2 * ENEMY_RADIUS);
    g.endFill();
  }, []);
  return (
    <C x={position.x} y={-position.y} rotation={rotation}>
      <Graphics draw={draw} />
    </C>
  );
};

export default Wreck;
