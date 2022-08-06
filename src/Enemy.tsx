import { Sprite } from "@saitonakamura/react-pixi";
import enemy from "./enemy.png";

type Props = {
  position: { x: number; y: number };
  damaged: boolean;
};

const Enemy = ({ position, damaged }: Props) => {
  return (
    <Sprite
      image={enemy}
      x={position.x}
      y={-position.y}
      pivot={{ x: 75, y: 75 }}
      scale={{ x: 0.5, y: 0.5 }}
    />
  );
};

export default Enemy;
