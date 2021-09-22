import React from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { firestore } from "../../../firebase";

export const GameOptions = (props) => {
  const startGame = async () => {
    if (!props.lobby.pattern) {
      return props.showNotification(
        "UPS",
        "Define un patrón antes de empezar el bingo",
        "warning"
      );
    }

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      startAt: new Date(),
      updateAt: new Date(),
    });
  };

  const callNumber = async () => {

    // WHEN THE NUMBER IS SELECTED MAKE THE ANIMATION
  }

  return (
    <GameOptionsContainer hiddenOptions={props.hiddenOptions}>
      <div className="out">
        <div className="in">
          <p>{props.lastLetter}</p>
          <p>{props.lastNumber}</p>
        </div>
      </div>
      {!props.hiddenOptions && (
        <div className="options">
          <div className="btn-container">
            {props.lobby.startAt ? (
              <ButtonAnt width="100%">LLamar número</ButtonAnt>
            ) : (
              <ButtonAnt width="100%" onClick={() => startGame()}>
                Iniciar Juego
                <Image
                  src={`${config.storageUrl}/resources/white-play.svg`}
                  height="15px"
                  width="15px"
                  size="contain"
                  margin="0"
                />
              </ButtonAnt>
            )}
          </div>
          <div className="btn-container">
            <ButtonAnt color="default" width="100%" className="btn-automatic">
              Reproducción automática
            </ButtonAnt>
          </div>
          <div className="btn-container">
            <ButtonAnt variant="contained" color="default" width="100%">
              Reiniciar tablero
            </ButtonAnt>
          </div>
        </div>
      )}
    </GameOptionsContainer>
  );
};

const GameOptionsContainer = styled.div`
  width: ${(props) => (props.hiddenOptions ? "105px" : "325px")};
  display: grid;
  grid-template-columns: 85px 220px;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  background: ${(props) => props.theme.basic.blackDarken};

  .out {
    width: 85px;
    height: 85px;
    border-radius: 50%;
    background: #195d8b;
    display: flex;
    align-items: center;
    justify-content: center;

    .in {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fafafa;
      display: flex;
      align-items: center;
      flex-direction: column;

      p {
        margin: 0;
      }
    }
  }

  .options {
    .btn-container {
      margin: 0.5rem !important;
    }
  }
`;
