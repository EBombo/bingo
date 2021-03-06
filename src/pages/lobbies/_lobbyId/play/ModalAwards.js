import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { ButtonAnt } from "../../../../components/form";
import { Input } from "antd";
import defaultTo from "lodash/defaultTo";
import { firestore } from "../../../../firebase";
import { ModalConfirm } from "../../../../components/modal/ModalConfirm";
import { FileUpload } from "../../../../components/common/FileUpload";
import { AfterMobile, Mobile } from "../../../../constants";
import { useTranslation } from "../../../../hooks";

export const ModalAwards = (props) => {
  const { t } = useTranslation("lobby-play");

  const [authUser] = useGlobal("user");

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false);
  const [awards, setAwards] = useState(defaultTo(props.lobby.settings.awards, []));
  const [award, setAward] = useState("");

  const deleteAward = async (index) => {
    const newAwards = [...awards];
    newAwards.splice(index, 1);
    setAwards(newAwards);
    setIsUpdating(true);
  };

  const addAward = async () => {
    const newAwards = [...awards];
    newAwards.push({ ...award, id: firestore.collection("awards").doc().id });
    setAwards(newAwards);
    setAward("");
    setIsUpdating(true);
  };

  const saveAwards = async () => {
    setIsSaving(true);

    const newSettings = props.lobby.settings;

    newSettings.awards = awards;

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      settings: newSettings,
      updateAt: new Date(),
    });

    setIsSaving(false);
    setIsUpdating(false);
    props.setIsVisibleModalAwards(false);
  };

  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      topDesktop="10%"
      visible={props.isVisibleModalAwards}
      onCancel={() => props.setIsVisibleModalAwards(false)}
    >
      {isVisibleModalConfirm && (
        <ModalConfirm
          isVisibleModalConfirm={isVisibleModalConfirm}
          setIsVisibleModalConfirm={setIsVisibleModalConfirm}
          title="??Est??s seguro que deseas volver?"
          description={"Si vuelves no se guardaran los cambios."}
          action={() => props.setIsVisibleModalAwards(false)}
          buttonName={"Volver"}
          {...props}
        />
      )}

      <AwardsContainer key={props.lobby.settings}>
        <div className="title">
          {authUser.isAdmin ? t("edit") : ""} {t("rewards")}
        </div>
        {defaultTo(awards, []).map((award, index) => (
          <div
            className="relative bg-whiteLight shadow-[0_0_8px_rgba(0,0,0,0.17)] rounded-[10px] grid grid-cols-[2fr_1fr] items-center my-4 md:grid-cols-[2fr_1fr_1fr] h-[150px] md:h-[130px]"
            key={index}
          >
            <div className="absolute top-[10%] w-[120px] flex">
              <div className="pointer">
                {t("reward")} {index + 1}
              </div>
            </div>
            <div className="p-2 relative w-full h-full">
              <div className="absolute bottom-[10px] bg-gray text-blackDarken w-[90%] rounded-[4px] p-2">
                {award.name}
              </div>
            </div>
            <div className="">
              <FileUpload
                file={award.imageUrl}
                preview={true}
                fileName="awardImg"
                filePath={`awards/${award.id}`}
                sizes="250x250"
                afterUpload={(images) => {
                  const newAwards = [...awards];
                  newAwards[index].imageUrl = images[0].url;
                  console.log(newAwards);
                  setAwards(newAwards);
                }}
              />

              <Mobile>
                {authUser?.isAdmin && (
                  <ButtonAnt color="danger" onClick={() => deleteAward(index)} padding="5px" margin="0 auto">
                    {t("delete")}
                  </ButtonAnt>
                )}
              </Mobile>
            </div>
            <AfterMobile>
              <div className="p-2">
                {authUser?.isAdmin && (
                  <ButtonAnt color="danger" onClick={() => deleteAward(index)} size="small">
                    {t("delete")}
                  </ButtonAnt>
                )}
              </div>
            </AfterMobile>
          </div>
        ))}
        {authUser.isAdmin && (
          <>
            <div className="relative bg-whiteLight shadow-[0_0_8px_rgba(0,0,0,0.17)] rounded-[10px] grid items-center my-4 grid-cols-[2fr_1fr] h-[120px]">
              <div className="absolute top-[10%] w-[120px] flex">
                <div className="pointer">{t("add-reward")}</div>
              </div>

              <div className="p-2">
                <form>
                  <Input
                    placeholder={t("reward")}
                    name="award"
                    value={award.name}
                    onChange={(event) => {
                      event.preventDefault();
                      setAward({
                        name: event.target.value,
                        order: defaultTo(props.lobby.settings.awards, []).length + 1,
                      });
                    }}
                  />
                </form>
              </div>
              <ButtonAnt color="secondary" margin="0 auto" padding="5px" onClick={() => addAward()}>
                {t("add")}
              </ButtonAnt>
            </div>
            <div className="btns-container">
              <ButtonAnt
                color="default"
                onClick={() => (isUpdating ? setIsVisibleModalConfirm(true) : props.setIsVisibleModalAwards(false))}
              >
                {t("cancel")}
              </ButtonAnt>
              <ButtonAnt loading={isSaving} onClick={() => saveAwards()}>
                {t("save")}
              </ButtonAnt>
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
    margin-top: 0.5rem;
    margin-bottom: 5px;
  }

  .award {
    .content {
      display: grid;
      grid-template-columns: 80% 20%;
      grid-gap: 15px;
      align-items: center;
    }
  }

  form {
    display: grid;
    grid-template-columns: 80% 20%;
    grid-gap: 15px;
    align-items: center;
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }

  .pointer {
    width: 100%;
    height: 22px;
    position: relative;
    background: ${(props) => props.theme.basic.primary};
    text-align: center;
  }

  .pointer:before {
    content: "";
    position: absolute;
    right: -11px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 11px solid ${(props) => props.theme.basic.primary};
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
  }
`;
