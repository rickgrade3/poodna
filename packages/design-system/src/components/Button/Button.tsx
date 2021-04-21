import React, { useState } from "react";
import tw, { css, styled, theme } from "twin.macro";

import Ink from "react-ink";
import { Theme } from "../types";
import { FaSpinner } from "react-icons/fa";
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
  auto = "auto",
  xl2 = "xl2",
  xl = "xl",
  lg = "lg",
  md = "md",
  sm = "sm",
}
export type ButtonSize = keyof typeof ButtonSizeEnum;
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
  iconAfter?: React.ReactNode;
  autoloading?: boolean;
  loading?: boolean;
  focus?: boolean;
  full?: boolean;
  disabled?: boolean;
  tone?: Theme;
  onClick?: () => void;
  style?: any;
  className?: string;
}

const StyleButton = styled.button<ButtonProps>(
  ({
    color,
    tone,
    variant = "ghost",
    rounded = "md",
    size = "md",
    full,
    disabled,
    loading,
    focus,
  }) => {
    if (tone === "LIGHT")
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

        size === "auto" ? tw`px-2 py-2` : "",
        size === "xl2" ? tw`px-12 h-20` : "",
        size === "xl" ? tw`px-10 h-16` : "",
        size === "lg" ? tw`px-8 h-14` : "",
        size === "md" ? tw`px-6 h-12` : "",
        size === "sm" ? tw`px-4 h-10` : "",

        full ? tw`w-full  block` : "",

        loading ? tw`animate-pulse` : "",
        rounded === "full" ? tw`rounded-full` : "",
        rounded === "lg" ? tw`rounded-3xl` : "",
        rounded === "md" ? tw`rounded-md` : "",
        tw`transition  duration-300 ease-in-out cursor-pointer	relative`,
      ];
    if (tone === "DARK")
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
          ring-purple-900 
          ring-opacity-50      
          bg-purple-800             
        `
          : variant === "primary"
          ? tw`
          hover:bg-purple-400
          active:bg-purple-500          
          focus:outline-none
          focus:ring-4
          focus:ring-opacity-50
          focus:ring-purple-900          
        `
          : "",
        //GHOST
        variant === "ghost"
          ? tw`
        border-gray-100
        border
        text-gray-100
        bg-transparent
      `
          : "",
        variant === "ghost" && (loading || focus)
          ? tw`
          bg-gray-100
          border-gray-900
          text-gray-900
          ring-4
          ring-gray-600          
        `
          : variant === "ghost"
          ? tw`
          hover:bg-white
          hover:border-gray-900
          hover:text-gray-900
          
          focus:outline-none
          focus:ring-4
          focus:ring-gray-600          

          active:border-gray-500
          active:bg-white
          active:text-gray-600       
        `
          : "",
        //GHOST_DIM
        variant === "ghost_dim"
          ? tw`
        border
        border-gray-500
        text-gray-100
        bg-transparent
        `
          : "",
        variant === "ghost_dim" && (loading || focus)
          ? tw`
          border
          border-transparent
          bg-white
          border-purple-400
          text-purple-900          
          ring-4
          ring-gray-600   
        `
          : variant === "ghost_dim"
          ? tw`
          hover:bg-white
          hover:border-purple-400
          hover:text-purple-900
          
          focus:outline-none
          focus:ring-4
          focus:ring-gray-600          

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
        bg-gray-800
        text-gray-50
        
      `
          : "",
        variant === "dim" && (loading || focus)
          ? tw`
            outline-none
            ring-4
            border-purple-600
            ring-purple-900          
            bg-white
            text-purple-600
        `
          : variant === "dim"
          ? tw`
            hover:bg-white
            hover:text-purple-900
            focus:outline-none
            focus:ring-4
            focus:border-purple-500
            focus:ring-purple-900          
            active:bg-white
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
        text-white
        border-transparent

        
      `
          : "",
        variant === "text" && (loading || focus)
          ? tw`
            bg-gray-700
            text-white
        `
          : variant === "text"
          ? tw`
            hover:bg-gray-700
            hover:text-white
            focus:outline-none
            active:bg-gray-700
            active:text-white
        `
          : "",
        //TEXT_GREY
        variant === "text_gray"
          ? tw`
        border
          border-transparent
        bg-transparent
        text-white
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

        disabled ? tw`opacity-50 pointer-events-none` : "",
        variant === "ghost_dim" ? tw`` : "",
        variant === "dim" ? tw`` : "",
        variant === "text" ? tw`` : "",

        size === "xl2" ? tw`px-12 h-16` : "",
        size === "xl" ? tw`px-10 h-16` : "",
        size === "lg" ? tw`px-8 h-14` : "",
        size === "md" ? tw`px-6 h-12` : "",
        size === "sm" ? tw`px-4 h-10` : "",

        full ? tw`w-full  block` : "",

        loading ? tw`animate-pulse` : "",
        rounded === "full" ? tw`rounded-full` : "",
        rounded === "lg" ? tw`rounded-3xl` : "",
        rounded === "md" ? tw`rounded-md` : "",
        tw`transition  duration-300 ease-in-out cursor-pointer	relative`,
      ];
  }
);

export default ({ tone = "LIGHT", onClick, ...props }: ButtonProps) => {
  const [internalLoading, setInternalLoading] = useState(props.loading);
  const _loading = props.autoloading ? internalLoading : props.loading;
  const full = typeof props.full === "undefined" ? true : false;
  return (
    <StyleButton
      tone={tone}
      {...{ ...props, full }}
      onClick={async () => {
        setInternalLoading(true);
        if (onClick) {
          await onClick();
        }
        setInternalLoading(false);
      }}
    >
      <Ink />
      <div css={tw`flex items-center justify-center whitespace-nowrap`}>
        <div
          css={[
            _loading
              ? props.children
                ? tw`w-7 mr-3 opacity-100`
                : `opacity-100`
              : tw`w-0 opacity-0`,
            tw`transition-all ease-in-out duration-300 overflow-hidden`,
          ]}
        >
          <FaSpinner
            css={[_loading ? tw`animate-spin` : tw``, tw`fill-current`]}
          />
        </div>
        {props.icon && !_loading && (
          <div css={[props.children ? tw`w-7` : tw``]}>{props.icon}</div>
        )}
        {props.children}
        {props.iconAfter && <div css={[tw`ml-2`]}>{props.iconAfter}</div>}
      </div>
    </StyleButton>
  );
};
