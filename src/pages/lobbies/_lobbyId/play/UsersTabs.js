import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import defaultTo from "lodash/defaultTo";
import { Popover, Progress } from "antd";
import { darkTheme } from "../../../../theme";
import { ModalUserCard } from "./ModalUserCard";
import { config, firestore } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

export const UsersTabs = (props) => {
  const [authUser] = useGlobal("user");
  const [tab, setTab] = useState("cards");
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisibleModalUserCard, setIsVisibleModalUserCard] = useState(false);
  const [isLoadingRemoveUser, setIsLoadingRemoveUser] = useState(false);

  const removeUser = async (userId) => {
    await firestore.doc(`lobbies/${props.lobby.id}`);
  };

  const userContent = (user, index) => {
    if (tab === "cards")
      return (
        <div className="user-card" key={`${user.nickname}-${index}`}>
          <div className="name">{user.nickname}</div>
          <div className="card-preview">
            {defaultTo(
              JSON.parse(user.card),
              Array(5).fill(Array(5).fill(0))
            ).map((row) =>
              row.map((num) => (
                <div
                  className={`matrix-num`}
                  key={`${row}-${Math.random() * 150}`}
                />
              ))
            )}
          </div>
          <div className="btn-container">
            <button
              className="btn-show-card"
              onClick={() => {
                setCurrentUser(user);
                setIsVisibleModalUserCard(true);
              }}
            >
              Ver cartilla
            </button>
          </div>
          {authUser.isAdmin && (
            <Popover
              placement="bottom"
              content={
                <div style={{ display: "flex" }}>
                  <Image
                    src={`${config.storageUrl}/resources/close.svg`}
                    filter="brightness(0.5)"
                    height="15px"
                    width="15px"
                    size="contain"
                    margin="auto 5px"
                  />{" "}
                  <div style={{ margin: "auto" }}>Remover jugador</div>
                </div>
              }
            >
              <div className="more">
                <div />
                <div />
                <div />
              </div>
            </Popover>
          )}
        </div>
      );

    return (
      <div className="user-progress" key={`${user.nickname}-${index}`}>
        <div className="name">{user.nickname}</div>
        <div className={`progress ${user.progress === 100 && winner}`}>
          <Progress percent={30} strokeColor={darkTheme.basic.primary} />
        </div>
        <div className="options">
          <button className="btn-show-card">Ver cartilla</button>
          <div className="more">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    );
  };

  return (
    <TabsContainer>
      {isVisibleModalUserCard && (
        <ModalUserCard
          isVisibleModalUserCard={isVisibleModalUserCard}
          setIsVisibleModalUserCard={setIsVisibleModalUserCard}
          user={currentUser}
          {...props}
        />
      )}
      <div className="tabs-container">
        <div
          className={`tab ${tab === "cards" && "active"}`}
          onClick={() => setTab("cards")}
        >
          Cuadrícula
        </div>
        <div
          className={`tab ${tab === "table" && "active"}`}
          onClick={() => setTab("table")}
        >
          Tabla
        </div>
      </div>
      <div className={`user-tab-${tab === "cards" ? "cards" : "table"}`}>
        {Object.values(props.lobby.users ?? {}).map((user, index) =>
          userContent(user, index)
        )}
      </div>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  width: 100%;

  .btn-show-card {
    height: 21px;
    font-family: Encode Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 14px;
    background: ${(props) => props.theme.basic.secondary};
    color: ${(props) => props.theme.basic.whiteLight};
    border: none;
    padding: 0 5px;
    border-radius: 2px;
  }

  .tabs-container {
    height: 32px;
    background: ${(props) => props.theme.basic.whiteDark};
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
      color: ${(props) => props.theme.basic.primary};
    }

    .active::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .user-tab {
    &-cards {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
      padding: 1rem;

      .user-card {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: ${(props) => props.theme.basic.whiteDark};
        padding: 0.5rem;
        border-radius: 3px;
      }

      .card-preview {
        width: 42px;
        height: 42px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        grid-gap: 1px;
        padding: 3px;
        background: ${(props) => props.theme.basic.blackDarken};
        border-radius: 3px;

        .matrix-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 6px;
          height: 6px;
          border-radius: 2px;
          background: ${(props) => props.theme.basic.blackLighten};
        }

        .active {
          background: ${(props) => props.theme.basic.primary};
        }
      }

      .more {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 25px;
        cursor: pointer;
        div {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.blackLighten};
        }
      }
    }
    &-table {
      width: 100%;
      display: flex;
      flex-direction: column;

      .user-progress {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(3, 1fr);
        height: 40px;
        border: 1px solid #dedede;
        background: ${(props) => props.theme.basic.whiteLight};
        padding: 0 1rem;

        .name {
          font-family: Open Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 18px;
        }

        .progress {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .ant-progress {
            max-width: 250px;
            .ant-progress-inner {
              background: ${(props) => props.theme.basic.grayDark} !important;
            }
          }
        }

        .options {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .more {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 25px;
            cursor: pointer;
            margin-left: 10px;
            div {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: ${(props) => props.theme.basic.blackLighten};
            }
          }
        }
      }

      .winner {
        background: ${(props) => props.theme.basic.primaryLight};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .btn-show-card {
      padding: 0 20px;
      border-radius: 4px;
    }

    .tabs-container {
      height: 32px;
      background: transparent;
      display: flex;
      align-items: center;
      border-bottom: 2px solid ${(props) => props.theme.basic.whiteLight};

      .tab {
        padding: 0.5rem 1rem;
        font-size: 15px;
        line-height: 18px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .active {
        color: ${(props) => props.theme.basic.primaryLight};
      }

      .active::after {
        width: 80%;
        height: 2px;
        background: ${(props) => props.theme.basic.primaryLight};
      }
    }

    .user-tab {
      &-cards {
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      }
    }
  }
`;
