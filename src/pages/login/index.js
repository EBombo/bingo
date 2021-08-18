import { useForm } from "react-hook-form";
import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { object, string } from "yup";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonAnt, Input } from "../../components/form";

const Login = (props) => {
  const validationSchema = object().shape({
    pin: string().required().email(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  return (
    <LoginContainer>
      <Image
        src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
        width="200px"
        margin="10px auto"
      />
      <div className="login-container">
        <Input
          placeholder="Pin de juego"
          border="gray"
          padding="10px"
          textAlign="center"
          borderRadius="5px"
          bgColorEvents="white"
        />
        <ButtonAnt
          variant="secondary"
          color="white"
          border="none"
          width="100%"
          padding="10px"
        >
          Ingresar
        </ButtonAnt>
      </div>
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
