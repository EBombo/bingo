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
import { Lobby } from "./Lobby";

const Login = (props) => {
  const [authUser] = useGlobal("user");

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

  const fetchLobby = async (pin, callback) => {
    const lobbyRef = await firestore
      .collection("lobbies")
      .where("pin", "==", +pin)
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
    //if the current lobby is isClosed:true [return and notification]
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
    <>
      <LoginContainer>
        {!lobby && (
          <form onSubmit={handleSubmit(validatePin)}>
            <Image
              src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
              width="180px"
              margin="10px auto"
            />
            <div className="login-container">
              <InputBingo
                ref={register}
                error={errors.pin}
                name="pin"
                align="center"
                width="100%"
                margin="10px auto"
                variant="default"
                disabled={isLoading}
                placeholder="Pin del juego"
              />
              <ButtonBingo width="100%" disabled={isLoading} htmlType="submit">
                Ingresar
              </ButtonBingo>
            </div>
          </form>
        )}
        {lobby && lobby.userIdentity && !email && (
          <EmailStep
            lobby={lobby}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setEmailVerification={setEmail}
            {...props}
          />
        )}
        {((lobby && lobby.userIdentity && email && !nickname) ||
          (lobby && !lobby.userIdentity && !nickname)) && (
          <NicknameStep
            lobby={lobby}
            nickname={nickname}
            setNickname={setNickname}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            {...props}
          />
        )}
      </LoginContainer>
      {((lobby && lobby.userIdentity && email && nickname) ||
        (lobby && !lobby.userIdentity && nickname)) && (
        <Lobby {...props} lobby={lobby} email={email} nickname={nickname} />
      )}
    </>
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
  }
`;

export default Login;
