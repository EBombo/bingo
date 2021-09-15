import styled from "styled-components";
import React, { useGlobal } from "reactn";
import { Popover } from "antd";
import { firestore } from "../../../firebase";
import { useUser } from "../../../hooks";
import { mediaQuery } from "../../../constants";

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
      <div className="right-content">
        <Popover
          content={
            <div>
              <div onClick={logout} style={{ cursor: "pointer" }}>
                Salir
              </div>
            </div>
          }
        >
          <div className="icon-menu">
            <span />
            <span />
            <span />
          </div>
        </Popover>
      </div>
    </UserLayoutCss>
  );
};

const UserLayoutCss = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  background: ${(props) => props.theme.basic.white};
  padding: 0.5rem;
  height: 50px;

  .title {
    text-align: center;
  }

  .right-content {
    display: flex;
    justify-content: flex-end;

    .icon-menu {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      height: 30px;

      span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 0.5rem 1rem;
  }
`;
