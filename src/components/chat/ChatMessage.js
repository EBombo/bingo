import React, { useGlobal } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import Linkify from "react-linkify";
import moment from "moment";

export const ChatMessage = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <Messages
      received={get(authUser, "id", "") !== get(props, "message.user.id", null)}
    >
      <div className="header">
        <div className="nickname">
          {get(props, "message.user.nickname", "")}
        </div>
        <div className="time">
          {moment(props.message.createAt.toDate()).format("hh:mma")}
        </div>
      </div>

      <div className="message">
        <Linkify>{props.message.message}</Linkify>
      </div>
    </Messages>
  );
};

const Messages = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.received ? "flex-start" : "flex-end")};
  margin: ${(props) =>
    props.received ? "auto auto auto 0" : "auto 0 auto auto"};

  .header {
    display: flex;
    align-items: center;

    .nickname {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) =>
        props.received
          ? props.theme.basic.grayDark
          : props.theme.basic.primary};
    }

    .time {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayDark};
    }

    .time::before {
      content: "";
      display: inline-block;
      width: 5px;
      height: 5px;
      margin: 2px 5px;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      border-radius: 50%;
      background-color: ${(props) => props.theme.basic.grayDark};
    }
  }

  .message {
    margin-top: 5px;
    background: ${(props) =>
      props.received
        ? props.theme.basic.whiteDark
        : props.theme.basic.primaryLight};
    border-radius: 4px;
    padding: 5px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.blackDarken};
  }
`;
