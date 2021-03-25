import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import { ReactComponent as Check } from "../../icons/solid/check.svg";
import { ReactComponent as Chevron } from "../../icons/solid/chevron-right.svg";
export interface MenuItemProps {
  before?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  after?: React.ReactNode;
  chevron?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

export default (props: MenuItemProps) => {
  return (
    <div
      {...props}
      css={[
        tw`
        flex items-center justify-between py-4 
        bg-transparent
        text-gray-600
        border-transparent
        hover:bg-gray-100
        hover:text-gray-900
        focus:outline-none
        active:bg-gray-200
        active:text-gray-600
        transition  duration-300 ease-in-out cursor-pointer	
    `,
        `
        :not(:first-child) {
            border-top:1px solid rgba(0,0,0,0.1);
        }
    `,
      ]}
    >
      <div css={tw`flex items-center justify-start space-x-2`}>
        {[
          props.before && <div>{props.before}</div>,
          props.icon && (
            <div
              css={[
                tw`text-purple-700`,
                `
                svg{
                    fill:currentColor;
                }
            `,
              ]}
            >
              {props.icon}
            </div>
          ),
          props.children && <div>{props.children}</div>,
        ].filter((v) => v)}
      </div>
      <div css={tw`flex items-center justify-end space-x-2`}>
        {[
          props.label && <div>{props.label}</div>,
          props.after && <div>{props.after}</div>,
          props.checked && (
            <div>
              <Check css={tw`fill-current text-purple-700`} />
            </div>
          ),
          props.chevron && (
            <div>
              <Chevron css={tw`fill-current`} />
            </div>
          ),
        ].filter((v) => v)}
      </div>
    </div>
  );
};
