import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { authEvents, config, firestore } from "../../firebase";
import { useFetch } from "../../hooks/useFetch";
import { ButtonBingo } from "../../components/form";

export const Lobby = () => {
  const { Fetch } = useFetch();
  const router = useRouter();
  const { tokenId, gameId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!tokenId || !gameId) return;

    const fetchUserByToken = async () => {
      try {
        const url = `${config.serverUrlEvents}/api/tokens`;
        const { response, error } = await Fetch(url, "POST", { tokenId });

        if (error) return router.push("/login");

        const authUser = response.user;

        if (!authUser) return router.push("/login");

        const gameRef = await firestore.doc(`games/${gameId}`).get();
        const game = gameRef.data();

        if (!game.usersIds.includes(authUser.uid)) return router.push("/login");

        setGame(game);
        setIsAdmin(true);
        setIsLoading(false);
        await router.push({
          pathname: router.asPath.split("?")[0],
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserByToken();
  }, [tokenId, gameId]);

  if (isLoading) return "spin";

  return (
    <LobbyCss>
      <div>
        <ButtonBingo variant="primary" width="100%">
          Día del padre
        </ButtonBingo>
        <div className="container-lobby">
          <div className="item">
            <div>Jugadores vs Jugadores</div>
            <div>1:1 dispositivos</div>
            <ButtonBingo>Clásico</ButtonBingo>
          </div>
          <div className="item">
            <div>Jugadores vs Jugadores</div>
            <div>1:1 dispositivos</div>
            <ButtonBingo>Clásico</ButtonBingo>
          </div>
        </div>
        <ButtonBingo variant="primary" width="100%">
          Opciones del juego
        </ButtonBingo>
      </div>
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  width: 100%;
  margin: auto;
  max-width: 400px;
  color: ${(props) => props.theme.basic.white};

  .container-lobby {
    grid-gap: 5px;
    padding: 10px 5px 5px 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .item {
      background: gray;
      border-radius: 4px;
      text-align: center;
    }
  }
`;
