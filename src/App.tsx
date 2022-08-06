import styled from "styled-components";
import { Stage } from "@saitonakamura/react-pixi";
import useWindowSize from "./useWindowSize";
import Game from "./Game";
import KeyboardProvider from "./keyboard/KeyboardProvider";
import useKeyboard from "./keyboard/useKeyboard";
import { useState } from "react";

const Root = styled.div`
  background-color: #000;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  canvas {
    display: block;
  }
`;

const StartButton = styled.button`
  font-family: monospace;
  margin: 0;
  padding: 20px 40px;
  appearance: none;
  background: #0f0;
  border: none;
  color: #000;
  font-size: 100px;
  cursor: pointer;
`;

function App() {
  const [started, setStarted] = useState(false);
  const [width, height] = useWindowSize();
  const keyboard = useKeyboard();
  return (
    <Root>
      {started ? (
        <Stage
          options={{ backgroundColor: 0xffcc99 }}
          width={width}
          height={height}
        >
          <KeyboardProvider keyboard={keyboard}>
            <Game canvasWidth={width} canvasHeight={height} />
          </KeyboardProvider>
        </Stage>
      ) : (
        <StartButton
          onClick={() => {
            setStarted(true);
          }}
        >
          Start
        </StartButton>
      )}
    </Root>
  );
}

export default App;
