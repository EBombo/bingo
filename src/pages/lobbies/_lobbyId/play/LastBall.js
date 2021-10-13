import React from "reactn";
import styled from "styled-components";
import { config, firestore } from "../../../../firebase";
import get from "lodash/get";
import { BOARD_PARAMS, createBoard } from "../../../../business";

export const LastBall = (props) => {
  return (
    <LastBallContainer number={props.lastNumber} vertical={props.vertical}>
      <div className="ball-container">
        <div className="middle-container">
          <div className="inner-container">
            <div className="letter">
              {props.lastNumber === 0
                ? 0
                : props.lastNumber < BOARD_PARAMS.B.value
                ? get(props, "lobby.game.letters.b", "B")
                : props.lastNumber < BOARD_PARAMS.I.value
                ? get(props, "lobby.game.letters.i", "I")
                : props.lastNumber < BOARD_PARAMS.N.value
                ? get(props, "lobby.game.letters.n", "N")
                : props.lastNumber < BOARD_PARAMS.G.value
                ? get(props, "lobby.game.letters.g", "G")
                : get(props, "lobby.game.letters.o", "O")}
            </div>
            <div className="number">{props.lastNumber}</div>
          </div>
        </div>
      </div>
    </LastBallContainer>
  );
};

const LastBallContainer = styled.div`
  width: ${(props) => (props.vertical ? "125px" : "100%")};
  height: ${(props) => (props.vertical ? "190px" : "130px")};
  background: #221545;
  box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  padding: 5px;
  display: ${(props) => (props.vertical ? "flex-start" : "center")};
  max-width: 200px;

  .ball-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${(props) =>
      props.number < 16
        ? props.theme.ballsColors.b
        : props.number < 31
        ? props.theme.ballsColors.i
        : props.number < 46
        ? props.theme.ballsColors.n
        : props.number < 61
        ? props.theme.ballsColors.g
        : props.theme.ballsColors.o};
    position: relative;
    .middle-container {
      width: 77%;
      height: 77%;
      border-radius: 50%;
      background: ${(props) =>
        props.number < 16
          ? props.theme.ballsColors.borderB
          : props.number < 31
          ? props.theme.ballsColors.borderI
          : props.number < 46
          ? props.theme.ballsColors.borderN
          : props.number < 61
          ? props.theme.ballsColors.borderG
          : props.theme.ballsColors.borderO};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .inner-container {
      width: 75%;
      height: 75%;
      border-radius: 50%;
      background: linear-gradient(191.91deg, #ffffff 7.17%, #ededed 91.29%);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .number,
      .letter {
        font-family: "Lato", sans-serif;
        font-style: normal;
        font-weight: bold;
        font-style: normal;
        font-size: 22px;
        line-height: 24px;
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .options {
    .btn-container {
      margin: 0.5rem !important;
    }
  }
`;
