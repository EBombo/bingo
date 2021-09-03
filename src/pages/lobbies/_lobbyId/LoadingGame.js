import React, { useState, useGlobal, useEffect } from "reactn";
import styled from "styled-components";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import get from "lodash/get";
import { mediaQuery } from "../../../constants";

export const LoadingGame = (props) => {
  const [step, setStep] = useState(true);

  useEffect(() => {}, []);

  return (
    <LoadingGameContainer>
      <div className="step-one">
        <Image
          src={`${config.storageUrl}/resources/white-icon-ebombo.svg`}
          height="58px"
          width="222px"
          desktopHeight="92px"
          desktopWidth="350px"
          size="contain"
          margin="0 auto"
          className="step-one-logo"
        />
        <div className="step-one-description">Entra a www.ebombo.it</div>
      </div>
      <div className="step-two">
        <div className="step-two-name">{get(props, "lobby.game.name", "")}</div>
      </div>
      <div className="step-three">
        <div className="main-container">
          <div className="page">
            <div className="number">
              <span className="num3">3</span>
              <span className="num2">2</span>
              <span className="num1">1</span>
            </div>
          </div>
        </div>
      </div>
    </LoadingGameContainer>
  );
};

const LoadingGameContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;

  .step-one {
    &-logo {
      position: relative;
      animation-delay: 2s;
      margin-top: 3rem;
      animation: move-up 2s forwards;
      -webkit-animation-delay: 2s;
      -o-animation-delay: 2s;
    }

    &-description {
      margin: 2rem auto;
      max-width: 375px;
      height: 50px;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: "Gloria Hallelujah", cursive;
      font-style: normal;
      font-weight: normal;
      font-size: 25px;
      line-height: 50px;
      color: ${(props) => props.theme.basic.blackDarken};
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      animation-delay: 2s;
      animation: move-right 3s forwards;
      -webkit-animation-delay: 2s;
      -o-animation-delay: 2s;
    }
  }

  .step-two {
    width: 100%;

    &-name {
      position: absolute;
      top: 40%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      height: 123px;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Gloria Hallelujah;
      font-style: normal;
      font-weight: normal;
      font-size: 30px;
      line-height: 59px;
      animation: 6s ease 0s normal forwards 1 fadein;
      -webkit-animation: 6s ease 0s normal forwards 1 fadein;
      opacity: 0;
    }
  }

  .step-three {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .main-container {
      width: 115px;
      height: 115px;
      background: ${(props) => props.theme.basic.secondaryDark};

      .page {
        width: 100%;
        height: 100%;
      }

      .number {
        font-size: 140px;
        color: ${(props) => props.theme.basic.grayDark};
        line-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
      }

      span {
        opacity: 1;
      }

      .num3,
      .num2,
      .num1 {
        color: ${(props) => props.theme.basic.danger};
      }

      .num1 {
        animation: time 10s infinite;
        animation-delay: (10-1 * 2) + s;
      }

      .num2 {
        animation: time 10s infinite;
        animation-delay: (20-2 * 2) + s;
      }

      .num3 {
        animation: time 10s infinite;
        animation-delay: (20-3 * 2) + s;
      }

      @-webkit-keyframes time {
        0% {
          opacity: 0;
          transform: scale(1);
        }
        10% {
          opacity: 0;
          transform: scale(1);
        }

        100% {
          opacity: 0;
          transform: scale(1);
        }

        5% {
          opacity: 0.8;
          transform: scale(1.2);
        }
      }

      ${mediaQuery.afterTablet} {
        width: 180px;
        height: 180px;
      }
    }
  }

  @keyframes move-right {
    0% {
      left: 0;
    }
    100% {
      left: 100%;
    }
  }

  @keyframes move-up {
    0% {
      top: 0;
    }
    100% {
      transform: translateY(calc(-100% - 3rem));
      opacity: 0;
    }
  }

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
