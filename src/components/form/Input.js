import React, {forwardRef, useEffect, useState} from "reactn";
import styled from "styled-components";
import {inputAutoFill, sizes} from "../../constants";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import get from "lodash/get";

export const Input = forwardRef((props, ref) => {
    const [hide, setHide] = useState(false);

    const inputType = () => {
        if (props.type === "password") return hide ? "password" : "text";

        return props.type;
    };

    useEffect(() => {
        if (props.type === "password") setHide(true);
    }, [props.type]);

    return <InputContainer marginBottom={props.marginbottom}
                           width={props.width}>
        {
            props.label
            && <Label required={props.required}
                      variant={props.variant}>
                {props.label}
            </Label>
        }
        <InputWrapper {...props}>
        <span className="ant-input-wrapper ant-input-group"
              style={{display: "table"}}>
          {
              props.addonBefore
              && <span className={"ant-input-group-addon"}>{props.addonBefore}</span>
          }
            <StyledInput
                hasError={props.error}
                {...props}
                ref={ref}
                type={inputType()}
                className={`ant-input ${get(props, "className", "")}`}
            />
            {
                props.addonAfter
                && <span className={"ant-input-group-addon"}>{props.addonAfter}</span>
            }
        </span>
            {
                props.type === "password"
                && <>
                    {
                        hide
                            ? <EyeOutlinedCss onClick={() => setHide(!hide)}/>
                            : <EyeInvisibleOutlinedCss onClick={() => setHide(!hide)}/>
                    }
                </>
            }
        </InputWrapper>
        {
            props.error
            && <Error>{props.error.message}</Error>
        }
    </InputContainer>;
});

const InputContainer = styled.div`
  margin-bottom: ${({marginBottom = "1rem"}) => marginBottom} !important;
  width: ${({width = "100%"}) => width};
  margin: ${({margin = 0}) => margin};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  .ant-input-wrapper {
    .ant-input-group-addon {
      height: 30px;
      padding: 0 5px;

      ${({variant = "default", theme}) =>
    variant === "primary" &&
    ` background: ${theme.basic.default};
                border: 1px solid ${theme.basic.primary};`}

      ${({variant = "default", theme}) =>
    variant === "secondary" &&
    ` background: ${theme.basic.default};
                border: 1px solid ${theme.basic.secondary};`}

      ${({variant = "default", theme}) =>
    variant === "default" &&
    ` background: ${theme.basic.default};
                border: 1px solid ${theme.basic.default};`}
    }
  }
`;

const EyeOutlinedCss = styled(EyeOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${props => props.theme.basic.primary} !important;
  }
`;

const EyeInvisibleOutlinedCss = styled(EyeInvisibleOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${props => props.theme.basic.primary} !important;
  }
`;

const StyledInput = styled.input`
  font-size: ${sizes.font.small};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: ${({borderRadius = 0}) => borderRadius};

  background: ${({variant = "default", theme}) =>
    variant === "primary"
        ? theme.basic.default
        : variant === "secondary"
        ? theme.basic.default
        : variant === "warning"
            ? theme.basic.default
            : variant === "danger"
                ? theme.basic.default
                : "transparent"
};
  color: ${({variant = "default", theme}) =>
    variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
            ? theme.basic.warning
            : variant === "danger"
                ? theme.basic.danger
                : theme.basic.default
};
  border: 1px solid ${({variant = "default", theme}) =>
    variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
            ? theme.basic.warning
            : variant === "danger"
                ? theme.basic.danger
                : theme.basic.default
};

  :hover {
    background: ${(props) => props.bgColorEvents ? props.bgColorEvents : props.theme.basic.blackDarken};
    color: ${({variant = "default", theme}) =>
    variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
            ? theme.basic.warning
            : variant === "danger"
                ? theme.basic.danger
                : theme.basic.default
};
    border: 1px solid ${({variant = "default", theme}) =>
    variant === "primary"
        ? theme.basic.primary
        : variant === "secondary"
        ? theme.basic.secondary
        : variant === "warning"
            ? theme.basic.warning
            : variant === "danger"
                ? theme.basic.danger
                : theme.basic.default
};
  }

  ${props => props.hasError && `border:1px solid ${props => props.theme.basic.danger}!important;`}
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .ant-select-selection {
    background: none !important;
    border-radius: 0;
    border: none;
    outline: none;

    :active {
      outline-color: ${props => props.theme.basic.primary};
    }

    .ant-select-selection__placeholder {
      font-size: 10px;
      color: ${props => props.theme.basic.whiteDarken};
      line-height: 24px;
    }
  }

  ::placeholder {
    color: ${props => props.theme.basic.whiteDarken};
  }

  &:focus {
    outline: 0;
    ${(props) => props.variant === "primary" ? `border: 2px solid ${props.theme.basic.primary};` : "none"};
    box-shadow: 0 0 3px 1px ${props => props.theme.basic.whiteDarken};
  }

  &[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
    pointer-events: none;
    background: ${(props) => props.theme.basic.blackLighten} !important;
    color: ${(props) => props.theme.basic.whiteDarken} !important;
    border: 1px solid ${(props) => props.theme.basic.blackLighten} !important;
  }

  ${props => inputAutoFill("none", props.theme.basic.action, props.theme.basic.whiteDarken, props.theme.basic.blackLighten)} ${(props) => props.borderRadius && `border-radius: ${(props) => props.borderRadius};`}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 16px;
  font-size: ${sizes.font.small};

  color: ${({variant = "default", theme}) => variant === "primary" ? theme.basic.primary : theme.basic.blackLighten};

  ${(props) => props.required
    && `::before {
                display: inline-block;
                margin-right: 4px;
                color: ${props.theme.basic.danger};
                font-size: 14px;
                line-height: 1;
                content: "*";
                }`}
`;

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
