import React from "react";
import { Story, Meta } from "@storybook/react";
import Input, { InputProps, InputRoundedEnum, InputSizeEnum } from "./Input";
export default {
  title: "Global/Input",
  component: Input,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: InputSizeEnum,
      },
    },
    rounded: {
      control: {
        type: "select",
        options: InputRoundedEnum,
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
const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  rounded: "lg",
  size: "md",
  loading: true,
  disabled: true,
  label: "Label",
  full: true,
};
