import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonBingo, InputBingo } from "../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

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
    console.log("submit nickname", data);
    props.setNickname(data.nickname);
    props.setIsLoading(false);
  };

  return (
    <NicknameForm onSubmit={handleSubmit(nicknameSubmit)}>
      <Image
        src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
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
