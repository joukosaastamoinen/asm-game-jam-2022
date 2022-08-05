import { Graphics } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback } from "react";
import { PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants";

type Props = {
  position: { x: number; y: number };
};

const Player = ({ position }: Props) => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(0x000000, 1);
      g.drawRect(
        position.x - PLAYER_WIDTH / 2,
        -position.y - PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
      g.endFill();
    },
    [position.x, position.y]
  );
  return <Graphics draw={draw} />;
};

export default Player;
