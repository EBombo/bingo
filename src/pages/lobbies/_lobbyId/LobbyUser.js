import { config, database, firebase } from "../../../firebase";
import { Image } from "../../../components/common/Image";
import React, { useEffect, useGlobal } from "reactn";
import { mediaQuery } from "../../../constants";
import styled from "styled-components";
import { UserLayout } from "./userLayout";

export const LobbyUser = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (!props.lobby) return;
    if (!authUser) return;

    const userStatusDatabaseRef = database.ref(
      `lobbies/${props.lobby.id}/users/${authUser.id}`
    );

    const user = {
      email: authUser?.email ?? null,
      userId: authUser?.id ?? null,
      nickname: authUser?.nickname ?? null,
      lobbyId: props.lobby.id,
    };

    const createPresence = async () => {
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
  }, [props.lobby, authUser]);

  return (
    <SuccessInscriptionContainer>
      <UserLayout {...props} />
      <Image
        src={`${config.storageUrl}/resources/white-icon-ebombo.png`}
        width="180px"
        margin="3rem auto 1rem auto"
      />
      <div className="message">Ya estas adentro :)</div>
      <div className="message">¿Ves tu nombre en pantalla?</div>
      <div className="item-user">{authUser?.nickname}</div>
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

  .item-user {
    width: 150px;
    padding: 5px 10px;
    text-align: center;
    border-radius: 5px;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.primary};
    margin: 2rem auto;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;

    ${mediaQuery.afterTablet} {
      width: 200px;
      padding: 15px 10px;
      font-size: 20px;
      line-height: 24px;
    }
  }

  ${mediaQuery.afterTablet} {
    .message {
      font-size: 34px;
      line-height: 41px;
    }
  }
`;
