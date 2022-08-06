import { Sprite } from "@saitonakamura/react-pixi";
import { GROUND_LEVEL } from "./constants";
import island from "./island.png";

const Ground = () => {
  return (
    <>
      <Sprite image={island} x={-340} y={-GROUND_LEVEL - 75} />
    </>
  );
};

export default Ground;
