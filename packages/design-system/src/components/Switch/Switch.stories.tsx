import React from "react";
import { Story, Meta } from "@storybook/react";
import Switch, { SwitchProps } from "./Switch";
import { ButtonSizeEnum } from "../Button/Button";
import { ThemeEnum } from "../types";
export default {
  title: "Global/Switch",
  component: Switch,
  argTypes: {
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
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  onChange: () => {},
  items: [
    { key: "item1", label: "item1", value: "item1" },
    { key: "item2", label: "item2", value: "item2" },
    { key: "item3", label: "item3", value: "item3" },
  ],
  value: "item1",
  tone: "DARK",
  size: "md",
};
