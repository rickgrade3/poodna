import React from "react";
import { Story, Meta } from "@storybook/react";
import Avatar, {
  AvatarSizeEnum,
  AvatarStatusEnum,
  AvatarProps,
} from "./Avatar";
export default {
  title: "Global/Avatar",
  component: Avatar,
  argTypes: {
    status: {
      control: {
        type: "select",
        options: AvatarStatusEnum,
      },
    },
    size: {
      control: {
        type: "select",
        options: AvatarSizeEnum,
      },
    },
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  src:
    "https://images.unsplash.com/photo-1612831819784-9084c50c5477?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
  text: "text",
  label: "label",
  background: "red",
  size: "md",
  status: "online",
  left: "x",
  active: true,
};
