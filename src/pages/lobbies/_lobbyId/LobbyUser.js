import { Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import { config, database, firebase, firestore, hostName } from "../../../firebase";
import { Image } from "../../../components/common/Image";
import { Desktop, mediaQuery, Tablet } from "../../../constants";
import { UserLayout } from "./userLayout";
import { ButtonBingo } from "../../../components/form";

let alreadyRun = false;

export const LobbyUser = (props) => {
  const [authUser] = useGlobal("user");
  const [users, setUsers] = useState([]);
  const { ref, inView, entry } = useInView({ threshold: 0 });
  const [isOnline, setIsOnline] = useState(false);

  const isFirstRun = useRef(true);

  useEffect(() => {
    // skip first run
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const incrementCountPlayer = async () => {
      await firestore.doc(`lobbies/${props.lobby.id}`).update({
        countPlayers: isOnline
          ? firebase.firestore.FieldValue.increment(1)
          : firebase.firestore.FieldValue.increment(-1),
      });
    };

    incrementCountPlayer();
    console.log(`isOnline`, isOnline);
  }, [isOnline]);

  useEffect(() => {
    window.addEventListener("unload", async function (event) {
      await firestore.doc(`lobbies/${props.lobby.id}`).update({
        countPlayers: firebase.firestore.FieldValue.increment(-1),
      });
    });

    const listenUserState = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${props.lobby.id}/users/${authUser.id}`);

      userStatusDatabaseRef.on("value", async (snapshot) => {
        const user = snapshot.val();
        setIsOnline(user?.state === "online");
      });
    };
    console.log("execution listenUserState");

    listenUserState();
  }, []);

  useEffect(() => {
    if (!props.lobby) return;
    if (!authUser) return;
    if (alreadyRun) return;
    alreadyRun = true;
    console.log("execution setPresence");

    const userStatusDatabaseRef = database.ref(`lobbies/${props.lobby.id}/users/${authUser.id}`);

    const user = {
      email: authUser?.email ?? null,
      userId: authUser?.id ?? null,
      nickname: authUser?.nickname ?? null,
      avatar: authUser?.avatar ?? null,
      lobbyId: props.lobby.id,
    };

    const createPresence = async () => {
      const isOfflineForDatabase = {
        ...user,
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineForDatabase = {
        ...user,
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      database.ref(".info/connected").on("value", async (snapshot) => {
        console.log(`info/connected ${snapshot.val()}`);
        if (!snapshot.val()) return;

        await userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase);

        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    };

    createPresence();

    return async () => {
      await userStatusDatabaseRef.set({
        ...user,
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      });
    };
  }, [props.lobby, authUser]);

  // useEffect(() => {
  //   if (!props.lobby) return;
  //
  //   const fetchUsers = async () => {
  //     const userStatusDatabaseRef = database.ref(`lobbies/${lobbyId}/users`);
  //
  //     userStatusDatabaseRef.on("value", (snapshot) => {
  //       let users_ = Object.values(snapshot.val() ?? {});
  //       users_ = users_.filter((user) => user.state.includes("online"));
  //       users_ = orderBy(users_, ["last_changed"], ["desc"]);
  //       setUsers(users_);
  //     });
  //   };
  //
  //   fetchUsers();
  // }, [props.lobby]);

  const content = () => (
    <>
      <UserLayout {...props} />

      <div className="header">
        <div className="item-pin">
          <Tooltip placement="bottom" title="Click aquí para copiar el link de ebombo con pin">
            <div
              className="label"
              onClick={() => {
                navigator.clipboard.writeText(`${hostName}?pin=${props.lobby?.pin}`);
                props.showNotification("OK", "Link copiado!", "success");
              }}
            >
              {props.lobby.isLocked ? (
                "Este juego esta bloqueado"
              ) : (
                <>
                  Entra a <span className="font-black">ebombo.io</span>
                </>
              )}
            </div>
          </Tooltip>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">
            {props.lobby.isLocked ? (
              <ButtonBingo variant="primary" margin="10px 20px">
                <Image
                  cursor="pointer"
                  src={`${config.storageUrl}/resources/lock.svg`}
                  height="24px"
                  width="24px"
                  size="contain"
                  margin="auto"
                />
              </ButtonBingo>
            ) : (
              <div
                onClick={() => {
                  navigator.clipboard.writeText(props.lobby.pin);
                  props.showNotification("OK", "PIN copiado!", "success");
                }}
              >
                <Tooltip placement="bottom" title="Click aquí para copiar el PIN">
                  {props.lobby?.pin}
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="logo">
          <Image src={`${config.storageUrl}/resources/white-icon-ebombo.png`} width="180px" height="auto" margin="0" />
        </div>
        <div className="message">Ya estás adentro :)</div>
        <div className="message">¿Ves tu nombre en pantalla?</div>
        <div className="item-user">{authUser?.nickname}</div>

        <div className="container-users">
          <div className="all-users">
            {users?.length ?? 0} <UserOutlined />
          </div>
          <div className="list-users">
            {users.map((user) => (
              <div key={user.userId} className="item-user">
                {user.nickname}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SuccessInscriptionContainer>
      <Tablet>
        <Container bgImg={`${config.storageUrl}/resources/balls/coral-pattern-tablet.svg`}>{content()}</Container>
      </Tablet>
      <Desktop>
        <Container bgImg={`${config.storageUrl}/resources/balls/coral-pattern.svg`}>{content()}</Container>
      </Desktop>
    </SuccessInscriptionContainer>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: contain;
  background-position: center;
`;

const SuccessInscriptionContainer = styled.div`
  width: 100%;

  ${mediaQuery.afterTablet} {
    .message {
      font-size: 34px;
      line-height: 41px;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .message {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 30px;
    margin: 1rem auto;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }

  .item-user {
    width: 150px;
    padding: 5px 10px;
    text-align: center;
    border-radius: 5px;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.primary};
    margin: 2rem auto;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;

    ${mediaQuery.afterTablet} {
      width: 200px;
      padding: 15px 10px;
      font-size: 20px;
      line-height: 24px;
    }
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    padding: 2rem 1rem 2rem 1rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.theme.basic.secondary};

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: auto;

      align-items: start;
    }

    .right-menus {
      margin-left: 0.25rem;
      justify-content: flex-end;

      .btn-start {
        padding: 11px 36px !important;
        ${mediaQuery.afterTablet} {
          padding: 11px 72px !important;
        }
      }
    }

    .right-menus,
    .left-menus {
      text-align: center;
      display: flex;
      align-items: center;
    }

    .left-menus {
      margin-right: 0.25rem;
      justify-content: flex-start;

      button {
        width: 45px;
        box-shadow: none;
        margin: 0 0.5rem 0 0;
      }
    }

    .item-pin {
      font-size: 21px;
      border-radius: 4px 4px 0px 0px;
      text-align: center;
      margin: 0 0 2rem 0;
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.secondaryDarken};
      box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);

      grid-column: 1 / 3;
      grid-row: 1 / 2;

      ${mediaQuery.afterTablet} {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        margin: 0;
      }

      .label {
        background: ${(props) => props.theme.basic.white};
        color: ${(props) => props.theme.basic.black};
        font-style: normal;
        font-weight: normal;
        cursor: pointer;
      }

      .pin-label {
        display: inline-block;
        font-size: 1.25rem;
        font-weight: 900;
        vertical-align: super;
        margin: 0 0.25rem;

        ${mediaQuery.afterTablet} {
          margin: 0 0.5rem 0 1.5rem;
          font-size: 2.5rem;
        }
      }

      .pin {
        display: inline-block;
        font-size: 2.5rem;
        cursor: pointer;
        font-weight: 900;
        margin: 0 0.25rem;

        ${mediaQuery.afterTablet} {
          margin: 0 1.5rem 0 0.5rem;
          font-size: 5rem;
        }
      }
    }
  }
`;
