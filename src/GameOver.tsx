import styled from "styled-components";

type Props = {
  onRestart: () => void;
};

const Root = styled.div`
  user-select: none;
  position: fixed;
  top: 50vh;
  left: 50vw;
  width: 100%;
  padding: 20px;
  font-size: 100px;
  font-family: sans-serif;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  padding: 20px;
  background: red;
  color: black;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 20;
`;

const GameOver = ({ onRestart }: Props) => {
  return (
    <Root>
      Game over :(
      <Button
        onClick={() => {
          onRestart();
        }}
      >
        Restart
      </Button>
    </Root>
  );
};

export default GameOver;
