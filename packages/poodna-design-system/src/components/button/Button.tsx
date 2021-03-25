import React from "react";
import tw, { css, styled, theme } from "twin.macro";

const StyleButton = styled.button(({ color }) => [
  `
  height: 35px;
  background: ${color || "#ffffff"};
  border-radius: 25px;
  color: #ffffff !important;
  border-color: ${color || "#ffffff"};
  border: 1px solid;
  padding: 0 15px;
`,
  tw`bg-red-50`,
]);

export interface ButtonProps {
  color?: string;
  children: React.ReactNode;
  onClick?: (color: string) => void;
}

export default (props: ButtonProps) => {
  const { color = "#000", onClick } = props;
  return (
    <StyleButton
      style={{ color }}
      color={color}
      onClick={() => onClick && onClick(color)}
    >
      {props.children}
    </StyleButton>
  );
};
