import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";
import { PLAYER_INITIAL_HEALTH } from "./constants";

type Props = {
  health: number;
  width: number;
  height: number;
  x: number;
  y: number;
};

const PADDING = 2;

const HealthMeter = ({ x, y, width, height, health }: Props) => {
  const drawBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x000000, 1);
      g.drawRect(x, y, width, height);
      g.endFill();
    },
    [x, y, width, height]
  );
  const drawHealth = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x00ff00, 1);
      g.drawRect(
        x + PADDING,
        y + PADDING,
        (width - 2 * PADDING) * (health / PLAYER_INITIAL_HEALTH),
        height - 2 * PADDING
      );
      g.endFill();
    },
    [x, y, width, height, health]
  );
  return (
    <>
      <Graphics draw={drawBackground} />
      <Graphics draw={drawHealth} />
    </>
  );
};

export default HealthMeter;
