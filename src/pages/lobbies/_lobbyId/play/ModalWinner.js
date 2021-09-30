import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import get from "lodash/get";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

export const ModalWinner = (props) => {
  const [authUser] = useGlobal("user");

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
        {authUser.isAdmin ? (
          <div className="btn-container">
            <ButtonAnt
              color="default"
              onClick={() => props.setIsVisibleModalWinner(false)}
            >
              Cerrar
            </ButtonAnt>
          </div>
        ) : (
          <div className="user-waiting">
            <Image
              src={`${config.storageUrl}/resources/pacman.gif`}
              height="75px"
              width="75px"
              size="contain"
              margin="1rem auto"
            />
            <div className="description">
              Esperando que el administrador continúe el juego...
            </div>
          </div>
        )}
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

  .user-waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: ${(props) => props.theme.basic.blackDarken};
    }
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
