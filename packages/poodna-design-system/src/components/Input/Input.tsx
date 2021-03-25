import React, { useEffect, useState } from "react";
import tw, { css, styled, theme } from "twin.macro";
import Button from "../Button/Button";
import { ReactComponent as Close } from "../../icons/solid/x.svg";
import Ink from "react-ink";

export enum InputSizeEnum {
  xl2 = "xl2",
  xl = "xl",
  lg = "lg",
  md = "md",
  sm = "sm",
}
type InputSize = keyof typeof InputSizeEnum;
export enum InputRoundedEnum {
  full = "full",
  lg = "lg",
  md = "md",
  none = "none",
}
type InputRounded = keyof typeof InputRoundedEnum;

export interface InputProps {
  value?: string | number;
  onChange?: (v: string | number) => void;
  loading?: boolean;
  disabled?: boolean;
  rounded?: InputRounded;
  label: string;
  color?: string;
  size?: InputSize;
  full?: boolean;
}

const StyleInputContainer = styled.div<Omit<InputProps, "onChange" | "value">>(
  ({ loading, disabled, rounded, label, color, size, full }) => {
    return [tw`relative`];
  }
);

export default (props: InputProps) => {
  const { onChange, value, ...containerProps } = props;
  const [controlled] = useState(!!props.value);
  const [isFocus, setFocus] = useState(false);
  const [_v, setValue] = useState(props.value);
  return (
    <StyleInputContainer {...containerProps}>
      <input
        value={controlled ? props.value : _v}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        css={[
          tw`
            bg-transparent
            border
            border-gray-300

            
        `,
          _v
            ? tw`
              border-purple-500
              bg-white
              
              hover:bg-gray-50
              focus:outline-none
              focus:ring-4
              focus:ring-purple-100    
              focus:border-purple-700      
            `
            : tw`
              hover:bg-gray-50
              hover:border-gray-900
              hover:text-gray-900
              
              focus:outline-none
              focus:ring-4
              focus:ring-purple-100    
              focus:border-purple-700      

              active:border-purple-500
              active:bg-white
              active:text-purple-600    
          
          `,
          props.rounded === "full" ? tw`rounded-full` : "",
          props.rounded === "lg" ? tw`rounded-2xl` : "",
          props.rounded === "md" ? tw`rounded-md` : "",
          props.size === "xl2" ? tw`px-12 pb-9 pt-11` : "",
          props.size === "xl" ? tw`px-10 pb-8 pt-10` : "",
          props.size === "lg" ? tw`px-8 pb-5 pt-7` : "",
          props.size === "md" ? tw`px-6 pb-4 pt-8` : "",
          props.size === "sm" ? tw`px-4 pb-3 pt-6` : "",
          tw`transition  duration-300 ease-in-out  w-full	relative`,
        ]}
        type="text"
      />
      {props.label && (
        <div
          css={[
            props.size === "xl2" ? tw`px-12` : "",
            props.size === "xl" ? tw`px-10` : "",
            props.size === "lg" ? tw`px-8` : "",
            props.size === "md" ? tw`px-6` : "",
            props.size === "sm" ? tw`px-4` : "",
            tw`absolute top-1/2 -translate-y-1/2  transform pointer-events-none transition-all  duration-300 ease-in-out`,
          ]}
        >
          <div
            css={[
              isFocus || _v
                ? isFocus
                  ? tw`
                    -translate-y-4 transform text-purple-700  text-xs font-medium`
                  : tw`
                    -translate-y-4 transform text-gray-400 text-xs font-medium
                  `
                : tw`
                  opacity-20 transform
              `,
              tw`transition-all  duration-300`,
            ]}
          >
            {props.label}
          </div>
        </div>
      )}
      {_v && (
        <Button
          onClick={() => {
            setValue("");
            if (onChange) onChange("");
          }}
          variant="text"
          css={[
            tw`
            absolute
            right-3
            top-1/2 -translate-y-1/2  transform
        `,
          ]}
          icon={
            <Close
              css={tw`
              text-purple-600
              fill-current
              
          `}
            />
          }
        ></Button>
      )}
    </StyleInputContainer>
  );
};
