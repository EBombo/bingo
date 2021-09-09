import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import get from "lodash/get";
import { mediaQuery } from "../../../constants";

export const LoadingGame = (props) => {
  const [authUser] = useState("user");

  return (
    <LoadingGameContainer>
      {authUser.isAdmin ? (
        <>
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
            <div className="step-two-name">
              {get(props, "lobby.game.name", "")}
            </div>
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
          <div className="step-four">
            <div className="step-four-image">
              <Image
                src={`${config.storageUrl}/resources/amount.svg`}
                height="35px"
                width="35px"
                desktopHeight="55px"
                desktopWidth="55px"
                size="contain"
                margin="0"
                className="amount-logo"
              />
            </div>
            <div className="step-four-description">BINGO</div>
            <div className="step-four-bar" />
          </div>
        </>
      ) : (
        <>
          <div className="step-one">
            <div className="step-one-title">¡Prepárate!</div>
          </div>
          <div className="step-four">
            <div className="step-four-image">
              <Image
                src={`${config.storageUrl}/resources/amount.svg`}
                height="35px"
                width="35px"
                desktopHeight="55px"
                desktopWidth="55px"
                size="contain"
                margin="0"
                className="amount-logo"
              />
            </div>
            <div className="step-four-description">BINGO</div>
            <div className="step-four-bar" />
          </div>
        </>
      )}
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

    &-title {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 50px;
      line-height: 60px;
      margin: 3rem 0;
      text-align: center;
      color: ${(props) => props.theme.basic.white};
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
    };

      .page {
        width: 100%;
        height: 100%;
      }

      .number {
        font-size: 80px;
        color: ${(props) => props.theme.basic.grayDark};
        width: 100%;
        height: 100%;
        position: relative;
      }

      span {
        opacity: 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .num3,
      .num2,
      .num1 {
        color: ${(props) => props.theme.basic.danger};
      }

      .num1 {
        animation: time 20s forwards;
        animation-delay: 9s;
      }

      .num2 {
        animation: time 20s forwards;
        animation-delay: 8s;
      }

      .num3 {
        animation: time 20s forwards;
        animation-delay: 7s;
      }

      ${mediaQuery.afterTablet} {
        width: 180px;
        height: 180px;
      }
    }
  }

  .step-four {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    animation: fadein 20s forwards;
    -webkit-animation: fadein 20s forwards;
    
    &-image {
      background: ${(props) => props.theme.basic.primary};
      width: 65px;
      height: 65px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
      transform: translateY(20%) rotate(45deg);
      
      .amount-logo {
        transform: rotate(-45deg);
      }
      
      ${mediaQuery.afterTablet} {
        width: 105px;
        height: 105px;
      }
    }

    &-description {
      height: 50px;
      position: relative;
      z-index: 1;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 30px;
      line-height: 36px;
      color: ${(props) => props.theme.basic.blackDarken};
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      ${mediaQuery.afterTablet} {
        font-size: 48px;
        line-height: 58px;
      }
    }
    
    &-bar {
      width: 80%;
      margin: 1rem auto;
      height: 20px;
      border-radius: 40px;
      background: ${(props) => props.theme.basic.grayLighten};

      ${mediaQuery.afterTablet} {
        height: 31px;
      }
    }
  }

  @keyframes time {
    0% {
      opacity: 0;
      transform: scale(1);
    }

    5% {
      opacity: 0.8;
      transform: scale(1.2);
    }

    10% {
      opacity: 0;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(1);
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
