import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LobbyLoading } from "./LobbyLoading";
import { LobbyInPlay } from "./play/LobbyInPlay";
import { useUser } from "../../../hooks";
import { LobbyClosed } from "./closed/LobbyClosed";
import { snapshotToArray } from "../../../utils";
import { useMemo } from "react";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;

  const [authUserLs, setAuthUserLs] = useUser();

  const [authUser, setAuthUser] = useGlobal("user");

  const [lobby, setLobby] = useState(null);
  const [users, setUsers] = useState({});
  const [isLoading, setLoading] = useState(true);

  const audioRef = useRef(null);

  const logout = async () => {
    const userId = firestore.collection("users").doc().id;

    const userMapped = {
      id: userId,
      email: authUserLs.email,
      avatar: authUserLs.avatar,
      nickname: authUserLs.nickname,
    };

    await setAuthUser(userMapped);
    setAuthUserLs(userMapped);

    await router.push("/");
  };

  useEffect(() => {
    if (!authUser?.nickname && !authUser.isAdmin) return router.push("/");
  }, [authUser]);

  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = () =>
      firestore.doc(`lobbies/${lobbyId}`).onSnapshot(async (lobbyRef) => {
        const currentLobby = lobbyRef.data();

        // Lobby not found.
        if (!currentLobby) {
          props.showNotification("UPS", "No encontramos tu sala, intenta nuevamente", "warning");
          logout();
        }

        // If the game is closed logout user.
        if (currentLobby?.isClosed && !authUser?.isAdmin) return logout();

        setAuthUserLs({ ...authUser, lobby: currentLobby });
        await setAuthUser({ ...authUser, lobby: currentLobby });

        setLobby(currentLobby);
        setLoading(false);
      });

    const fetchUsers = () =>
      firestore
        .collection("lobbies")
        .doc(lobbyId)
        .collection("users")
        .onSnapshot((usersRef) => {
          const users_ = snapshotToArray(usersRef);

          const usersMapped = users_.reduce((usersSum, user) => ({ ...usersSum, [user.id]: user }), {});

          setUsers(usersMapped);
        });

    const unSubLobby = fetchLobby();
    const unSubUsers = fetchUsers();
    return () => {
      unSubLobby && unSubLobby();
      unSubUsers && unSubUsers();
    };
  }, [lobbyId]);

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

  if (lobbyIsClosed) return <LobbyClosed {...additionalProps} />;

  if (lobby?.isPlaying) return <LobbyInPlay {...additionalProps} />;

  if (lobby?.startAt) return <LobbyLoading {...additionalProps} />;

  if (authUser?.isAdmin) return <LobbyAdmin {...additionalProps} />;

  return <LobbyUser {...additionalProps} />;
};
