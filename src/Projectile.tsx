import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";
import { PROJECTILE_RADIUS } from "./constants";

type Props = {
  position: { x: number; y: number };
};

const WIDTH = 2 * PROJECTILE_RADIUS;
const HEIGHT = 2 * PROJECTILE_RADIUS;

const Projectile = ({ position }: Props) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x000000, 1);
      g.drawRect(
        position.x - WIDTH / 2,
        -position.y - HEIGHT / 2,
        WIDTH,
        HEIGHT
      );
      g.endFill();
    },
    [position.x, position.y]
  );
  return <Graphics draw={draw} />;
};

export default Projectile;
