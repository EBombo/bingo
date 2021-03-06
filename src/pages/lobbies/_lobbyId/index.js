import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { bomboGamesDomain, firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyUser } from "./LobbyUser";
import { LobbyLoading } from "./LobbyLoading";
import { LobbyInPlay } from "./play/LobbyInPlay";
import { useUser } from "../../../hooks";
import { LobbyClosed } from "./closed/LobbyClosed";
import { snapshotToArray } from "../../../utils";
import { useMemo } from "react";
import { timeoutPromise } from "../../../utils/promised";
import UrlAssembler from "url-assembler";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [authUserLs, setAuthUserLs] = useUser();

  const [authUser, setAuthUser] = useGlobal("user");

  const [lobby, setLobby] = useState(null);
  const [users, setUsers] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isClose, setIsClose] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    router.prefetch("/");
  }, []);

  useEffect(() => {
    // Redirect to login.
    if (!authUser?.nickname && !authUser.isAdmin && typeof window !== "undefined") window.location.href = "/";
  }, [authUser]);

  const logout = async (isClosed = false, _lobby = null) => {
    // Prevent multiple runs
    if (isClose) return;
    setIsClose(true);

    let feedbackUrl;

    if (isClosed && _lobby) {
      feedbackUrl = UrlAssembler(bomboGamesDomain)
        .template("/lobbies/:lobbyId/users/:userId")
        .param("lobbyId", _lobby.id)
        .param("userId", authUser.id)
        .toString();
    }

    const userMapped = {
      id: firestore.collection("users").doc().id,
      email: authUserLs?.email,
      avatar: authUserLs?.avatar,
      nickname: authUserLs?.nickname,
    };

    await setAuthUser(userMapped);
    setAuthUserLs(userMapped);

    if (typeof window !== "undefined") {
      window.location.href = feedbackUrl ?? "/";
      await timeoutPromise(5000);
    }
  };

  // Fetch lobby.
  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = () =>
      firestore.doc(`lobbies/${lobbyId}`).onSnapshot(async (lobbyRef) => {
        const currentLobby = lobbyRef.data();

        // Lobby not found.
        if (!currentLobby) {
          props.showNotification("UPS", "No encontramos tu sala, intenta nuevamente", "warning");
          await logout();
        }

        // If the game is closed logout user.
        if (currentLobby?.isClosed && !authUser?.isAdmin) return await logout(true, currentLobby);

        setAuthUserLs({ ...authUser, lobby: currentLobby });
        await setAuthUser({ ...authUser, lobby: currentLobby });

        setLobby(currentLobby);
        setLoading(false);
      });

    const unSubLobby = fetchLobby();
    return () => unSubLobby && unSubLobby();
  }, [lobbyId]);

  // Fetch users.
  useEffect(() => {
    if (!lobby) return;

    const fetchUsers = () => {
      let usersQueryRef = firestore.collection("lobbies").doc(lobbyId).collection("users");

      if (!lobby.settings?.showParticipants && !authUser.isAdmin)
        usersQueryRef = usersQueryRef.where("id", "==", authUser.id).limit(1);

      return usersQueryRef.onSnapshot((usersRef) => {
        const users_ = snapshotToArray(usersRef);

        const usersMapped = users_.reduce((usersSum, user) => {
          if (user.hasExited === true) return usersSum;

          return { ...usersSum, [user.id]: user };
        }, {});

        setUsers(usersMapped);
      });
    };

    const unSubUsers = fetchUsers();
    return () => unSubUsers && unSubUsers();
  }, [lobby]);

  const lobbyWithUsers = useMemo(() => {
    if (!lobby) return null;
    if (!users) return { ...lobby, users: {} };

    return { ...lobby, users };
  }, [lobby, users]);

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby) return spinLoaderMin();

  const additionalProps = {
    lobby: lobbyWithUsers,
    audioRef: audioRef,
    logout: logout,
    ...props,
  };

  const lobbyIsClosed = lobby?.isClosed && authUser?.isAdmin;

  /** Game report. **/
  if (lobbyIsClosed) return <LobbyClosed {...additionalProps} />;

  /** The game is playing. **/
  if (lobby?.isPlaying) return <LobbyInPlay {...additionalProps} />;

  /** Loading page. **/
  if (lobby?.startAt) return <LobbyLoading {...additionalProps} />;

  /** Before starting the game. **/
  return <LobbyUser {...additionalProps} />;
};
