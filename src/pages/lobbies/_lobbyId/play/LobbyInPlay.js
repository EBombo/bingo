import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Chat } from "../../../../components/chat";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { ModalWinner } from "./ModalWinner";
import { ModalAwards } from "./ModalAwards";
import { UsersTabs } from "./UsersTabs";
import defaultTo from "lodash/defaultTo";
import { UserLayout } from "../userLayout";
import { firestore } from "../../../../firebase";
import { AdminPanel } from "./AdminPanel";
import { UserPanel } from "./UserPanel";
import { ModalFinalStage } from "./ModalFinalStage";
import { ModalUserCard } from "./ModalUserCard";
import { useTranslation } from "../../../../hooks";

const TABS = {
  BINGO: { value: "bingo" },
  USERS: { value: "users" },
};

export const LobbyInPlay = (props) => {
  const { t } = useTranslation("lobby-play");

  const [authUser] = useGlobal("user");
  const [tabletTab, setTabletTab] = useState("bingo");

  const [user, setUser] = useState(null);
  const [isVisibleModalFinal, setIsVisibleModalFinal] = useState(false);
  const [isVisibleModalWinner, setIsVisibleModalWinner] = useState(false);
  const [isVisibleModalAwards, setIsVisibleModalAwards] = useState(false);
  const [isVisibleModalUserCard, setIsVisibleModalUserCard] = useState(false);

  const [toggleChat, setToggleChat] = useState(false);

  useEffect(() => {
    if (props.lobby.finalStage) setIsVisibleModalFinal(true);
    if (!props.lobby.finalStage) setIsVisibleModalFinal(false);
  }, [props.lobby.finalStage]);

  useEffect(() => {
    setIsVisibleModalWinner(!!props.lobby.bingo);
  }, [props.lobby.bingo]);

  useEffect(() => {
    /** Don't use "props.lobby.users" because the "get" query gets users progressively  **/
    if (!props.lobby) return;
    if (!authUser?.id) return;
    // AuthUser is admin.
    if (props.lobby.game.usersIds.includes(authUser.id)) return;

    const verifyUserAccount = async () => {
      const userQuery = await firestore
        .collection("lobbies")
        .doc(props.lobby.id)
        .collection("users")
        .doc(authUser.id)
        .get();

      // User is registered in lobby.
      if (userQuery.exists) return;

      await props.logout();
    };

    verifyUserAccount();
  }, [props.lobby.users]);

  const callBingo = async () => {
    const _users = Object.values(props.lobby.users);
    const bingoUser = _users.find((user) => user.id === authUser.id);

    if (!bingoUser) return props.showNotification("Ups", t("user-not-exist"));

    // Lobby Ref.
    const lobbyRef = firestore.doc(`lobbies/${props.lobby.id}`);

    // Transactions for call bingo.
    await firestore.runTransaction(async (transaction) => {
      // Fetch lobby.
      const lobbyQuery = await transaction.get(lobbyRef);
      const lobby_ = lobbyQuery.data();

      // Prevent call bingo.
      if (lobby_?.bingo) return;

      // Call bingo.
      transaction.update(lobbyRef, {
        bingo: bingoUser,
        updateAt: new Date(),
      });
    });
  };

  // TODO: Consider to refactoring, <Admin> & <User>.
  return (
    <>
      <UserLayout {...props} setToggleChat={setToggleChat} />

      <BingoGameContainer isVisibleBoard={props.lobby.settings.showBoardToUser}>
        {isVisibleModalFinal && (
          <ModalFinalStage
            isVisibleModalFinal={isVisibleModalFinal}
            setIsVisibleModalFinal={setIsVisibleModalFinal}
            {...props}
          />
        )}
        {isVisibleModalUserCard && (
          <ModalUserCard
            isVisibleModalUserCard={isVisibleModalUserCard}
            setIsVisibleModalUserCard={setIsVisibleModalUserCard}
            user={user}
            {...props}
          />
        )}
        {isVisibleModalAwards && (
          <ModalAwards
            awards={defaultTo(props.lobby.settings.awards, [])}
            isVisibleModalAwards={isVisibleModalAwards}
            setIsVisibleModalAwards={setIsVisibleModalAwards}
            {...props}
          />
        )}
        {isVisibleModalWinner && (
          <ModalWinner
            winner={props.lobby.bingo}
            setUser={setUser}
            setIsVisibleModalUserCard={setIsVisibleModalUserCard}
            isVisibleModalWinner={isVisibleModalWinner}
            setIsVisibleModalWinner={setIsVisibleModalWinner}
            {...props}
          />
        )}

        <Desktop>
          {authUser.isAdmin ? (
            <AdminPanel
              {...props}
              tabletTab={tabletTab}
              setIsVisibleModalAwards={setIsVisibleModalAwards}
              isVisibleModalFinal={isVisibleModalFinal}
            />
          ) : (
            <UserPanel
              {...props}
              tabletTab={tabletTab}
              callBingo={callBingo}
              setIsVisibleModalAwards={setIsVisibleModalAwards}
            />
          )}

          {toggleChat && (
            <div className="h-[100%] min-w-[300px]">
              <Chat title={t("chat")} />
            </div>
          )}
        </Desktop>

        <Tablet>
          {(authUser.isAdmin || props.lobby.settings?.showParticipants) && (
            <div className="tablet-tabs">
              <div
                className={`tab ${tabletTab === TABS.BINGO.value && "active"}`}
                onClick={() => setTabletTab(TABS.BINGO.value)}
              >
                Bingo
              </div>
              <div
                className={`tab ${tabletTab === TABS.USERS.value && "active"}`}
                onClick={() => setTabletTab(TABS.USERS.value)}
              >
                {t("participants")}
              </div>
            </div>
          )}

          {tabletTab === "bingo" && authUser.isAdmin && (
            <AdminPanel {...props} tabletTab={tabletTab} setIsVisibleModalAwards={setIsVisibleModalAwards} />
          )}

          {tabletTab === "bingo" && !authUser.isAdmin && (
            <UserPanel
              {...props}
              tabletTab={tabletTab}
              callBingo={callBingo}
              setIsVisibleModalAwards={setIsVisibleModalAwards}
            />
          )}

          {tabletTab === "users" && authUser.isAdmin && <UsersTabs {...props} />}
        </Tablet>
      </BingoGameContainer>
    </>
  );
};

const BingoGameContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);

  .tablet-tabs {
    height: 32px;
    background: ${(props) => props.theme.basic.primary};
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .tab {
      padding: 0.5rem 1rem;
      text-align: center;
      font-family: "Encode Sans", sans-serif;
      font-style: normal;
      font-size: 15px;
      font-weight: 400 !important;
      line-height: 17px;
      position: relative;
      cursor: pointer;
      color: ${(props) => props.theme.basic.secondary};
    }

    .active {
      color: ${(props) => props.theme.basic.whiteLight};
    }

    .active::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: ${(props) => props.theme.basic.whiteLight};
    }
  }

  ${mediaQuery.afterTablet} {
    display: flex;

    .user-main {
      grid-template-columns: ${(props) => (props.isVisibleBoard ? "375px auto" : "1fr")};
    }
  }
`;
