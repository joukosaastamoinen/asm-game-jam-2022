import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";

type Props = {
  position: { x: number; y: number };
};

const WIDTH = 10;
const HEIGHT = 10;

const Bullet = ({ position }: Props) => {
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

export default Bullet;
