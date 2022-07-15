import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { firestore } from "../../../../firebase";
import { generateMatrix } from "../../../../business";
import { useTranslation } from "../../../../hooks";

export const CardPattern = (props) => {
  const { t } = useTranslation("lobby-play");

  const [authUser] = useGlobal("user");

  const [isLoading, setIsLoading] = useState(false);
  const [pattern, setPattern] = useState(generateMatrix());

  useEffect(() => {
    if (props.apagon) return setPattern(generateMatrix(true));

    if (props.lobby.pattern) return setPattern(JSON.parse(props.lobby.pattern));
  }, [props.lobby.pattern, props.apagon]);

  const editPattern = (row, col) => {
    const newPattern = [...pattern];
    newPattern[row][col] = newPattern[row][col] ? null : true;
    setPattern(newPattern);
  };

  const savePattern = async () => {
    setIsLoading(true);

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      pattern: JSON.stringify(pattern),
      startGame: props.continueGame ? new Date() : props.lobby.startGame,
      updateAt: new Date(),
    });

    if (props.continueGame) await props.continueGame();

    setIsLoading(false);
  };

  return (
    <PatternContainer user={authUser} isEdit={props.isEdit}>
      <div className="text-['Lato'] py-2 font-bold text-[18px] leading-[22px] text-white text-center">
        {props.caption}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{get(props, "lobby.game.letters.b")}</th>
              <th>{get(props, "lobby.game.letters.i")}</th>
              <th>{get(props, "lobby.game.letters.n")}</th>
              <th>{get(props, "lobby.game.letters.g")}</th>
              <th>{get(props, "lobby.game.letters.o")}</th>
            </tr>
          </thead>
          <tbody>
            {pattern.map((element, index) => (
              <tr key={index}>
                {element.map((value, index_) => (
                  <td
                    onClick={() => {
                      if (!props.isEdit) return;
                      editPattern(index, index_);
                    }}
                    key={`${pattern}-${index}-${index_}`}
                  >
                    <div className="square">
                      <div className={`${value && "selected"}`} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt
            size="big"
            onClick={() => {
              props.setApagon(true);
              props.setIsVisibleModalPattern(true);
            }}
          >
            {t("blackout")}
          </ButtonAnt>
          <ButtonAnt
            size="big"
            color="default"
            onClick={() => {
              props.setApagon(false);
              props.setIsVisibleModalPattern(true);
            }}
          >
            {t("edit")}
          </ButtonAnt>
        </div>
      )}
      {props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt color="success" loading={isLoading} onClick={() => savePattern()}>
            {t("save")}
          </ButtonAnt>
          <ButtonAnt
            color="default"
            disabled={isLoading}
            onClick={() => {
              if (props.apagon) props.setApagon(false);
              props.cancelAction();
            }}
          >
            {t("cancel")}
          </ButtonAnt>
        </div>
      )}
    </PatternContainer>
  );
};

const PatternContainer = styled.div`
  width: 100%;
  aspect-ratio: 5 / 6;

  .table-container {
    margin: 0.25rem 0;
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 5px;
      margin: auto;
      background: transparent;
      border-radius: 5px;
      
      th {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        width: 20%;
        aspect-ratio: 1 / 1;
        font-size: 14px;
        line-height: 18px;
        background: transparent;
        color: ${(props) => props.theme.basic.white};
        border-radius: 3px;
      }

      td {
        width: 20%;
        aspect-ratio: 1 / 1;
        background: ${(props) => props.theme.basic.secondaryDarken};
        border-radius: 3px;
        cursor: ${(props) => (props.isEdit ? "pointer" : "default")};

        .selected {
          width: 80%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.whiteDark};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${(props) => props.theme.basic.blackDarken};
          margin: 0 auto;
        }
        .square {
          cursor: pointer;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          text-align: center;
        }
      }
    }
  }
  
  .btns-container{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    
    button {
      width: 80%;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 18px;
    }
  }
  
  ${mediaQuery.afterTablet}{
    
    .btns-container{
      flex-direction: ${(props) => (props.isEdit ? "column" : "row")};

      button {
        width: ${(props) => (props.isEdit ? "100%" : "auto")};
        margin-bottom: ${(props) => (props.isEdit ? "1rem" : "0")};
      }
    }
    
    .table-container {
      
      table {
        border-spacing: 5px;

        th {
          font-size: ${(props) => (!props.user.isAdmin ? "20px" : "26px;")};
          line-height: ${(props) => (!props.user.isAdmin ? "26px" : "32px")};
        }

        td {
          font-size: 26px;
          line-height: 32px;
        }
      }
    }
  }
  }
`;
