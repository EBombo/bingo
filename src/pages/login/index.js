import { ButtonBingo, InputBingo } from "../../components/form";
import { Image } from "../../components/common/Image";
import { config, firestore } from "../../firebase";
import { NicknameStep } from "./NicknameStep";
import { snapshotToArray } from "../../utils";
import { useForm } from "react-hook-form";
import React, { useGlobal, useState } from "reactn";
import { EmailStep } from "./EmailStep";
import styled from "styled-components";
import { object, string } from "yup";
import { Lobby } from "./Lobby";

const Login = (props) => {
  const [authUser] = useGlobal("user");

  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState(authUser?.game ?? null);
  const [email, setEmail] = useState(authUser?.email ?? null);
  const [nickname, setNickname] = useState(authUser?.nickname ?? null);

  const validationSchema = object().shape({
    pin: string().required().min(6),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const validatePin = async (data) => {
    setIsLoading(true);

    const gameRef = await firestore
      .collection("games")
      .where("pin", "==", +data.pin)
      .limit(1)
      .get();

    if (gameRef.empty) {
      props.showNotification(
        "UPS",
        "No encontramos tu juego, intenta nuevamente",
        "warning"
      );
      return setIsLoading(false);
    }

    setGame(snapshotToArray(gameRef)[0]);
    setIsLoading(false);
  };

  return (
    <>
      <LoginContainer>
        {!game && (
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
        {game && game.userIdentity && !email && (
          <EmailStep
            game={game}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setEmailVerification={setEmail}
            {...props}
          />
        )}
        {((game && game.userIdentity && email && !nickname) ||
          (game && !game.userIdentity && !nickname)) && (
          <NicknameStep
            game={game}
            nickname={nickname}
            setNickname={setNickname}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            {...props}
          />
        )}
      </LoginContainer>
      {((game && game.userIdentity && email && nickname) ||
        (game && !game.userIdentity && nickname)) && (
        <Lobby {...props} game={game} email={email} nickname={nickname} />
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
