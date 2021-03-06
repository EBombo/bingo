import React, { useEffect, useGlobal, useState } from "reactn";
import { config, database, firestore, firestoreBomboGames, hostName } from "../../../firebase";
import { ButtonAnt, ButtonBingo } from "../../../components/form";
import { Desktop, mediaQuery } from "../../../constants";
import styled from "styled-components";
import { Popover, Slider, Tooltip } from "antd";
import { getBingoCard } from "../../../business";
import { Image } from "../../../components/common/Image";
import { useSendError, useTranslation } from "../../../hooks";
import { saveMembers } from "../../../constants/saveMembers";
import { useRouter } from "next/router";

export const LobbyHeader = (props) => {
  const { sendError } = useSendError();

  const router = useRouter();
  const { lobbyId } = router.query;

  const { t } = useTranslation("lobby-user");
  const { t: tCommon } = useTranslation("coomon");

  const [authUser] = useGlobal("user");
  const [audios] = useGlobal("audios");

  const [volume, setVolume] = useState(30);
  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [isLoadingLock, setIsLoadingLock] = useState(false);
  const [isLoadingStart, setIsLoadingStart] = useState(false);

  useEffect(() => {
    if (!authUser.isAdmin) return;

    const currentAudioToPlay = props.lobby.game?.audio?.audioUrl ?? audios[0]?.audioUrl;

    props.audioRef.current = props.audioRef.current ?? new Audio(currentAudioToPlay);
    props.audioRef.current.play();
  }, []);

  const mapUsersWithCards = (users) =>
    users.reduce((usersSum, user) => {
      const card = getBingoCard();
      const newUser = { ...user, id: user.userId, card: JSON.stringify(card) };
      return { ...usersSum, [newUser.id]: newUser };
    }, {});

  const updateLobby = async (isLocked = false, gameStarted = null) => {
    // TODO: Consider move this functions to backend [optimize performance].
    try {
      if (!lobbyId) throw Error("Lobby not exist");

      let users = null;
      let newLobby = {
        isLocked,
        startAt: gameStarted,
        updateAt: new Date(),
      };

      // Add users to lobby.
      const promiseLobbyBingo = firestore.doc(`lobbies/${lobbyId}`).update(newLobby);
      const promiseLobbyGames = firestoreBomboGames.doc(`lobbies/${lobbyId}`).update(newLobby);

      if (!gameStarted) return;

      // Fetch users.
      const usersDatabaseRef = database.ref(`lobbies/${props.lobby.id}/users`);
      const snapshot = await usersDatabaseRef.get();

      // Mapped users.
      let users_ = Object.values(snapshot.val());
      const usersFiltered = users_.filter((user) => user.state.includes("online"));
      users = mapUsersWithCards(usersFiltered);

      // Save users in sub collection.
      const promisesUsers = Object.values(users).map(
        async (user) =>
          await firestore
            .collection("lobbies")
            .doc(lobbyId)
            .collection("users")
            .doc(user.id)
            .set({ ...user, hasExited: false })
      );

      await Promise.all(promisesUsers);

      // The new users saved as members.
      const promiseMembers = users ? saveMembers(props.lobby, users) : null;

      await Promise.all([promiseLobbyBingo, promiseLobbyGames, promiseMembers]);
    } catch (error) {
      if (!gameStarted) setIsLoadingStart(false);
      props.showNotification("ERROR", "Lobby not exist");
      sendError(error, "updateLobby");
    }
  };

  return (
    <LobbyHeaderStyled {...props}>
      <div className="item-pin">
        <Tooltip placement="bottom" title="Click aqu?? para copiar el link de ebombo con pin">
          <div
            className="label"
            onClick={() => {
              navigator.clipboard.writeText(`${hostName}/?pin=${props.lobby?.pin}`);
              props.showNotification("OK", tCommon("link-copied"), "success");
            }}
          >
            {props.lobby.isLocked ? (
              t("this-game-is-blocked")
            ) : (
              <>
                {t("get-into")}{" "}
                <span className="font-black">
                  ebombo.io{" "}
                  <Image className="inline-block" src={`${config.storageUrl}/resources/link.svg`} width="18px" />{" "}
                </span>
              </>
            )}
          </div>
        </Tooltip>

        <div className="pin-label">{t("game-pin")}:</div>

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
            <div>{props.lobby?.pin}</div>
          )}
        </div>
      </div>

      {authUser.isAdmin && (
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
                "???"
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
      )}

      {authUser.isAdmin && (
        <div className="right-menus">
          <ButtonAnt
            className="btn-start"
            loading={isLoadingStart}
            color="success"
            disabled={!props.lobby.countPlayers || isLoadingStart}
            onClick={async () => {
              setIsLoadingStart(true);
              await updateLobby(false, new Date());
            }}
          >
            {t("start")}
          </ButtonAnt>
        </div>
      )}

      <Desktop>
        <div className="user-count bg-primaryDark text-white font-bold rounded py-2 px-4 self-end w-min">
          <span className="whitespace-nowrap">
            <span className="align-text-top">{props.lobby?.countPlayers ?? 0}</span>
            <span className="w-[45px] inline-block"></span>
            <Image
              className="inline-block align-sub"
              src={`${config.storageUrl}/resources/user.svg`}
              height="15px"
              width="15px"
              size="contain"
            />
          </span>
        </div>
      </Desktop>
    </LobbyHeaderStyled>
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

const LobbyHeaderStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  padding: 2rem 1rem 1rem 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  background: ${(props) => props.theme.basic.secondary};
  position: relative;

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto;

    padding: 2rem 1rem 2rem 1rem;
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
    margin: 0;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.secondaryDarken};
    box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);

    grid-column: 1 / 3;
    grid-row: 1 / 3;

    ${mediaQuery.afterTablet} {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
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

  .user-count {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
`;
