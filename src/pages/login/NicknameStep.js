import { ButtonBingo, InputBingo } from "../../components/form";
import { Image } from "../../components/common/Image";
import { useForm } from "react-hook-form";
import { config } from "../../firebase";
import styled from "styled-components";
import { object, string } from "yup";
import React from "reactn";

export const NicknameStep = (props) => {
  const validationSchema = object().shape({
    nickname: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const nicknameSubmit = async (data) => {
    props.setIsLoading(true);
    props.setNickname(data.nickname);
    props.setIsLoading(false);
  };

  return (
    <NicknameForm onSubmit={handleSubmit(nicknameSubmit)}>
      <Image
        src={`${config.storageUrl}/resources/white-icon-ebombo.png`}
        width="180px"
        margin="10px auto"
      />
      <div className="login-container">
        <InputBingo
          ref={register}
          error={errors.nickname}
          name="nickname"
          align="center"
          width="100%"
          margin="10px auto"
          variant="default"
          disabled={props.isLoading}
          placeholder="Apodo"
        />
        <ButtonBingo width="100%" disabled={props.isLoading} htmlType="submit">
          Ingresar
        </ButtonBingo>
      </div>
    </NicknameForm>
  );
};

const NicknameForm = styled.form`
  padding: 10px;
  max-width: 400px;
  margin: 10% auto auto auto;
  color: ${(props) => props.theme.basic.white};
`;
