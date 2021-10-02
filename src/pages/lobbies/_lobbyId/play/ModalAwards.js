import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Input } from "antd";
import defaultTo from "lodash/defaultTo";
import { firestore } from "../../../../firebase";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";

export const ModalAwards = (props) => {
  const [authUser] = useGlobal("user");
  const [isSaving, setIsSaving] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [awards, setAwards] = useState(
    defaultTo(props.lobby.settings.awards, [])
  );
  const [award, setAward] = useState("");

  const deleteAward = async (index) => {
    const newSettings = props.lobby.settings;

    newSettings.awards.splice(index, 1);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      settings: newSettings,
      updateAt: new Date(),
    });
  };

  const addAward = async () => {
    setIsSaving(true);
    try {
      const newSettings = props.lobby.settings;

      if (newSettings.awards) {
        newSettings.awards.push(award);
      } else {
        newSettings.awards = [award];
      }

      setAward("");

      await firestore.doc(`lobbies/${props.lobby.id}`).update({
        settings: newSettings,
        updateAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
  };

  return (
    <ModalContainer
      background="#FAFAFA"
      closable={false}
      footer={null}
      top="10%"
      visible={props.isVisibleModalAwards}
    >
      {isVisibleModalConfirm && (
        <ModalConfirm
          isVisibleModalConfirm={isVisibleModalConfirm}
          setIsVisibleModalConfirm={setIsVisibleModalConfirm}
          title="¿Estás seguro que deseas volver?"
          description={"Si vuelves no se guardaran los cambios"}
          action={() => props.setIsVisibleModalAwards(false)}
          buttonName={"Volver"}
          {...props}
        />
      )}
      <AwardsContainer key={props.lobby.settings}>
        <div className="title">{authUser.isAdmin ? "Editar " : ""} Premios</div>
        {defaultTo(props.lobby.settings.awards, []).map((award, index) => (
          <div className="award" key={index}>
            <div className="label">Premio {index + 1}</div>
            <div className="content">
              <Input
                defaultValue={award.name}
                placeholder={`Premio ${index + 1}`}
              />
              {authUser.isAdmin && (
                <ButtonAnt color="danger" onClick={() => deleteAward(index)}>
                  Borrar
                </ButtonAnt>
              )}
            </div>
          </div>
        ))}
        {authUser.isAdmin && (
          <>
            <div className="label">Agregar premio</div>
            <form>
              <Input
                placeholder="Premio"
                name="award"
                value={award.name}
                onChange={(event) =>
                  setAward({
                    name: event.target.value,
                    order:
                      defaultTo(props.lobby.settings.awards, []).length + 1,
                  })
                }
              />
              <ButtonAnt
                color="secondary"
                loading={isSaving}
                onClick={() => addAward()}
              >
                Agregar
              </ButtonAnt>
            </form>
            <div className="btns-container">
              <ButtonAnt
                color="default"
                onClick={() => setIsVisibleModalConfirm(true)}
              >
                Cancelar
              </ButtonAnt>
              <ButtonAnt>Guardar</ButtonAnt>
            </div>
          </>
        )}
      </AwardsContainer>
    </ModalContainer>
  );
};

const AwardsContainer = styled.div`
  width: 100%;
  font-family: Lato;

  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-bottom: 1rem;
  }

  .label {
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.blackDarken};
    margin-bottom: 5px;
  }

  .award {
    .content {
      display: grid;
      grid-template-columns: auto 60px;
      grid-gap: 15px;
      align-items: center;
    }
  }

  form {
    display: grid;
    grid-template-columns: auto 80px;
    grid-gap: 15px;
    align-items: center;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }
`;
