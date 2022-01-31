import { UserCard } from "./UserCard";
import { BingoBoard } from "./BingoBoard";
import { CardPattern } from "./CardPattern";
import { LastBall } from "./LastBall";
import { ButtonAnt } from "../../../../components/form";
import { LastPlays } from "./LastPlays";
import React, { useGlobal, useMemo } from "reactn";
import defaultTo from "lodash/defaultTo";
import { Chat } from "../../../../components/chat";
import { Desktop, Tablet } from "../../../../constants";

export const UserPanel = (props) => {
  const [authUser] = useGlobal("user");

  // Use useMemo to prevent re render unnecessary.
  const lastBall = useMemo(() => {
    if (!props.lobby) return null;

    return (
      <>
        <Desktop>
          <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} vertical />
        </Desktop>
        <Tablet>
          <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} />
        </Tablet>
      </>
    );
  }, [props.lobby?.lastPlays, props.lobby?.animationSpeed]);

  return (
    <div className="bg-lobby-pattern w-full h-full overflow-auto">
      <Desktop>
        <div className={`user-main grid p-4 w-full h-full`}>
          {props.lobby.settings.showBoardToUser && (
            <div className="p-4">
              <BingoBoard vertical isVisible {...props} />
            </div>
          )}
          <div
            className={`bg-secondaryDarken/60 p-2 grid grid-cols-[1fr_2fr] w-full max-w-screen-xl mx-auto`}
          >
            <div className="flex flex-col items-center justify-around">
              <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} />
              <LastPlays {...props} />
              <div className="w-[300px] bg-secondary shadow-[0_4px_8px_rgba(0,0,0,0.25)] rounded-[4px] p-4">
                <CardPattern caption={"Patrón a completar"} hiddenOptions key={props.lobby.pattern} {...props} />
              </div>
              {props.lobby.settings.awards?.length && (
                <ButtonAnt color="default" width="100%" onClick={() => props.setIsVisibleModalAwards(true)}>
                  Ver premios
                </ButtonAnt>
              )}
              <ButtonAnt
                color="success"
                width="90%"
                padding="1rem"
                fontSize="3rem"
                onClick={() => props.callBingo()}
                disabled={defaultTo(props.lobby.bannedUsersId, []).includes(authUser.id) || !props.lobby.startGame}
              >
                Bingo
              </ButtonAnt>
            </div>
            <div className="flex items-center p-8">
              <UserCard user={authUser} full {...props} />
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="top-container-user">
          <div className="left-side">
            <div className="pattern">
              <CardPattern key={props.lobby.pattern} caption={"Patrón que se debe llenar"} hiddenOptions {...props} />
            </div>
          </div>
          <div className="right-side">
            {lastBall}
            <LastPlays {...props} />
          </div>
        </div>
        <div className="bingo-card-container">
          <UserCard user={authUser} {...props} />
        </div>
        <div className="buttons-container">
          <ButtonAnt
            color="success"
            onClick={() => props.callBingo()}
            disabled={defaultTo(props.lobby.bannedUsersId, []).includes(authUser.id) || !props.lobby.startGame}
          >
            Bingo
          </ButtonAnt>
          {props.lobby.settings.awards?.length && (
            <ButtonAnt color="default" margin={"0 0 0 1rem"} onClick={() => props.setIsVisibleModalAwards(true)}>
              Ver premios
            </ButtonAnt>
          )}
        </div>
        <div className="bingo-board">
          <BingoBoard {...props} isVisible={props.lobby.settings.showBoardToUser} />
        </div>
        <div className="chat-container">
          <Chat title={"CHAT DEL BINGO"} />
        </div>
      </Tablet>
    </div>
  );
};
