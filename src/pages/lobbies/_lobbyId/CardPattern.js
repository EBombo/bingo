import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { ButtonAnt } from "../../../components/form";
import { mediaQuery } from "../../../constants";

export const CardPattern = (props) => {
  return (
    <PatternContainer>
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
      <div className="btns-container">
        <ButtonAnt>Apágon</ButtonAnt>
        <ButtonAnt color="default">Limpiar</ButtonAnt>
      </div>
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
  }

  .table-container {
    margin: 0.5rem 0;
    
    table {
      border-collapse: separate;
      border-spacing: 5px;
      margin: auto;
      
      th {
        font-family: Encode Sans;
        font-style: normal;
        font-weight: bold;
        width: 25px;
        height: 25px;
        font-size: 14px;
        line-height: 18px;
        background: ${(props) => props.theme.basic.primaryLight};
        color: ${(props) => props.theme.basic.white};
        border-radius: 3px;
      }

      td {
        width: 25px;
        height: 25px;
        background: ${(props) => props.theme.basic.primary};
        border-radius: 3px;
        position: relative;

        .selected {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 15px;
          height: 15px;
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
          width: 35px;
          height: 35px;
          font-size: 26px;
          line-height: 32px;
        }

        td {
          width: 35px;
          height: 35px;
          font-size: 26px;
          line-height: 32px;

          .selected {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
  }
`;
