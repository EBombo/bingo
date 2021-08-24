import React, { forwardRef } from "reactn";
import styled from "styled-components";
import { darkTheme } from "../../theme";

export const ButtonBingo = forwardRef((props, ref) => {
  const theme =
    props.variant === "primary"
      ? darkTheme.buttonPrimary
      : darkTheme.buttonDefault;

  return <ButtonCss theme={theme} ref={ref} {...props} />;
});

const ButtonCss = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px 10px;
  width: ${(props) => props.width ?? "auto"};
  color: ${(props) => props.theme.color};
  background: ${(props) => props.theme.background};
  box-shadow: 0 4px 0 ${(props) => props.theme.shadow};

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
  }
`;
