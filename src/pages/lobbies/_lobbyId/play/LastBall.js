import React, { useEffect, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import get from "lodash/get";
import { ANIMATION, BOARD_PARAMS } from "../../../../business";
import { fadeInDownBig, fadeInLeftBig, fadeOutDownBig, fadeOutRightBig } from "react-animations";
import { timeoutPromise } from "../../../../utils/promised";
import defaultTo from "lodash/defaultTo";

export const LastBall = (props) => {
  const [lastNumber, setLastNumber] = useState(props.lastPlays?.[0] ?? null);
  const [outEffect, setOutEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return setIsLoading(false);
    // Prevent re render.
    if (props.lastPlays?.[0] === lastNumber) return;

    const initializeAnimation = async () => {
      await timeoutPromise((ANIMATION.max - defaultTo(props.animationSpeed, ANIMATION.default)) * 1000);

      setOutEffect(true);

      await timeoutPromise(500);

      setOutEffect(false);

      setLastNumber(props.lastPlays?.[0] ?? null);
    };

    initializeAnimation();
  }, [props.lastPlays]);

  return (
    <LastBallContainer number={lastNumber} vertical={props.vertical} outEffect={outEffect} {...props}>
      {lastNumber && (
        <div className="ball-container">
          <div className="middle-container">
            <div className="inner-container">
              <div className="letter">
                {lastNumber < BOARD_PARAMS.B.value
                  ? get(props, "lobby.game.letters.b", "B")
                  : lastNumber < BOARD_PARAMS.I.value
                  ? get(props, "lobby.game.letters.i", "I")
                  : lastNumber < BOARD_PARAMS.N.value
                  ? get(props, "lobby.game.letters.n", "N")
                  : lastNumber < BOARD_PARAMS.G.value
                  ? get(props, "lobby.game.letters.g", "G")
                  : get(props, "lobby.game.letters.o", "O")}
              </div>
              <div className="number">{lastNumber}</div>
            </div>
          </div>
        </div>
      )}
    </LastBallContainer>
  );
};

const slideInLeftAnimation = keyframes`${fadeInLeftBig}`;
const slideOutRightAnimation = keyframes`${fadeOutRightBig}`;

const slideInDownAnimation = keyframes`${fadeInDownBig}`;
const slideOutDownAnimation = keyframes`${fadeOutDownBig}`;

const LastBallContainer = styled.div`
  width: ${(props) => (props.vertical ? "125px" : "200px")};
  height: ${(props) =>
    props.size === "small" ? (props.vertical ? "150px" : "100px") : props.vertical ? "190px" : "130px"};
  background: #221545;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  padding: 5px;
  margin: 0 auto;
  display: ${(props) => (props.vertical ? "flex-start" : "center")};
  clip-path: ${(props) => (props.vertical ? "ellipse(62% 51% at 50% 50%)" : "ellipse(50% 60% at 50% 50%)")};

  .ball-container {
    width: ${(props) => (props.size === "small" ? "90px" : "120px")};
    height: ${(props) => (props.size === "small" ? "90px" : "120px")};
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
    animation: 1s
      ${(props) =>
        props.vertical
          ? props.outEffect
            ? slideOutDownAnimation
            : slideInDownAnimation
          : props.outEffect
          ? slideOutRightAnimation
          : slideInLeftAnimation};

    .middle-container {
      width: 72%;
      height: 72%;
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
      width: 85%;
      height: 85%;
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
        font-weight: bold;
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
