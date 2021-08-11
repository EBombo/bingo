import React from "reactn";
import styled from "styled-components";
import {config} from "../../firebase";
import {mediaQuery} from "../../constants";

const WspIcon = () =>
    <WspIconCss onClick={() => window.open('http://wa.me/51922662007', '_blank')}/>

const WspIconCss = styled.div`
  filter: hue-rotate(45deg);
  background-image: url(${`${config.storageUrl}/resources/whatsapp-icon.svg`});
  background-color: ${props => props.theme.basic.blackDarken};
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  bottom: 80px;
  right: 0;
  z-index: 9999;
  cursor: pointer;
  width: 65px;
  height: 60px;
  border-radius: 10px 0 0 10px;

  ${mediaQuery.afterTablet} {
    bottom: 25px;
  }
`;

export default WspIcon;
