import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { darkTheme } from "../../theme";
import { ButtonAnt } from "../../components/form";

export const ModalVerification = (props) => (
  <ModalContainer
    footer={null}
    closable={false}
    visible={props.isVisibleModalVerification}
    padding={"1rem"}
    top={"20%"}
    background={darkTheme.basic.whiteLight}
    onCancel={() => props.setIsVisibleModalVerification(props.email)}
  >
    <ContentModal>
      <div className="title">Identificación del jugador grabada</div>
      <div className="description">
        La próxima vez que jueges no va a ser necesario que coloques tu
        identificación de jugador otra vez, asi que puedes ingresar rápidamente.
        Lo puedes cambiar en ajustes en cualquier momento.
      </div>
      <ButtonAnt
        variant={"primary"}
        width={"200px"}
        margin={"1rem auto"}
        onClick={() => props.setIsVisibleModalVerification(props.email)}
      >
        Ok
      </ButtonAnt>
    </ContentModal>
  </ModalContainer>
);

const ContentModal = styled.div`
  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .description {
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
  }
`;
