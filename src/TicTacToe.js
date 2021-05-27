import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "papercss/dist/paper.css";
import { DIMS, SQUARE_DIMS } from "./constants";


function squareClass(size) {
  switch(size) {
    case 1: return "btn-danger";
    case 2: return "btn-secondary";
    case 3: return "btn-success";
    case 4: return "btn-warning";
    case 5: return "paper-btn btn-primary";
    case 6: return "disabled";
    default: return "button";
  }
}

function Square({ value, onClick, size}) {
  return (
    <button className={squareClass(size)} style={{width: '200px', height: '200px', fontSize:(46+(size*15))}} onClick={onClick}>
      {value}
    </button>
  );
}


function Marker({ value, size, onClick }) {
  return (
    <button className={squareClass(size)} style={{fontSize:(46+(size*15))}} onClick={onClick}>
      {value}
    </button>
  );
}


function Restart({ onClick }) {
  return (
    <button className="restart" onClick={onClick}>
      Play again
    </button>
  );
}

function Game() {
  const [ squares, setSquares ] = useState(Array(9).fill(null).map(row => new Array(2).fill(null)));
  const [ isXNext, setIsXNext ] = useState(true);
  const nextSymbol = isXNext ? "X" : "O";
  const winner = calculateWinner(squares,0);
  let currentMass = 0;
  const [ usedMarkers, setMarkersUsed ] = useState(Array(2).fill(0).map(row => new Array(5).fill(0)));
  //usedMarkers[0][] is O
  //usedMarkers[1][] is X

  function getStatus() {
    if (winner) {
      return "Winner: " + winner;
    } else if (isBoardFull(squares)) {
      return "Draw!";
    }
  }

  function renderSquare(i) {
    return (
      <Square
        value={squares[i][1]}
        onClick={() => {
          if (winner != null) {
            return;
          }
          if (squares[i][0] === 0 || squares[i][0] >= currentMass){
            console.log("You can't use that piece there.");
            return;
          }
          if (squares[i][1] === nextSymbol) {
            return;
          }
          const nextSquares = squares.slice();
          let markerUsed = usedMarkers.slice();
          nextSquares[i][0] = currentMass;
          nextSquares[i][1] = nextSymbol;
          setSquares(nextSquares);
          if(isXNext) {
            markerUsed[1][currentMass-1] = 1;
            setMarkersUsed(markerUsed);
          } else {
            markerUsed[0][currentMass-1] = 1;
            setMarkersUsed(markerUsed);
          }
          setIsXNext(!isXNext); // toggle turns
          currentMass = 0;
        }}
        size = {squares[i][0]}
      />
    );
  }

  function renderRestartButton() {
    return (
      <Restart
        onClick={() => {
          setSquares(Array(9).fill(null).map(row => new Array(2).fill(null)));
          setMarkersUsed(Array(2).fill(0).map(row => new Array(5).fill(0)));
          setIsXNext(true);
        }}
      />
    );
  }

  function renderPieces(nextSymbol,mass) {
    return (
      <Marker
        value={nextSymbol}
        size={mass}
        onClick={() => {
          currentMass = mass;
        }}
      />
    );
  }

  function loadPieces() {
    if(isXNext){
      return (
        <Fragment>
          {!usedMarkers[1][4] ? renderPieces(nextSymbol,5) : renderPieces(nextSymbol,6)}
          {!usedMarkers[1][3] ? renderPieces(nextSymbol,4) : renderPieces(nextSymbol,6)}
          {!usedMarkers[1][2] ? renderPieces(nextSymbol,3) : renderPieces(nextSymbol,6)}
          {!usedMarkers[1][1] ? renderPieces(nextSymbol,2) : renderPieces(nextSymbol,6)}
          {!usedMarkers[1][0] ? renderPieces(nextSymbol,1) : renderPieces(nextSymbol,6)}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {!usedMarkers[0][4] ? renderPieces(nextSymbol,5) : renderPieces(nextSymbol,6)}
          {!usedMarkers[0][3] ? renderPieces(nextSymbol,4) : renderPieces(nextSymbol,6)}
          {!usedMarkers[0][2] ? renderPieces(nextSymbol,3) : renderPieces(nextSymbol,6)}
          {!usedMarkers[0][1] ? renderPieces(nextSymbol,2) : renderPieces(nextSymbol,6)}
          {!usedMarkers[0][0] ? renderPieces(nextSymbol,1) : renderPieces(nextSymbol,6)}
        </Fragment>
      )
    }
  }

  function winningLine(){
    return calculateWinner(squares,1);
  }

  return (
    //<div className="container">
    <div>
    <Container dims={DIMS}>
      <div className="game">
        <div className="game-board">
          <Strikethrough
            styles={
              getStrikethroughStyles(winningLine())
            }
          />
          <div className="row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
      </div>
    </Container>
    <Container>
      <div style={{margin: '30px'}}>
          {loadPieces()}
      </div>
    </Container>
    <Container>
        <div className="game-info">{getStatus()}</div>
    </Container>
    <Container>
        <div className="restart-button">{renderRestartButton()}</div>
    </Container>
    </div>
  );
}

function calculateWinner(squares, isDraw) {
  const possibleLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  // go over all possibly winning lines and check if they consist of only X's/only O's
  for (let i = 0; i < possibleLines.length; i++) {
    const [a, b, c] = possibleLines[i];
    if (squares[a][1] && squares[a][1] === squares[b][1] && squares[a][1] === squares[c][1]) {
      if(isDraw){
        return i;
      } else {
        return squares[a][1]
      }
    }
  }
  return null;
}

function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i][1] == null) {
      return false;
    }
  }
  return true;
}

function getStrikethroughStyles(winningIndex) {
  console.log("winning line is: " + winningIndex);
  const defaultWidth = 500;
  const diagonalWidth = 700;
  switch (winningIndex) {
    case 0:
      return `
        background: indianred;
        transform: none;
        top: 100px;
        left: 55px;
        width: ${defaultWidth}px;
      `;
    case 1:
      return `
        background: indianred;
        transform: none;
        top: 305px;
        left: 55px;
        width: ${defaultWidth}px;
      `;
    case 2:
      return `
        background: indianred;
        transform: none;
        top: 520px;
        left: 55px;
        width: ${defaultWidth}px;
      `;
    case 3:
      return `
        transform: rotate(90deg);
        background: indianred;
        top: 320px;
        left: -145px;
        width: ${defaultWidth}px;
      `;
    case 4:
      return `
        transform: rotate(90deg);
        background: indianred;
        top: 320px;
        left: 55px;
        width: ${defaultWidth}px;
      `;
    case 5:
      return `
        transform: rotate(90deg);
        background: indianred;
        top: 320px;
        left: 255px;
        width: ${defaultWidth}px;
      `;
    case 6:
      return `
        transform: rotate(45deg);
        background: indianred;
        top: 320px;
        left: -20px;
        width: ${diagonalWidth}px;
      `;
    case 7:
      return `
        transform: rotate(-45deg);
        background: indianred;
        top: 312px;
        left: -45px;
        width: ${diagonalWidth}px;
      `;
    default:
      return null;
  }
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Strikethrough = styled.div`
  position: absolute;
  ${({ styles }) => styles}
  background: indianred;
  height: 5px;
  width: ${({ styles }) => !styles && "0px"};
`;

export default Game;