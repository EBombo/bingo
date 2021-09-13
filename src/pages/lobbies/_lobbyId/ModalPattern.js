import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { CardPattern } from "./CardPattern";
import { mediaQuery } from "../../../constants";

export const ModalPattern = (props) => {
  return (
    <ModalContainer
      background="#FAFAFA"
      footer={null}
      closable={false}
      top="20%"
      padding="1rem"
      visible={props.isVisibleModalPattern}
    >
      <Content>
        <div className="title">
          Si cambia el patrón podría ya haber un ganador
        </div>
        <CardPattern
          isEdit
          cancelAction={() => props.setIsVisibleModalPattern(false)}
          {...props}
        />
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  ${mediaQuery.afterTablet} {
    font-size: 20px;
    line-height: 24px;
  }
`;
