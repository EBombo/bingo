import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import { config, database, firestore } from "../../../firebase";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { firebase } from "../../../firebase/config";
import { useInView } from "react-intersection-observer";
import { LobbyHeader } from "./LobbyHeader";

const userListSizeRatio = 50;

export const LobbyUser = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [authUser] = useGlobal("user");

  const [users, setUsers] = useState([]);
  const [userListSize, setUserListSize] = useState(100);
  const { ref: scrollTriggerRef, inView } = useInView({ threshold: 0 });
  const [isOnline, setIsOnline] = useState(false);

  // common
  useEffect(() => {
    if (!props.lobby) return;
    if (!inView) return;

    const usersQuery = () =>
      database.ref(`lobbies/${lobbyId}/users`).orderByChild("last_changed").limitToLast(userListSize);

    let userQueryListener;
    let UsersQueryRef = usersQuery();
    const fetchUsers = async () => {
      userQueryListener = UsersQueryRef.on("value", (snapshot) => {
        let users_ = [];

        snapshot.forEach((docRef) => {
          const user = docRef.val();
          if (!authUser.isAdmin && user.userId === authUser.id) return
          if (user.state.includes("online")) users_.unshift(user);
        })

        setUserListSize(userListSize + userListSizeRatio);
        setUsers(users_);
      });
    };

    fetchUsers();

    return () => {
      UsersQueryRef?.off("value", userQueryListener);
    };
  }, [inView]);

  if (!authUser.isAdmin) {
    const isFirstRun = useRef(true); 
    useEffect(() => {
      // skip first run
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      const incrementCountPlayer = async () => {
        await firestore.doc(`lobbies/${props.lobby.id}`).update({
          countPlayers: isOnline ? firebase.firestore.FieldValue.increment(1) : firebase.firestore.FieldValue.increment(-1),
        });
      };

      incrementCountPlayer();
    }, [isOnline]);

    useEffect(() => {
      window.addEventListener('unload', async function(event) {
        await firestore.doc(`lobbies/${props.lobby.id}`).update({
          countPlayers: firebase.firestore.FieldValue.increment(-1),
        });
      });

      let userStatusDatabaselistener;
      let userStatusDatabaseRef;
      const listenUserState = async () => {
        userStatusDatabaseRef = database.ref(`lobbies/${props.lobby.id}/users/${authUser.id}`);

        userStatusDatabaselistener = userStatusDatabaseRef.on("value", async (snapshot) => {
          const user = snapshot.val();
          setIsOnline(user?.state === 'online');

        });
      };

      listenUserState();

      return () => {
        userStatusDatabaseRef?.off("value", userStatusDatabaselistener);
      };
    }, []);

    const alreadyRun = useRef(false);
    useEffect(() => {
      if (!props.lobby) return;
      if (!authUser) return;
      if (alreadyRun.current) return;
      alreadyRun.current = true;

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
      }
    }, [props.lobby, authUser]);
  }

  return (
    <LobbyCss {...props}>
      <div className="title">{props.lobby?.game?.name}</div>
      <LobbyHeader {...props} />

      <div className="container-users">
        <div className="all-users">
          {props.lobby?.countPlayers ?? 0} <UserOutlined />
        </div>
        <div className="list-users">
          { !authUser.isAdmin && (
            <div className="item-user">{authUser?.nickname}</div>
          )}
          {users.map((user, i) => (
            <div key={`user-${i}`} className="item-user">
              {user.nickname}
            </div>
          ))}
        </div>
      </div>

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
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    ${mediaQuery.afterTablet} {
      font-size: 2rem;
    }
  }

  .container-users {
    padding: 10px 15px;

    ${mediaQuery.afterTablet} {
      padding: 10px 5rem;
    }

    .all-users {
      padding: 5px 10px;
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
      }
    }
  }

  .loading-section {
    height: 20px;
  }
`;
