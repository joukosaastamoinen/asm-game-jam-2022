import { Container, Graphics, useTick } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";
import { ENEMY_RADIUS } from "./constants";
import explosionSound from "./rajahdys.mp3";

type Props = {
  position: { x: number; y: number };
};

// Hack around incorrect types in react-pixi
const C = Container as any;

const Wreck = ({ position }: Props) => {
  const [playExplosionSound] = useSound(explosionSound, { volume: 0.4 });
  useEffect(() => {
    playExplosionSound();
  }, [playExplosionSound]);
  const [explosionScale, setExplosionScale] = useState(1);
  const [rotation] = useState(() => Math.PI * Math.random());
  useTick((delta) => {
    setExplosionScale((scale) => Math.max(0, scale - 0.2 * delta));
  });
  const drawWreck = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(2, 0x4444444, 1, 0);
    g.beginFill(0xbbbbbb, 1);
    g.drawCircle(0, 0, 0.9 * ENEMY_RADIUS);
    g.drawRect(-ENEMY_RADIUS, -ENEMY_RADIUS, 5, 2 * ENEMY_RADIUS);
    g.drawRect(ENEMY_RADIUS - 5, -ENEMY_RADIUS, 5, 2 * ENEMY_RADIUS);
    g.endFill();
  }, []);
  const drawExplosion = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0xffffff, 1);
    g.drawCircle(0, 0, 70);
    g.endFill();
  }, []);
  return (
    <C x={position.x} y={-position.y} rotation={rotation}>
      <Graphics draw={drawWreck} />
      <C scale={{ x: explosionScale, y: explosionScale }}>
        <Graphics draw={drawExplosion} />
      </C>
    </C>
  );
};

export default Wreck;
