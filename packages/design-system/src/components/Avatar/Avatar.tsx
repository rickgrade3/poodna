import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import Typography from "../Typography/Typography";

export enum AvatarSizeEnum {
  lg = "lg",
  md = "md",
  sm = "sm",
}
type AvatarSize = keyof typeof AvatarSizeEnum;

export enum AvatarStatusEnum {
  online = "online",
  offline = "offline",
  none = "none",
}
type AvatarStatus = keyof typeof AvatarStatusEnum;

export interface AvatarProps {
  src: string;
  text?: string;
  left?: string;
  background?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  label?: string;
  active?: boolean;
}

export default (props: AvatarProps) => {
  return (
    <div css={tw`inline-flex flex-col space-y-3 w-auto`}>
      <div css={tw`relative`}>
        <div
          css={[
            props.size === "lg" ? tw`w-20 h-20` : "",
            props.size === "md" || !props.size ? tw`w-14 h-14` : "",
            props.size === "sm" ? tw`w-6 h-6` : "",
            props.background ? `background:${props.background};` : "",
            tw`relative overflow-hidden bg-cover bg-no-repeat bg-center rounded-full`,
            props.active
              ? tw`
                ring-2
                ring-purple-600
                ring-offset-4
            `
              : "",
          ]}
        >
          {props.text && (
            <div
              css={[
                tw`
                 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute text-white text-lg`,
              ]}
            >
              {props.text[0]}
            </div>
          )}
          {props.src && (
            <div
              css={[
                tw`relative overflow-hidden bg-cover bg-no-repeat bg-center rounded-full`,
                tw`
                w-full h-full left-0 top-0`,
                `background-image:url(${props.src})`,
              ]}
            />
          )}
        </div>
        {props.status && props.status !== "none" && (
          <div
            css={[
              tw`
                w-3 h-3 rounded-full ring-2 ring ring-white absolute  transform -translate-x-1/2  -translate-y-1/2
                `,
              `
                    top:87%;
                    left:87%;
                `,
              props.status === "online" ? tw`bg-green-600` : "",
              props.status === "offline" ? tw`bg-red-500` : "",
            ]}
          ></div>
        )}
      </div>
      {props.label && (
        <div css={[tw`text-center`, props.active ? tw`text-purple-500` : ""]}>
          <Typography size="text_sm" variant="normal">
            {props.label}
          </Typography>
        </div>
      )}
    </div>
  );
};
