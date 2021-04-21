import React from "react";
import tw, { css, styled, theme } from "twin.macro";

import Ink from "react-ink";
import { FaCheck, FaChevronRight, FaSpinner } from "react-icons/fa";
import { Avatar } from "../..";
export interface MenuItemProps {
  before?: React.ReactNode;
  avatar?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  after?: React.ReactNode;
  chevron?: boolean;
  checked?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export default (props: MenuItemProps) => {
  return (
    <div
      {...props}
      css={[
        tw`
        
        w-full
        flex items-center justify-between py-6 
        bg-transparent
        text-gray-600
        border-transparent
        hover:bg-gray-100
        hover:text-gray-900
        focus:outline-none
        active:bg-gray-200
        active:text-gray-600
        transition  duration-300 ease-in-out cursor-pointer	
        relative
    `,
        props.loading ? tw`animate-pulse` : "",
        `
        :not(:first-child) {
            border-top:1px solid rgba(0,0,0,0.1);
        }
    `,
      ]}
    >
      <Ink />
      <div css={tw`flex items-center justify-start space-x-4`}>
        {[
          props.avatar && <Avatar src={props.avatar} />,
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
      <div css={tw`flex items-center justify-end space-x-4`}>
        {[
          props.label && <div css={tw`opacity-30`}>{props.label}</div>,
          props.after && <div>{props.after}</div>,
          props.checked && (
            <div>
              <FaCheck css={tw`fill-current text-purple-700`} />
            </div>
          ),
          props.chevron && (
            <div>
              <FaChevronRight css={tw`fill-current`} />
            </div>
          ),
          props.loading && (
            <div>
              <div
                css={[
                  props.loading ? tw`w-7 opacity-100` : tw`w-0 opacity-0`,
                  tw`transition-all ease-in-out duration-300 overflow-hidden`,
                ]}
              >
                <FaSpinner
                  css={[
                    props.loading ? tw`animate-spin` : tw``,
                    tw`fill-current`,
                  ]}
                />
              </div>
            </div>
          ),
        ].filter((v) => v)}
      </div>
    </div>
  );
};
