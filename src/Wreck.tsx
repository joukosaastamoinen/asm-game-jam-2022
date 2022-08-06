import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";
import { ENEMY_RADIUS } from "./constants";

type Props = {
  position: { x: number; y: number };
};

const Wreck = ({ position }: Props) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle(2, 0x4444444, 1, 0);
      g.beginFill(0xbbbbbb, 1);
      g.drawCircle(position.x, -position.y, ENEMY_RADIUS);
      g.endFill();
    },
    [position]
  );
  return <Graphics draw={draw} />;
};

export default Wreck;
