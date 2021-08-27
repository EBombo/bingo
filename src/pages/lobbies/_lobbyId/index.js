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
    if (!pin) return router.push("/login");

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
        <div className="pin-label">Pin del juego:</div>
        <div className="pin">{pin}</div>
      </div>
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  .item-pin {
    width: 100%;
    height: 370px;
    font-size: 20px;
    max-width: 400px;
    border-radius: 50%;
    padding-top: 175px;
    text-align: center;
    margin: -175px auto auto auto;
    color: ${(props) => props.theme.basic.white};
    box-shadow: 0 25px 0 ${(props) => props.theme.basic.secondaryDark};

    .pin-label {
      font-size: 2rem;
    }

    .pin {
      font-size: 2rem;
    }

    .label {
      background: ${(props) => props.theme.basic.white};
      color: ${(props) => props.theme.basic.black};
    }
  }
`;
