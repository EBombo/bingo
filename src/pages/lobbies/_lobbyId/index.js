import {
  LockOutlined,
  SoundOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { spinLoaderMin } from "../../../components/common/loader";
import React, { useEffect, useGlobal, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { database, firestore } from "../../../firebase";
import { ButtonBingo } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { LoadingGame } from "./LoadingGame";
import { Popover, Slider } from "antd";

export const Lobby = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [authUser] = useGlobal("user");
  const [users, setUsers] = useState([]);
  const [lobby, setLobby] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (!lobbyId) return;

    const fetchLobby = () =>
      firestore.doc(`lobbies/${lobbyId}`).onSnapshot((lobbyRef) => {
        const currentLobby = lobbyRef.data();

        if (
          !currentLobby ||
          currentLobby.isClosed ||
          !currentLobby?.game?.usersIds?.includes(authUser.id)
        ) {
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
    if (!lobbyId) return;

    const updateLobby = async () =>
      await firestore
        .doc(`lobbies/${lobbyId}`)
        .update({ isLocked, updateAt: new Date() });

    updateLobby();
  }, [isLocked]);

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

  const startGame = () => setGameStarted(true);

  if (gameStarted) return <LoadingGame lobby={lobby} {...props} />;

  return (
    <LobbyCss>
      <div className="header">
        <div className="left-menus">
          <Popover
            content={
              <div style={{ width: 100 }}>
                <div>musica1</div>
                <div>musica2</div>
                <div>musica3</div>
              </div>
            }
          >
            <ButtonBingo
              variant="primary"
              margin="10px 20px"
              onClick={() => {
                if (!lobby?.game?.audio?.audioUrl || (audio && !audio?.paused))
                  return;

                const audio_ = new Audio(lobby?.game.audio.audioUrl);
                setAudio(audio_);
                audio_.play();
              }}
            >
              {audio?.paused || !audio ? "►" : "♫"}
            </ButtonBingo>
          </Popover>
          <Popover
            content={
              <div style={{ width: 100 }}>
                <Slider
                  defaultValue={30}
                  onChange={(event) => {
                    if (!audio) return;
                    audio.volume = event / 100;
                  }}
                />
              </div>
            }
          >
            <ButtonBingo
              variant="primary"
              margin="10px 20px"
              disabled={!audio || audio?.paused}
            >
              <SoundOutlined />
            </ButtonBingo>
          </Popover>
        </div>

        <div className="item-pin">
          <div className="label">Entra a www.ebombo.it</div>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">{isLocked ? <LockOutlined /> : lobby?.pin}</div>
        </div>

        <div className="right-menus">
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <LockOutlined /> : <UnlockOutlined />}
          </ButtonBingo>
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            padding="10px 20px"
            disabled={!users?.length}
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

    .left-menus {
      button {
        width: 45px;
        box-shadow: none;
        border-radius: 50px;
      }
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
