import { useForm } from "react-hook-form";
import React, { useState } from "reactn";
import styled from "styled-components";
import { object, string } from "yup";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonBingo, InputBingo } from "../../components/form";

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = object().shape({
    pin: string().required().min(6),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const validatePin = async (data) => {
    setIsLoading(true);
    console.log("data", data);
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit(validatePin)}>
        <Image
          src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
          width="200px"
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
          <ButtonBingo width="100%" disabled={isLoading}>
            Ingresar
          </ButtonBingo>
        </div>
      </form>
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
  }
`;

export default Login;
