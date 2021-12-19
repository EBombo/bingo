import React, { useEffect, useGlobal, useState } from "reactn";
import { ButtonBingo, InputBingo } from "../../components/form";
import { Image } from "../../components/common/Image";
import { useForm } from "react-hook-form";
import { config, database, firestore } from "../../firebase";
import styled from "styled-components";
import { object, string } from "yup";
import { useSendError, useUser } from "../../hooks";
import { ValidateNickname } from "./ValidateNickname";
import { firebase } from "../../firebase/config";
import { getBingoCard } from "../../business";
import { saveMembers } from "../../constants/saveMembers";

export const NicknameStep = (props) => {
  const { sendError } = useSendError();

  const [, setAuthUserLs] = useUser();
  const [authUser, setAuthUser] = useGlobal("user");

  const [users, setUsers] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validationSchema = object().shape({
    nickname: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!authUser?.lobby) return;

    const fetchUsers = async () => {
      const userStatusDatabaseRef = database.ref(`lobbies/${authUser.lobby.id}/users`);

      userStatusDatabaseRef.on("value", (snapshot) => {
        let users_ = Object.values(snapshot.val() ?? {});
        users_ = users_.filter((user) => user.state.includes("online"));
        setUsers(users_);
      });
    };

    fetchUsers();
  }, [authUser.lobby]);

  const validateNickname = async (data) => {
    setIsValidating(true);

    try {
      props.setIsLoading(true);

      if (users.some((user) => user.nickname === data.nickname)) {
        setIsValidating(false);
        throw Error("ERROR", "El nickname ya se encuentra registrado");
      }

      await setAuthUser({ ...authUser, nickname: data.nickname });

      if (authUser.lobby?.isPlaying) {
        const newUser = {
          email: authUser?.email ?? null,
          userId: authUser?.id ?? null,
          nickname: authUser?.nickname ?? null,
          avatar: authUser?.avatar ?? null,
          lobbyId: authUser.lobby.id,
          card: JSON.stringify(getBingoCard()),
        };

        await firestore.doc(`games/${authUser.lobby.game.id}`).update({
          countPlayers: firebase.firestore.FieldValue.increment(1),
        });

        await firestore
          .collection("lobbies")
          .doc(authUser.lobby.id)
          .update({
            users: { ...authUser.lobby.users, [authUser.id]: newUser },
          });

        await saveMembers(authUser.lobby, authUser);
      }

      setAuthUserLs({ ...authUser, nickname: data.nickname });
    } catch (error) {
      props.showNotification("Error", error.message);

      await sendError({
        error: Object(error).toString(),
        action: "nicknameSubmit",
      });
    }

    props.setIsLoading(false);
    setIsValidating(false);
  };

  return (
    <NicknameForm onSubmit={handleSubmit(validateNickname)}>
      {isValidating && <ValidateNickname {...props} />}

      <Image src={`${config.storageUrl}/resources/white-icon-ebombo.png`} width="180px" margin="10px auto" />

      <div className="login-container">
        <InputBingo
          ref={register}
          error={errors.nickname}
          name="nickname"
          align="center"
          width="100%"
          margin="10px auto"
          variant="default"
          defaultValue={authUser?.nickname ?? null}
          disabled={props.isLoading}
          placeholder="Apodo"
          autoComplete="off"
        />

        <ButtonBingo width="100%" disabled={props.isLoading} loading={props.isLoading} htmlType="submit">
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
