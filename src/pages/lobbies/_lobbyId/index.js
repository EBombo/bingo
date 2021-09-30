import React, { useEffect, useGlobal, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LoadingGame } from "./LoadingGame";
import { BingoGame } from "./play/BingoGame";
import { useUser } from "../../../hooks";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [, setAuthUserLs] = useUser();
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useGlobal("user");

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

        if (!currentLobby || currentLobby.isClosed) {
          props.showNotification(
            "UPS",
            "No encontramos tu sala, intenta nuevamente",
            "warning"
          );
          logout();
          return router.push("/login");
        }

        setLobby(currentLobby);
        setLoading(false);
      });

    const sub = fetchLobby();
    return () => sub && sub();
  }, [lobbyId]);

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby)
    return spinLoaderMin();

  if (lobby?.isPlaying)
    return <BingoGame lobby={lobby} {...props} logout={logout} />;

  if (lobby?.startAt) return <LoadingGame lobby={lobby} {...props} />;

  if (authUser?.isAdmin) return <LobbyAdmin lobby={lobby} {...props} />;

  return <LobbyUser lobby={lobby} {...props} logout={logout} />;
};
