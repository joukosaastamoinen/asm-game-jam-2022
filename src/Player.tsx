import { AnimatedSprite, Container } from "@saitonakamura/react-pixi";
import * as PIXI from "pixi.js";
import { useEffect, useState } from "react";
import spritesheetImage from "./player.png";

type Props = {
  position: { x: number; y: number };
};

const atlasData = {
  frames: [...Array(10)].reduce((acc, _, index) => {
    return {
      ...acc,
      [`player-${index}`]: {
        frame: { x: index * 64, y: 65, w: 64, h: 63 },
        sourceSize: { w: 64, h: 63 },
        spriteSourceSize: { x: 0, y: 0, w: 64, h: 63 },
      },
    };
  }, {}),
  meta: {
    image: spritesheetImage,
    format: "RGBA8888",
    size: { w: 640, h: 128 },
    scale: "1",
  },
  animations: {
    player: [...Array(10)].map((_, index) => `player-${index}`),
  },
};
console.log(atlasData);

// Hack around incorrect types in react-pixi
const C = Container as any;

const Player = ({ position }: Props) => {
  const [textures, setTextures] = useState<
    PIXI.Texture<PIXI.Resource>[] | null
  >(null);

  useEffect(() => {
    const spritesheet = new PIXI.Spritesheet(
      PIXI.BaseTexture.from(atlasData.meta.image),
      atlasData
    );
    spritesheet.parse().then(() => {
      setTextures(spritesheet.animations.player);
    });
  }, []);
  return textures ? (
    <C x={position.x} y={-position.y}>
      <AnimatedSprite
        anchor={0.5}
        textures={textures}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.2}
      />
    </C>
  ) : null;
};

export default Player;
