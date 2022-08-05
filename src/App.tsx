import styled from "styled-components";
import { Container, Stage } from "@saitonakamura/react-pixi";
import useSound from "use-sound";
import gunSound from "./pew1.mp3";
import useWindowSize from "./useWindowSize";
import Game from "./Game";
import KeyboardProvider from "./keyboard/KeyboardProvider";
import useKeyboard from "./keyboard/useKeyboard";

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
  const [playPop] = useSound(gunSound);
  const [width, height] = useWindowSize();
  const keyboard = useKeyboard();
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
        <KeyboardProvider keyboard={keyboard}>
          <C position={[width / 2, height / 2 + 200]}>
            <Game />
          </C>
        </KeyboardProvider>
      </Stage>
    </Root>
  );
}

export default App;
