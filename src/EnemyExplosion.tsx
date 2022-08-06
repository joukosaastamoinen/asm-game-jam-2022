import { Container, Graphics, useTick } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import explosionSound from "./rajahdys.mp3";

type Props = {
  x: number;
  y: number;
};

// Hack around incorrect types in react-pixi
const C = Container as any;

const EnemyExplosion = ({ x, y }: Props) => {
  const [playExplosionSound] = useSound(explosionSound, { volume: 0.4 });
  useEffect(() => {
    playExplosionSound();
  }, [playExplosionSound]);
  const [explosionScale, setExplosionScale] = useState(1);
  useTick((delta) => {
    setExplosionScale((scale) => Math.max(0, scale - 0.2 * delta));
  });
  const drawExplosion = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0xffffff, 1);
    g.drawCircle(0, 0, 70);
    g.endFill();
  }, []);
  const explosionScaleObject = useMemo(
    () => ({ x: explosionScale, y: explosionScale }),
    [explosionScale]
  );
  return explosionScale > 0 ? (
    <C x={x} y={-y}>
      <C scale={explosionScaleObject}>
        <Graphics draw={drawExplosion} />
      </C>
    </C>
  ) : null;
};

export default React.memo(EnemyExplosion);
