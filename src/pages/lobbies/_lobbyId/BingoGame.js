import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { Chat } from "../../../components/chat";
import { mediaQuery, Tablet, Desktop } from "../../../constants";
import { BingoBoard } from "./BingoBoard";
import { RoundsLastNumber } from "./RoundsLastNumber";
import { GameOptions } from "./GameOptions";
import { CardPattern } from "./CardPattern";
import { ModalWinner } from "./ModalWinner";
import { ModalAwards } from "./ModalAwards";
import { UsersTabs } from "./UsersTabs";
import { database } from "../../../firebase";
import { useRouter } from "next/router";

export const BingoGame = (props) => {
  const [isVisibleModalWinner, setIsVisibleModalWinner] = useState(true);
  const [isVisibleModalAwards, setIsVisibleModalAwards] = useState(false);
  const [users, setUsers] = useState([]);
  const [tabletTab, setTabletTab] = useState("bingo");
  const router = useRouter();
  const { lobbyId } = router.query;

  useEffect(() => {
    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${lobbyId}/users`);
      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [props.lobby]);

  return (
    <BingoGameContainer>
      {isVisibleModalAwards && (
        <ModalAwards
          awards={[]}
          isVisibleModalAwards={isVisibleModalAwards}
          setIsVisibleModalAwards={setIsVisibleModalAwards}
          {...props}
        />
      )}
      {isVisibleModalWinner && (
        <ModalWinner
          winner={{ nickname: "smendo95", id: "justfortesting" }}
          isVisibleModalWinner={isVisibleModalWinner}
          setIsVisibleModalWinner={setIsVisibleModalWinner}
          {...props}
        />
      )}
      <Desktop>
        <div className="main-container">
          <div className="bingo">
            <div className="left-container">
              <RoundsLastNumber lastNumber={35} round={6} {...props} />
              <CardPattern caption={"Patrón que se debe llenar"} {...props} />
            </div>
            <div className="right-container">
              <div className="board-container">
                <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
              </div>
              <div className="bottom-section">
                <div className="left">
                  <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
                </div>
                <div className="right">
                  <div
                    className="awards"
                    onClick={() => setIsVisibleModalAwards(true)}
                  >
                    Premios
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          {tabletTab === "bingo" && (
            <>
              <div className="bingo-board">
                <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
              </div>
              <div className="pattern-rounds">
                <CardPattern caption={"Patrón que se debe llenar"} {...props} />
                <RoundsLastNumber lastNumber={35} round={6} {...props} />
              </div>
              <div className="options-container">
                <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
              </div>
              <div
                className="awards"
                onClick={() => setIsVisibleModalAwards(true)}
              >
                Premios
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
  );
};

const BingoGameContainer = styled.div`
  width: 100%;
  height: 100vh;

  .main-container {
    .tablet-tabs {
      height: 32px;
      background: ${(props) => props.theme.basic.primary};
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .tab {
        padding: 0.5rem 1rem;
        text-align: center;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
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
  }

  .chat-container {
    height: 550px;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: auto 350px;

    .main-container {
      padding: 0;
    }

    .chat-container {
      height: 100%;
    }

    .bingo {
      padding: 0.5rem 0.5rem 2rem 0.5rem;
      display: grid;
      grid-template-columns: 300px auto;
      border-bottom: 10px solid ${(props) => props.theme.basic.primary};
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
