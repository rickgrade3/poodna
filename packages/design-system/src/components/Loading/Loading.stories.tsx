import React from "react";
import { Story, Meta } from "@storybook/react";
import Loading, { LoadingProps, LoadingSizeEnum } from "./Loading";
import { ThemeEnum } from "../types";
export default {
  title: "Global/Loading",
  component: Loading,
  argTypes: {
    select: {
      control: {
        type: "select",
        options: ["option1", "option2", "option3"],
      },
    },
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<LoadingProps> = (args) => <Loading {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
