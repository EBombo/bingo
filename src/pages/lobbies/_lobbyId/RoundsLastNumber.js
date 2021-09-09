import React from "reactn";
import styled from "styled-components";

export const RoundsLastNumber = (props) => {
  return (
    <Container>
      <div className="item">
        <div className="number">{props.round}</div>
        <div className="description">Número de rondas</div>
      </div>
      <div className="item">
        <div className="number">{props.lastNumber}</div>
        <div className="description">Jugada anterior</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 0.5rem 1rem;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    .number {
      font-size: 70px;
      line-height: 85px;
      color: ${(props) => props.theme.basic.primary};
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.whiteLight};
    }
  }
`;
