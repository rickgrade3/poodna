import React from "react";
import { Story, Meta } from "@storybook/react";
import Button, {
  ButtonProps,
  ButtonRoundedEnum,
  ButtonSizeEnum,
  ButtonVariantEnum,
} from "./Button";
import { ThemeEnum } from "../types";
export default {
  title: "Global/Button",
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ButtonVariantEnum,
      },
    },
    tone: {
      control: {
        type: "select",
        options: ThemeEnum,
      },
    },
    size: {
      control: {
        type: "select",
        options: ButtonSizeEnum,
      },
    },
    rounded: {
      control: {
        type: "select",
        options: ButtonRoundedEnum,
      },
    },
    full: {
      control: {
        type: "boolean",
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
    },
    loading: {
      control: {
        type: "boolean",
      },
    },
    focus: {
      control: {
        type: "boolean",
      },
    },
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  tone: "DARK",
  variant: "primary",
  children: "Test",
  rounded: "lg",
  size: "md",
  full: false,
  disabled: false,
  loading: false,
  focus: false,
};
