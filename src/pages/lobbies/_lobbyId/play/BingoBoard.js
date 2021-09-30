import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import get from "lodash/get";
import { timeoutPromise } from "../../../../utils/promised";
import { getHead } from "../../../../business";

export const BingoBoard = (props) => {
  const [animationSpeed] = useGlobal("animationSpeed");
  const [startEffectHead, setStartEffectHead] = useState(null);
  const [startEffectBody, setStartEffectBody] = useState(null);

  const [currentBoard, setCurrentBoard] = useState(props.lobby.board ?? {});

  useEffect(() => {
    if (!props.lobby.board) return setCurrentBoard({});

    const initialize = async () => {
      if (!props.lobby.lastPlays[0]) return setCurrentBoard({});

      const lastPlays = [...props.lobby.lastPlays];
      const lastNumber = lastPlays[0];

      const position = getHead(lastNumber);

      const positionOnScreenY = position?.index ?? 0;
      setStartEffectHead(String(positionOnScreenY));
      await timeoutPromise((animationSpeed / 2) * 1000);

      const positionOnScreenX = lastNumber - position.min;
      setStartEffectBody(String(positionOnScreenX));
      await timeoutPromise((animationSpeed / 2) * 1000);

      setStartEffectHead(null);
      setStartEffectBody(null);

      setCurrentBoard(props.lobby.board);
    };

    initialize();
  }, [props.lobby.board]);

  const range = (start, end) =>
    Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);

  return (
    <BoardContainer
      startEffectHead={startEffectHead}
      animationSpeed={animationSpeed}
      startEffectBody={startEffectBody}
    >
      <table className="board">
        <thead>
          {!!startEffectHead && <tr className="div-animation-head" />}
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.b", "B")}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.i", "I")}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.n", "N")}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.g", "G")}
            </th>
          </tr>
          <tr>
            <th className="th-header">
              {get(props, "lobby.game.letters.o", "O")}
            </th>
          </tr>
        </thead>
        <tbody>
          {!!startEffectBody && <tr className="div-animation-body" />}
          <tr>
            {range(1, 15).map((number) => (
              <td
                className={`td-numbers ${currentBoard[number] && `active`}`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(16, 30).map((number) => (
              <td
                className={`td-numbers ${currentBoard[number] && `active`}`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(31, 45).map((number) => (
              <td
                className={`td-numbers ${currentBoard[number] && `active`}`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(46, 60).map((number) => (
              <td
                className={`td-numbers ${currentBoard[number] && `active`}`}
                key={number}
              >
                {number}
              </td>
            ))}
          </tr>
          <tr>
            {range(61, 75).map((number) => (
              <td
                className={`td-numbers ${currentBoard[number] && `active`}`}
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
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      background: ${(props) => props.theme.basic.primaryLight};
      border-radius: 3px;

      tr {
        z-index: 2;
      }

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

      /* effects */
      @keyframes board-animation-head {
        0% {
          top: 0;
        }
        20% {
          top: calc(100% - 26px);

          ${mediaQuery.afterTablet} {
            top: calc(100% - 42px);
          }
        }
        40% {
          top: 0;
        }
        60% {
          top: calc(100% - 26px);

          ${mediaQuery.afterTablet} {
            top: calc(100% - 42px);
          }
        }
        80% {
          top: 0;
        }
        100% {
          top: ${(props) =>
            props.startEffectHead ? 26 * props.startEffectHead : 0}px;

          ${mediaQuery.afterTablet} {
            top: ${(props) =>
              props.startEffectHead ? 42 * props.startEffectHead : 0}px;
          }
        }
      }

      .div-animation-head {
        z-index: 1;
        width: 100%;
        position: absolute;
        background: ${(props) => props.theme.basic.primary};

        top: ${(props) =>
          props.startEffectHead ? 26 * props.startEffectHead : 0}px;
        height: 26px;

        ${mediaQuery.afterTablet} {
          height: 42px;
          top: ${(props) =>
            props.startEffectHead ? 42 * props.startEffectHead : 0}px;
        }

        animation: ${(props) =>
          props.startEffectHead
            ? `board-animation-head ${(props.animationSpeed / 2).toFixed(2)}s`
            : "none"};
      }

      /* effects */
    }

    tbody {
      position: relative;
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

      tr {
        z-index: 2;
      }

      /* effects */
      @keyframes board-animation-body {
        0% {
          left: 0;
        }
        20% {
          left: calc(100% - 20px);

          ${mediaQuery.afterTablet} {
            left: calc(100% - 40px);
          }
        }
        40% {
          left: 0;
        }
        60% {
          left: calc(100% - 20px);

          ${mediaQuery.afterTablet} {
            left: calc(100% - 40px);
          }
        }
        80% {
          left: 0;
        }
        100% {
          left: ${(props) =>
            props.startEffectBody ? props.startEffectBody * 20 : 0}px;

          ${mediaQuery.afterTablet} {
            left: ${(props) =>
              props.startEffectBody ? props.startEffectBody * 42 : 0}px;
          }
        }
      }

      .div-animation-body {
        z-index: 1;

        position: absolute;
        background: ${(props) => props.theme.basic.primary};

        top: ${(props) =>
          props.startEffectHead ? 27 * props.startEffectHead : 0}px;
        left: ${(props) =>
          props.startEffectBody ? 27 * props.startEffectBody : 0}px;
        width: 20px;
        height: 20px;

        ${mediaQuery.afterTablet} {
          top: ${(props) =>
            props.startEffectHead ? 42 * props.startEffectHead : 0}px;
          left: ${(props) =>
            props.startEffectBody ? 42 * props.startEffectBody : 0}px;
          width: 40px;
          height: 42px;
        }

        animation: ${(props) =>
          props.startEffectBody
            ? `board-animation-body ${(props.animationSpeed / 2).toFixed(2)}s`
            : "none"};
      }

      /* effects */
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
