import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt } from "../../../components/form";
import { mediaQuery } from "../../../constants";
import { ModalPattern } from "./ModalPattern";

export const CardPattern = (props) => {
  const [isVisibleModalPattern, setIsVisibleModalPattern] = useState(false);
  const [authUser] = useGlobal("user");

  const savePattern = () => {
    console.log("guardando");
  };

  return (
    <PatternContainer user={authUser}>
      {isVisibleModalPattern && (
        <ModalPattern
          isVisibleModalPattern={isVisibleModalPattern}
          setIsVisibleModalPattern={setIsVisibleModalPattern}
          {...props}
        />
      )}
      <div className="caption">{props.caption}</div>
      <div className="table-container">
        <table>
          <tr>
            <th className="empty"></th>
            <th>{get(props, "lobby.game.letters.b", {})}</th>
            <th>{get(props, "lobby.game.letters.i", {})}</th>
            <th>{get(props, "lobby.game.letters.n", {})}</th>
            <th>{get(props, "lobby.game.letters.g", {})}</th>
            <th>{get(props, "lobby.game.letters.o", {})}</th>
          </tr>

          <tr>
            <th>1</th>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
          </tr>

          <tr>
            <th>2</th>
            <td>
              <div className="selected" />
            </td>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
            <td>
              <div className="selected" />
            </td>
          </tr>

          <tr>
            <th>3</th>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
          </tr>

          <tr>
            <th>4</th>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
          </tr>

          <tr>
            <th>5</th>
            <td>
              <div className="selected" />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div className="selected" />
            </td>
          </tr>
        </table>
      </div>
      {!props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt>Apágon</ButtonAnt>
          <ButtonAnt
            color="default"
            onClick={() => setIsVisibleModalPattern(true)}
          >
            Limpiar
          </ButtonAnt>
        </div>
      )}
      {props.isEdit && !props.hiddenOptions && (
        <div className="btns-container">
          <ButtonAnt color="default" onClick={() => props.cancelAction()}>
            Cancelar
          </ButtonAnt>
          <ButtonAnt color="warning" onClick={() => savePattern()}>
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
