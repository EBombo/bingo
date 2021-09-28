import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Chat } from "../../../components/chat";
import { Desktop, mediaQuery, Tablet } from "../../../constants";
import { BingoBoard } from "./BingoBoard";
import { RoundsLastNumber } from "./RoundsLastNumber";
import { GameOptions } from "./GameOptions";
import { CardPattern } from "./CardPattern";
import { ModalWinner } from "./ModalWinner";
import { ModalAwards } from "./ModalAwards";
import { UsersTabs } from "./UsersTabs";
import { LastPlays } from "./LastPlays";
import { BingoCard } from "./BingoCard";
import { ButtonAnt } from "../../../components/form";
import defaultTo from "lodash/defaultTo";
import { UserLayout } from "./userLayout";
import { firestore } from "../../../firebase";

export const BingoGame = (props) => {
  const [isVisibleModalWinner, setIsVisibleModalWinner] = useState(false);
  const [isVisibleModalAwards, setIsVisibleModalAwards] = useState(false);
  const [authUser] = useGlobal("user");
  const [tabletTab, setTabletTab] = useState("bingo");

  useEffect(() => {
    if (!props.lobby.bingo) return;
    setIsVisibleModalWinner(true);
  }, [props.lobby]);

  const callBingo = async () => {
    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      bingo: authUser,
      updateAt: new Date(),
    });
  };

  return (
    <>
      <UserLayout {...props} />

      <BingoGameContainer>
        {isVisibleModalAwards && (
          <ModalAwards
            awards={defaultTo(props.lobby.settings.awards, [])}
            isVisibleModalAwards={isVisibleModalAwards}
            setIsVisibleModalAwards={setIsVisibleModalAwards}
            {...props}
          />
        )}
        {isVisibleModalWinner && (
          <ModalWinner
            winner={props.lobby.bingo}
            isVisibleModalWinner={isVisibleModalWinner}
            setIsVisibleModalWinner={setIsVisibleModalWinner}
            {...props}
          />
        )}
        <Desktop>
          <div className="main-container">
            {authUser.isAdmin && (
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
                        onClick={() => setIsVisibleModalAwards(true)}
                      >
                        Premios
                      </div>
                      <div className="last-plays-container">
                        <LastPlays
                          lastNumbers={
                            props.lobby?.lastPlays?.slice(0, 5) || []
                          }
                          {...props}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!authUser.isAdmin && (
              <div className="user-content">
                <div className="left-user-content">
                  <BingoCard user={authUser} {...props} />
                </div>
                <div className="right-user-content">
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
                  <div className="buttons-container">
                    <ButtonAnt onClick={() => callBingo()}>Bingo</ButtonAnt>
                    <ButtonAnt color="default">Ver premios</ButtonAnt>
                  </div>
                  <div className="last-plays-container">
                    <LastPlays
                      lastNumbers={props.lobby?.lastPlays?.slice(0, 5) || []}
                      {...props}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="subtitle">Participantes</div>
            <UsersTabs
              users={[
                { nickname: "sebastian", id: "asdklfjowei" },
                { nickname: "jacobo", id: "dsajkfaksjl" },
                { nickname: "mendo", id: "dkfjwioefjwof" },
                { nickname: "lopez", id: "elfjnk891238d" },
                { nickname: "rafael", id: "sdklajfh2893" },
              ]}
              {...props}
            />
          </div>
          <div className="chat-container">
            <Chat title={"CHAT DEL BINGO"} />
          </div>
        </Desktop>
        <Tablet>
          <div className="main-container">
            <div className="tablet-tabs">
              <div
                className={`tab ${tabletTab === "bingo" && "active"}`}
                onClick={() => setTabletTab("bingo")}
              >
                Bingo
              </div>
              <div
                className={`tab ${tabletTab === "users" && "active"}`}
                onClick={() => setTabletTab("users")}
              >
                Participantes
              </div>
            </div>
            {tabletTab === "bingo" && authUser.isAdmin && (
              <>
                <div className="bingo-board">
                  <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
                </div>
                <div className="pattern-rounds">
                  <CardPattern
                    caption={"Patrón que se debe llenar"}
                    {...props}
                  />
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
                  onClick={() => setIsVisibleModalAwards(true)}
                >
                  Premios
                </div>
                <div className="last-plays-container">
                  <LastPlays
                    lastNumbers={props.lobby?.lastPlays?.slice(0, 5) || []}
                    {...props}
                  />
                </div>
                <div className="chat-container">
                  <Chat title={"CHAT DEL BINGO"} />
                </div>
              </>
            )}
            {tabletTab === "bingo" && !authUser.isAdmin && (
              <>
                <div className="top-container-user">
                  <BingoCard user={authUser} {...props} />
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
                  <ButtonAnt onClick={() => callBingo()}>Bingo</ButtonAnt>
                  <ButtonAnt
                    color="default"
                    onClick={() => setIsVisibleModalAwards(true)}
                  >
                    Ver premios
                  </ButtonAnt>
                </div>
                <div className="chat-container">
                  <Chat title={"CHAT DEL BINGO"} />
                </div>
              </>
            )}
          </div>

          {tabletTab === "users" && (
            <UsersTabs
              users={[
                { nickname: "sebastian", id: "asdklfjowei" },
                { nickname: "jacobo", id: "dsajkfaksjl" },
                { nickname: "mendo", id: "dkfjwioefjwof" },
                { nickname: "lopez", id: "elfjnk891238d" },
                { nickname: "rafael", id: "sdklajfh2893" },
              ]}
              {...props}
            />
          )}
        </Tablet>
      </BingoGameContainer>
    </>
  );
};

const BingoGameContainer = styled.div`
  width: 100%;
  height: 100vh;

  .main-container {
    .top-container-user {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      justify-content: center;
      margin: 1rem 0;
      padding: 0.5rem;

      .right-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }
    .buttons-container {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    .tablet-tabs {
      height: 32px;
      background: ${(props) => props.theme.basic.primary};
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .tab {
        padding: 0.5rem 1rem;
        text-align: center;
        font-family: "Encode Sans", sans-serif;
        font-style: normal;
        font-size: 15px;
        font-weight: 400 !important;
        line-height: 17px;
        position: relative;
        cursor: pointer;
        color: ${(props) => props.theme.basic.secondary};
      }

      .active {
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: ${(props) => props.theme.basic.whiteLight};
      }
    }

    .bingo-board {
      max-width: 100%;
      overflow: auto;
      margin-top: 1rem;
    }

    .pattern-rounds {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin: 1rem 0;
    }

    .options-container {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .awards {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    text-decoration: underline;
    color: ${(props) => props.theme.basic.primaryLight};
    cursor: pointer;
    padding: 1rem;
  }

  .chat-container {
    height: 550px;
  }

  .last-plays-container {
    margin: 1rem;
    overflow: auto;
    max-width: 100%;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: calc(100% - 300px) 300px;

    .main-container {
      padding: 0;

      .user-content {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 0.5rem 0.5rem 2rem 0.5rem;

        .left-user-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .right-user-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          .top-content {
            display: flex;
            align-items: center;
          }
          .buttons-container {
            width: 100%;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
          }
        }
      }
    }

    .chat-container {
      height: 100%;
    }

    .bingo {
      padding: 0.5rem 0.5rem 2rem 0.5rem;
      //display: -webkit-box;
      display: flex;
      justify-content: space-between;
      border-bottom: 10px solid ${(props) => props.theme.basic.primary};
      overflow: auto;
    }

    .left-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .right-container {
      .board-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .bottom-section {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 335px auto;

        .last-plays-container {
          margin: 1rem;
          display: inline-flex;
          overflow: auto;
          max-width: 100%;
        }
      }
    }

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      color: ${(props) => props.theme.basic.whiteLight};
      padding: 1rem;
    }
  }
`;
