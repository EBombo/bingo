import { LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { spinLoaderMin } from "../../../components/common/loader";
import React, { useEffect, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { database, firestore } from "../../../firebase";
import { ButtonBingo } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { LoadingGame } from "./LoadingGame";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [users, setUsers] = useState([]);
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = async () => {
      const lobbyRef = await firestore.collection("lobbies").doc(lobbyId).get();

      if (!lobbyRef.exists) {
        props.showNotification(
          "UPS",
          "No encontramos tu sala, intenta nuevamente",
          "warning"
        );
        return router.push("/login");
      }

      setLobby(lobbyRef.data());
      setLoading(false);
    };

    fetchLobby();
  }, [lobbyId]);

  useEffect(() => {
    if (!lobby) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${lobbyId}/users`);
      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [lobby]);

  if (isLoading) return spinLoaderMin();

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) return <LoadingGame lobby={lobby} {...props} />;

  return (
    <LobbyCss>
      <div className="header">
        <div className="left-menus" />
        <div className="item-pin">
          <div className="label">Entra a www.ebombo.it</div>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">{lobby?.pin}</div>
        </div>

        <div className="right-menus">
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            onClick={() => setIsClosed(!isClosed)}
          >
            {isClosed ? <LockOutlined /> : <UnlockOutlined />}
          </ButtonBingo>
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            padding="10px 20px"
            onClick={() => startGame()}
          >
            EMPEZAR
          </ButtonBingo>
        </div>
      </div>

      <Divider />

      <div className="container-users">
        <div className="all-users">
          {users?.length ?? 0} <UserOutlined />
        </div>
        <div className="list-users">
          {users.map((user) => (
            <div key={user.userId} className="item-user">
              {user.nickname}
            </div>
          ))}
        </div>
      </div>
    </LobbyCss>
  );
};

const LobbyCss = styled.div`
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .right-menus,
    .left-menus {
      text-align: center;
    }

    .item-pin {
      width: 100%;
      height: 370px;
      font-size: 20px;
      max-width: 400px;
      border-radius: 50%;
      padding-top: 175px;
      text-align: center;
      margin: -175px auto 2rem auto;
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
  }

  .container-users {
    padding: 10px 15px;

    ${mediaQuery.afterTablet} {
      padding: 10px 5rem;
    }

    .all-users {
      padding: 5px 10px;
      width: fit-content;
      border-radius: 3px;
      margin-bottom: 2rem;
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.primaryDark};
    }

    .list-users {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
      }

      .item-user {
        padding: 5px 10px;
        text-align: center;
        border-radius: 5px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
