import React from "react";
import { Children } from "react";
import { Global } from "@emotion/react";

import tw, { css, styled, theme } from "twin.macro";
export interface LayourBaseProps {
  children?: React.ReactNode | React.ReactNode[];
  d?: "x" | "y"; //DefaultX
  justify?: "center" | "start" | "between" | "end"; //DefaultCenter
  align?: "center" | "start"; //DefaultCenter
  gap?: number; //Default0
  p?: number;
  px?: number;
  py?: number;
  autoW?: boolean;
  divider?: boolean;
  className?: string;
  style?: any;
  variant?: (
    | "box"
    | "light"
    | "dark"
    | "rounded"
    | "shadow"
    | "page-wrapper"
    | "page-padding"
  )[];
}

export const Layout = ({
  children,
  d = "x",
  justify = "center",
  align = "center",
  autoW = false,
  divider = false,
  gap,
  p,
  px,
  py,
  style,
  variant,

  className,
}: LayourBaseProps) => {
  return (
    <div
      style={style}
      css={css`
        ${(variant || []).indexOf("page-wrapper") >= 0
          ? `
          max-width:600px;
          margin-left:auto;
          margin-right:auto;
          margin-top:3rem;
          padding-left:2rem;
          padding-right:2rem;
        `
          : ``}
        ${(variant || []).indexOf("page-padding") >= 0
          ? tw`
          px-4
          -mx-4
          w-auto
        `
          : ``}

        ${(variant || []).indexOf("box") >= 0
          ? tw`
          p-7        
        `
          : ``}
        ${(variant || []).indexOf("rounded") >= 0
          ? tw`
          rounded-xl    
        `
          : ``}
        ${(variant || []).indexOf("shadow") >= 0
          ? tw`
          shadow-md
        `
          : ``}
          ${(variant || []).indexOf("light") >= 0
          ? `
          background:white;
        `
          : `
            
          
          `}
          ${(variant || []).indexOf("dark") >= 0
          ? `
            background:rgba(255,255,255,0.5);
        `
          : `
         
          
          `}
      `}
      className={[!autoW ? `w-full` : `w-auto`, `${className}`].join(" ")}
    >
      <div
        className={[
          `${d === "x" ? "flex-row" : "flex-col"}`,
          `justify-${justify}`,
          `items-${align}`,
          `space-${d}-${typeof gap === "undefined" || gap === null ? 2 : gap}`,
          `p-${p! >= 0 ? p : ""}`,
          `px-${px! >= 0 ? px : ""}`,
          `py-${py! >= 0 ? py : ""}`,
          divider ? `divide-${d} divide-solid` : ``,
          !autoW ? `w-full` : `w-auto`,
        ].join(" ")}
        css={[
          tw`flex`,
          css`
            ${d === "y"
              ? `
            > * {
            width: 100%;
          }
          `
              : ""}
          `,
        ]}
      >
        {children}
      </div>
    </div>
  );
};
export const L = Layout;

export const Y = ({ children, ...p }: LayourBaseProps) => {
  return (
    <Layout {...p} d={"y"}>
      {children}
    </Layout>
  );
};

export const X = ({ children, ...p }: LayourBaseProps) => {
  return (
    <Layout {...p} d={"x"}>
      {children}
    </Layout>
  );
};

export const BG = (p: { color?: "black" | "white" | "gray" | "primary" }) => {
  return (
    <Global
      styles={
        p.color === "black"
          ? css`
              body {
                background-color: #000;
              }
            `
          : p.color === "white"
          ? css`
              body {
                background-color: #fff;
              }
            `
          : p.color === "gray"
          ? css`
              body {
                background-color: #e8e9ef;
              }
            `
          : p.color === "primary"
          ? css`
              body {
                background-color: #e8e9ef;
              }
            `
          : ``
      }
    />
  );
};
