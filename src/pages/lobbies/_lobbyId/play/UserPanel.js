import { BingoCard } from "./BingoCard";
import { BingoBoard } from "./BingoBoard";
import { CardPattern } from "./CardPattern";
import { GameOptions } from "./GameOptions";
import defaultTo from "lodash/defaultTo";
import { ButtonAnt } from "../../../../components/form";
import { LastPlays } from "./LastPlays";
import React, { useGlobal } from "reactn";
import { Chat } from "../../../../components/chat";
import { Desktop, Tablet } from "../../../../constants";

export const UserPanel = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <>
      <Desktop>
        <div className="user-content">
          <div className="left-user-content">
            <BingoCard user={authUser} {...props} />
          </div>
          <div className="right-user-content">
            {props.lobby.settings.showBoardToUser && (
              <div className="board-container">
                <BingoBoard {...props} />
              </div>
            )}
            <div
              className={`${
                props.lobby.settings.showBoardToUser
                  ? "flex-container"
                  : "normal"
              } `}
            >
              <div className="top-content">
                <CardPattern
                  caption={"Patrón que se debe llenar"}
                  hiddenOptions
                  key={props.lobby.pattern}
                  {...props}
                />
                <GameOptions
                  lastNumber={
                    defaultTo(props.lobby.lastPlays, []).length > 0
                      ? props.lobby.lastPlays[0]
                      : 0
                  }
                  hiddenOptions
                  {...props}
                />
              </div>
              <div className="last-plays-container">
                <div className="buttons-container">
                  <ButtonAnt onClick={() => props.callBingo()}>Bingo</ButtonAnt>
                  <ButtonAnt color="default">Ver premios</ButtonAnt>
                </div>
                <LastPlays {...props} />
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="bingo-board">
          <BingoBoard {...props} />
        </div>
        <div className="top-container-user">
          <div className="bingo-card-container">
            <BingoCard user={authUser} {...props} />
          </div>
          <div className="right-container">
            <GameOptions
              lastNumber={
                defaultTo(props.lobby.lastPlays, []).length > 0
                  ? props.lobby.lastPlays[0]
                  : 0
              }
              hiddenOptions
              {...props}
            />
            <CardPattern
              key={props.lobby.pattern}
              caption={"Patrón que se debe llenar"}
              hiddenOptions
              {...props}
            />
          </div>
        </div>

        <div className="buttons-container">
          <ButtonAnt onClick={() => props.callBingo()}>Bingo</ButtonAnt>
          <ButtonAnt
            color="default"
            onClick={() => props.setIsVisibleModalAwards(true)}
          >
            Ver premios
          </ButtonAnt>
        </div>
        {props.lobby?.settings?.showChat && (
          <div className="chat-container">
            <Chat title={"CHAT DEL BINGO"} />
          </div>
        )}
      </Tablet>
    </>
  );
};
