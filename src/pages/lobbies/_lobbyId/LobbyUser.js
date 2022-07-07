import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { useRouter } from "next/router";
import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Popover } from "antd";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { config, database } from "../../../firebase";
import { mediaQuery, Tablet } from "../../../constants";
import { firebase } from "../../../firebase/config";
import { LobbyHeader } from "./LobbyHeader";
import { spinLoader, spinLoaderMin } from "../../../components/common/loader";
import { Image } from "../../../components/common/Image";
import debounce from "lodash/debounce";
import orderBy from "lodash/orderBy";
import moment from "moment";
import { reserveLobbySeat } from "../../../business";
import { useSendError } from "../../../hooks";
import { useFetch } from "../../../hooks/useFetch";

const userListSizeRatio = 100;

const currentTime = moment().format("x");

export const LobbyUser = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");

  const [users, setUsers] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
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
      UsersQueryRef.on(
        "value",
        debounce((snapshot) => {
          let users_ = [];

          snapshot.forEach((docRef) => {
            const user = docRef.val();
            if (user.state.includes("online")) users_.unshift(user);
          });

          setUserListSize(newUserListSizeRatio);
          setIsLoading(false);
          setUsers(users_);
        }, 100)
      );

    const userQueryListener = fetchUsers();

    return () => UsersQueryRef?.off("value", userQueryListener);
  }, [inView]);

  // Create presence.
  useEffect(() => {
    if (!props.lobby) return;

    if (!authUser) return;
    if (!authUser.lobby) return;
    if (authUser.isAdmin) return setIsPageLoading(false);;

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
      last_changed: currentTime,
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

        // Verifies if lobby can let user in.
        const verifyLobbyAvailability = async () => {
          setIsPageLoading(true);

          try {
            await reserveLobbySeat(Fetch, props.lobby.id, authUser.id, null);

            await userRef.current.set(isOnlineForDatabase);
          } catch (error) {
            console.error(error);
            await sendError(error, "verifyLobbyAvailability");

            props.showNotification("No es posible unirse a lobby.", error?.message);

            await props.logout();
          }

          setIsPageLoading(false);
        };

        verifyLobbyAvailability();
      });

    unSub.current = createPresence();

    return () => userRef.current?.off("value", unSub.current);
  }, [authUser?.id]);

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

  if (isPageLoading) return spinLoader();

  return (
    <LobbyCss {...props}>
      <div className="title">
        <div />
        {props.lobby?.game?.name}
        <div className="right-content">{btnExit}</div>
      </div>

      <LobbyHeader {...props} />

      <div className="container-users">
        {!authUser?.isAdmin && (
          <div className="notification-joint-user font-bold text-white bg-greenDark text-base sm:text-lg py-2 px-4 flex justify-between md:justify-center items-center min-w-[140px] border-b-[1px] border-primary">
            <span>Entró correctamente al juego.</span>
            <div className="inline-block bg-primary p-2 m-2 rounded shadow-xl text-center">
              {authUser.nickname} (Tú)
            </div>
          </div>
        )}

        <Tablet>
          {!authUser?.isAdmin && (
            <div className="font-bold text-white text-lg text-left my-4 px-4">
              El administrador iniciará el juego pronto
            </div>
          )}
          <div className="user-count bg-primaryDark text-white font-bold rounded m-4 py-2 px-4 self-end w-min">
            <span className="whitespace-nowrap">
              <span className="align-text-top">{props.lobby?.countPlayers ?? 0}</span>
              <span className="w-[45px] inline-block" />
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

        <div>
          <TransitionGroup className="grid grid-cols-[1fr_1fr_1fr] max-w-[1000px] gap-[4px] mx-auto md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-[10px] my-4">
            {orderBy(users, ["last_changed"], ["desc"]).map((user) => (
              <CSSTransition key={user.userId} classNames="itemfade" timeout={500}>
                <div key={user.userId}
                  className={`px-[10px] py-[8px] md:text-lg text-base text-center rounded-[5px] text-white font-bold md:py-[12px] px-[10px] overflow-hidden text-ellipsis ${
                    authUser.id === user.userId ? "bg-primary" : "bg-secondaryDarken"
                  }`}
                >
                  {user.nickname}
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
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
  }

  .loading-section {
    height: 20px;
  }

  .itemfade-enter {
    opacity: 0.01;
  }

  .itemfade-enter.itemfade-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .itemfade-leave {
    opacity: 1;
  }

  .itemfade-leave.itemfade-leave-active {
    opacity: 0.01;
    transition: opacity 500ms ease-in;
  }
`;
