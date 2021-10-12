import React, { useGlobal, useState } from "reactn";
import styled, { keyframes } from "styled-components";
import { slideInLeft, slideInRight } from "react-animations";
import get from "lodash/get";
import Linkify from "react-linkify";
import moment from "moment";
import { mediaQuery } from "../../constants";

export const ChatMessage = (props) => {
  const [authUser] = useGlobal("user");
  const [sameAsBefore] = useState(
    get(props, "previousMessage.user.id", null) ===
      get(props, "message.user.id", null)
  );

  return (
    <Messages
      received={get(authUser, "id", "") !== get(props, "message.user.id", null)}
      sameAsBefore={sameAsBefore}
      isAdmin={get(props, "message.user.isAdmin", null)}
      key={props.index}
    >
      <div className="header">
        {!sameAsBefore && (
          <div className="nickname">
            {`${get(props, "message.user.nickname", "")} ${
              props.message.user.isAdmin ? "[ADMIN]" : ""
            }`}
          </div>
        )}
      </div>
      <div className="message-content">
        <div className="message">
          <Linkify>{props.message.message}</Linkify>
        </div>
        <div className="time">
          {moment(props.message.createAt.toDate()).format("hh:mma")}
        </div>
      </div>
    </Messages>
  );
};

const slideInLeftAnimation = keyframes`${slideInLeft}`;
const slideInRightAnimation = keyframes`${slideInRight}`;

const Messages = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.received ? "flex-start" : "flex-end")};
  margin: ${(props) =>
    props.received
      ? props.sameAsBefore
        ? "auto auto auto 0"
        : "10px auto auto 0"
      : props.sameAsBefore
      ? "auto 0 auto auto"
      : "10px 0 auto auto"};

  animation: 1s
    ${(props) =>
      props.received ? slideInLeftAnimation : slideInRightAnimation};

  .header {
    display: flex;
    align-items: center;

    .nickname {
      font-family: "Lato", sans-serif;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      color: ${(props) => props.theme.basic.grayDark};
    }
  }

  .message-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: ${(props) => (props.received ? "row" : "row-reverse")};

    .time {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayDark};
      margin: ${(props) => (props.received ? "0 0 0 5px" : "0 5px 0 0")};
    }

    .message {
      margin-top: 5px;
      background: ${(props) =>
        props.isAdmin
          ? props.theme.basic.secondary
          : props.received
          ? props.theme.basic.primary
          : props.theme.basic.primary};
      border-radius: ${(props) =>
        props.received
          ? props.sameAsBefore
            ? "4px"
            : "0 4px 4px 4px"
          : props.sameAsBefore
          ? "4px"
          : "4px 0 4px 4px"};
      padding: 5px;
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  ${mediaQuery.afterTablet} {
    .header {
      .nickname {
        font-size: 13px;
        line-height: 15px;
      }
    }
  }
`;
