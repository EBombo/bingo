import { UserCard } from "./UserCard";
import { BingoBoard } from "./BingoBoard";
import { CardPattern } from "./CardPattern";
import { LastBall } from "./LastBall";
import { ButtonAnt } from "../../../../components/form";
import { LastPlays } from "./LastPlays";
import React, { useGlobal, useState } from "reactn";
import { Chat } from "../../../../components/chat";
import { Desktop, Tablet } from "../../../../constants";

export const UserPanel = (props) => {
  const [authUser] = useGlobal("user");
  const [lastNumber, setLastNumber] = useState(0);

  return (
    <>
      <Desktop>
        <div className="user-content">
          <div className="left-user-content">
            <UserCard user={authUser} {...props} />
            <ButtonAnt color="success" onClick={() => props.callBingo()}>
              Bingo
            </ButtonAnt>
          </div>
          <div className="right-user-content">
            <div className="board-container">
              <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={!props.lobby.settings.showBoardToUser} />
            </div>
            <div className="bottom-section">
              <LastBall lastNumber={lastNumber} vertical {...props} />
              <div className="last-plays-container">
                <LastPlays showMore {...props} />
              </div>
              <div className="pattern">
                <CardPattern caption={"Patrón que se debe llenar"} hiddenOptions key={props.lobby.pattern} {...props} />
                <ButtonAnt color="default" width="100%">
                  Ver premios
                </ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="top-container-user">
          <div className="left-side">
            <CardPattern key={props.lobby.pattern} caption={"Patrón que se debe llenar"} hiddenOptions {...props} />
          </div>
          <div className="right-side">
            <LastBall lastNumber={lastNumber} {...props} />
            <LastPlays {...props} />
          </div>
        </div>
        <div className="bingo-card-container">
          <UserCard user={authUser} {...props} />
        </div>
        <div className="buttons-container">
          <ButtonAnt color="success" onClick={() => props.callBingo()}>
            Bingo
          </ButtonAnt>
          <ButtonAnt color="default" onClick={() => props.setIsVisibleModalAwards(true)}>
            Ver premios
          </ButtonAnt>
        </div>
        <div className="bingo-board">
          <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={props.lobby.settings.showBoardToUser} />
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
