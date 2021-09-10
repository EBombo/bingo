import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";
import React, { useGlobal } from "reactn";
import { Popover } from "antd";
import { firestore } from "../../../firebase";
import { useUser } from "../../../hooks";

export const UserLayout = (props) => {
  const [, setAuthUserLs] = useUser();
  const [, setAuthUser] = useGlobal("user");

  const logout = async () => {
    await setAuthUser({ id: firestore.collection("users").doc().id });
    setAuthUserLs(null);
  };

  return (
    <UserLayoutCss>
      <div />
      <div className="title">{props.lobby.game.title}</div>
      <div className="icon-menu">
        <Popover
          content={
            <div>
              <div onClick={logout} style={{ cursor: "pointer" }}>
                Salir
              </div>
            </div>
          }
        >
          <MoreOutlined />
        </Popover>
      </div>
    </UserLayoutCss>
  );
};

const UserLayoutCss = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: ${(props) => props.theme.basic.white};
  padding: 5px 0;

  .title {
    text-align: center;
  }

  .icon-menu {
    text-align: right;
  }
`;
