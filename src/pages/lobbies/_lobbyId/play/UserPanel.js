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
          </div>
          <div className="right-user-content">
            <div className="board-container">
              <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={props.lobby.settings.showBoardToUser} />
            </div>
            <div className={`${props.lobby.settings.showBoardToUser ? "flex-container" : "normal"} `}>
              <div className="top-content">
                <CardPattern caption={"Patrón que se debe llenar"} hiddenOptions key={props.lobby.pattern} {...props} />
                <LastBall lastNumber={lastNumber} hiddenOptions {...props} />
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
          <BingoBoard {...props} setLastNumber={setLastNumber} isVisible={props.lobby.settings.showBoardToUser} />
        </div>
        <div className="top-container-user">
          <div className="bingo-card-container">
            <UserCard user={authUser} {...props} />
          </div>
          <div className="right-container">
            <LastBall lastNumber={lastNumber} hiddenOptions {...props} />
            <CardPattern key={props.lobby.pattern} caption={"Patrón que se debe llenar"} hiddenOptions {...props} />
          </div>
        </div>

        <div className="buttons-container">
          <ButtonAnt onClick={() => props.callBingo()}>Bingo</ButtonAnt>
          <ButtonAnt color="default" onClick={() => props.setIsVisibleModalAwards(true)}>
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
