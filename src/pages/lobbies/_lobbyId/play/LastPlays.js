import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { BOARD_PARAMS } from "../../../../business";
import { timeoutPromise } from "../../../../utils/promised";

export const LastPlays = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");
  const [lastPlays, setLastPlays] = useState(
    props.lobby?.lastPlays?.slice(0, 5) || []
  );

  useEffect(() => {
    const initialize = async () => {
      const newLastPlays = props.lobby?.lastPlays?.slice(0, 5) || [];

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
          </BallContainer>
        ))}
      </div>

      <div className="label">útilmas 5 jugadas</div>
    </Container>
  );
};

const Container = styled.div`
  width: 430px;

  .balls {
    display: flex;
    align-items: center;
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid
    ${(props) =>
      props.number < 16
        ? props.theme.ballsColors.b
        : props.number < 31
        ? props.theme.ballsColors.i
        : props.number < 46
        ? props.theme.ballsColors.n
        : props.number < 61
        ? props.theme.ballsColors.g
        : props.theme.ballsColors.o};
  background: ${(props) => props.theme.basic.white};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;

  .inner-container {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: ${(props) => props.theme.basic.blackDarken};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .number,
    .letter {
      font-family: Encode Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;
