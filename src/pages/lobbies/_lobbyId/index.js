import { LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { database, firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { useRouter } from "next/router";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { ButtonBingo } from "../../../components/form";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId: pin } = router.query;
  const [game, setGame] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin] = useGlobal("isAdmin");
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    console.log("pin", pin);
    if (!pin) return router.push("/login");

    const fetchGameByPin = async () => {
      const gameRef = await firestore
        .collection("games")
        //.where("isClosed", "==", false)
        .where("pin", "==", +pin)
        .limit(1)
        .get();

      setGame(snapshotToArray(gameRef)[0]);
      setIsLoading(false);
    };

    fetchGameByPin();
  }, [pin]);

  useEffect(() => {
    if (!game) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`games/${game.id}/users`);
      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val());
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [game]);

  return (
    <LobbyCss>
      <div className="header">
        <div className="left-menus" />
        <div className="item-pin">
          <div className="label">Entra a www.ebombo.it</div>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">{pin}</div>
        </div>
        <div className="right-menus">
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            onClick={setIsClosed(!isClosed)}
          >
            {isClosed ? <LockOutlined /> : <UnlockOutlined />}
          </ButtonBingo>
          <ButtonBingo variant="primary" margin="10px 20px" padding="10px 20px">
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
