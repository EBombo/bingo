import React, { useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../../components/form";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";
import { mapKeys } from "lodash/object";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { BOARD_PARAMS, MAX_NUMBER_BOARD } from "../../../../business";

export const GameOptions = (props) => {
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingCalledNumber, setIsLoadingCalledNumber] = useState(false);

  const createBoard = () =>
    Array.from({ length: MAX_NUMBER_BOARD }, (_, i) => i + 1).reduce(
      (board, number) => ({ ...board, [number]: false }),
      {}
    );

  const startGame = async (callback) => {
    setLoading(true);
    if (!props.lobby.pattern)
      return props.showNotification(
        "UPS",
        "Define un patrón antes de empezar el bingo",
        "warning"
      );

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

  const modalConfirm = () => (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      padding="1rem"
      width="440px"
      top="30%"
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

  const callNumber = async () => {
    if (!props.lobby || !props.lobby.board) return;
    setIsLoadingCalledNumber(true);

    const newBoard = props.lobby.board;
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
    setIsLoadingCalledNumber(false);
  };

  return (
    <GameOptionsContainer hiddenOptions={props.hiddenOptions}>
      {modalConfirm()}
      <div className="out">
        <div className="in">
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
      </div>
      {!props.hiddenOptions && (
        <div className="options">
          <div className="btn-container">
            {props.lobby.startGame ? (
              <ButtonAnt
                width="100%"
                onClick={() => callNumber()}
                disabled={loading || isLoadingCalledNumber}
                loading={isLoadingCalledNumber}
              >
                LLamar número
              </ButtonAnt>
            ) : (
              <ButtonAnt
                width="100%"
                onClick={() => startGame()}
                disabled={loading}
              >
                Iniciar Juego
                <Image
                  src={`${config.storageUrl}/resources/white-play.svg`}
                  height="15px"
                  width="15px"
                  size="contain"
                  margin="0"
                />
              </ButtonAnt>
            )}
          </div>
          <div className="btn-container">
            <ButtonAnt color="default" width="100%" className="btn-automatic">
              Reproducción automática
            </ButtonAnt>
          </div>
          <div className="btn-container">
            <ButtonAnt
              variant="contained"
              color="default"
              width="100%"
              onClick={() => setIsVisibleModalConfirm(true)}
            >
              Reiniciar tablero
            </ButtonAnt>
          </div>
        </div>
      )}
    </GameOptionsContainer>
  );
};

const GameOptionsContainer = styled.div`
  width: ${(props) => (props.hiddenOptions ? "105px" : "325px")};
  display: grid;
  grid-template-columns: 85px 220px;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  background: ${(props) => props.theme.basic.blackDarken};

  .out {
    width: 85px;
    height: 85px;
    border-radius: 50%;
    background: #195d8b;
    display: flex;
    align-items: center;
    justify-content: center;

    .in {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fafafa;
      display: flex;
      align-items: center;
      flex-direction: column;

      p {
        margin: 0;
      }
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
