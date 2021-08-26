import React, { useEffect, useGlobal, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import styled from "styled-components";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId: pin } = router.query;
  const [game, setGame] = useState(null);
  const [isLoading, setIdLoading] = useState(true);
  const [isAdmin] = useGlobal("isAdmin");

  useEffect(() => {
    if (!pin) return;

    const fetchGameByPin = async () => {
      const gameRef = await firestore
        .collection("games")
        .where("isClosed", "==", false)
        .where("pin", "==", pin)
        .get();

      setGame(snapshotToArray(gameRef));
      setIdLoading(false);
    };

    fetchGameByPin();
  }, [pin]);

  return (
    <LobbyCss>
      <div className="item-pin">
        <div className="label">Entra a www.ebombo.it</div>
        <div>Pin del juego:</div>
        <div>{pin}</div>
      </div>
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  .item-pin {
    width: 100%;
    margin: auto;
    height: 200px;
    font-size: 20px;
    max-width: 400px;
    text-align: center;
    color: ${(props) => props.theme.basic.white};
    box-shadow: 0 7px 0 ${(props) => props.theme.basic.black};
    border-radius: 50%;

    .label {
      background: ${(props) => props.theme.basic.white};
      color: ${(props) => props.theme.basic.black};
    }
  }
`;
