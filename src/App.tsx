import styled from "styled-components";
import useWindowSize from "./useWindowSize";
import Game from "./Game";
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
  return (
    <Root>
      {started ? (
        <Game canvasWidth={width} canvasHeight={height} />
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
