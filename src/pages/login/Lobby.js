import { Image } from "../../components/common/Image";
import React, { useEffect, useGlobal, useState } from "reactn";
import { config, database, firebase } from "../../firebase";
import { mediaQuery } from "../../constants";
import styled from "styled-components";
import { useUser } from "../../hooks";

export const Lobby = (props) => {
  const [authUser] = useGlobal("user");
  const [userId] = useState(authUser.id);

  const [game] = useState(props.game);
  const [nickname] = useState(props.nickname);
  const [email] = useState(props.email ?? null);

  const [, setAuthUserLs] = useUser();

  const userStatusDatabaseRef = database.ref(
    `games/${game.id}/users/${userId}`
  );

  const user = {
    email,
    userId,
    nickname,
    gameId: game.id,
  };

  useEffect(() => {
    if (!game) return;
    if (!game.userIdentity && !props.nickname) return;
    if (game.userIdentity && (!props.email || !props.nickname)) return;

    const createPresence = async () => {
      setAuthUserLs({ ...authUser, nickname, email, game: game });

      const isOfflineForDatabase = {
        ...user,
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      const isOnlineForDatabase = {
        ...user,
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      database.ref(".info/connected").on("value", async (snapshot) => {
        if (!snapshot.val()) return;

        await userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase);

        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    };

    createPresence();

    return async () =>
      await userStatusDatabaseRef.set({
        ...user,
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      });
  }, [props.game]);

  return (
    <SuccessInscriptionContainer>
      <Image
        src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
        width="180px"
        margin="10px auto"
      />
      <div className="message">Ya estas adentro :)</div>
      <div className="message">¿Vez tu nombre en pantalla?</div>
      <div className="nickname">{nickname}</div>
    </SuccessInscriptionContainer>
  );
};

const SuccessInscriptionContainer = styled.div`
  width: 100%;

  .message {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 30px;
    margin: 1rem auto;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }

  .nickname {
    margin-top: 50px;
    background: ${(props) => props.theme.basic.whiteLight};
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    height: 63px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${mediaQuery.afterTablet} {
    .message {
      font-size: 34px;
      line-height: 41px;
    }

    .nickname {
      font-size: 28px;
      line-height: 34px;
    }
  }
`;
