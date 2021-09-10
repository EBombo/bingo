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
  const [isVisibleModalAwards, setIsVisibleModalAwards] = useState(false);

  return (
    <BingoGameContainer>
      {isVisibleModalAwards && (
        <ModalAwards
          isVisibleModalAwards={isVisibleModalAwards}
          setIsVisibleModalAwards={setIsVisibleModalAwards}
          {...props}
        />
      )}
      {isVisibleModalWinner && (
        <ModalWinner
          winner={{ nickname: "smendo95", id: "justfortesting" }}
          isVisibleModalWinner={isVisibleModalWinner}
          setIsVisibleModalWinner={setIsVisibleModalWinner}
          {...props}
        />
      )}
      <div className="main-container">
        <Desktop>
          <CardPattern caption={"Patrón que se debe llenar"} {...props} />
          <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
          <RoundsLastNumber lastNumber={35} round={6} {...props} />
          <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
        </Desktop>
        <Tablet>
          <div className="bingo-board">
            <BingoBoard numbers={[1, 15, 45, 68, 23, 32]} {...props} />
          </div>
          <div className="pattern-rounds">
            <CardPattern caption={"Patrón que se debe llenar"} {...props} />
            <RoundsLastNumber lastNumber={35} round={6} {...props} />
          </div>
          <div className="options-container">
            <GameOptions lastNumber={30} lastLetter={"I"} {...props} />
          </div>
          <div className="awards" onClick={() => setIsVisibleModalAwards(true)}>
            Premios
          </div>
        </Tablet>
      </div>
      <Chat title={"CHAT DEL BINGO"} />
    </BingoGameContainer>
  );
};

const BingoGameContainer = styled.div`
  width: 100%;
  height: 100vh;

  .main-container {
    padding: 0.5rem;

    .bingo-board {
      max-width: 100%;
      overflow: auto;
      margin-top: 1rem;
    }

    .pattern-rounds {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin: 1rem 0;
    }

    .options-container {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: auto 300px;
  }
`;
