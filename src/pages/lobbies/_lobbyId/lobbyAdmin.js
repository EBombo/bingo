import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useGlobal, useState } from "reactn";
import { Divider } from "../../../components/common/Divider";
import { config, database, firestore, firestoreBomboGames, hostName } from "../../../firebase";
import { ButtonAnt, ButtonBingo } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Popover, Slider, Tooltip } from "antd";
import { getBingoCard } from "../../../business";
import { Image } from "../../../components/common/Image";
import { firebase } from "../../../firebase/config";
import { useSendError } from "../../../hooks";
import { saveMembers } from "../../../constants/saveMembers";
import { useInView } from "react-intersection-observer";

const userListSizeRatio = 50; 

export const LobbyAdmin = (props) => {
  const { sendError } = useSendError();

  const router = useRouter();
  const { lobbyId } = router.query;

  const [audios] = useGlobal("audios");

  const [users, setUsers] = useState([]);
  const [volume, setVolume] = useState(30);
  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingLock, setIsLoadingLock] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [userListSize, setUserListSize] = useState(100);
  const { ref : scrollTriggerRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!props.lobby) return;
    if (!inView) return;

    const usersQuery = () => database
        .ref(`lobbies/${lobbyId}/users`)
        .orderByChild("last_changed")
        .limitToLast(userListSize);

    const fetchUsers = async () => {
      const UsersQueryRef = usersQuery();
      UsersQueryRef.on("value", (snapshot) => {
        let users_ = [] 

        snapshot.forEach((docRef) => {
          const user = docRef.val();

          if (user.state.includes("online"))
            users_.unshift(user);
        })

        setUserListSize(userListSize + userListSizeRatio);
        setUsers(users_);
      });
    };
    fetchUsers();
  }, [inView]);

  useEffect(() => {
    const currentAudioToPlay = props.lobby.game?.audio?.audioUrl ?? audios[0]?.audioUrl;

    const currentAudio = props.audioRef.current ?? new Audio(currentAudioToPlay);

    props.audioRef.current = currentAudio;
    props.audioRef.current.play();
  }, []);

  const mapUsersWithCards = () =>
    users.reduce((usersSum, user) => {
      const card = getBingoCard();
      const newUser = { ...user, id: user.userId, card: JSON.stringify(card) };
      return { ...usersSum, [newUser.id]: newUser };
    }, {});

  const updateLobby = async (isLocked = false, gameStarted = null) => {
    try {
      if (!lobbyId) throw Error("Lobby not exist");

      let users = null;
      let newLobby = {
        isLocked,
        startAt: gameStarted,
        updateAt: new Date(),
      };

      if (gameStarted) users = mapUsersWithCards();

      // Add users to lobby.
      const promiseLobbyBingo = firestore.doc(`lobbies/${lobbyId}`).update(newLobby);
      const promiseLobbyGames = firestoreBomboGames.doc(`lobbies/${lobbyId}`).update(newLobby);

      if (!gameStarted) return;

      // Save users.
      const promisesUsers = Object.values(users).map(
        async (user) => await firestore.collection("lobbies").doc(lobbyId).collection("users").doc(user.id).set(user)
      );

      await Promise.all(promisesUsers);

      // Count users.
      const promiseGame = users
        ? await firestore
            .doc(`games/${props.lobby.game.id}`)
            .update({ countPlayers: firebase.firestore.FieldValue.increment(Object.values(users ?? {}).length ?? 0) })
        : null;

      // The new users saved as members.
      const promiseMembers = users ? saveMembers(props.lobby, users) : null;

      await Promise.all([promiseLobbyBingo, promiseLobbyGames, promiseGame, promiseMembers]);
    } catch (error) {
      props.showNotification("ERROR", "Lobby not exist");
      console.error(error);
      sendError(error, "updateLobby");
    }
  };

  return (
    <LobbyCss {...props}>
      <div className="title">
        {props.lobby?.game?.name}
      </div>
      <div className="header"> 

        <div className="item-pin">
          <Tooltip placement="bottom" title="Click aquí para copiar el link de ebombo con pin">
            <div
              className="label"
              onClick={() => {
                navigator.clipboard.writeText(`${hostName}?pin=${props.lobby?.pin}`);
                props.showNotification("OK", "Link copiado!", "success");
              }}
            >
              {props.lobby.isLocked 
                ? "Este juego esta bloqueado"
                : (<>Entra a <span className="font-black">ebombo.io</span></> )}
            </div>
          </Tooltip>
          <div className="pin-label">Pin del juego:</div>
          <div className="pin">
            {props.lobby.isLocked ? (
              <ButtonBingo variant="primary" margin="10px 20px">
                <Image
                  cursor="pointer"
                  src={`${config.storageUrl}/resources/lock.svg`}
                  height="24px"
                  width="24px"
                  size="contain"
                  margin="auto"
                />
              </ButtonBingo>
            ) : (
              <div
                onClick={() => {
                  navigator.clipboard.writeText(props.lobby.pin);
                  props.showNotification("OK", "PIN copiado!", "success");
                }}
              >
                <Tooltip placement="bottom" title="Click aquí para copiar el PIN">
                  {props.lobby?.pin}
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <div className="left-menus">
          <Popover
            trigger="click"
            content={
              <AudioStyled>
                {audios.map((audio_) => (
                  <div
                    key={audio_.id}
                    className="item-audio"
                    onClick={() => {
                      if (props.audioRef.current) props.audioRef.current.pause();

                      const currentAudio = new Audio(audio_.audioUrl);

                      props.audioRef.current = currentAudio;
                      props.audioRef.current.volume = volume / 100;
                      props.audioRef.current.play();
                      setIsPlay(true);
                      setIsMuted(false);
                    }}
                  >
                    {audio_.title}
                  </div>
                ))}
              </AudioStyled>
            }
          >
            <ButtonBingo variant="primary">
              {isPlay ? (
                <Image
                  cursor="pointer"
                  src={`${config.storageUrl}/resources/sound.svg`}
                  height="24px"
                  width="24px"
                  size="contain"
                  margin="auto"
                />
              ) : (
                "►"
              )}
            </ButtonBingo>
          </Popover>
          <Popover
            content={
              <SliderContent>
                <Slider
                  defaultValue={30}
                  value={volume}
                  onChange={(value) => {
                    if (!props.audioRef.current) return;

                    props.audioRef.current.volume = value / 100;
                    setVolume(value);
                  }}
                />
              </SliderContent>
            }
          >
            <ButtonBingo
              variant="primary"
              disabled={!isPlay}
              onClick={() => {
                if (!props.audioRef.current) return;

                if (props.audioRef.current.volume === 0) {
                  props.audioRef.current.volume = 0.3;
                  setVolume(30);

                  return setIsMuted(false);
                }
                setVolume(0);
                props.audioRef.current.volume = 0;
                setIsMuted(true);
              }}
              key={isMuted}
            >
              <Image
                cursor="pointer"
                src={isMuted ? `${config.storageUrl}/resources/mute.svg` : `${config.storageUrl}/resources/volume.svg`}
                height="24px"
                width="24px"
                size="contain"
                margin="auto"
              />
            </ButtonBingo>
          </Popover>
          <ButtonBingo
            variant="primary"
            disabled={isLoadingLock}
            loading={isLoadingLock}
            onClick={async () => {
              setIsLoadingLock(true);
              await updateLobby(!props.lobby.isLocked);
              setIsLoadingLock(false);
            }}
          >
            {!isLoadingLock && (
              <Image
                src={`${config.storageUrl}/resources/${props.lobby.isLocked ? "lock.svg" : "un-lock.svg"}`}
                cursor="pointer"
                height="24px"
                width="24px"
                size="contain"
                margin="auto"
              />
            )}
          </ButtonBingo>
        </div>

        <div className="right-menus">
          
          <ButtonAnt
            className="btn-start"
            loading={isLoadingStart}
            color="success"
            disabled={!users?.length || isLoadingStart}
            onClick={async () => {
              setIsLoadingStart(true);
              await updateLobby(false, new Date());
              setIsLoadingStart(false);
            }}
          >
            Empezar
          </ButtonAnt>
        </div>
      </div>

      <div className="container-users">
        <div className="all-users">
          {props.lobby?.countPlayers ?? 0} <UserOutlined />
        </div>
        <div className="list-users">
          {users.map((user, i) => (
            <div key={`user-${i}`} className="item-user">
              {user.nickname}
            </div>
          ))}
        </div>
      </div>
      <div ref={scrollTriggerRef} className="loading-section" />
    </LobbyCss>
  );
};

const SliderContent = styled.div`
  width: 100px;

  .ant-slider-track {
    background-color: ${(props) => props.theme.basic.success} !important;
  }

  .ant-slider-handle {
    border: solid 2px ${(props) => props.theme.basic.successDark} !important;
  }
`;

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
  min-height: 100vh;
  background-image: url("${(props) => `${config.storageUrl}/resources/balls/coral-pattern-tablet.svg`}");

  ${mediaQuery.afterTablet} {
    width: auto;
  }

  .title {
    text-align: center;
    background: ${(props) => props.theme.basic.white};
    color: ${(props) => props.theme.basic.black};
    padding: 0.5rem 0;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    ${mediaQuery.afterTablet} {
      font-size: 2rem;
    }
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    padding: 2rem 1rem 2rem 1rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.theme.basic.secondary};

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: auto;

      align-items: start;
    }

    .right-menus {
      margin-left: 0.25rem;
      justify-content: flex-end;

      .btn-start {
        padding: 11px 36px !important;
        ${mediaQuery.afterTablet} {
          padding: 11px 72px !important;
        }
      }
    }

    .right-menus,
    .left-menus {
      text-align: center;
      display: flex;
      align-items: center;
    }

    .left-menus {
      margin-right: 0.25rem;
      justify-content: flex-start;

      button {
        width: 45px;
        box-shadow: none;
        margin: 0 0.5rem 0 0;
      }
    }

    .item-pin {
      font-size: 21px;
      border-radius: 4px 4px 0px 0px;
      text-align: center;
      margin: 0 0 2rem 0;
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.secondaryDarken};
      box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);

      grid-column: 1 / 3;
      grid-row: 1 / 2;

      ${mediaQuery.afterTablet} {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        margin: 0;
      }

      .label {
        background: ${(props) => props.theme.basic.white};
        color: ${(props) => props.theme.basic.black};
        font-style: normal;
        font-weight: normal;
        cursor: pointer;
      }

      .pin-label {
        display: inline-block;
        font-size: 1.25rem;
        font-weight: 900;
        vertical-align: super;
        margin: 0 0.25rem;

        ${mediaQuery.afterTablet} {
          margin: 0 0.5rem 0 1.5rem;
          font-size: 2.5rem;
        }
      }

      .pin {
        display: inline-block;
        font-size: 2.5rem;
        cursor: pointer;
        font-weight: 900;
        margin: 0 0.25rem;

        ${mediaQuery.afterTablet} {
          margin: 0 1.5rem 0 0.5rem;
          font-size: 5rem;
        }
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
      font-weight: bold;

      span {
        vertical-align: baseline;
      }
    }

    .list-users {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 10px;
      }

      .item-user {
        padding: 8px 10px;
        text-align: center;
        border-radius: 5px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.secondaryDarken};
        font-weight: bold;

        ${mediaQuery.afterTablet} {
          padding: 12px 10px;
        }
      }
    }
  }
  .loading-section {
    height: 20px;
  }
`;
