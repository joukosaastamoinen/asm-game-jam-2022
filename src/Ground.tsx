import * as PIXI from "pixi.js";
import { Graphics } from "@saitonakamura/react-pixi";
import { useCallback } from "react";
import { GROUND_LEVEL, GROUND_WIDTH } from "./constants";

const Ground = () => {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x773322, 1);
    g.moveTo(-GROUND_WIDTH / 2, -GROUND_LEVEL);
    g.lineTo(GROUND_WIDTH / 2, -GROUND_LEVEL);
    g.lineTo(0.3 * GROUND_WIDTH, 1000);
    g.lineTo(-0.3 * GROUND_WIDTH, 1000);
    g.endFill();
  }, []);
  return <Graphics draw={draw} />;
};

export default Ground;
