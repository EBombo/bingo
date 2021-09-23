import React, { useState, useGlobal, useEffect } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import { ButtonAnt } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { ModalPattern } from "./ModalPattern";
import { firestore } from "../../../firebase";
import { spinLoader } from "../../../components/common/loader";

export const CardPattern = (props) => {
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apagon, setApagon] = useState(false);
  const [pattern, setPattern] = useState(
    Array.from(Array(5), () => new Array(5).fill(null))
  );
  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (props.apagon) {
      return setPattern(Array.from(Array(5), () => new Array(5).fill(true)));
    }

    if (props.lobby.pattern) return setPattern(JSON.parse(props.lobby.pattern));

    console.log(props);
  }, []);

  const copyMatrix = () => {
    const newMatrix = [];
    for (const row of pattern) {
      newMatrix.push(row.slice());
    }
    return newMatrix;
  };

  const editPattern = (row, col) => {
    const newPattern = copyMatrix();
    newPattern[row][col] = newPattern[row][col] ? null : true;
    setPattern(newPattern);
  };

  const savePattern = async () => {

    await firestore.doc(`lobbies/${props.lobby.id}`).update({
      pattern: JSON.stringify(pattern),
      updateAt: new Date(),
    });

    setIsVisibleModalPattern(false);
  };

  return (
    <PatternContainer user={authUser} isEdit={props.isEdit}>
      {isVisibleModalPattern && (
        <ModalPattern
          apagon={apagon}
          isVisibleModalPattern={isVisibleModalPattern}
          setIsVisibleModalPattern={setIsVisibleModalPattern}
          {...props}
        />
      )}
      <div className="caption">{props.caption}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="empty"></th>
              <th>{get(props, "lobby.game.letters.b", {})}</th>
              <th>{get(props, "lobby.game.letters.i", {})}</th>
              <th>{get(props, "lobby.game.letters.n", {})}</th>
              <th>{get(props, "lobby.game.letters.g", {})}</th>
              <th>{get(props, "lobby.game.letters.o", {})}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              {pattern[0].map((element, idx) => (
                <td
                  onClick={() => {
                    if (!props.isEdit) return;
                    editPattern(0, idx);
                  }}
                  key={`${pattern}-0-${idx}`}
                >
                  <div className={`${element ? "selected" : "empty"}`} />
                </td>
              ))}
            </tr>

            <tr>
              <th>2</th>
              {pattern[1].map((element, idx) => (
                <td
                  onClick={() => {
                    if (!props.isEdit) return;
                    editPattern(1, idx);
                  }}
                  key={`${pattern}-1-${idx}`}
                >
                  <div
                    className={`${element === true ? "selected" : "empty"}`}
                  />
                </td>
              ))}
            </tr>

            <tr>
              <th>3</th>
              {pattern[2].map((element, idx) => (
                <td
                  onClick={() => {
                    if (!props.isEdit) return;
                    editPattern(2, idx);
                  }}
                  key={`${pattern}-2-${idx}`}
                >
                  <div className={`${element ? "selected" : "empty"}`} />
                </td>
              ))}
            </tr>

            <tr>
              <th>4</th>
              {pattern[3].map((element, idx) => (
                <td
                  onClick={() => {
                    if (!props.isEdit) return;
                    editPattern(3, idx);
                  }}
                  key={`${pattern}-3-${idx}`}
                >
                  <div className={`${element ? "selected" : "empty"}`} />
                </td>
              ))}
            </tr>

            <tr>
              <th>5</th>
              {pattern[4].map((element, idx) => (
                <td
                  onClick={() => {
                    if (!props.isEdit) return;
                    editPattern(4, idx);
                  }}
                  key={`${pattern}-4-${idx}`}
                >
                  <div className={`${element ? "selected" : "empty"}`} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {!props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt
            onClick={() => {
              setApagon(true);
              setIsVisibleModalPattern(true);
            }}
          >
            Apágon
          </ButtonAnt>
          <ButtonAnt
            color="default"
            onClick={() => {
              setApagon(false);
              setIsVisibleModalPattern(true);
            }}
          >
            Editar
          </ButtonAnt>
        </div>
      )}
      {props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt
            color="default"
            disabled={isLoading}
            onClick={() => props.cancelAction()}
          >
            Cancelar
          </ButtonAnt>
          <ButtonAnt
            color="warning"
            loading={isLoading}
            onClick={() => savePattern()}
          >
            Guardar
          </ButtonAnt>
        </div>
      )}
    </PatternContainer>
  );
};

const PatternContainer = styled.div`
  width: 100%;
  max-width: 220px;
  .caption{
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }

  .table-container {
    margin: 0.5rem 0;
    
    table {
      border-collapse: separate;
      border-spacing: 5px;
      margin: auto;
      background: ${(props) =>
        !props.user.isAdmin ? props.theme.basic.primaryLight : "transparent"};
      border-radius: 5px;
      
      th {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        width: ${(props) => (!props.user.isAdmin ? "15px" : "25px")};
        height: ${(props) => (!props.user.isAdmin ? "15px" : "25px")};
        font-size: ${(props) => (!props.user.isAdmin ? "11px" : "14px;")};
        line-height: ${(props) => (!props.user.isAdmin ? "13px" : "18px")};
        background: ${(props) =>
          props.user.isAdmin
            ? props.theme.basic.primaryLight
            : props.theme.basic.secondary};
        color: ${(props) => props.theme.basic.white};
        border-radius: 3px;
      }

      td {
        width: ${(props) => (!props.user.isAdmin ? "15px" : "25px")};
        height: ${(props) => (!props.user.isAdmin ? "15px" : "25px")};
        background: ${(props) => props.theme.basic.primary};
        border-radius: 3px;
        position: relative;
        cursor: ${(props) => (props.isEdit ? "pointer" : "default")};

        .selected {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${(props) => (!props.user.isAdmin ? "10px" : "15px")};
          height: ${(props) => (!props.user.isAdmin ? "10px" : "15px")};
          border-radius: 50%;
          background: ${(props) => props.theme.basic.secondary};
        }
      }

      .empty {
        background: transparent;
      }
    }
  }
  
  .btns-container{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    
    button {
      font-size: 14px;
      line-height: 18px;
    }
  }
  
  ${mediaQuery.afterTablet}{
    max-width: 260px;
    
    .caption{
      font-size: 18px;
      line-height: 22px;
    }
    
    .table-container {
      
      table {
        border-spacing: 5px;

        th {
          width: ${(props) => (!props.user.isAdmin ? "15px" : "35px")};
          height: ${(props) => (!props.user.isAdmin ? "15px" : "35px")};
          font-size: ${(props) => (!props.user.isAdmin ? "11px" : "26px;")};
          line-height: ${(props) => (!props.user.isAdmin ? "13px" : "32px")};
        }

        td {
          width: ${(props) => (!props.user.isAdmin ? "15px" : "35px")};
          height: ${(props) => (!props.user.isAdmin ? "15px" : "35px")};
          font-size: 26px;
          line-height: 32px;

          .selected {
            width: ${(props) => (!props.user.isAdmin ? "10px" : "20px")};
            height: ${(props) => (!props.user.isAdmin ? "10px" : "20px")};
          }
        }
      }
    }
  }
  }
`;
