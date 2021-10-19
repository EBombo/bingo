import React, { useEffect, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import { timeoutPromise } from "../../../../utils/promised";
import { mediaQuery } from "../../../../constants";
import { Winner } from "./Winner";
import { ButtonAnt, ButtonBingo } from "../../../../components/form";
import { fadeOutLeftBig, fadeOutUpBig } from "react-animations";

export const LobbyClosed = (props) => {
  const [isVisibleTitle, setIsVisibleTitle] = useState(true);
  const [isVisibleTitleAnimation, setIsVisibleTitleAnimation] = useState(false);

  const [showResume, setShowResume] = useState(false);
  const [showResumeAnimation, setShowResumeAnimation] = useState(false);

  useEffect(() => {
    const initializeAnimation = async () => {
      await timeoutPromise(2 * 1000);
      setIsVisibleTitleAnimation(true);
      await timeoutPromise(2 * 1000);
      setIsVisibleTitle(false);
    };

    initializeAnimation();
  }, []);

  const initializeTransition = async () => {
    setShowResumeAnimation(true);
    await timeoutPromise(2 * 1000);
    setShowResume(true);
    setShowResumeAnimation(false);
  };

  return !showResume ? (
    <LobbyClosedCss isVisibleTitleAnimation={isVisibleTitleAnimation} showResumeAnimation={showResumeAnimation}>
      <>
        <div className="header">
          {!isVisibleTitle && (
            <ButtonBingo variant="primary" margin="10px 10px auto auto" onClick={initializeTransition}>
              Siguiente
            </ButtonBingo>
          )}
        </div>

        {isVisibleTitle && <div className="title">{props.lobby.game.title}</div>}

        <div className="winners">
          {!isVisibleTitle &&
            props.lobby.winners?.map((winner, index) => <Winner winner={winner} index={index} key={index} />)}
        </div>
      </>
    </LobbyClosedCss>
  ) : (
    <LobbyResumeCss>
      <div className="resume">
        <div className="item">
          <ButtonAnt variant="contained" color="primary" margin="auto">
            Volver ap podio
          </ButtonAnt>
        </div>
        <div className="child">
          <div className="item">asd</div>
          <div className="item flex">
            <div className="content-center">
              ¿Se divirtieron?
              <ButtonAnt variant="contained" color="success" margin="auto">
                Jugar de nuevo
              </ButtonAnt>
            </div>
          </div>
          <div className="item">asd</div>
          <div className="item">
            <ButtonAnt variant="contained" color="primary" margin="20px auto" width="80%">
              Ver reporte completo
            </ButtonAnt>
            <ButtonAnt variant="contained" color="primary" margin="20px auto" width="80%">
              Volver al inicio
            </ButtonAnt>
          </div>
        </div>
      </div>
    </LobbyResumeCss>
  );
};

const LobbyResumeCss = styled.div`
  display: flex;
  height: 100vh;
  text-align: center;

  .flex {
    display: flex;
  }

  .item {
    border-radius: 10px;
    background: ${(props) => props.theme.basic.white};

    .content-center {
      margin: auto;
    }
  }

  .resume {
    width: 90%;
    margin: auto;
    display: grid;
    height: 300px;
    grid-gap: 20px;
    grid-template-columns: 1.5fr 3fr;

    .child {
      display: grid;
      grid-gap: 20px;
      grid-template-columns: 1.3fr 1fr;
      grid-template-rows: 1fr 1fr;
    }
  }
`;

const fadeOutUpBigAnimation = keyframes`${fadeOutUpBig}`;
const fadeOutLeftBigAnimation = keyframes`${fadeOutLeftBig}`;

const LobbyClosedCss = styled.div`
  display: grid;
  grid-template-rows: 1fr 6fr;
  height: 100vh;

  .header {
    display: flex;
  }

  .title {
    margin: auto;
    background: ${(props) => props.theme.basic.white};
    font-size: 1.5rem;
    padding: 10px 10px;
    border-radius: 5px;
    animation: 2s ${(props) => (props.isVisibleTitleAnimation ? fadeOutUpBigAnimation : "")};
  }

  .winners {
    height: 100%;
    width: 90%;
    margin: auto;
    animation: 2s ${(props) => (props.showResumeAnimation ? fadeOutLeftBigAnimation : "")};

    ${mediaQuery.afterTablet} {
      width: 70vw;
    }
  }
`;
