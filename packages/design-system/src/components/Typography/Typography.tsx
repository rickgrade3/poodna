import React from "react";
import tw, { css, styled, theme } from "twin.macro";
export enum TypoVariantEnum {
  heading = "heading",
  normal = "normal",
}
type TypoVariant = keyof typeof TypoVariantEnum;

export enum TypoSizeEnum {
  text_xs = "text_xs",
  text_sm = "text_sm",
  text_base = "text_base",
  text_lg = "text_lg",
  text_xl = "text_xl",
  text_2xl = "text_2xl",
  text_3xl = "text_3xl",
  text_4xl = "text_4xl",
  text_5xl = "text_5xl",
  text_6xl = "text_6xl",
  text_7xl = "text_7xl",
  text_8xl = "text_8xl",
}
type TypoSize = keyof typeof TypoSizeEnum;

export interface TypographyProps {
  variant: TypoVariant;
  children: React.ReactNode | React.ReactNode[];
  size: TypoSize;
  className?: string;
}

export default (props: TypographyProps) => {
  return (
    <div
      className={props.className}
      css={[
        //Weight
        props.variant === "heading" ? tw`font-extrabold opacity-90` : "",
        props.variant === "normal" ? tw`font-light opacity-80` : "",
        //Size
        props.size === "text_xs" ? tw`text-xs` : "",
        props.size === "text_sm" ? tw`text-sm` : "",
        props.size === "text_base" ? tw`text-base` : "",
        props.size === "text_lg" ? tw`text-lg` : "",
        props.size === "text_xl" ? tw`text-xl` : "",
        props.size === "text_2xl" ? tw`text-2xl` : "",
        props.size === "text_3xl" ? tw`text-3xl` : "",
        props.size === "text_4xl" ? tw`text-4xl` : "",
        props.size === "text_5xl" ? tw`text-5xl` : "",
        props.size === "text_6xl" ? tw`text-6xl` : "",
        props.size === "text_7xl" ? tw`text-7xl` : "",
        props.size === "text_8xl" ? tw`text-8xl` : "",
      ]}
    >
      {props.children}
    </div>
  );
};
