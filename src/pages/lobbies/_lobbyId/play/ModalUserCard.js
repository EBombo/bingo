import React, { useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { UserCard } from "./UserCard";
import { BingoBoard } from "./BingoBoard";
import { config, firestore } from "../../../../firebase";
import defaultTo from "lodash/defaultTo";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";

export const ModalUserCard = (props) => {
  const [isVisibleAssignAward, setIsVisibleAssignAward] = useState(false);
  const [awardSelected, setAwardSelected] = useState(null);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);

  const disqualifyUser = async () => {
    props.setIsVisibleModalUserCard(false);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
    });
  };

  const bannedUser = async () => {
    props.setIsVisibleModalUserCard(false);

    const bannedUsersId = [...defaultTo(props.lobby.bannedUsersId, []), props.user.id];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      updateAt: new Date(),
      bannedUsersId,
    });
  };

  const saveBingoWinner = async () => {
    const winners = props.lobby.winners
      ? [...props.lobby.winners, { ...props.user, award: awardSelected }]
      : [{ ...props.user, award: awardSelected }];

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: null,
      winners,
      finalStage: true,
      updateAt: new Date(),
    });

    const roundsRef = firestore.collection("lobbies").doc(props.lobby?.id).collection("rounds");

    const newRoundId = roundsRef.doc().id;

    const _lobby = props.lobby;

    delete _lobby.settings;
    delete _lobby.game;
    delete _lobby.finalStage;
    delete _lobby.bingo;
    delete _lobby.createAt;
    delete _lobby.startAt;

    await roundsRef.doc(newRoundId).set(
      {
        ...props.lobby,
        endGame: new Date(),
        round: winners?.length,
        id: newRoundId,
      },
      { merge: true }
    );

    const promiseUsers = Object.values(props.lobby.users).map(async (user) => {
      await firestore
        .collection("lobbies")
        .doc(props.lobby?.id)
        .collection("users")
        .doc(user.id)
        .update({
          rounds: [...defaultTo(user.rounds, []), { myWinningCard: user.myWinningCard, card: user.card }],
        });
    });

    await Promise.all(promiseUsers);

    props.setIsVisibleModalUserCard(false);
  };

  const modalContent = () => {
    if (isVisibleAssignAward && props.lobby.bingo && props.user.id === props.lobby.bingo.id) {
      return (
        <ModalContainer
          background="#331E6C"
          footer={null}
          closable={false}
          topDesktop="10%"
          width="650px"
          visible={props.isVisibleModalUserCard}
        >
          <StyledRibbon>
            <div className="w-full text-blackDarken text-['Lato'] font-[900] text-[14px] leading-[17px] text-center">
              {props.user.nickname}
            </div>
          </StyledRibbon>
          <ContentAward {...props}>
            <div className="main-content-award">
              <div className="w-full">
                <div className="w-full flex justify-end mb-4">
                  <ButtonAnt color="default" margin="0 10px 0 0" onClick={() => setIsVisibleAssignAward(false)}>
                    Volver
                  </ButtonAnt>
                </div>
                <UserCard user={props.user} {...props} />
              </div>
              {props.lobby.settings.awards && (
                <div className="my-4 md:my-0">
                  <div className="text-['Lato'] font-bold text-[13px] leading-[16px] text-white">Escoge el premio</div>
                  <div className="flex flex-col my-2">
                    {props.lobby.settings.awards.map((award, index) => (
                      <div className="flex items-center my-2 " key={`${award.name}-${index}`}>
                        <input
                          id={`radio${index}`}
                          type="radio"
                          className="input-radio opacity-0 absolute h-8 w-8"
                          value={index}
                          checked={`${award.name}-${index}` === `${awardSelected?.name}-${awardSelected?.index}`}
                          onChange={() => setAwardSelected({ ...award, index })}
                        />

                        <label
                          htmlFor={`radio${index}`}
                          className="flex items-center cursor-pointer text-xl cursor-pointer"
                        >
                          <span className="w-4 h-4 inline-block mr-2 rounded-full bg-gray flex-no-shrink"></span>
                          <div className="text-['Lato'] font-bold text-[13px] leading-[16px] text-white">
                            {award.name}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center my-4">
              <ButtonAnt color="success" onClick={() => saveBingoWinner()}>
                Anunciar
              </ButtonAnt>
            </div>
          </ContentAward>
        </ModalContainer>
      );
    }

    switch (props.user?.id) {
      case defaultTo(props.lobby?.bingo?.id, ""):
        return (
          <ModalContainer
            background="#331E6C"
            footer={null}
            closable={false}
            topDesktop="20%"
            padding="1rem"
            visible={props.isVisibleModalUserCard}
            width="1200px"
          >
            <StyledRibbon>
              <div className="w-full text-blackDarken text-['Lato'] font-[900] text-[14px] leading-[17px] text-center">
                {props.user.nickname}
              </div>
            </StyledRibbon>
            <div className="mt-[50px] md:grid grid-cols-[300px_auto] gap-4 items-center">
              <ModalConfirm
                isVisibleModalConfirm={isVisibleModalConfirm}
                setIsVisibleModalConfirm={setIsVisibleModalConfirm}
                title="El usuario sera bloqueado permanentemente. ¿Deseas continuar?"
                description={"Si vuelves no se guardaran los cambios."}
                action={() => bannedUser()}
                buttonName={"Suspender"}
                {...props}
              />
              <Desktop>
                <UserCard user={props.user} {...props} />

                <div>
                  <div className="mb-2">
                    <BingoBoard {...props} isView isVisible />
                  </div>
                  <div className="action-container flex items-center justify-between">
                    <ButtonAnt color="success" onClick={() => setIsVisibleAssignAward(true)}>
                      Bingo
                    </ButtonAnt>
                    <div className="flex items-center">
                      <ButtonAnt color="warning" className="disqualify" margin="0 5px" onClick={() => disqualifyUser()}>
                        Invalidar
                      </ButtonAnt>
                      <ButtonAnt color="danger" className="disqualify" onClick={() => setIsVisibleModalConfirm(true)}>
                        Suspender
                      </ButtonAnt>
                    </div>
                  </div>
                </div>
              </Desktop>
              <Tablet>
                <div className="mt-[50px]">
                  <UserCard user={props.user} {...props} />
                </div>

                <div className="my-2">
                  <BingoBoard {...props} isView isVisible />
                </div>

                <div className="my-2 flex justify-center">
                  <ButtonAnt color="success" onClick={() => setIsVisibleAssignAward(true)}>
                    Bingo
                  </ButtonAnt>
                </div>

                <div className="flex items-center justify-center">
                  <ButtonAnt color="warning" className="disqualify" margin="1rem 10px" onClick={() => disqualifyUser()}>
                    Invalidar
                  </ButtonAnt>
                  <ButtonAnt color="danger" className="disqualify" onClick={() => setIsVisibleModalConfirm(true)}>
                    Suspender
                  </ButtonAnt>
                </div>
              </Tablet>
            </div>
          </ModalContainer>
        );

      default:
        return (
          <ModalContainer
            background="#FAFAFA"
            footer={null}
            closable={false}
            topDesktop="20%"
            padding="1rem"
            visible={props.isVisibleModalUserCard}
          >
            <Content>
              <div className="title-card">Cartilla {props.user.nickname}</div>
              <div className="card-container">
                <UserCard user={props.user} {...props} disableSelect />
              </div>
              <div className="btn-container">
                <ButtonAnt color="default" onClick={() => props.setIsVisibleModalUserCard(false)}>
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
  .input-radio + label span {
    transition: background 0.2s, transform 0.2s;
  }

  .input-radio + label span:hover,
  .input-radio + label:hover span {
    transform: scale(1.2);
  }

  .input-radio:checked + label span {
    background-color: ${(props) => props.theme.basic.success};
  }

  ${mediaQuery.afterTablet} {
    .main-content-award {
      display: grid;
      grid-template-columns: ${(props) => (props.lobby.settings.awards ? `2fr 1fr` : `1fr`)};
      align-items: center;
      grid-gap: 1rem;
    }
  }
`;

const Content = styled.div`
  width: 100%;

  .title-card {
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

const StyledRibbon = styled.div`
  position: absolute;
  width: 150px;
  height: 38px;
  background: linear-gradient(180deg, #56eea5 0%, #36c27f 100%);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  align-items: center;
  justify-items: center;
  top: 15px;
  left: -10px;

  :before {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid ${(props) => props.theme.basic.success};
    border-top: 5px solid ${(props) => props.theme.basic.success};
    border-bottom: 5px solid transparent;
  }
`;
