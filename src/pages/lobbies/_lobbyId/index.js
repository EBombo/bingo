import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LobbyLoading } from "./LobbyLoading";
import { LobbyPlay } from "./play/LobbyPlay";
import { useUser } from "../../../hooks";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [, setAuthUserLs] = useUser();
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useGlobal("user");

  const audioRef = useRef(null);

  const logout = async () => {
    await setAuthUser({ id: firestore.collection("users").doc().id });
    setAuthUserLs(null);
    router.push("/");
  };

  useEffect(() => {
    if (!authUser?.nickname && !authUser.isAdmin) return router.push("/");
  }, [authUser]);

  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = () =>
      firestore.doc(`lobbies/${lobbyId}`).onSnapshot((lobbyRef) => {
        const currentLobby = lobbyRef.data();

        // Lobby not found.
        if (!currentLobby) {
          props.showNotification("UPS", "No encontramos tu sala, intenta nuevamente", "warning");
          logout();
        }

        // Game is closed.
        if (currentLobby.isClosed) logout();

        setLobby(currentLobby);
        setLoading(false);
      });

    const sub = fetchLobby();
    return () => sub && sub();
  }, [lobbyId]);

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby) return spinLoaderMin();

  const additionalProps = {
    audioRef: audioRef,
    logout: logout,
    lobby: lobby,
    ...props,
  };

  if (lobby?.isPlaying) return <LobbyPlay {...additionalProps} />;

  if (lobby?.startAt) return <LobbyLoading {...additionalProps} />;

  if (authUser?.isAdmin) return <LobbyAdmin {...additionalProps} />;

  return <LobbyUser {...additionalProps} />;
};
