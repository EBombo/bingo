import React, { useEffect, useGlobal, useState } from "reactn";
import { database, firebase, firestore } from "../../../firebase";
import { useRouter } from "next/router";
import { spinLoaderMin } from "../../../components/common/loader";
import { LobbyAdmin } from "./lobbyAdmin";
import { LobbyUser } from "./LobbyUser";
import { LoadingGame } from "./LoadingGame";
import { BingoGame } from "./BingoGame";
import { useUser } from "../../../hooks";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");
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
    if (
      !lobby ||
      !lobby?.startAt ||
      lobby.bingoCardsDistributed ||
      authUser.isAdmin
    )
      return;

    const userStatusDatabaseRef = database.ref(
      `lobbies/${lobby.id}/users/${authUser.id}`
    );

    const card = getBingoCard();

    const createCardOnUser = async () => {
      const addCard = {
        ...authUser,
        card: JSON.stringify(card),
        state: "online",
      };

      database.ref(".info/connected").on("value", async (snapshot) => {
        userStatusDatabaseRef.set(addCard);
      });
    };

    setAuthUserLs({
      ...authUser,
      card: JSON.stringify(card),
    });
    setAuthUser({
      ...authUser,
      card: JSON.stringify(card),
    });
    createCardOnUser();
  }, [lobby]);

  const transpose = (matrix) => {
    return Object.keys(matrix[0]).map(function (c) {
      return matrix.map((r) => {
        return r[c];
      });
    });
  };

  const getBingoCard = () => {
    let arr = [
      [], // b (1-15)
      [], // i (16-30)
      [], // n (31-45)
      [], // g (46-60)
      [], // o (51-75)
    ];

    for (let i = 0; i < arr.length; i++) {
      let min = i * 15 + 1;
      let max = min + 15;

      while (arr[i].length < 5) {
        let num = Math.floor(Math.random() * (max - min)) + min;

        if (!arr[i].includes(num)) {
          arr[i].push(num);
        }
      }

      arr[i].sort((a, b) => a - b);
    }

    return transpose(arr);
  };

  if (isLoading || (!authUser?.nickname && !authUser.isAdmin) || !lobby)
    return spinLoaderMin();

  if (lobby.bingoCardsDistributed)
    return <BingoGame lobby={lobby} {...props} />;

  if (lobby.startAt) return <LoadingGame lobby={lobby} {...props} />;

  return authUser.isAdmin ? (
    <LobbyAdmin lobby={lobby} {...props} />
  ) : (
    <LobbyUser lobby={lobby} {...props} />
  );
};
