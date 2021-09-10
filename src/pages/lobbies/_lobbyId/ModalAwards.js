import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import get from "lodash/get";
import { ButtonAnt } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { Input } from "antd";

export const ModalAwards = (props) => {
  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      top="10%"
      visible={props.isVisibleModalAwards}
    >
      <AwardsContainer>
        <div className="title">Editar Premios</div>
        {props.awards.map((award, index) => (
          <div className="award">
            <div className="label">Premio {index + 1}</div>
            <div className="content">
              <Input
                defaultValue={get(award, "name", "")}
                placeholder={`Premio ${index + 1}`}
              />
              <ButtonAnt color="danger">Borrar</ButtonAnt>
            </div>
          </div>
        ))}
        <div className="label">Agregar premio</div>
        <form action="">
          <Input placeholder="Premio" />
          <ButtonAnt
            color="secondary"
            onClick={() => props.setIsVisibleModalAwards(false)}
          >
            Agregar
          </ButtonAnt>
        </form>
        <div className="btns-container">
          <ButtonAnt
            color="default"
            onClick={() => props.setIsVisibleModalAwards(false)}
          >
            Volver
          </ButtonAnt>
          <ButtonAnt>Guardar</ButtonAnt>
        </div>
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
    justify-content: space-between;
    margin: 1rem 0;
  }
`;
