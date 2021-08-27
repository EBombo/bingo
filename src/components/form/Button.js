import React, { forwardRef } from "reactn";
import styled from "styled-components";
import Button from "antd/lib/button";

// Variant="outlined".
// Variant="contained".

export const ButtonAnt = forwardRef((props, ref) => (
  <ButtonAntCss
    ref={ref}
    size={props.size ? props.size : "medium"}
    width={props.width ? props.width : "auto"}
    {...props}
  />
));

const ButtonAntCss = styled(Button)`
  padding: ${(props) =>
    props.size === "small"
      ? "10px"
      : props.size === "medium"
      ? "6px 20px"
      : props.size === "big"
      ? "10px 30px"
      : ""};
  margin: ${(props) => props.margin || 0};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "4px"};
  cursor: pointer;
  width: ${(props) => props.width};
  height: ${(props) => (props.height ? props.height : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ variant = "contained", theme, color = "primary" }) =>
    variant === "contained"
      ? `
      background: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color
      };
        color: ${
          color === "white"
            ? theme.basic.secondaryLight
            : color === "default"
            ? theme.basic.blackDarken
            : theme.basic.white
        };
      border: none;
      box-shadow: 0 4px ${
        color === "primary"
          ? theme.basic.primaryDark
          : color === "secondary"
          ? theme.basic.secondaryDark
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? "#979797"
          : color
      };
      `
      : variant === "outlined"
      ? `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color
      };
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : color
      };
      `
      : `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : color
      };  
      border: none;
      `}

  &:hover {
    ${({ variant = "contained", theme = darkTheme, color = "primary" }) =>
      variant === "contained"
        ? `
      background: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : `${color}90`
      };
      color: ${
        color === "white"
          ? theme.basic.secondaryLight
          : color === "default"
          ? theme.basic.blackDarken
          : theme.basic.white
      };
      border: none;
      `
        : variant === "outlined"
        ? `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : `${color}CC`
      };
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.whiteDark
          : `${color}CC`
      };
      `
        : `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primaryLight
          : color === "secondary"
          ? theme.basic.secondaryLight
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color === "default"
          ? theme.basic.blackDarken
          : `${color}CC`
      };  
      border: none;
      `}
  }

  &:active {
    ${({ variant = "contained", theme = darkTheme, color = "primary" }) =>
      variant === "contained" &&
      `
        box-shadow: 0 2px ${
          color === "primary"
            ? theme.basic.primary
            : color === "secondary"
            ? theme.basic.secondary
            : color === "warning"
            ? theme.basic.warning
            : color === "danger"
            ? theme.basic.danger
            : color === "default"
            ? "#979797"
            : color
        } !important;
        transform: translateY(2px);`}
`;
