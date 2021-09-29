import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt, Input } from "../../../../components/form";
import { mediaQuery, Tablet, Desktop } from "../../../../constants";
import { BingoCard } from "./BingoCard";
import { BingoBoard } from "./BingoBoard";
import { firestore } from "../../../../firebase";
import defaultTo from "lodash/defaultTo";

export const ModalUserCard = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleAssignAward, setIsVisibleAssignAward] = useState(false);
  const [awardSelected, setAwardSelected] = useState(null);

  const disqualifyUser = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
    });
  };

  const saveBingoWinner = async () => {
    const winners = props.lobby.winners
      ? [...props.lobby.winners, props.user]
      : [{ ...props.user, award: awardSelected }];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      winners,
      updateAt: new Date(),
    });
  };

  const modalContent = () => {
    if (isVisibleAssignAward && props.user?.id === props.lobby?.bingo.id) {
      return (
        <ModalContainer
          background="#FAFAFA"
          footer={null}
          closable={false}
          top="20%"
          padding="1rem"
          visible={props.isVisibleModalUserCard}
        >
          <ContentAward>
            <div className="award-content">
              <div className="first-content">
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
              </div>
              {props.lobby.settings.awards && (
                <div className="second-content">
                  <div className="subtitle">Escoge el premio</div>
                  <div className="awards">
                    {props.lobby.settings.awards.map((award, index) => (
                      <div
                        className="award-content"
                        key={`${award.name}-${index}`}
                      >
                        <input
                          type="checkbox"
                          name="award[1][]"
                          className="input-checkbox"
                          value={index}
                          checked={award.name === awardSelected?.name}
                          onChange={() => setAwardSelected(award)}
                        />
                        <label>{award.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="btns-container">
              <ButtonAnt
                color="default"
                onClick={() => props.setIsVisibleModalUserCard(false)}
              >
                Volver
              </ButtonAnt>
              <ButtonAnt onClick={() => saveBingoWinner()}>Bingo</ButtonAnt>
            </div>
          </ContentAward>
        </ModalContainer>
      );
    }

    switch (props.user?.id) {
      case defaultTo(props.lobby?.bingo?.id, ""):
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
                    <ButtonAnt onClick={() => setIsVisibleAssignAward(true)}>
                      Bingo
                    </ButtonAnt>
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
                  <ButtonAnt onClick={() => setIsVisibleAssignAward(true)}>
                    Bingo
                  </ButtonAnt>
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

const ContentAward = styled.div`
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

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  .second-content {
    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .awards {
      display: flex;
      flex-direction: column;

      .award-content {
        display: flex;
        align-items: center;
        margin: 0.5rem 0;

        label {
          color: ${(props) => props.theme.basic.blackDarken};
          font-family: Lato;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 16px;
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .award-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: center;
      grid-gap: 1rem;
    }
  }
`;

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