import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import Ripples from "react-ripples";

export enum ButtonVariantEnum {
  primary = "primary",
  ghost = "ghost",
  ghost_dim = "ghost_dim",
  dim = "dim",
  text = "text",
}
type ButtonVariant = keyof typeof ButtonVariantEnum;
export enum ButtonSizeEnum {
  xl = "xl",
  lg = "lg",
  md = "md",
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
  children: React.ReactNode;
  color?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: ButtonRounded;
  loading?: boolean;
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
  }) => {
    return [
      `
      border: 1px solid;
      padding: 0 15px;    
`,

      variant === "primary"
        ? tw`
          bg-purple-600
          hover:bg-purple-800
          active:bg-purple-500
          focus:outline-none
          focus:ring-4
          focus:ring-purple-200          
          border-none
          text-white
        `
        : "",
      variant === "ghost"
        ? tw`
        border-purple-600
        text-purple-600
        bg-transparent

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

      variant === "ghost_dim"
        ? tw`
        border-gray-300
        text-purple-600
        bg-transparent

        hover:bg-gray-50
        hover:border-gray-400
        hover:text-purple-900
        
        focus:outline-none
        focus:ring-4
        focus:ring-gray-100          

        active:border-gray-500
        active:bg-white
        active:text-purple-600
      `
        : "",

      variant === "dim"
        ? tw`
        bg-purple-50
        text-purple-600
        border-transparent

        hover:bg-purple-200
        hover:text-purple-900
        hover:border-purple-400
        
        focus:outline-none
        focus:ring-4
        focus:border-purple-500
        focus:ring-purple-50          

        active:bg-purple-100
        active:text-purple-600
        active:border-purple-500
      `
        : "",

      variant === "text"
        ? tw`
        bg-transparent
        text-purple-600
        border-transparent

        hover:bg-purple-100
        hover:text-purple-900

        focus:outline-none
        
        active:bg-purple-200
        active:text-purple-600
      `
        : "",

      disabled ? tw`opacity-10 pointer-events-none` : "",
      variant === "ghost_dim" ? tw`` : "",
      variant === "dim" ? tw`` : "",
      variant === "text" ? tw`` : "",

      size === "xl" ? tw`px-12 py-8` : "",
      size === "lg" ? tw`px-10 py-7` : "",
      size === "md" ? tw`px-8 py-4` : "",
      full ? tw`w-full  block` : "",
      rounded === "full" ? tw`rounded-full` : "",
      rounded === "lg" ? tw`rounded-3xl` : "",
      rounded === "md" ? tw`rounded-md` : "",
      tw`transition  duration-300 ease-in-out cursor-pointer	`,
    ];
  }
);

export default (props: ButtonProps) => {
  return <StyleButton {...props}>{props.children}</StyleButton>;
};
