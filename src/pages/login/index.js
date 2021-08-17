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
      />
      <div className="login-container">
        <Input placeholder="Pin de juego" />
        <ButtonAnt>Ingresar</ButtonAnt>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  margin: auto;
  padding: 10px;
  max-width: 400px;
  color: ${(props) => props.theme.basic.white};
  .login-container {
    background: ${(props) => props.theme.basic.white};
    padding: 15px;
    border-radius: 4px;
  }
`;

export default Login;
