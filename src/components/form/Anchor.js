import Link from "next/link";
import React, { useMemo } from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";

export const Anchor = (props) => {
  const AnchorComponent = useMemo(() => {
    return (
      <>
        {props.loading && <LoadingOutlined />}
        {props.children}
      </>
    );
  }, [props.loading]);

  return props.href ?? props.url ? (
    <Link href={props.href ?? props.url} passHref>
      <AnchorTag classname="no-wrap" target={props.target || "_self"} rel="noreferrer" {...props}>
        {AnchorComponent}
      </AnchorTag>
    </Link>
  ) : (
    <AnchorTag
      onClick={() => (props.onClick ? props.onClick() : null)}
      classname="no-wrap"
      target={props.target || "_self"}
      rel="noreferrer"
      {...props}
    >
      {AnchorComponent}
    </AnchorTag>
  );
};

const AnchorTag = styled.a`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 500)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "11px")};
  text-decoration: ${(props) => (props.underlined ? `underline` : "")};
  border: ${(props) => (props.border ? props.border : "")};
  margin: ${(props) => (props.margin ? props.margin : "")};
  padding: ${(props) => (props.padding ? props.padding : "")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  display: ${(props) => (props.display ? props.display : "")};
  color: ${({ variant = "default", theme }) =>
    variant === "primary"
      ? theme.basic.primary
      : variant === "secondary"
      ? theme.basic.secondary
      : variant === "warning"
      ? theme.basic.warning
      : variant === "danger"
      ? theme.basic.danger
      : variant === "white"
      ? theme.basic.whiteLight
      : theme.basic.default};

  :hover {
    text-decoration: ${(props) => (props.underlined ? `underline` : "")};
    text-shadow: 0 0 10px
      ${({ variant = "default", theme }) =>
        variant === "primary"
          ? theme.basic.primary
          : variant === "secondary"
          ? theme.basic.secondary
          : variant === "warning"
          ? theme.basic.warning
          : variant === "danger"
          ? theme.basic.danger
          : variant === "white"
          ? theme.basic.whiteLight
          : theme.basic.primary};
  }

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
    color: ${(props) => props.theme.basic.whiteDarken} !important;
  }
`;
