import React from "reactn";
import styled from "styled-components";
import { config, firestore } from "../../../../firebase";
import get from "lodash/get";
import { BOARD_PARAMS, createBoard } from "../../../../business";

export const LastBall = (props) => {
  return (
    <LastBallContainer
      hiddenOptions={props.hiddenOptions}
      number={props.lastNumber}
      green={`${config.storageUrl}/resources/balls/green-ball.png`}
      blue={`${config.storageUrl}/resources/balls/blue-ball.png`}
      orange={`${config.storageUrl}/resources/balls/orange-ball.png`}
      yellow={`${config.storageUrl}/resources/balls/yellow-ball.png`}
      red={`${config.storageUrl}/resources/balls/red-ball.png`}
    >
      <div className="ball-container">
        <p>
          {props.lastNumber < BOARD_PARAMS.B.value
            ? get(props, "lobby.game.letters.b", "B")
            : props.lastNumber < BOARD_PARAMS.I.value
            ? get(props, "lobby.game.letters.i", "I")
            : props.lastNumber < BOARD_PARAMS.N.value
            ? get(props, "lobby.game.letters.n", "N")
            : props.lastNumber < BOARD_PARAMS.G.value
            ? get(props, "lobby.game.letters.g", "G")
            : get(props, "lobby.game.letters.o", "O")}
        </p>
        <p>{props.lastNumber}</p>
      </div>
    </LastBallContainer>
  );
};

const LastBallContainer = styled.div`
  width: 100%;
  height: 130px;
  background: #221545;
  box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  padding: 5px;
  display: flex;
  align-items: center;
  max-width: 200px;

  .ball-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-image: url("${(props) =>
      props.number < 16
        ? props.green
        : props.number < 31
        ? props.blue
        : props.number < 46
        ? props.orange
        : props.number < 61
        ? props.yellow
        : props.red}");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p {
      margin: 0;
    }
  }

  .options {
    .btn-container {
      margin: 0.5rem !important;
    }
  }
`;
