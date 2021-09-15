import {
  LockOutlined,
  SoundOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { database, firestore } from "../../../firebase";
import { ButtonBingo } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Popover, Slider } from "antd";
import { BingoGame } from "./BingoGame";

export const LobbyAdmin = (props) => {
  const router = useRouter();
  const { lobbyId } = router.query;
  const [audios] = useGlobal("audios");
  const [users, setUsers] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [gameStarted, setGameStarted] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!lobbyId) return;

    const updateLobby = async () => {
      setLoading(true);
      await firestore.doc(`lobbies/${lobbyId}`).update({
        isLocked,
        startAt: gameStarted,
        updateAt: new Date(),
      });
      setLoading(false);
    };

    updateLobby();
  }, [isLocked, gameStarted]);

  useEffect(() => {
    if (!props.lobby) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${lobbyId}/users`);
      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [props.lobby]);

  return (
    <LobbyCss>
      <div className="header">
        <div className="left-menus">
          <Popover
            content={
              <AudioStyled>
                {audios.map((audio_) => (
                  <div
                    key={audio_.id}
                    className="item-audio"
                    onClick={() => {
                      if (audioRef.current) audioRef.current.pause();

                      const currentAudio = new Audio(audio_.audioUrl);

                      audioRef.current = currentAudio;
                      audioRef.current.play();
                      setIsPlay(true);
                    }}
                  >
                    {audio_.title}
                  </div>
                ))}
              </AudioStyled>
            }
          >
            <ButtonBingo
              variant="primary"
              key={audioRef.current?.paused}
              margin="10px 20px"
              onClick={() => {
                if (audioRef.current && !audioRef.current?.paused) {
                  audioRef.current.pause();
                  return setIsPlay(false);
                }

                const currentAudio =
                  audioRef.current ??
                  new Audio(props.lobby?.game.audio.audioUrl);

                audioRef.current = currentAudio;
                audioRef.current.play();
                setIsPlay(true);
              }}
            >
              {isPlay ? "♫" : "►"}
            </ButtonBingo>
          </Popover>
          <Popover
            content={
              <div style={{ width: 100 }}>
                <Slider
                  defaultValue={30}
                  onChange={(event) => {
                    if (!audioRef.current) return;
                    audioRef.current.volume = event / 100;
                  }}
                />
              </div>
            }
          >
            <ButtonBingo
              variant="primary"
              margin="10px 20px"
              disabled={!isPlay}
            >
              <SoundOutlined />
            </ButtonBingo>
          </Popover>
        </div>

        <div className="item-pin">
          <div className="label">Entra a www.ebombo.it</div>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">
            {isLocked ? <LockOutlined /> : props.lobby?.pin}
          </div>
        </div>

        <div className="right-menus">
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            disabled={isLoading}
            loading={isLoading}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <LockOutlined /> : <UnlockOutlined />}
          </ButtonBingo>
          <ButtonBingo
            variant="primary"
            margin="10px 20px"
            padding="10px 30px"
            loading={isLoading}
            disabled={!users?.length || isLoading}
            onClick={() => setGameStarted(new Date())}
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

const AudioStyled = styled.div`
  width: 100%;

  .item-audio {
    cursor: pointer;
    padding: 0 10px;

    &:hover {
      color: ${(props) => props.theme.basic.secondary};
      background: ${(props) => props.theme.basic.primaryLight};
    }
  }
`;

const LobbyCss = styled.div`
  width: fit-content;

  ${mediaQuery.afterTablet} {
    width: auto;
  }

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
      width: 370px;
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
        font-family: Gloria Hallelujah;
        font-style: normal;
        font-weight: normal;
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

        ${mediaQuery.afterTablet} {
          padding: 15px 10px;
        }
      }
    }
  }
`;
