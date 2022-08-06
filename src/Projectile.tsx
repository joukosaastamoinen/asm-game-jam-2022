import { Sprite } from "@saitonakamura/react-pixi";
import projectileRed from "./projectile-red.png";
import projectileBlue from "./projectile-blue.png";

type Props = {
  position: { x: number; y: number };
  rotation: number;
  variant: "blue" | "red";
};

const variants = {
  red: projectileRed,
  blue: projectileBlue,
};

const Projectile = ({ position, rotation, variant }: Props) => {
  return (
    <Sprite
      image={variants[variant]}
      pivot={{ x: 8, y: 8 }}
      x={position.x}
      y={-position.y}
      rotation={rotation}
      scale={{ x: 1.5, y: 1.5 }}
    />
  );
};

export default Projectile;
