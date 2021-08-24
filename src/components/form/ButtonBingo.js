import React, { forwardRef } from "reactn";
import { darkTheme } from "../../theme";
import styled from "styled-components";

export const ButtonBingo = forwardRef((props, ref) => {
  const theme =
    props.variant === "primary"
      ? darkTheme.buttonPrimary
      : props.variant === "secondary"
      ? darkTheme.buttonSecondary
      : darkTheme.buttonDefault;

  return <ButtonCss theme={theme} ref={ref} {...props} />;
});

const ButtonCss = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 4px;
  text-align: ${(props) => props.align ?? "center"};
  padding: ${(props) => props.padding ?? "10px 10px"};
  color: ${(props) => props.theme.color};
  width: ${(props) => props.width ?? "auto"};
  background: ${(props) => props.theme.background};
  box-shadow: 0 4px 0 ${(props) => props.theme.shadow};

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
  }
`;
