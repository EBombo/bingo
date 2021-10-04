import { ButtonBingo, InputBingo } from "../../components/form";
import React, { useEffect, useGlobal, useState } from "reactn";
import { Image } from "../../components/common/Image";
import { config, firestore } from "../../firebase";
import { NicknameStep } from "./NicknameStep";
import { snapshotToArray } from "../../utils";
import { useForm } from "react-hook-form";
import { EmailStep } from "./EmailStep";
import styled from "styled-components";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { useUser } from "../../hooks";

const Login = (props) => {
  const router = useRouter();
  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const [lobby, setLobby] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(authUser?.email ?? null);
  const [nickname, setNickname] = useState(authUser?.nickname ?? null);

  const validationSchema = object().shape({
    pin: string().required().min(6),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!lobby) return;
    if (!nickname) return;
    if (lobby.userIdentity && !email) return;

    const currentUser = {
      ...authUser,
      nickname,
      email: email ?? null,
      lobby: lobby,
    };

    setAuthUserLs(currentUser);
    setAuthUser(currentUser);
    router.push(`/lobbies/${lobby.id}`);
  }, [lobby, nickname, email]);

  const fetchLobby = async (pin, callback) => {
    const lobbyRef = await firestore
      .collection("lobbies")
      .where("pin", "==", pin.toString())
      .where("isLocked", "==", false)
      .limit(1)
      .get();

    if (lobbyRef.empty) {
      props.showNotification(
        "UPS",
        "No encontramos tu sala, intenta nuevamente",
        "warning"
      );
      return setIsLoading(false);
    }
    const currentLobby = snapshotToArray(lobbyRef)[0];

    if (currentLobby.isClosed) {
      await setAuthUser({ id: firestore.collection("users").doc().id });
      setLobby(null);
      setEmail(null);
      setNickname(null);
      return callback && callback(false);
    }

    setLobby(currentLobby);
    callback && callback(false);
  };

  useEffect(() => {
    if (lobby || !authUser?.lobby?.pin) return;

    setIsLoading(true);
    fetchLobby(authUser.lobby.pin, setIsLoading);
  }, [authUser?.lobby?.pin]);

  const validatePin = async (data) => {
    setIsLoading(true);

    await fetchLobby(data.pin, setIsLoading);
  };

  return (
    <LoginContainer>
      {!lobby && (
        <form onSubmit={handleSubmit(validatePin)}>
          <Image
            src={`${config.storageUrl}/resources/white-icon-ebombo.png`}
            width="180px"
            margin="10px auto 2rem auto"
          />
          <div className="login-container">
            <InputBingo
              ref={register}
              error={errors.pin}
              type="number"
              name="pin"
              align="center"
              width="100%"
              margin="10px auto"
              variant="default"
              disabled={isLoading}
              placeholder="Pin del juego"
            />
            <ButtonBingo
              width="100%"
              disabled={isLoading}
              loading={isLoading}
              htmlType="submit"
            >
              Ingresar
            </ButtonBingo>
          </div>
        </form>
      )}

      {lobby
        ? lobby.settings?.userIdentity &&
          !email && (
            <EmailStep
              lobby={lobby}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setEmailVerification={setEmail}
              {...props}
            />
          )
        : null}

      {lobby ? (
        (lobby.settings.userIdentity && email && !nickname) ||
        (!lobby.settings.userIdentity && !nickname) ? (
          <NicknameStep
            lobby={lobby}
            nickname={nickname}
            setNickname={setNickname}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            {...props}
          />
        ) : null
      ) : null}
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  padding: 10px;
  max-width: 400px;
  margin: 10% auto auto auto;
  color: ${(props) => props.theme.basic.white};

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
`;

export default Login;
