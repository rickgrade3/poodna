import React from "react";
import { Story, Meta } from "@storybook/react";
import Pagination, { PaginationProps } from "./Pagination";
import { ThemeEnum } from "../types";
export default {
  title: "Global/Pagination",
  component: Pagination,
  argTypes: {
    tone: {
      control: {
        type: "select",
        options: ThemeEnum,
      },
    },
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<PaginationProps> = (args) => <Pagination {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  totalItem: 300,
  currentPage: 2,
  pageCount: 4,
  tone: "DARK",
};
