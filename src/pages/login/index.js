import { useForm } from "react-hook-form";
import React, { useState } from "reactn";
import styled from "styled-components";
import { object, string } from "yup";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonBingo, InputBingo } from "../../components/form";
import { NicknameStep } from "./NicknameStep";
import { EmailStep } from "./EmailStep";
import { mediaQuery } from "../../constants";

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState(null);
  const [emailVerification, setEmailVerification] = useState(null);
  const [nickname, setNickname] = useState(null);

  const validationSchema = object().shape({
    pin: string().required().min(6),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const validatePin = async (data) => {
    setIsLoading(true);
    console.log("fetch the game if the game exist set the game", data);
    setGame({
      verification: true,
      name: "bingo",
    });
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
        {game && game.verification && !emailVerification && (
          <EmailStep
            game={game}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setEmailVerification={setEmailVerification}
            {...props}
          />
        )}
        {game && emailVerification && !nickname && (
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
      {game && emailVerification && nickname && (
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

export default Login;
