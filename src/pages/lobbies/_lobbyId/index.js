import React, { useEffect, useGlobal, useState } from "reactn";
import { firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LoadingGame } from "./LoadingGame";
import {BingoGame} from "./BingoGame";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [authUser] = useGlobal("user");
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);

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
          return router.push("/login");
        }

        setLobby(currentLobby);
        setLoading(false);
      });

    const sub = fetchLobby();
    return () => sub && sub();
  }, [lobbyId]);

  useEffect(() => {
    if (!lobby || !lobby?.startAt) return;

    //generar cartilla para los usuarios
    console.log("generar cartilla para los usuarios");
  }, [lobby]);

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby)
    return spinLoaderMin();

  if(lobby.bingoCardsDistributed) return <BingoGame lobby={lobby} {...props} />;

  if (lobby.startAt) return <LoadingGame lobby={lobby} {...props} />;

  return authUser.isAdmin ? (
    <LobbyAdmin lobby={lobby} {...props} />
  ) : (
    <LobbyUser lobby={lobby} {...props} />
  );
};
