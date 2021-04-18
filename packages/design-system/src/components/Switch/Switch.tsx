import React from "react";
import tw, { css, styled, theme } from "twin.macro";
import { Button } from "../..";
import { ButtonSize, ButtonSizeEnum } from "../Button/Button";
import { X } from "../Layout/Layout";
import { Theme } from "../types";
import Typography from "../Typography/Typography";

export interface SwitchProps {
  items: { key: string; label: string; value: string | number }[];
  value: string;
  onChange: (v: string | number) => void;
  tone?: Theme;
  size?: ButtonSize;
}

export default ({ tone = "DARK", size, ...props }: SwitchProps) => {
  return (
    <X
      css={[
        size === "xl2" ? tw`h-16` : "",
        size === "xl" ? tw` h-16` : "",
        size === "lg" ? tw` h-14` : "",
        size === "md" || !size ? tw` h-12` : "",
        size === "sm" ? tw` h-10` : "",
      ]}
      gap={1}
      p={1}
      className={`${tone === "DARK" ? "bg-gray-800" : "bg-gray-50"} rounded-lg`}
    >
      {props.items.map((i) => {
        return (
          <Button
            css={`
              height: 100%;
              padding-top: 0;
              padding-bottom: 0;
              min-width: 7rem;
            `}
            onClick={() => {
              setTimeout(() => {
                try {
                  props.onChange(i.value);
                } catch {}
              }, 100);
            }}
            full
            tone={tone}
            size="sm"
            variant={i.value === props.value ? "primary" : "text"}
          >
            {i.label || i.value || i.key}
          </Button>
        );
      })}
    </X>
  );
};
