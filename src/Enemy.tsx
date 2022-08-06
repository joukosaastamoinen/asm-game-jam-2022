import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";
import { ENEMY_RADIUS } from "./constants";

type Props = {
  position: { x: number; y: number };
  damaged: boolean;
};

const Enemy = ({ position, damaged }: Props) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(damaged ? 0x4444444 : 0x000000, 1);
      g.drawCircle(position.x, -position.y, ENEMY_RADIUS);
      g.endFill();
    },
    [position.x, position.y, damaged]
  );
  return <Graphics draw={draw} />;
};

export default Enemy;
