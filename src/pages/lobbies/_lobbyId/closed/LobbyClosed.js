import { fadeOutUpBig } from "react-animations";
import React, { useEffect, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import { timeoutPromise } from "../../../../utils/promised";
import { mediaQuery } from "../../../../constants";
import { Winner } from "./Winner";

export const LobbyClosed = (props) => {
  const [isVisibleTitle, setIsVisibleTitle] = useState(true);
  const [isVisibleTitleAnimation, setIsVisibleTitleAnimation] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await timeoutPromise(2 * 1000);
      setIsVisibleTitleAnimation(true);
      await timeoutPromise(2 * 1000);
      setIsVisibleTitle(false);
    };

    initialize();
  }, []);

  return (
    <LobbyClosedCss isVisibleTitleAnimation={isVisibleTitleAnimation}>
      {isVisibleTitle && <div className="title">{props.lobby.game.title}</div>}

      {!isVisibleTitle && (
        <div className="winners">
          {props.lobby.winners?.map((winner, index) => (
            <Winner winner={winner} index={index} key={index} />
          ))}
        </div>
      )}
    </LobbyClosedCss>
  );
};

const fadeOutUpBiganimation = keyframes`${fadeOutUpBig}`;

const LobbyClosedCss = styled.div`
  display: flex;
  height: 100vh;

  .title {
    margin: auto;
    background: ${(props) => props.theme.basic.white};
    font-size: 1.5rem;
    padding: 10px 10px;
    border-radius: 5px;
    animation: 2s ${(props) => (props.isVisibleTitleAnimation ? fadeOutUpBiganimation : "")};
  }

  .winners {
    width: 90%;
    margin: auto;

    ${mediaQuery.afterTablet} {
      width: 70vw;
    }
  }
`;
