import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import get from "lodash/get";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";

export const ModalWinner = (props) => {
  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      top="20%"
      visible={props.isVisibleModalWinner}
    >
      <WinnerContainer>
        <div className="title">¡Bingo!</div>
        <div className="name">{get(props, "winner.nickname", "")}</div>
        <div className="btn-container">
          <ButtonAnt
            color="default"
            onClick={() => props.setIsVisibleModalWinner(false)}
          >
            Cerrar
          </ButtonAnt>
        </div>
      </WinnerContainer>
    </ModalContainer>
  );
};

const WinnerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 64px;
    line-height: 77px;
    color: ${(props) => props.theme.basic.secondary};
  }

  .name {
    font-family: Open Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 33px;
    margin: 70px 0;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 96px;
      line-height: 115px;
    }

    .name {
      font-size: 36px;
      line-height: 49px;
    }
  }
`;
