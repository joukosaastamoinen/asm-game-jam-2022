import {
  Container,
  Graphics,
  Sprite,
  useTick,
} from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import wreck from "./wreck.png";
import explosionSound from "./rajahdys.mp3";

type Props = {
  position: { x: number; y: number };
};

// Hack around incorrect types in react-pixi
const C = Container as any;

const PIVOT = { x: 60, y: 60 };

const SCALE = { x: 0.5, y: 0.5 };

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
  return (
    <C x={position.x} y={-position.y} rotation={rotation}>
      <Sprite image={wreck} x={0} y={0} pivot={PIVOT} scale={SCALE} />
      <C scale={explosionScaleObject}>
        <Graphics draw={drawExplosion} />
      </C>
    </C>
  );
};

export default Wreck;
