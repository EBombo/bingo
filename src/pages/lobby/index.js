import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { config, firestore } from "../../firebase";
import { useFetch } from "../../hooks/useFetch";

export const Lobby = () => {
  const { Fetch } = useFetch();
  const router = useRouter();
  const { tokenId, gameId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!tokenId && !gameId) return router.push("/login");

    const fetchUserByToken = async (tokenId) => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens/${tokenId}`;

        const { response, error } = await Fetch(url);

        if (error) return router.push("/login");

        const authUser = response.user;

        console.log("authUser", authUser);
        if (!authUser) return router.push("/login");

        const gameRef = await firestore.doc(`games/${gameId}`).get();
        const game = gameRef.data();

        if (!game.usersIds.includes(authUser.uid)) return router.push("/login");

        setGame(game);
        setIsAdmin(true);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
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
