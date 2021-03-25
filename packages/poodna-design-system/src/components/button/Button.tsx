import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import { ReactComponent as Loading } from "../../icons/solid/spinner.svg";
import Ink from "react-ink";
export enum ButtonVariantEnum {
  primary = "primary",
  ghost = "ghost",
  ghost_dim = "ghost_dim",
  dim = "dim",
  text = "text",
  text_gray = "text_gray",
}
type ButtonVariant = keyof typeof ButtonVariantEnum;
export enum ButtonSizeEnum {
  xl2 = "xl2",
  xl = "xl",
  lg = "lg",
  md = "md",
  sm = "sm",
}
type ButtonSize = keyof typeof ButtonSizeEnum;
export enum ButtonRoundedEnum {
  full = "full",
  lg = "lg",
  md = "md",
  none = "none",
}
type ButtonRounded = keyof typeof ButtonRoundedEnum;

export interface ButtonProps {
  children?: React.ReactNode;
  color?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: ButtonRounded;
  icon?: React.ReactNode;
  loading?: boolean;
  focus?: boolean;
  full?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const StyleButton = styled.button<ButtonProps>(
  ({
    color,
    variant,
    rounded = "md",
    size = "md",
    full,
    disabled,
    loading,
    focus,
  }) => {
    return [
      //PRIMARY
      variant === "primary"
        ? tw`
          border
          bg-purple-600          
          border-none
          text-white
        `
        : "",
      variant === "primary" && (loading || focus)
        ? tw`
          outline-none
          ring-4
          ring-purple-200       
          bg-purple-800             
        `
        : variant === "primary"
        ? tw`
          hover:bg-purple-800
          active:bg-purple-500          
          focus:outline-none
          focus:ring-4
          focus:ring-purple-200          
        `
        : "",
      //GHOST
      variant === "ghost"
        ? tw`
        border-purple-600
        border
        text-purple-600
        bg-transparent
      `
        : "",
      variant === "ghost" && (loading || focus)
        ? tw`
          bg-purple-100
          border-purple-900
          text-purple-900
          ring-4
          ring-purple-200          
        `
        : variant === "ghost"
        ? tw`
          hover:bg-purple-50
          hover:border-purple-900
          hover:text-purple-900
          
          focus:outline-none
          focus:ring-4
          focus:ring-purple-200          

          active:border-purple-500
          active:bg-white
          active:text-purple-600       
        `
        : "",
      //GHOST_DIM
      variant === "ghost_dim"
        ? tw`
        border
        border-gray-300
        text-gray-600
        bg-transparent
        `
        : "",
      variant === "ghost_dim" && (loading || focus)
        ? tw`
          border
          border-transparent
          bg-purple-50
          border-purple-400
          text-purple-900          
          ring-4
          ring-purple-100   
        `
        : variant === "ghost_dim"
        ? tw`
          hover:bg-purple-50
          hover:border-purple-400
          hover:text-purple-900
          
          focus:outline-none
          focus:ring-4
          focus:ring-purple-100          

          active:border-purple-500
          active:bg-white
          active:text-purple-600  
        `
        : "",
      //DIM
      variant === "dim"
        ? tw`
        border
          border-transparent
        bg-purple-50
        text-purple-600
        
      `
        : "",
      variant === "dim" && (loading || focus)
        ? tw`
            outline-none
            ring-4
            border-purple-600
            ring-purple-50          
            bg-purple-100
            text-purple-600
        `
        : variant === "dim"
        ? tw`
            hover:bg-purple-200
            hover:text-purple-900
            focus:outline-none
            focus:ring-4
            focus:border-purple-500
            focus:ring-purple-50          
            active:bg-purple-100
            active:text-purple-600
            active:border-purple-500
        `
        : "",
      //TEXT
      variant === "text"
        ? tw`
        border
          border-transparent
        bg-transparent
        text-purple-600
        border-transparent

        
      `
        : "",
      variant === "text" && (loading || focus)
        ? tw`
            bg-purple-200
            text-purple-600
        `
        : variant === "text"
        ? tw`
            hover:bg-purple-100
            hover:text-purple-900
            focus:outline-none
            active:bg-purple-200
            active:text-purple-600
        `
        : "",
      //TEXT_GREY
      variant === "text_gray"
        ? tw`
        border
          border-transparent
        bg-transparent
        text-gray-600
        border-transparent

        
      `
        : "",
      variant === "text_gray" && (loading || focus)
        ? tw`
            border
            border-transparent
            bg-gray-200
            text-gray-600
        `
        : variant === "text_gray"
        ? tw`
            hover:bg-gray-100
            hover:text-gray-900

            focus:outline-none

            active:bg-gray-200
            active:text-gray-600
        `
        : "",

      disabled ? tw`opacity-10 pointer-events-none` : "",
      variant === "ghost_dim" ? tw`` : "",
      variant === "dim" ? tw`` : "",
      variant === "text" ? tw`` : "",

      size === "xl2" ? tw`px-12 py-8` : "",
      size === "xl" ? tw`px-10 py-7` : "",
      size === "lg" ? tw`px-8 py-4` : "",
      size === "md" ? tw`px-6 py-3` : "",
      size === "sm" ? tw`px-4 py-2` : "",

      full ? tw`w-full  block` : "",

      loading ? tw`animate-pulse` : "",
      rounded === "full" ? tw`rounded-full` : "",
      rounded === "lg" ? tw`rounded-3xl` : "",
      rounded === "md" ? tw`rounded-md` : "",
      tw`transition  duration-300 ease-in-out cursor-pointer	relative`,
    ];
  }
);

export default (props: ButtonProps) => {
  return (
    <StyleButton {...props}>
      <Ink />
      <div css={tw`flex items-center justify-center`}>
        <div
          css={[
            props.loading
              ? props.children
                ? tw`w-7 opacity-100`
                : `opacity-100`
              : tw`w-0 opacity-0`,
            tw`transition-all ease-in-out duration-300 overflow-hidden`,
          ]}
        >
          <Loading
            css={[props.loading ? tw`animate-spin` : tw``, tw`fill-current`]}
          />
        </div>
        {props.icon && !props.loading && (
          <div css={[props.children ? tw`w-7` : tw``]}>{props.icon}</div>
        )}
        {props.children}
      </div>
    </StyleButton>
  );
};
