import React from "reactn";
import { RoundsLastNumber } from "../RoundsLastNumber";
import defaultTo from "lodash/defaultTo";
import { CardPattern } from "../CardPattern";
import { BingoBoard } from "../BingoBoard";
import { GameOptions } from "../GameOptions";
import { LastPlays } from "../LastPlays";
import { Desktop, Tablet } from "../../../../constants";
import { Chat } from "../../../../components/chat";

export const AdminPanel = (props) => {
  return (
    <>
      <Desktop>
        <div className="bingo">
          <div className="left-container">
            <RoundsLastNumber
              key={defaultTo(props.lobby.lastPlays, []).length}
              {...props}
            />
            <CardPattern
              caption={"Patrón que se debe llenar"}
              key={props.lobby.pattern}
              {...props}
            />
          </div>
          <div className="right-container">
            <div className="board-container">
              <BingoBoard {...props} />
            </div>
            <div className="bottom-section">
              <div className="left">
                <GameOptions
                  lastNumber={
                    defaultTo(props.lobby.lastPlays, []).length > 0
                      ? props.lobby.lastPlays[0]
                      : 0
                  }
                  {...props}
                />
              </div>
              <div className="right">
                <div
                  className="awards"
                  onClick={() => props.setIsVisibleModalAwards(true)}
                >
                  Premios
                </div>
                <div className="last-plays-container">
                  <LastPlays
                    lastNumbers={props.lobby?.lastPlays?.slice(0, 5) || []}
                    {...props}
                  />
                </div>
              </div>
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
          <LastPlays
            lastNumbers={props.lobby?.lastPlays?.slice(0, 5) || []}
            {...props}
          />
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
