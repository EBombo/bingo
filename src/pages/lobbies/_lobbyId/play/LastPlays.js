import React, { useEffect, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import get from "lodash/get";
import { ANIMATION, BOARD_PARAMS } from "../../../../business";
import { timeoutPromise } from "../../../../utils/promised";
import { mediaQuery } from "../../../../constants";
import { fadeInLeft } from "react-animations";
import defaultTo from "lodash/defaultTo";
import { useMemo } from "react";

export const LastPlays = (props) => {
  const currentLastPlays = useMemo(() => {
    // Prevent work as a pointer.
    let lastBalls = [...(props.lobby?.lastPlays || [])];
    // Prevent delete undefined.
    lastBalls.length ? lastBalls.shift() : [];

    return lastBalls;
  }, [props.lobby?.lastPlays]);

  const [lastPlays, setLastPlays] = useState(currentLastPlays);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return setIsLoading(false);

    const initialize = async () => {
      await timeoutPromise((ANIMATION.max - defaultTo(props.lobby.animationSpeed, ANIMATION.default)) * 1000);

      // Update local lastPlays.
      setLastPlays(currentLastPlays);
    };

    initialize();
  }, [props.lobby?.lastPlays]);

  return (
    <Container>
      <div className="balls">
        {lastPlays.slice(0, 4).map((number) => (
          <BallContainer number={number} key={number}>
            <div className="middle-container">
              <div className="inner-container">
                <div className="letter">
                  {number < BOARD_PARAMS.B.value
                    ? get(props, "lobby.game.letters.b", "B")
                    : number < BOARD_PARAMS.I.value
                    ? get(props, "lobby.game.letters.i", "I")
                    : number < BOARD_PARAMS.N.value
                    ? get(props, "lobby.game.letters.n", "N")
                    : number < BOARD_PARAMS.G.value
                    ? get(props, "lobby.game.letters.g", "G")
                    : get(props, "lobby.game.letters.o", "O")}
                </div>
                <div className="number">{number}</div>
              </div>
            </div>
          </BallContainer>
        ))}
      </div>
      {props.showMore && (
        <div className="balls">
          {lastPlays.slice(4, 8).map((number) => (
            <BallContainer number={number} key={number}>
              <div className="middle-container">
                <div className="inner-container">
                  <div className="letter">
                    {number < BOARD_PARAMS.B.value
                      ? get(props, "lobby.game.letters.b", "B")
                      : number < BOARD_PARAMS.I.value
                      ? get(props, "lobby.game.letters.i", "I")
                      : number < BOARD_PARAMS.N.value
                      ? get(props, "lobby.game.letters.n", "N")
                      : number < BOARD_PARAMS.G.value
                      ? get(props, "lobby.game.letters.g", "G")
                      : get(props, "lobby.game.letters.o", "O")}
                  </div>
                  <div className="number">{number}</div>
                </div>
              </div>
            </BallContainer>
          ))}
        </div>
      )}
      {props.showMore && (
        <div className="balls">
          {lastPlays.slice(8, 12).map((number) => (
            <BallContainer number={number} key={number}>
              <div className="middle-container">
                <div className="inner-container">
                  <div className="letter">
                    {number < BOARD_PARAMS.B.value
                      ? get(props, "lobby.game.letters.b", "B")
                      : number < BOARD_PARAMS.I.value
                      ? get(props, "lobby.game.letters.i", "I")
                      : number < BOARD_PARAMS.N.value
                      ? get(props, "lobby.game.letters.n", "N")
                      : number < BOARD_PARAMS.G.value
                      ? get(props, "lobby.game.letters.g", "G")
                      : get(props, "lobby.game.letters.o", "O")}
                  </div>
                  <div className="number">{number}</div>
                </div>
              </div>
            </BallContainer>
          ))}
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .balls {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 3px;
    align-items: center;
    height: 53px;
    background: ${(props) => props.theme.basic.secondaryDarken};
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.25);
    border-radius: 100px;
    padding: 5px;
    margin: 0 auto;
    overflow: hidden;
    max-width: 200px;
  }

  ${mediaQuery.afterTablet} {
    .balls {
      max-width: 250px;
      height: 70px;
      grid-gap: 3px;
    }
  }

  .label {
    margin: 0.5rem 0;
    font-family: Lato;
    font-style: italic;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: #a3a3a3;
  }
`;

const slideInLeftAnimation = keyframes`${fadeInLeft}`;

const BallContainer = styled.div`
  width: 100%;
  height: 100%;
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
  animation: 1s ${slideInLeftAnimation};
  position: relative;

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
      font-size: 9px;
      line-height: 11px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    .inner-container {
      .number,
      .letter {
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
`;
