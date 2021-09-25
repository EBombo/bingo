import React, { useEffect, useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";

export const BingoCard = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    console.log("usuario", authUser);
  });

  return (
    <CardContainer
      backgroundColor={props.lobby.game.backgroundColor}
      titleColor={props.lobby.game.titleColor}
      blocksColor={props.lobby.game.blocksColor}
      numberColor={props.lobby.game.numberColor}
    >
      <div className="card-title">{props.lobby.game.title}</div>
      <table>
        <thead className="thead">
          <tr>
            <th>{props.lobby.game.letters.b}</th>
            <th>{props.lobby.game.letters.i}</th>
            <th>{props.lobby.game.letters.n}</th>
            <th>{props.lobby.game.letters.g}</th>
            <th>{props.lobby.game.letters.o}</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {JSON.parse(authUser.card).map((arrNums, index) => (
            <tr key={`key-${index}`}>
              {arrNums.map((num, idx) => (
                <td key={`key-${num}-${idx}`}>{num}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  width: 100%;
  height: 210px;
  max-width: 200px;
  background: ${(props) =>
    props.backgroundColor
      ? props.backgroundColor
      : props.theme.basic.secondary};
  border-radius: 3px;

  .card-title {
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) =>
      props.titleColor ? props.titleColor : props.theme.basic.white};
    text-align: center;
    padding: 0.5rem;
  }

  table {
    border-collapse: separate;
    border-spacing: 2.5px;
    margin: 0 auto;

    thead {
      tr {
        th {
          height: 30px;
          width: 30px;
          text-align: center;
          font-family: Lato;
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          line-height: 18px;
          color: ${(props) => props.theme.basic.whiteLight};
        }
      }
    }

    tbody {
      tr {
        td {
          width: 30px;
          height: 30px;
          margin-right: 5px;
          text-align: center;
          font-family: Lato;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 15px;
          color: ${(props) =>
            props.numberColor ? props.numberColor : props.theme.basic.white};
          background: ${(props) =>
            props.blocksColor ? props.blocksColor : props.theme.basic.primary};
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 460px;
    height: 500px;

    .card-title {
      font-size: 28px;
      line-height: 35px;
      font-weight: 700;
      padding: 1rem 0;
    }

    table {
      width: 400px;
      border-collapse: separate;
      border-spacing: 5px;

      thead {
        tr {
          th {
            font-weight: 700;
            font-size: 34px;
            line-height: 38px;
            color: ${(props) => props.theme.basic.whiteLight};
          }
        }
      }

      tbody {
        tr {
          height: 70px;

          td {
            margin-right: 5px;
            font-weight: 700;
            font-size: 38px;
            line-height: 41px;
          }
        }
      }
    }
  }
`;
