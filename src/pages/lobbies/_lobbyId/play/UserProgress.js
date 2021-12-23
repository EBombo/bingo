import React, { useState } from "reactn";
import { firestore } from "../../../../firebase";
import { darkTheme } from "../../../../theme";
import { Progress } from "antd";

export const UserProgress = (props) => {
  const [numberWinners] = useState(props.user.myWinningCard ?? props.numberWinners);
  const [userCard] = useState(JSON.parse(props.user.card));

  return props.isCard ? (
    <React.Fragment key={numberWinners?.length}>
      {userCard.map((axiX, indexX) =>
        axiX.map((axiY, indexY) => (
          <div className={`matrix-num ${numberWinners?.includes(axiY) && "active"}`} key={`${indexX}-${indexY}`} />
        ))
      )}
    </React.Fragment>
  ) : (
    <Progress percent={props.user.progress} strokeColor={darkTheme.basic.primary} />
  );
};
