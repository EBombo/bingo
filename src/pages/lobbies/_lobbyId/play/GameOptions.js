import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../../components/form";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";
import { mapKeys } from "lodash/object";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { BOARD_PARAMS, createBoard } from "../../../../business";
import { useInterval } from "../../../../hooks/useInterval";
import { timeoutPromise } from "../../../../utils/promised";

export const GameOptions = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");
  const [reproductionSpeed] = useGlobal("reproductionSpeed");
  const [isAutomatic, setIsAutomatic] = useGlobal("isAutomatic");

  const [loading, setLoading] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [isLoadingCalledNumber, setIsLoadingCalledNumber] = useState(false);

  const startGame = async (callback) => {
    if (!props.lobby.pattern)
      return props.showNotification(
        "UPS",
        "Define un patrón antes de empezar el bingo",
        "warning"
      );

    setLoading(true);

    const board = createBoard();

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      round: 0,
      lastPlays: [],
      startGame: new Date(),
      updateAt: new Date(),
      board,
    });

    setLoading(false);
    callback && callback(false);
  };

  const callNumber = async () => {
    if (!props.lobby || !props.lobby.board) return;

    setIsLoadingCalledNumber(true);

    const newBoard = { ...props.lobby.board };
    const missingNumbers = [];

    mapKeys(newBoard, (value, key) => {
      if (!value) missingNumbers.push(key);
    });

    const randomIndex = Math.round(Math.random() * missingNumbers.length);

    const numberCalled = missingNumbers[randomIndex];

    newBoard[numberCalled] = true;

    const newLastPlays = props.lobby.lastPlays;

    newLastPlays.unshift(numberCalled);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      updateAt: new Date(),
      round: props.lobby.round + 1,
      lastPlays: newLastPlays,
      board: newBoard,
    });

    await timeoutPromise(animationSpeed * 1000);
    setIsLoadingCalledNumber(false);
  };

  useInterval(
    callNumber,
    isAutomatic && !props.lobby.bingo
      ? (reproductionSpeed + animationSpeed) * 1000
      : null
  );

  const modalConfirm = () => (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      padding="1rem"
      width="440px"
      topDesktop="30%"
      visible={isVisibleModalConfirm}
    >
      <ContentModal>
        <div className="title">¿Seguro que quieres reiniciar el tablero?</div>
        <div className="description">
          Si lo reinicias, no podrás deshacerlo.
        </div>
        <div className="btns-container">
          <ButtonAnt
            color="default"
            disabled={loading}
            onClick={() => setIsVisibleModalConfirm(false)}
          >
            Cancelar
          </ButtonAnt>
          <ButtonAnt
            color="danger"
            loading={loading}
            onClick={() => startGame(setIsVisibleModalConfirm)}
          >
            Reiniciar
          </ButtonAnt>
        </div>
      </ContentModal>
    </ModalContainer>
  );

  return (
    <GameOptionsContainer
      hiddenOptions={props.hiddenOptions}
      number={props.lastNumber}
      green={`${config.storageUrl}/resources/balls/green-ball.png`}
      blue={`${config.storageUrl}/resources/balls/blue-ball.png`}
      orange={`${config.storageUrl}/resources/balls/orange-ball.png`}
      yellow={`${config.storageUrl}/resources/balls/yellow-ball.png`}
      red={`${config.storageUrl}/resources/balls/red-ball.png`}
    >
      {modalConfirm()}
      <div className="ball-container">
        <p>
          {props.lastNumber < BOARD_PARAMS.B.value
            ? get(props, "lobby.game.letters.b", "B")
            : props.lastNumber < BOARD_PARAMS.I.value
            ? get(props, "lobby.game.letters.i", "I")
            : props.lastNumber < BOARD_PARAMS.N.value
            ? get(props, "lobby.game.letters.n", "N")
            : props.lastNumber < BOARD_PARAMS.G.value
            ? get(props, "lobby.game.letters.g", "G")
            : get(props, "lobby.game.letters.o", "O")}
        </p>
        <p>{props.lastNumber}</p>
      </div>
    </GameOptionsContainer>
  );
};

const GameOptionsContainer = styled.div`
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  background: ${(props) => props.theme.basic.blackDarken};

  .ball-container {
    width: 85px;
    height: 85px;
    border-radius: 50%;
    background-image: url("${(props) =>
      props.number < 16
        ? props.green
        : props.number < 31
        ? props.blue
        : props.number < 46
        ? props.orange
        : props.number < 61
        ? props.yellow
        : props.red}");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p {
      margin: 0;
    }
  }

  .options {
    .btn-container {
      margin: 0.5rem !important;
    }
  }
`;

const ContentModal = styled.div`
  width: 100%;

  .title {
    font-family: Encode Sans, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
  }

  .description {
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.blackDarken};
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
