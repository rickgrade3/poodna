import React from "react";
import styled from "styled-components";

const StyleButton = styled.button`
  height: 35px;
  background: ${(props) => (props.color ? props.color : "#ffffff")};
  border-radius: 25px;
  color: #ffffff !important;
  border-color: ${(props) => (props.color ? props.color : "#ffffff")};
  border: 1px solid;
  padding: 0 15px;
`;

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
