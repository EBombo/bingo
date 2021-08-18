import React, { forwardRef } from "reactn";
import styled from "styled-components";
import Button from "antd/lib/button";

export const ButtonAnt = forwardRef((props, ref) => (
  <ButtonAntCss ref={ref} {...props} />
));

const ButtonAntCss = styled(Button)`
  background: ${({ variant = "default", theme }) =>
    variant === "primary"
      ? theme.basic.primary
      : variant === "secondary"
      ? theme.basic.default
      : variant === "warning"
      ? theme.basic.default
      : variant === "danger"
      ? theme.basic.default
      : "transparent"};
  color: ${({ variant = "default", theme, color }) =>
    color
      ? color
      : variant === "primary"
      ? theme.basic.black
      : variant === "secondary"
      ? theme.basic.secondary
      : variant === "warning"
      ? theme.basic.warning
      : variant === "danger"
      ? theme.basic.danger
      : theme.basic.primary};
  border: 2px solid
    ${({ variant = "default", theme, border }) =>
      border
        ? border
        : variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
        ? theme.basic.warning
        : variant === "danger"
        ? theme.basic.danger
        : theme.basic.primary};

  cursor: pointer;
  border-radius: ${(props) =>
    props["border-radius"] ? props["border-radius"] : "5px"};
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  display: ${(props) => (props.display ? props.display : "block")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineheight ? props.lineheight : "27px")};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "bold")};
  box-shadow: ${(props) =>
    props.boxShadow ? props.boxShadow : "0 4px 4px rgba(0, 0, 0, 0.25)"};
  margin: ${(props) => (props.margin ? props.margin : "0px auto")};
  font-style: ${(props) => (props.fontStyle ? props.fontStyle : "normal")};

  ${(props) =>
    props.justifyContent ? `justify-content: ${props.justifyContent};` : ""}
  ${(props) => (props.padding ? `padding:${props.padding};` : "")}
  ${(props) => (props.alignItems ? `align-items: ${props.alignItems};` : "")}
  :before {
    background: ${(props) => (props.bgColorBefore ? "-" : "none")}:;
  }

  :hover {
    background: ${({ variant = "default", theme }) =>
      variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.default
        : variant === "warning"
        ? theme.basic.default
        : variant === "danger"
        ? theme.basic.default
        : "transparent"};
    color: ${({ variant = "default", theme }) =>
      variant === "primary"
        ? theme.basic.black
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
        ? theme.basic.warning
        : variant === "danger"
        ? theme.basic.danger
        : theme.basic.primary};
    border: 2px solid
      ${({ variant = "default", theme }) =>
        variant === "primary"
          ? theme.basic.primary
          : variant === "secondary"
          ? theme.basic.secondary
          : variant === "warning"
          ? theme.basic.warning
          : variant === "danger"
          ? theme.basic.danger
          : theme.basic.primary};
    box-shadow: 0 0 10px
      ${({ variant = "default", theme }) =>
        variant === "primary"
          ? theme.basic.primary
          : variant === "secondary"
          ? theme.basic.secondary
          : variant === "warning"
          ? theme.basic.warning
          : variant === "danger"
          ? theme.basic.danger
          : theme.basic.primary};
  }

  :focus {
    background: ${(props) =>
      props.background ? props.background : "transparent"};
    color: ${(props) =>
      props.color ? props.color : props.theme.basic.primary};
    border: ${(props) =>
      props.border ? props.border : `1px solid ${props.theme.basic.primary}`};
    outline: none !important;
  }

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
    background: ${(props) => props.theme.basic.default} !important;
    color: ${(props) => props.theme.basic.blackLighten} !important;
    border: 1px solid ${(props) => props.theme.basic.blackLighten} !important;
  }
`;
