import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { BingoCard } from "./BingoCard";
import { ButtonAnt } from "../../../../components/form";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

export const ModalFinalStage = (props) => {
  const [authUser] = useGlobal("user");

  const adminContent = () => (
    <AdminContent>
      <ButtonAnt color="secondary">Continuar juego</ButtonAnt>
      <ButtonAnt color="secondary">Apagón</ButtonAnt>
      <ButtonAnt color="secondary">Continuar con cartillas nuevas</ButtonAnt>
      <ButtonAnt color="secondary">Juego nuevo</ButtonAnt>
      <ButtonAnt color="danger">Finalizar juego</ButtonAnt>
    </AdminContent>
  );

  const userContent = () => (
    <UserContent>
      <div className="description">
        Esperando que el administrador continue el juego...
      </div>
      <Image
        src={`${config.storageUrl}/resources/pacman.gif`}
        height="85px"
        width="85px"
        size="contain"
        margin="1rem auto"
      />
    </UserContent>
  );

  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      top="20%"
      width="600px"
      visible={props.isVisibleModalFinal}
    >
      <Content>
        <div className="title">Ganador</div>
        <div className="main-container">
          <div className="left-container">
            <div className="winner-name">
              {props.lobby.winners[props.lobby.winners.length - 1].nickname}
            </div>
            <div className="card-container">
              <BingoCard
                user={props.lobby.winners[props.lobby.winners.length - 1]}
                {...props}
              />
            </div>
          </div>
          <div className="right-container">
            {props.lobby.winners[props.lobby.winners.length - 1].award && (
              <>
                <div className="award">Premio</div>
                <div className="award-name">
                  {
                    props.lobby.winners[props.lobby.winners.length - 1].award
                      .name
                  }
                </div>
              </>
            )}
            {authUser.isAdmin ? adminContent() : userContent()}
          </div>
        </div>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .title {
    text-align: center;
    font-family: Open Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 49px;
    color: ${(props) => props.theme.basic.secondary};
  }

  .main-container {
    display: flex;
    flex-direction: column;

    .left-container {
      .winner-name {
        font-family: Open Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin-bottom: 2rem;
        text-align: center;
      }
      .card-container {
        max-width: 200px;
        margin: 0 auto;
      }
    }
    .right-container {
      .award {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin: 0.5rem 0;
        text-align: center;
      }

      .award-name {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        margin: 0.5rem 0;
        text-align: center;
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .main-container {
      display: grid;
      grid-template-columns: 320px auto;
      grid-gap: 0.5rem;

      .left-container {
        .winner-name {
          text-align: left;
        }
        .card-container {
          max-width: 320px;
        }
      }
      .right-container {
        .award,
        .award-name {
          text-align: end;
        }
      }
    }
  }
`;

const AdminContent = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  flex-direction: column;
  height: 80%;

  button {
    width: 90%;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin: 0.5rem auto;
  }

  ${mediaQuery.afterTablet} {
    button {
      margin: 0.5rem 0;
    }
  }
`;

const UserContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  flex-direction: column;
  height: 80%;

  .description {
    word-wrap: break-word;
    text-align: center;
    font-family: Encode Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    max-width: 100%;
  }
`;
