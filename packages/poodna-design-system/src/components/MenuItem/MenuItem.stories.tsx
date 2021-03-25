import React from "react";
import { Story, Meta } from "@storybook/react";
import MenuItem, { MenuItemProps } from "./MenuItem";
export default {
  title: "Global/MenuItem",
  component: MenuItem,
  argTypes: {},
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<MenuItemProps> = (args) => (
  <div>
    <MenuItem {...args} />
    <MenuItem {...args} />
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  children: "Test",
  checked: true,
  chevron: true,
  icon: "icon",
  label: "Label",
  after: "After",
  before: "Before",
};
