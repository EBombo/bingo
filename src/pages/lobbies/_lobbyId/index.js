import React, { useEffect, useGlobal, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LoadingGame } from "./LoadingGame";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [authUser] = useGlobal("user");
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return router.push("/");
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
          return router.push("/login");
        }

        setLobby(currentLobby);
        setLoading(false);
      });

    const sub = fetchLobby();
    return () => sub && sub();
  }, [lobbyId]);

  if (isLoading || !authUser || !lobby) return spinLoaderMin();

  if (lobby.startAt) return <LoadingGame lobby={lobby} {...props} />;

  return authUser.isAdmin ? (
    <LobbyAdmin lobby={lobby} {...props} />
  ) : (
    <LobbyUser lobby={lobby} {...props} />
  );
};
