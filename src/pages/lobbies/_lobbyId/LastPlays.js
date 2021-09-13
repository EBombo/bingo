import React from "reactn";
import styled from "styled-components";

export const LastPlays = (props) => {
  return (
    <Container>
      <div className="balls">
        {props.lastNumbers.map((number) => (
          <BallContainer number={number}>
            <div className="inner-container">
              <div className="letter">B</div>
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
  width: 100%;
  max-width: 450px;
  
  .balls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .label{
    margin: 0.5rem 0;
    font-family: Lato;
    font-style: italic;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    color: #A3A3A3;
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
