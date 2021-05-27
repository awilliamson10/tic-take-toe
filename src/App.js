import React from "react";
import styled from "styled-components";
import "papercss/dist/paper.min.css";
import Game from "./TicTacToe";

function App() {
  return (
    <Main>
      {Game()}
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default App;