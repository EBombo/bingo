import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { BOARD_PARAMS } from "../../../../business";
import { timeoutPromise } from "../../../../utils/promised";

export const LastPlays = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");
  const [lastPlays, setLastPlays] = useState(props.lobby?.lastPlays?.slice(0, 4) || []);

  useEffect(() => {
    const initialize = async () => {
      const newLastPlays = props.lobby?.lastPlays?.slice(0, 4) || [];

      newLastPlays?.length && (await timeoutPromise(animationSpeed * 1000));

      setLastPlays(newLastPlays);
    };

    initialize();
  }, [props.lobby?.lastPlays]);

  return (
    <Container>
      <div className="balls">
        {lastPlays.map((number) => (
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
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  .balls {
    display: flex;
    align-items: center;
    height: 70px;
    background: #221545;
    box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);
    border-radius: 100px;
    padding: 5px;
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

const BallContainer = styled.div`
  width: 55px;
  height: 55px;
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
  margin: 0 5px 0 0;

  .middle-container {
    width: 38px;
    height: 38px;
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
    width: 35px;
    height: 35px;
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
      font-family: Lato;
      font-style: normal;
      font-size: 12px;
      line-height: 14px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }
`;
