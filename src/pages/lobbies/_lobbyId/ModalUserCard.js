import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import get from "lodash/get";
import { ButtonAnt } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { BingoCard } from "./BingoCard";

export const ModalUserCard = (props) => {
  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      top="20%"
      padding="1rem"
      visible={props.isVisibleModalUserCard}
    >
      <Content>
        <div className="title-card">Cartilla{" "}{props.user.nickname}</div>
        <div className="card-container">
          <BingoCard user={props.user} {...props} />
        </div>
        <div className="btn-container">
          <ButtonAnt
            color="default"
            onClick={() => props.setIsVisibleModalUserCard(false)}
          >
            Cerrar
          </ButtonAnt>
        </div>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .title-card {
    font-family: Open Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 33px;
    margin: 1rem;
    color: ${props => props.theme.basic.secondary};
    text-align: center;
  }
  
  .card-container{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-container{
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
