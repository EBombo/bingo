import React from "reactn";
import styled from "styled-components";
import { Chat } from "../../../components/chat";
import { mediaQuery, Tablet, Desktop } from "../../../constants";
import { BingoBoard } from "./BingoBoard";
import { RoundsLastNumber } from "./RoundsLastNumber";
export const BingoGame = (props) => {
  return (
    <BingoGameContainer>
      <div className="main-game-container">
        <Desktop>
          <RoundsLastNumber lastNumber={35} round={6} {...props} />
          <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
        </Desktop>
        <Tablet>
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
