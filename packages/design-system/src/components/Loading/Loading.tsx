import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

import tw, { css, styled, theme } from "twin.macro";
export enum LoadingSizeEnum {
  auto = "auto",
  xl2 = "xl2",
  xl = "xl",
  lg = "lg",
  md = "md",
  sm = "sm",
}
export type LoadingSize = keyof typeof LoadingSizeEnum;
export interface LoadingProps {
  size?: LoadingSizeEnum;
}

export default (p: LoadingProps) => {
  return (
    <FaSpinner
      css={[
        p.size === "auto" || !p.size ? tw`w-full h-auto` : "",
        p.size === "xl2" ? tw`w-16 h-16` : "",
        p.size === "xl" ? tw`w-16 h-16` : "",
        p.size === "lg" ? tw`w-14 h-14` : "",
        p.size === "md" ? tw`w-12 h-12` : "",
        p.size === "sm" || !p.size ? tw`w-10 h-10` : "",
        tw`mx-auto`,
        tw`animate-spin`,
        tw`fill-current`,
      ]}
    />
  );
};
