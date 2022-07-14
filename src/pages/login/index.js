import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { config, firebase, firestore } from "../../firebase";
import { NicknameStep } from "./NicknameStep";
import { snapshotToArray } from "../../utils";
import { EmailStep } from "./EmailStep";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSendError, useTranslation, useUser } from "../../hooks";
import { PinStep } from "./PinStep";
import { avatars } from "../../components/common/DataList";
import { Anchor } from "../../components/form";
import { getBingoCard } from "../../business";
import { saveMembers } from "../../constants/saveMembers";
import { fetchUserByEmail } from "./fetchUserByEmail";
import { Tooltip } from "antd";
import { spinLoader } from "../../components/common/loader";

const Login = (props) => {
  const router = useRouter();
  const { pin } = router.query;

  const { sendError } = useSendError();

  const { t, SwitchTranslation, locale } = useTranslation("login");

  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLobby, setIsLoadingLobby] = useState(false);

  useEffect(() => {
    if (!authUser?.lobby) return;

    router.prefetch(`/bingo/lobbies/${authUser?.lobby?.id}`);
  }, [authUser]);

  const fetchLobby = async (pin, avatar = avatars[0]) => {
    try {
      // Fetch lobby.
      const lobbyRef = await firestore.collection("lobbies").where("pin", "==", pin.toString()).limit(1).get();

      if (lobbyRef.empty) throw Error("No encontramos tu sala, intenta nuevamente");

      const currentLobby = snapshotToArray(lobbyRef)[0];

      if (currentLobby?.isLocked) throw Error("Este juego esta cerrado");

      if (currentLobby?.isClosed) {
        await setAuthUser({
          id: firestore.collection("users").doc().id,
          lobby: null,
          isAdmin: false,
          email: authUser.email || null,
          nickname: authUser.nickname || null,
        });

        throw Error(t("room-is-over"));
      }

      const isAdmin = !!currentLobby?.game?.usersIds?.includes(authUser.id);

      await setAuthUser({ avatar, ...authUser, email: authUser.email || null, lobby: currentLobby, isAdmin });
      setAuthUserLs({ avatar, ...authUser, email: authUser.email || null, lobby: currentLobby, isAdmin });
    } catch (error) {
      props.showNotification("UPS", error.message, "warning");
    }
    setIsLoading(false);
  };

  // Redirect to lobby.
  useEffect(() => {
    if (!authUser?.lobby) return setIsLoadingLobby(false);
    if (!authUser?.nickname) return setIsLoadingLobby(false);
    if (authUser?.lobby?.settings?.userIdentity && !authUser?.email) return setIsLoadingLobby(false);

    // Determine is necessary create a user.
    const initialize = async () => {
      setIsLoadingLobby(true);
      try {
        // Fetch lobby.
        const lobbyRef = await firestore.doc(`lobbies/${authUser.lobby.id}`).get();
        const lobby = lobbyRef.data();

        if (lobby?.isClosed) {
          props.showNotification("UPS", "El juego esta cerrado");

          await setAuthUser({
            id: firestore.collection("users").doc().id,
            lobby: null,
            isAdmin: false,
            email: authUser.email,
            nickname: authUser.nickname,
          });

          return setIsLoadingLobby(false);
        }

        // AuthUser is admin.
        if (authUser.lobby?.game?.usersIds?.includes(authUser.id)) {
          return router.push(`/bingo/lobbies/${authUser.lobby.id}`);
        }

        /** Game is full. **/
        if (lobby?.countPlayers >= lobby?.limitByPlan) {
          props.showNotification("La sala llego a su limite permitido por su PLAN.");

          await setAuthUser({
            id: firestore.collection("users").doc().id,
            lobby: null,
            isAdmin: false,
            email: authUser.email,
            nickname: authUser.nickname,
          });

          return setIsLoadingLobby(false);
        }

        // Replace "newUser" if user has already logged in before with the same email.
        const user_ = authUser?.email ? await fetchUserByEmail(authUser.email, authUser.lobby.id) : null;

        // If user has already logged then redirect.
        if (user_) {
          await setAuthUser(user_);
          setAuthUserLs(user_);

          return router.push(`/bingo/lobbies/${authUser.lobby.id}`);
        }

        // Redirect to lobby.
        if (!lobby?.isPlaying) return router.push(`/bingo/lobbies/${authUser.lobby.id}`);

        // Else if lobby is playing then register user in firestore. This skips
        // Realtime Database registration flow
        const userId = authUser?.id ?? firestore.collection("users").doc().id;
        const userCard = getBingoCard();

        let newUser = {
          id: userId,
          userId,
          email: authUser?.email ?? null,
          nickname: authUser.nickname,
          avatar: authUser?.avatar ?? null,
          card: JSON.stringify(userCard),
          lobbyId: lobby.id,
          lobby,
          hasExited: false,
        };

        // Update metrics.
        const promiseMetric = firestore.doc(`games/${lobby?.game?.id}`).update({
          countPlayers: firebase.firestore.FieldValue.increment(1),
        });

        // Update metrics for lobby.
        const promiseLobby = firestore.doc(`lobbies/${lobby?.id}`).update({
          countPlayers: firebase.firestore.FieldValue.increment(1),
        });

        // Register user in lobby.
        const promiseUser = firestore
          .collection("lobbies")
          .doc(lobby.id)
          .collection("users")
          .doc(authUser.id)
          .set(newUser);

        // Register user as a member in company.
        const promiseMember = saveMembers(authUser.lobby, [newUser]);

        await Promise.all([promiseMetric, promiseUser, promiseMember, promiseLobby]);

        await setAuthUser(newUser);
        setAuthUserLs(newUser);

        // Redirect to lobby.
        await router.push(`/bingo/lobbies/${authUser.lobby.id}`);
      } catch (error) {
        console.error(error);
        sendError(error, "initialize");
        props.showNotification("No es posible unirse a lobby.", error?.message);

        return setAuthUser({
          id: authUser.id || firestore.collection("users").doc().id,
          lobby: null,
          isAdmin: false,
          email: authUser.email,
          nickname: authUser.nickname,
        });
      }
      setIsLoadingLobby(false);
    };

    initialize();
  }, [authUser.id, authUser?.lobby?.id, authUser?.nickname, authUser?.email]);

  // Fetch lobby to auto login.
  useEffect(() => {
    if (!authUser?.lobby?.pin) return;

    setIsLoading(true);
    fetchLobby(authUser.lobby.pin);
  }, []);

  // Auto fetch lobby.
  useEffect(() => {
    if (!pin) return;

    setIsLoading(true);
    fetchLobby(pin);
  }, [pin]);

  const emailIsRequired = useMemo(() => {
    return !!authUser?.lobby?.settings?.userIdentity;
  }, [authUser]);

  const goToPinStep = useMemo(
    () => (
      <div className="back">
        <Anchor
          underlined
          variant="white"
          fontSize="16px"
          onClick={async () => {
            await setAuthUser({
              ...authUser,
              email: null,
              nickname: null,
              lobby: null,
            });
            setAuthUserLs({
              ...authUser,
              email: null,
              nickname: null,
              lobby: null,
            });
          }}
        >
          {t("back")}
        </Anchor>
      </div>
    ),
    []
  );

  return (
    <LoginContainer storageUrl={config.storageUrl}>
      <div className="absolute top-4 right-4 lg:top-10 lg:right-10">
        <SwitchTranslation />
      </div>

      {isLoadingLobby ? spinLoader() : null}

      <div className="main-container">
        {!authUser?.lobby && (
          <>
            <PinStep isLoading={isLoading} setIsLoading={setIsLoading} fetchLobby={fetchLobby} {...props} />

            {authUser?.email && authUser?.nickname && (
              <div className="back" key={locale}>
                <Tooltip title={`email: ${authUser.email} nickname: ${authUser.nickname}`} placement="bottom">
                  <Anchor
                    underlined
                    variant="white"
                    fontSize="11px"
                    margin="10px auto"
                    onClick={async () => {
                      await setAuthUser({
                        ...authUser,
                        email: null,
                        nickname: null,
                        lobby: null,
                      });
                      setAuthUserLs({
                        ...authUser,
                        email: null,
                        nickname: null,
                        lobby: null,
                      });
                    }}
                  >
                    {t("remove-info")}
                  </Anchor>
                </Tooltip>
              </div>
            )}
          </>
        )}

        {authUser?.lobby && (
          <>
            {emailIsRequired && !authUser?.email && (
              <>
                <EmailStep isLoading={isLoading} setIsLoading={setIsLoading} {...props} />
                {goToPinStep}
              </>
            )}

            {(emailIsRequired && authUser?.email && !authUser.nickname) || (!emailIsRequired && !authUser?.nickname) ? (
              <>
                <NicknameStep isLoading={isLoading} setIsLoading={setIsLoading} {...props} />
                {goToPinStep}
              </>
            ) : null}
          </>
        )}
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  color: ${(props) => props.theme.basic.white};
  width: 100%;
  height: 100vh;
  background-image: url("${(props) => `${props.storageUrl}/resources/balls/coral-pattern-tablet.svg`}");
  background-position: center;
  background-size: contain;

  .main-container {
    padding: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  .login-container {
    padding: 15px;
    border-radius: 4px;
    background: ${(props) => props.theme.basic.white};

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .back {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 1rem;
  }
`;

export default Login;
