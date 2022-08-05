import styled from "styled-components";
import { Container, Stage } from "@saitonakamura/react-pixi";
import useSound from "use-sound";
import pop from "./pop.mp3";
import useWindowSize from "./useWindowSize";
import Game from "./Game";

const Root = styled.div`
  width: 100%;
  height: 100;
  canvas {
    display: block;
  }
`;

// Hack around incorrect types in react-pixi
const C = Container as any;

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
        options={{ backgroundColor: 0xffcc99 }}
        width={width}
        height={height}
      >
        <C position={[width / 2, height / 2 + 200]}>
          <Game />
        </C>
      </Stage>
    </Root>
  );
}

export default App;
