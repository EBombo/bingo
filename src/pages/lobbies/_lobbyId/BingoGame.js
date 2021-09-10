import React, { useState } from "reactn";
import styled from "styled-components";
import { Chat } from "../../../components/chat";
import { mediaQuery, Tablet, Desktop } from "../../../constants";
import { BingoBoard } from "./BingoBoard";
import { RoundsLastNumber } from "./RoundsLastNumber";
import { GameOptions } from "./GameOptions";
import { CardPattern } from "./CardPattern";
import { ModalWinner } from "./ModalWinner";

export const BingoGame = (props) => {
  const [isVisibleModalWinner, setIsVisibleModalWinner] = useState(true);

  return (
    <BingoGameContainer>
      {isVisibleModalWinner && (
        <ModalWinner
          winner={{ nickname: "smendo95", id: "justfortesting" }}
          isVisibleModalWinner={isVisibleModalWinner}
          setIsVisibleModalWinner={setIsVisibleModalWinner}
          {...props}
        />
      )}
      <div className="main-game-container">
        <Desktop>
          <CardPattern caption={"Patrón que se debe llenar"} {...props} />
          <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
          <RoundsLastNumber lastNumber={35} round={6} {...props} />
          <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
        </Desktop>
        <Tablet>
          <CardPattern caption={"Patrón que se debe llenar"} {...props} />
          <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
          <RoundsLastNumber lastNumber={35} round={6} {...props} />
          <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
        </Tablet>
      </div>
      <Chat title={"CHAT DEL BINGO"} />
    </BingoGameContainer>
  );
};

const BingoGameContainer = styled.div`
  width: 100%;
  height: 100vh;

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: auto 300px;
  }
`;
