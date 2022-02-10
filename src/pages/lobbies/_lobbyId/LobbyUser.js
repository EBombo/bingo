import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { useRouter } from "next/router";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Popover } from "antd";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { config, database } from "../../../firebase";
import { mediaQuery, Tablet } from "../../../constants";
import { firebase } from "../../../firebase/config";
import { LobbyHeader } from "./LobbyHeader";
import { spinLoaderMin } from "../../../components/common/loader";
import { Image } from "../../../components/common/Image";

const userListSizeRatio = 100;

export const LobbyUser = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [authUser] = useGlobal("user");

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userListSize, setUserListSize] = useState(0);
  const { ref: scrollTriggerRef, inView } = useInView({ threshold: 0 });

  const userRef = useRef(null);
  const unSub = useRef(null);

  // Common.
  useEffect(() => {
    if (!props.lobby) return;
    if (!inView) return;

    setIsLoading(true);
    const newUserListSizeRatio = userListSize + userListSizeRatio;

    // Realtime database cannot sort descending.
    // Reference orderByChild: https://firebase.google.com/docs/database/web/lists-of-data?authuser=0#sort_data
    // Reference limitToLast: https://firebase.google.com/docs/database/web/lists-of-data?authuser=0#filtering_data
    const UsersQueryRef = database
      .ref(`lobbies/${lobbyId}/users`)
      .orderByChild("last_changed")
      .limitToLast(newUserListSizeRatio);

    const fetchUsers = () =>
      UsersQueryRef.on("value", (snapshot) => {
        let users_ = [];

        snapshot.forEach((docRef) => {
          const user = docRef.val();
          if (user.state.includes("online")) users_.unshift(user);
        });

        setUserListSize(newUserListSizeRatio);
        setIsLoading(false);
        setUsers(users_);
      });

    const userQueryListener = fetchUsers();

    return () => UsersQueryRef?.off("value", userQueryListener);
  }, [inView]);

  // Create presence.
  useEffect(() => {
    if (!props.lobby) return;

    if (!authUser) return;
    if (!authUser.lobby) return;
    if (authUser.isAdmin) return;

    const mappedUser = {
      email: authUser?.email ?? null,
      userId: authUser?.id ?? null,
      nickname: authUser?.nickname ?? null,
      avatar: authUser?.avatar ?? null,
      lobbyId: props.lobby.id,
    };

    const isOfflineForDatabase = {
      ...mappedUser,
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      ...mappedUser,
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    // Create reference.
    userRef.current = database.ref(`lobbies/${props.lobby.id}/users/${authUser.id}`);

    // Reference:
    // https://firebase.google.com/docs/firestore/solutions/presence
    const createPresence = () =>
      database.ref(".info/connected").on("value", async (snapshot) => {
        if (!snapshot?.val) return;
        if (!snapshot.val()) return;

        // Reference: https://firebase.google.com/docs/reference/node/firebase.database.OnDisconnect
        await userRef.current.onDisconnect().set(isOfflineForDatabase);

        userRef.current.set(isOnlineForDatabase);
      });

    unSub.current = createPresence();

    return () => userRef.current?.off("value", unSub.current);
  }, [authUser]);

  // Disconnect presence.
  useEffect(() => {
    // Update to offline when user doesn't have LOBBY and is not ADMIN.
    if (authUser?.lobby || authUser?.isAdmin) return;

    const isOfflineForDatabase = {
      state: "offline",
      userId: authUser?.id ?? null,
      email: authUser?.email ?? null,
      avatar: authUser?.avatar ?? null,
      nickname: authUser?.nickname ?? null,
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    return () => {
      userRef.current.set(isOfflineForDatabase);
      userRef.current?.off("value", unSub.current);
    };
  }, [authUser]);

  const btnExit = useMemo(() => {
    if (!authUser) return null;
    if (authUser.isAdmin) return null;

    return (
      <Popover
        trigger="click"
        content={
          <div>
            <div onClick={async () => props.logout()} style={{ cursor: "pointer" }}>
              Salir
            </div>
          </div>
        }
      >
        <div className="icon-menu">
          <MoreOutlined />
        </div>
      </Popover>
    );
  }, [authUser]);

  return (
    <LobbyCss {...props}>
      <div className="title">
        <div />
        {props.lobby?.game?.name}
        <div className="right-content">{btnExit}</div>
      </div>

      <LobbyHeader {...props} />

      <div className="container-users">
        <Tablet>
          { !authUser?.isAdmin && (
            <div className="font-bold text-white text-lg text-center my-4">
              El administrador iniciará el juego pronto
            </div>
          )}
          <div className="user-count bg-primaryDark text-white font-bold rounded m-4 py-2 px-4 self-end w-min">
            <span className="whitespace-nowrap">
              <span className="align-text-top">{props.lobby?.countPlayers ?? 0}</span>
              <span className="w-[15px] inline-block"></span>
              <Image
                className="inline-block align-sub"
                src={`${config.storageUrl}/resources/user.svg`}
                height="15px"
                width="15px"
                size="contain"
              />
            </span> 
          </div>
        </Tablet>

        { !authUser?.isAdmin && (
          <div className="notification-joint-user font-bold text-white bg-green-800 text-center sm:text-lg py-2">
            Entró correctamente al juego.
            <div className="inline-block bg-primary p-2 m-2 rounded shadow-xl">{authUser.nickname} (Tú)</div>
          </div>
        )}

        <div className="list-users  p-4">
          {users.map((user) => (
            <div key={user.userId} className={`item-user ${authUser.id === user.userId && 'active'}`}>
              {user.nickname}
            </div>
          ))}
        </div>
      </div>

      {isLoading && spinLoaderMin()}
      <div ref={scrollTriggerRef} className="loading-section" />
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  min-height: 100vh;
  background-image: url("${(props) => `${config.storageUrl}/resources/balls/coral-pattern-tablet.svg`}");

  ${mediaQuery.afterTablet} {
    width: auto;
  }

  .title {
    text-align: center;
    background: ${(props) => props.theme.basic.white};
    color: ${(props) => props.theme.basic.black};
    padding: 0.5rem 0;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;

    ${mediaQuery.afterTablet} {
      font-size: 2rem;
    }

    .right-content {
      display: flex;
      justify-content: flex-end;

      .icon-menu {
        cursor: pointer;
        width: 40px;
        height: 100%;
        display: flex;

        .anticon {
          margin: auto;
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }
  }

  .container-users {

    .all-users {
      width: fit-content;
      border-radius: 3px;
      margin-bottom: 2rem;
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.primaryDark};
      font-weight: bold;

      span {
        vertical-align: baseline;
      }
    }

    .list-users {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
      }

      .item-user {
        padding: 8px 10px;
        text-align: center;
        border-radius: 5px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.secondaryDarken};
        font-weight: bold;

        ${mediaQuery.afterTablet} {
          padding: 12px 10px;
        }

        &.active {
          background: ${(props) => props.theme.basic.primaryDarken};
        }
      }
    }
  }

  .loading-section {
    height: 20px;
  }
`;
