import React, { useGlobal, useState } from "reactn";
import { RoundsLastNumber } from "./RoundsLastNumber";
import defaultTo from "lodash/defaultTo";
import { CardPattern } from "./CardPattern";
import { BingoBoard } from "./BingoBoard";
import { GameOptions } from "./GameOptions";
import { LastPlays } from "./LastPlays";
import { Desktop, Tablet } from "../../../../constants";
import { Chat } from "../../../../components/chat";
import { SliderControls } from "./SliderControls";
import { ButtonAnt } from "../../../../components/form";
import { mapKeys } from "lodash/object";
import { firestore } from "../../../../firebase";
import { timeoutPromise } from "../../../../utils/promised";
import { createBoard } from "../../../../business";

export const AdminPanel = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");
  const [isAutomatic, setIsAutomatic] = useGlobal("isAutomatic");
  const [loading, setLoading] = useState(false);
  const [isLoadingCalledNumber, setIsLoadingCalledNumber] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);

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

  return (
    <>
      <Desktop>
        <div className="bingo">
          <div className="left-container">
            {/*<RoundsLastNumber*/}
            {/*  key={defaultTo(props.lobby.lastPlays, []).length}*/}
            {/*  {...props}*/}
            {/*/>*/}
            <CardPattern
              caption={"Patrón que se debe llenar"}
              key={props.lobby.pattern}
              {...props}
            />
            <div className="btn-container">
              <ButtonAnt
                variant="contained"
                color="default"
                width="100%"
                disabled={
                  isLoadingCalledNumber || isAutomatic || props.lobby.bingo
                }
                onClick={() => setIsVisibleModalConfirm(true)}
              >
                Reiniciar tablero
              </ButtonAnt>
            </div>
          </div>
          <div className="right-container">
            <div className="board-container">
              <BingoBoard {...props} />
            </div>
            <div className="bottom-section">
              <div className="ball-called">
                <GameOptions
                  lastNumber={
                    defaultTo(props.lobby.lastPlays, []).length > 0
                      ? props.lobby.lastPlays[0]
                      : 0
                  }
                  {...props}
                />
              </div>
              <div className="btn-container">
                {props.lobby.startGame ? (
                  <ButtonAnt
                    width="100%"
                    onClick={() => callNumber()}
                    disabled={
                      loading ||
                      isLoadingCalledNumber ||
                      isAutomatic ||
                      props.lobby.bingo
                    }
                    loading={isLoadingCalledNumber}
                  >
                    LLamar número
                  </ButtonAnt>
                ) : (
                  <ButtonAnt
                    width="100%"
                    color="success"
                    onClick={() => startGame()}
                    disabled={loading}
                  >
                    Iniciar Juego
                  </ButtonAnt>
                )}
              </div>
              <div className="controlers">
                <ButtonAnt
                  color="default"
                  width="100%"
                  className="btn-automatic"
                  disabled={
                    !props.lobby.startGame ||
                    isLoadingCalledNumber ||
                    props.lobby.bingo
                  }
                  onClick={() => setIsAutomatic(!isAutomatic)}
                >
                  {isAutomatic
                    ? "Detener Rep. automática"
                    : "Reproducción automática"}
                </ButtonAnt>

                <SliderControls {...props} />

                <ButtonAnt
                  color="default"
                  width="100%"
                  onClick={() => props.setIsVisibleModalAwards(true)}
                >
                  Ver Premios
                </ButtonAnt>
              </div>

              {/*<div className="left">*/}
              {/*</div>*/}
              {/*<div className="right">*/}
              {/*  <div*/}
              {/*    className="awards"*/}
              {/*    onClick={() => props.setIsVisibleModalAwards(true)}*/}
              {/*  >*/}
              {/*    Premios*/}
              {/*  </div>*/}
              {/*  <div className="last-plays-container">*/}
              {/*    <LastPlays {...props} />*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="bingo-board">
          <BingoBoard {...props} />
        </div>
        <div className="pattern-rounds">
          <CardPattern caption={"Patrón que se debe llenar"} {...props} />
          <RoundsLastNumber
            key={defaultTo(props.lobby.lastPlays, []).length}
            {...props}
          />
        </div>
        <div className="options-container">
          <GameOptions
            lastNumber={
              defaultTo(props.lobby.lastPlays, []).length > 0
                ? props.lobby.lastPlays[0]
                : 0
            }
            {...props}
          />
        </div>
        <div
          className="awards"
          onClick={() => props.setIsVisibleModalAwards(true)}
        >
          Premios
        </div>
        <div className="last-plays-container">
          <LastPlays {...props} />
        </div>
        <SliderControls {...props} />
        {props.lobby?.settings?.showChat && (
          <div className="chat-container">
            <Chat title={"CHAT DEL BINGO"} />
          </div>
        )}
      </Tablet>
    </>
  );
};
