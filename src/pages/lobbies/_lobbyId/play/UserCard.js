import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../constants";
import { generateMatrix } from "../../../../business";
import { firebase, firestore } from "../../../../firebase";
import defaultTo from "lodash/defaultTo";
import { useMemo } from "react";

export const UserCard = (props) => {
  const [authUser] = useGlobal("user");

  const [matrix, setMatrix] = useState(generateMatrix());

  const userId = useMemo(() => {
    return props.user ? props.user?.id : authUser?.id;
  }, [props.user, authUser]);

  const isAuthUser = useMemo(() => {
    return props.user && props.user?.id === authUser?.id;
  }, [props.user, authUser]);

  useEffect(() => {
    if (props.lobby?.settings?.cardAutofill) return;

    const fetchMyWiningCard = async () => {
      const userQuery = await firestore.collection("lobbies").doc(props.lobby.id).collection("users").doc(userId).get();

      if (!userQuery.exists) return;

      const user = userQuery.data();

      if (!user) return;
      if (!user?.card) return;
      if (!user?.myWinningCard) return;

      const userCard = JSON.parse(user.card ?? "[]");
      const newMatrix = [...matrix];

      // Autofill user card with "myWinningCard" [array].
      userCard.forEach((axisY, indexY) =>
        axisY.forEach((axisX, indexX) => {
          if (user.myWinningCard.includes(axisX)) newMatrix[indexY][indexX] = true;
        })
      );

      setMatrix(newMatrix);
    };

    fetchMyWiningCard();
  }, [props?.lobby]);

  useEffect(() => {
    const board = defaultTo(props.lobby.board, {});
    if (Object.values(board).every((numberStatus) => numberStatus === false)) setMatrix(generateMatrix());
  }, [props.lobby.board]);

  const selectNumber = async (row, col, number) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = newMatrix[row][col] ? null : true;
    setMatrix(newMatrix);

    const myWinningCard = newMatrix[row][col]
      ? firebase.firestore.FieldValue.arrayUnion(number)
      : firebase.firestore.FieldValue.arrayRemove(number);

    await updateUser(myWinningCard);
  };

  const updateUser = async (myWinningCard) =>
    await firestore
      .collection("lobbies")
      .doc(props.lobby.id)
      .collection("users")
      .doc(userId)
      .set({ myWinningCard }, { merge: true });

  return (
    <CardContainer
      full={props.full}
      backgroundColor={props.lobby.game.backgroundColor}
      backgroundImg={props.lobby.game.backgroundImg}
      titleColor={props.lobby.game.titleColor}
      blocksColor={props.lobby.game.blocksColor}
      numberColor={props.lobby.game.numberColor}
    >
      <div className="card-title">{props.lobby.game.title}</div>
      <table>
        <thead className="thead">
          <tr>
            <th>{props.lobby?.game?.letters?.b}</th>
            <th>{props.lobby?.game?.letters?.i}</th>
            <th>{props.lobby?.game?.letters?.n}</th>
            <th>{props.lobby?.game?.letters?.g}</th>
            <th>{props.lobby?.game?.letters?.o}</th>
          </tr>
        </thead>

        <tbody className="tbody" key={matrix}>
          {JSON.parse(props.winner?.card || props.lobby.users[userId]?.card || "[]").map((arrNums, row) => (
            <tr key={`key-${row}`}>
              {arrNums.map((num, col) => (
                <td key={`key-${num}-${col}-${matrix}`}>
                  {props.lobby?.settings?.cardAutofill ? (
                    <div className={`${props.lobby.board && props.lobby.board[num] && `active`}`}>{num}</div>
                  ) : isAuthUser ? (
                    <div
                      className={`${matrix[row][col] ? "active" : ""} number`}
                      onClick={() => !props.disableSelect && selectNumber(row, col, num)}
                    >
                      {num}
                    </div>
                  ) : (
                    <div className={`${matrix[row][col] ? "active" : ""} number`}>{num}</div>
                  )}
                </td>
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
  aspect-ratio: 6/ 8;
  ${(props) => props.full && "min-width: 550px"};
  max-width: ${(props) => (props.full ? "100%" : "350px")};
  background: ${(props) => {
    if (props.backgroundImg) return `url(${props.backgroundImg})`;
    if (props.backgroundColor) return props.backgroundColor;

    return props.theme.basic.secondary;
  }};
  background-position: center;
  border-radius: 3px;
  padding: ${(props) => (props.full ? "1rem" : "0.5rem")};
  margin: 0 auto;
  display: grid;
  grid-template-rows: 10% 85%;
  grid-gap: 5%;

  .card-title {
    font-family: Lato;
    font-weight: bold;
    color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
    text-align: center;
    font-size: ${(props) => (props.full ? "55px" : "32px")};
    line-height: ${(props) => (props.full ? "59px" : "36px")};
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 5px;
    margin: 0 auto;

    thead {
      tr {
        th {
          width: 20%;
          aspect-ratio: 1 / 1;
          text-align: center;
          font-family: Lato;
          font-weight: 700;
          font-size: ${(props) => (props.full ? "55px" : "32px")};
          line-height: ${(props) => (props.full ? "59px" : "36px")};
          font-style: normal;
          color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
        }
      }
    }

    tbody {
      tr {
        td {
          width: 20%;
          aspect-ratio: 1 / 1;
          margin-right: 5px;
          text-align: center;
          font-family: Lato;
          font-weight: 700;
          font-size: ${(props) => (props.full ? "55px" : "32px")};
          line-height: ${(props) => (props.full ? "59px" : "36px")};
          font-style: normal;
          color: ${(props) => (props.numberColor ? props.numberColor : props.theme.basic.white)};
          background: ${(props) => (props.blocksColor ? props.blocksColor : props.theme.basic.secondary)};
          justify-content: center;

          .active {
            border-radius: 50%;
            background: ${(props) => props.theme.basic.success};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${(props) => props.theme.basic.blackDarken};
            margin: 0 auto;
          }

          .number {
            cursor: pointer;
            width: 80%;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            text-align: center;
            font-size: 32px;

            ${mediaQuery.afterTablet} {
              font-size: 28px;
            }
          }
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 0.5rem 1rem;
  }
`;
