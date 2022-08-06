import { Sprite } from "@saitonakamura/react-pixi";
import enemy from "./enemy.png";

type Props = {
  position: { x: number; y: number };
  damaged: boolean;
};

const PIVOT = { x: 75, y: 75 };

const SCALE = { x: 0.5, y: 0.5 };

const Enemy = ({ position, damaged }: Props) => {
  return (
    <Sprite
      image={enemy}
      x={position.x}
      y={-position.y}
      pivot={PIVOT}
      scale={SCALE}
    />
  );
};

export default Enemy;
