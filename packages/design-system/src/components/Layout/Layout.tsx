import React from "react";
import { Children } from "react";
import tw, { css, styled, theme } from "twin.macro";
interface LayourBaseProps {
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
  className,
}: LayourBaseProps) => {
  return (
    <div
      style={style}
      className={[
        `${d === "x" ? "flex-row" : "flex-col"}`,
        `justify-${justify}`,
        `items-${align}`,
        `space-${d}-${gap || 0}`,
        `p-${p! >= 0 ? p : ""}`,
        `px-${px! >= 0 ? px : ""}`,
        `py-${py! >= 0 ? py : ""}`,
        divider ? `divide-${d} divide-solid` : ``,
        `${className}`,
        !autoW ? `w-full` : `w-auto`,
      ].join(" ")}
      css={[tw`flex`]}
    >
      {children}
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
