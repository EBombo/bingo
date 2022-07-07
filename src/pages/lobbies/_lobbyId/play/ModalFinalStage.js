import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { UserCard } from "./UserCard";
import { ButtonAnt } from "../../../../components/form";
import { config, firestore, firestoreBomboGames } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";
import { createBoard, generateMatrix, getBingoCard } from "../../../../business";
import { ModalPattern } from "./ModalPattern";
import { Ribbon } from "./Ribbon";

export const ModalFinalStage = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);

  const blackout = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      pattern: JSON.stringify(generateMatrix(true)),
      finalStage: false,
      updateAt: new Date(),
    });

    props.setIsVisibleModalFinal(false);
  };

  const endGame = async () => {
    const endTime = new Date();

    const bingoPromise = firestore.doc(`lobbies/${props.lobby.id}`).update({
      isClosed: true,
      updateAt: endTime,
    });

    const bomboGamesPromise = firestoreBomboGames.doc(`lobbies/${props.lobby.id}`).set(
      {
        ...props.lobby,
        isClosed: true,
        updateAt: endTime,
      },
      { merge: true }
    );

    await Promise.all([bingoPromise, bomboGamesPromise]);
  };

  const continueGame = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      finalStage: false,
      updateAt: new Date(),
    });

    setIsVisibleModalPattern(false);
    props.setIsVisibleModalFinal(false);
  };

  const newGame = async () => {
    const newUsers = newUsersCard();

    const board = createBoard();

    const promiseNewCards = firestore.doc(`lobbies/${props.lobby.id}`).update({
      startGame: false,
      pattern: null,
      round: 0,
      lastPlays: [],
      board,
      finalStage: false,
      updateAt: new Date(),
    });

    // Update users.
    const promisesUsers = Object.values(newUsers).map(
      async (user) =>
        await firestore.collection("lobbies").doc(props.lobby.id).collection("users").doc(user.id).update(user)
    );

    const promisesRemoveUsers = removeUsersCards();

    await Promise.all([promiseNewCards, promisesUsers, ...promisesRemoveUsers]);

    props.setIsVisibleModalFinal(false);
  };

  const newCards = async () => {
    const newUsers = newUsersCard();

    const promiseNewCards = firestore.doc(`lobbies/${props.lobby.id}`).update({
      round: 0,
      lastPlays: [],
      finalStage: false,
      updateAt: new Date(),
    });

    // Update users.
    const promisesUsers = Object.values(newUsers).map(
      async (user) =>
        await firestore.collection("lobbies").doc(props.lobby.id).collection("users").doc(user.id).update(user)
    );

    const promisesRemoveUsers = removeUsersCards();

    await Promise.all([promiseNewCards, promisesUsers, ...promisesRemoveUsers]);

    props.setIsVisibleModalFinal(false);
  };

  const newUsersCard = () =>
    Object.values(props.lobby.users).reduce((usersSum, user) => {
      const card = getBingoCard();
      const newUser = { ...user, card: JSON.stringify(card) };
      return { ...usersSum, [newUser.id]: newUser };
    }, {});

  const removeUsersCards = () =>
    Object.keys(props.lobby.users).map(async (userId) => {
      await firestore
        .collection("lobbies")
        .doc(props.lobby.id)
        .collection("users")
        .doc(userId)
        .update({ myWinningCard: [] });
    });

  return (
    <ModalContainer
      background="#331E6C"
      footer={null}
      closable={false}
      width="700px"
      visible={props.isVisibleModalFinal}
      padding="2rem 0rem 1rem 0"
    >
      {isVisibleModalPattern && (
        <ModalPattern
          continueGame={continueGame}
          isVisibleModalPattern={isVisibleModalPattern}
          setIsVisibleModalPattern={setIsVisibleModalPattern}
          {...props}
        />
      )}
      <Content>
        <Ribbon
          title={`¡Ganador ${props.lobby.winners[props.lobby.winners.length - 1].nickname}!`}
          overflowDesktopWidth={80}
          overflowWidth={40}
          fontSize={"35px"}
          lineHeight={"90px"}
        />
        <div className="main-container">
          <div className="left-container">
            <div className="card-container">
              <UserCard winner={props.lobby.winners[props.lobby.winners.length - 1]} {...props} />
            </div>
          </div>
          <div className="right-container">
            {props.lobby.winners[props.lobby.winners.length - 1].award && (
              <div className="flex flex-col">
                <div className="text-['Lato'] text-[17px] text-center leading-[20px] text-white">Premio</div>
                <div className="text-['Lato'] text-[17px] text-center font-bold leading-[20px] text-white my-2">
                  {props.lobby.winners[props.lobby.winners.length - 1].award.name}
                </div>
                <Image
                  src={
                    props.lobby.winners[props.lobby.winners.length - 1].award.imageUrl ??
                    `${config.storageUrl}/resources/gift.png`
                  }
                  height="80px"
                  width="80px"
                  size="contain"
                  margin="0 auto 2rem auto"
                />
              </div>
            )}

            {authUser.isAdmin ? (
              <AdminContent>
                <ButtonAnt className="btn" color="default" onClick={() => setIsVisibleModalPattern(true)}>
                  Continuar juego
                </ButtonAnt>
                <ButtonAnt className="btn" color="default" onClick={() => blackout()}>
                  Apagón
                </ButtonAnt>
                <ButtonAnt className="btn" color="default" onClick={() => newCards()}>
                  Continuar con cartillas nuevas
                </ButtonAnt>
                <ButtonAnt className="btn" color="default" onClick={() => newGame()}>
                  Juego nuevo
                </ButtonAnt>
                <ButtonAnt className="btn" color="danger" onClick={() => endGame()}>
                  Finalizar juego
                </ButtonAnt>
              </AdminContent>
            ) : (
              <UserContent>
                <div className="text-['Lato'] font-bold text-[18px] leading-[22px] text-center text-white w-full">
                  Esperando que el administrador <br /> continue el juego...
                </div>
                <Image
                  src={`${config.storageUrl}/resources/spinner.gif`}
                  height="85px"
                  width="85px"
                  size="contain"
                  margin="1rem auto"
                />
              </UserContent>
            )}
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
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 49px;
    color: ${(props) => props.theme.basic.secondary};
  }

  .main-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .left-container {
      .winner-name {
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin-bottom: 2rem;
        text-align: center;
      }
      .card-container {
        overflow-x: auto;
        margin: 0 auto;
      }
    }
    .right-container {
      .award {
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin: 0.5rem 0;
        text-align: center;
      }

      .award-name {
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
      align-items: center;

      .left-container {
        .winner-name {
          text-align: center;
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
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .btn {
    width: 90%;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    height: 45px;
    margin: 0 auto 2rem auto;
  }

  ${mediaQuery.afterTablet} {
    margin-top: 0;
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
`;
