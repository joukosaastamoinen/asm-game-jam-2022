import { Sprite } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import React, { useState } from "react";
import wreck from "./wreck.png";

type Props = {
  x: number;
  y: number;
};

const SCALE = { x: 0.5, y: 0.5 };

const TEXTURE = PIXI.Texture.from(wreck);

const Wreck = ({ x, y }: Props) => {
  const [rotation] = useState(() => Math.PI * Math.random());
  return (
    <Sprite
      texture={TEXTURE}
      x={x}
      y={-y}
      anchor={0.5}
      scale={SCALE}
      rotation={rotation}
    />
  );
};

export default React.memo(Wreck);
