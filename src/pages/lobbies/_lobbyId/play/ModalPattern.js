import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { CardPattern } from "./CardPattern";
import { mediaQuery } from "../../../../constants";

export const ModalPattern = (props) => (
  <ModalContainer
    background="#331E6C"
    footer={null}
    topDesktop="20%"
    padding="1rem"
    visible={props.isVisibleModalPattern}
    onCancel={() => props.setIsVisibleModalPattern(false)}
  >
    <div className="flex items-center justify-center flex-col	">
      <div className="text-['Lato'] text-[20px] leading-[24px] text-white text-center font-[900]">
        {!props.lobby.startGame
          ? "Por favor llene el patrón para empezar el juego"
          : "Si cambia el patrón podría ya haber un ganador"}
      </div>
      <div className="p-4 w-full max-w-[250px] bg-secondary shadow-[0px_4px_8px_rgba(0, 0, 0, 0.25)] rounded-[4px] my-5">
        <div className="text-['Lato'] text-[18px] leading-[22px] text-white text-center">Patrón a completar</div>
        <CardPattern isEdit cancelAction={() => props.setIsVisibleModalPattern(false)} {...props} />
      </div>
    </div>
  </ModalContainer>
);
