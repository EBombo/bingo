import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { BingoCard } from "./BingoCard";
import { BingoBoard } from "./BingoBoard";
import { firestore } from "../../../../firebase";
import defaultTo from "lodash/defaultTo";

export const ModalUserCard = (props) => {
  const [authUser] = useGlobal("user");

  const disqualifyUser = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
    });
  };

  const validateBingo = async () => {
    const winners = props.lobby.winners
      ? [...props.lobby.winners, props.user]
      : [props.user];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      winners,
      updateAt: new Date(),
    });
  };

  const modalContent = () => {
    switch (props.user?.id) {
      case defaultTo(props.lobby.bingo.id, ""):
        return (
          <ModalContainer
            background="#FAFAFA"
            footer={null}
            closable={false}
            top="20%"
            padding="1rem"
            visible={props.isVisibleModalUserCard}
            width="1100px"
          >
            <ContainerValidate>
              <Desktop>
                <div className="board-container">
                  <BingoBoard {...props} />
                  <div className="action-container">
                    <ButtonAnt
                      color="default"
                      onClick={() => props.setIsVisibleModalUserCard(false)}
                    >
                      Volver
                    </ButtonAnt>
                    <ButtonAnt onClick={() => validateBingo()}>Bingo</ButtonAnt>
                  </div>
                </div>
                <div className="card-container">
                  <div className="top-container">
                    <div className="name">{props.user.nickname}</div>
                    <div className="btn-container">
                      <ButtonAnt
                        color="danger"
                        className="disqualify"
                        onClick={() => disqualifyUser()}
                      >
                        Descalificar
                      </ButtonAnt>
                    </div>
                  </div>
                  <BingoCard user={props.user} {...props} />
                </div>
              </Desktop>
              <Tablet>
                <div className="top-container">
                  <div className="name">{props.user.nickname}</div>
                  <div className="btn-container">
                    <ButtonAnt
                      color="danger"
                      className="disqualify"
                      onClick={() => disqualifyUser()}
                    >
                      Descalificar
                    </ButtonAnt>
                  </div>
                </div>
                <div className="card-container">
                  <BingoCard user={props.user} {...props} />
                </div>
                <div className="board-container">
                  <BingoBoard {...props} />
                </div>
                <div className="action-container">
                  <ButtonAnt
                    color="default"
                    onClick={() => props.setIsVisibleModalUserCard(false)}
                  >
                    Volver
                  </ButtonAnt>
                  <ButtonAnt onClick={() => validateBingo()}>Bingo</ButtonAnt>
                </div>
              </Tablet>
            </ContainerValidate>
          </ModalContainer>
        );

      default:
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
              <div className="title-card">Cartilla {props.user.nickname}</div>
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
    }
  };

  return modalContent();
};

const ContainerValidate = styled.div`
  .top-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;

    .btn-container {
      .disqualify {
        font-family: Lato !important;
        font-style: normal !important;
        font-weight: bold !important;
        font-size: 12px !important;
        line-height: 14px !important;
        padding: 5px 10px !important;
      }
    }

    .name {
      font-family: Open Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .card-container {
    max-width: 200px;
    margin: 1rem auto;
  }

  .board-container {
    max-width: 100%;
    overflow: auto;
  }

  .action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .card-container {
      max-width: 320px;
    }

    .board-container {
      width: 650px;
      max-width: 650px;
    }
  }
`;

const Content = styled.div`
  width: 100%;

  .title-card {
    font-family: Open Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 33px;
    margin: 1rem;
    color: ${(props) => props.theme.basic.secondary};
    text-align: center;
  }

  .card-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-container {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${mediaQuery.afterTablet} {
    .title-card {
      font-size: 30px;
      line-height: 41px;
    }
  }
`;
