import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import get from "lodash/get";

export const BingoBoard = (props) => {
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  return (
    <BoardContainer>
      <table className="board">
        <thead>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.b", {})}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.i", {})}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.n", {})}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.g", {})}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.o", {})}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {range(1, 15).map((number) => (
              <td
                className={`td-numbers ${
                  props.lobby.board[number] && `active`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(16, 30).map((number) => (
              <td
                className={`td-numbers ${
                  props.lobby.board[number] && `active`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(31, 45).map((number) => (
              <td
                className={`td-numbers ${
                  props.lobby.board[number] && `active`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(46, 60).map((number) => (
              <td
                className={`td-numbers ${
                  props.lobby.board[number] && `active`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(61, 75).map((number) => (
              <td
                className={`td-numbers ${
                  props.lobby.board[number] && `active`
                }`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  width: 420px;
  table {
    display: flex;
    width: 420px;
    height: 130px;
    thead {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      background: ${(props) => props.theme.basic.primaryLight};
      border-radius: 3px;

      .th-header {
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: Encode Sans, sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 13px;
        line-height: 15px;
        margin: 0;
        color: ${(props) => props.theme.basic.secondary};
      }
    }

    tbody {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .td-numbers {
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        margin: 0 3px;
        background: transparent;
        color: ${(props) => props.theme.basic.grayLighten};
        font-size: 10px;
        line-height: 15px;
      }

      .active {
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.whiteDark};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    width: 650px;
    table {
      width: 650px;
      height: 210px;

      thead {
        .th-header {
          width: 35px;
          height: 35px;
          font-size: 26px;
          line-height: 30px;
        }
      }

      tbody {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .td-numbers {
          width: 35px;
          height: 35px;
          font-size: 20px;
          line-height: 26px;
        }
      }
    }
  }
`;
