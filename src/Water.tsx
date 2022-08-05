import * as PIXI from "pixi.js";
import { Graphics } from "@saitonakamura/react-pixi";
import { useCallback } from "react";
import { WATER_LEVEL } from "./constants";

const Water = () => {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x77ddaa, 1);
    g.drawRect(-2000, -WATER_LEVEL, 4000, 1000);
    g.endFill();
  }, []);
  return <Graphics draw={draw} />;
};

export default Water;
