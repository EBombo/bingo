import React, { useState } from "reactn";
import { darkTheme } from "../../../../theme";
import { Progress } from "antd";
import { useMemo } from "react";

export const UserProgress = (props) => {
  const numberWinners = useMemo(() => {
    if (props.lobby.settings.cardAutofill) return props.numberWinners ?? [];

    return props.user.myWinningCard ?? [];
  }, [props.lobby, props.user.myWinningCard, props.numberWinners]);

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
