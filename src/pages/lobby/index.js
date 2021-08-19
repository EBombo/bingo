import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { authEvents, firestore } from "../../firebase";

export const Lobby = () => {
  const router = useRouter();
  const { tokenId, gameId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!tokenId && !gameId) return router.push("/login");

    const fetchUserByToken = async (tokenId) => {
      const authUser = await authEvents.verifyIdToken(tokenId);

      if (!authUser) return router.push("/login");

      const gameRef = await firestore.doc(`games/${gameId}`).get();
      const game = gameRef.data();

      if (!game.usersIds.includes(authUser.uid)) return router.push("/login");

      setGame(game);

      setIsLoading(false);
    };

    fetchUserByToken(tokenId);
  }, [tokenId, gameId]);

  return (
    <LobbyCss>
      Lobby {String(isLoading)} {game?.name}
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  color: ${(props) => props.theme.basic.white};
`;
