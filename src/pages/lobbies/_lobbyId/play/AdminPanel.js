import React, { useGlobal, useState } from "reactn";
import { CardPattern } from "./CardPattern";
import { BingoBoard } from "./BingoBoard";
import { LastBall } from "./LastBall";
import { LastPlays } from "./LastPlays";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { Chat } from "../../../../components/chat";
import { SliderControls } from "./SliderControls";
import { ButtonAnt } from "../../../../components/form";
import { mapKeys } from "lodash/object";
import { firestore } from "../../../../firebase";
import { timeoutPromise } from "../../../../utils/promised";
import { ANIMATION, createBoard } from "../../../../business";
import { useInterval } from "../../../../hooks/useInterval";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import styled from "styled-components";
import { ModalPattern } from "./ModalPattern";
import { darkTheme } from "../../../../theme";
import { useMemo } from "react";
import { UsersTabs } from "./UsersTabs";
import { useTranslation } from "../../../../hooks";

export const AdminPanel = (props) => {
  const { t } = useTranslation("lobby-play");

  const [reproductionSpeed] = useGlobal("reproductionSpeed");
  const [animationSpeed] = useGlobal("animationSpeed");
  const [isAutomatic, setIsAutomatic] = useGlobal("isAutomatic");

  const [apagon, setApagon] = useState(false);
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoadingCalledNumber, setIsLoadingCalledNumber] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);

  const startGame = async (callback) => {
    if (!props.lobby.pattern) return setIsVisibleModalPattern(true);

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
    if (!props.lobby) return;
    if (!props.lobby.board) return;

    setIsLoadingCalledNumber(true);

    const newBoard = { ...props.lobby.board };
    const missingNumbers = [];

    mapKeys(newBoard, (value, key) => {
      if (!value) missingNumbers.push(key);
    });

    if (!missingNumbers?.length) {
      setIsLoadingCalledNumber(false);
      return props.showNotification("Ups", "Todas las bolillas ya han salido!");
    }

    const randomIndex = Math.floor(Math.random() * missingNumbers.length);

    const numberCalled = missingNumbers[randomIndex];

    // Prevent undefined number.
    if (!numberCalled) setIsLoadingCalledNumber(false);

    newBoard[numberCalled] = true;

    let newLastPlays = [...(props.lobby?.lastPlays ?? [])];

    newLastPlays.unshift(numberCalled);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      updateAt: new Date(),
      round: +props.lobby.round + 1,
      lastPlays: newLastPlays,
      board: newBoard,
    });

    await timeoutPromise((ANIMATION.max - animationSpeed) * 1000);
    setIsLoadingCalledNumber(false);
  };

  useInterval(
    callNumber,
    // Prevent auto play.
    isAutomatic && !props.lobby.bingo && !props.isVisibleModalFinal
      ? (20 - reproductionSpeed + animationSpeed) * 1000
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
        <div className="title">{t("are-you-sure-restart")}</div>
        <div className="description">{t("if-you-restart")}</div>
        <div className="btns-container">
          <ButtonAnt color="default" disabled={loading} onClick={() => setIsVisibleModalConfirm(false)}>
            {t("cancel")}
          </ButtonAnt>
          <ButtonAnt color="danger" loading={loading} onClick={() => startGame(setIsVisibleModalConfirm)}>
            {t("restart")}
          </ButtonAnt>
        </div>
      </ContentModal>
    </ModalContainer>
  );

  const modalPattern = () => (
    <ModalPattern
      apagon={apagon}
      setApagon={setApagon}
      isVisibleModalPattern={isVisibleModalPattern}
      setIsVisibleModalPattern={setIsVisibleModalPattern}
      continueGame={() => setIsVisibleModalPattern(false)}
      {...props}
    />
  );

  // Use useMemo to prevent re render unnecessary.
  const lastBall = useMemo(() => {
    if (!props.lobby) return null;

    return (
      <>
        <Desktop>
          <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} />
        </Desktop>
        <Tablet>
          <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} vertical />
        </Tablet>
      </>
    );
  }, [props.lobby?.lastPlays, props.lobby?.animationSpeed]);

  return (
    <div className="grid grid-rows-[min-content_auto] bg-lobby-pattern w-full">
      {modalConfirm()}
      {isVisibleModalPattern && modalPattern()}

      <Desktop>
        <div className="grid grid-cols-[250px_auto] gap-8 border-b-[10px] border-primary overflow-auto px-2 pt-8 pb-2">
          <div>
            <div className="bg-secondary shadow-[0px_4px_8px_rgba(0, 0, 0, 0.25)] p-4 rounded-[4px]">
              <CardPattern
                key={props.lobby.pattern}
                caption={t("pattern-to-fill")}
                apagon={apagon}
                setApagon={setApagon}
                isVisibleModalPattern={isVisibleModalPattern}
                setIsVisibleModalPattern={setIsVisibleModalPattern}
                {...props}
              />
            </div>

            <ButtonAnt
              variant="contained"
              color={darkTheme.basic.secondaryDark}
              width="100%"
              margin="1rem auto"
              disabled={isLoadingCalledNumber || isAutomatic || props.lobby.bingo}
              onClick={() => setIsVisibleModalConfirm(true)}
            >
              {t("reset-board")}
            </ButtonAnt>
          </div>
          <div className="">
            <div className="m-0">
              <BingoBoard {...props} isVisible />
            </div>
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-start max-w-[900px] m-4">
              <div className="self-center">{lastBall}</div>
              <div className="middle-container">
                {props.lobby.startGame ? (
                  <ButtonAnt
                    width="100%"
                    fontSize="18px"
                    onClick={() => callNumber()}
                    margin="0 0 1rem 0"
                    size="big"
                    disabled={
                      loading ||
                      isLoadingCalledNumber ||
                      isAutomatic ||
                      props.lobby.bingo ||
                      Object.values(props.lobby.board ?? {}).every((num) => num)
                    }
                    loading={isLoadingCalledNumber}
                  >
                    {t("call-ball")}
                  </ButtonAnt>
                ) : (
                  <ButtonAnt
                    width="100%"
                    fontSize="18px"
                    size="big"
                    margin="0 0 1rem 0"
                    color="success"
                    onClick={() => startGame()}
                    disabled={loading}
                  >
                    {t("start-game")}
                  </ButtonAnt>
                )}

                <LastPlays {...props} />
              </div>
              <div className="controlers">
                <ButtonAnt
                  color="default"
                  fontSize="18px"
                  width="100%"
                  size="big"
                  className="btn-automatic"
                  disabled={!props.lobby.startGame || isLoadingCalledNumber || props.lobby.bingo}
                  onClick={() => setIsAutomatic(!isAutomatic)}
                >
                  {isAutomatic ? t("stop-auto-play") : t("autoplay")}
                </ButtonAnt>

                <SliderControls {...props} />

                <ButtonAnt
                  fontSize="18px"
                  className="btn"
                  color="default"
                  size="big"
                  width="100%"
                  onClick={() => props.setIsVisibleModalAwards(true)}
                >
                  {t("see-award")}
                </ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="m-auto w-full p-2 overflow-auto">
          <BingoBoard {...props} isVisible />
        </div>
        <div className="grid items-center grid-cols-[50%_50%] my-4">
          <div>
            <div className="bg-secondary shadow-[0px_4px_8px_rgba(0, 0, 0, 0.25)] rounded-[4px] px-2 py-4 mx-auto max-w-[250px]">
              <CardPattern
                key={props.lobby.pattern}
                caption={t("pattern-to-fill")}
                apagon={apagon}
                setApagon={setApagon}
                isVisibleModalPattern={isVisibleModalPattern}
                setIsVisibleModalPattern={setIsVisibleModalPattern}
                {...props}
              />
            </div>
            <ButtonAnt
              variant="contained"
              color="default"
              width="90%"
              margin="1rem auto"
              disabled={isLoadingCalledNumber || isAutomatic || props.lobby.bingo}
              onClick={() => setIsVisibleModalConfirm(true)}
            >
              {t("reset-board")}
            </ButtonAnt>
            <ButtonAnt
              color="default"
              size="big"
              width="90%"
              margin="1rem auto"
              className="btn-automatic"
              disabled={!props.lobby.startGame || isLoadingCalledNumber || props.lobby.bingo}
              onClick={() => setIsAutomatic(!isAutomatic)}
            >
              {isAutomatic ? t("stop-auto-play") : t("autoplay")}
            </ButtonAnt>
          </div>
          <div className="grid gap-4">
            {lastBall}
            <LastPlays {...props} />
            <div className="btns-container">
              {props.lobby.startGame ? (
                <ButtonAnt
                  size="big"
                  width="90%"
                  margin="0 auto"
                  onClick={() => callNumber()}
                  disabled={
                    loading ||
                    isLoadingCalledNumber ||
                    isAutomatic ||
                    props.lobby.bingo ||
                    Object.values(props.lobby.board ?? {}).every((num) => num)
                  }
                  loading={isLoadingCalledNumber}
                >
                  {t("call-ball")}
                </ButtonAnt>
              ) : (
                <ButtonAnt
                  width="90%"
                  size="big"
                  color="success"
                  margin="0 auto"
                  onClick={() => startGame()}
                  disabled={loading}
                >
                  {t("start-game")}
                </ButtonAnt>
              )}
            </div>
            <SliderControls {...props} />
          </div>
        </div>
        <ButtonAnt color="default" width="90%" margin="1rem auto" onClick={() => props.setIsVisibleModalAwards(true)}>
          {t("see-award")}
        </ButtonAnt>
        <div className="h-[550px]">
          <Chat title={t("chat")} />
        </div>
      </Tablet>
      <UsersTabs {...props} />
    </div>
  );
};

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
