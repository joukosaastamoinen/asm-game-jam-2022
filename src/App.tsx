import styled from "styled-components";
import { Texture } from "pixi.js";
import { Sprite, Stage } from "@saitonakamura/react-pixi";
import useSound from "use-sound";
import bunny from "./bunny.png";
import pop from "./pop.mp3";
import useWindowSize from "./useWindowSize";

const Root = styled.div`
  width: 100%;
  height: 100;
  canvas {
    display: block;
  }
`;

function App() {
  const [playPop] = useSound(pop);
  const [width, height] = useWindowSize();
  return (
    <Root
      onClick={() => {
        playPop();
      }}
    >
      <Stage
        options={{ backgroundColor: 0xff9977 }}
        width={width}
        height={height}
      >
        <Sprite texture={Texture.from(bunny)} x={200} y={200} />
      </Stage>
    </Root>
  );
}

export default App;
