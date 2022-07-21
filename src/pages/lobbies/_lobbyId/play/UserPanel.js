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
import { useTranslation } from "../../../../hooks";

export const UserPanel = (props) => {
  const [authUser] = useGlobal("user");
  const { t } = useTranslation("lobby-play.modals");

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
          <div className={`bg-secondaryDarken/60 p-2 grid grid-cols-[1fr_2fr] w-full max-w-screen-xl mx-auto`}>
            <div className="grid gap-4 items-center justify-center m-0 w-full md:py-4">
              <LastBall lastPlays={props.lobby?.lastPlays} animationSpeed={props.lobby?.animationSpeed} size="small" />
              <LastPlays {...props} size="small" />
              <div className="w-[250px] my-2 bg-secondary shadow-[0_4px_8px_rgba(0,0,0,0.25)] rounded-[4px] p-2">
                <CardPattern caption={t("pattern-complete")} hiddenOptions key={props.lobby.pattern} {...props} />
              </div>
              {props.lobby.settings.awards?.length && (
                <ButtonAnt
                  color="default"
                  width="90%"
                  margin="0 auto"
                  onClick={() => props.setIsVisibleModalAwards(true)}
                >
                  Ver premios
                </ButtonAnt>
              )}
              <ButtonAnt
                color="success"
                width="90%"
                padding="0.5rem"
                fontSize="2rem"
                margin="0 auto"
                onClick={() => props.callBingo()}
                disabled={defaultTo(props.lobby.bannedUsersId, []).includes(authUser.id) || !props.lobby.startGame}
              >
                Bingo
              </ButtonAnt>
            </div>
            <div className="flex items-center px-8 py-4 mx-auto">
              <UserCard user={authUser} full {...props} />
            </div>
          </div>
        </div>
      </Desktop>
      <Tablet>
        <div className="grid grid-cols-[50%_50%] items-center justify-center my-4 p-2">
          <div className="left-side">
            <div className="bg-secondary shadow-[0_4px_8px_rgba(0,0,0,0.25) rounded-[4px] px-2 py-4 mx-auto max-w-[225px]">
              <CardPattern key={props.lobby.pattern} caption={t("pattern-to-fill")} hiddenOptions {...props} />
            </div>
          </div>
          <div className="grid gap-4">
            {lastBall}
            <LastPlays {...props} />
          </div>
        </div>
        <div className="mx-auto my-0">
          <UserCard user={authUser} {...props} />
        </div>
        <div className="m-4 flex items-center justify-evenly">
          <ButtonAnt
            width="100%"
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
        <div className="my-4 mx-auto">
          <BingoBoard {...props} isVisible={props.lobby.settings.showBoardToUser} />
        </div>
        <div className="h-[550px]">
          <Chat title={"CHAT DEL BINGO"} />
        </div>
      </Tablet>
    </div>
  );
};
