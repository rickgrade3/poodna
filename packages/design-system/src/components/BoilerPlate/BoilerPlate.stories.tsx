import React from "react";
import { Story, Meta } from "@storybook/react";
import BoilerPlate, {
  BoilerPlateProps,
  BoilerPlateSizeEnum,
} from "./BoilerPlate";
import { ThemeEnum } from "../types";
export default {
  title: "Global/BoilerPlate",
  component: BoilerPlate,
  argTypes: {
    select: {
      control: {
        type: "select",
        options: BoilerPlateSizeEnum,
      },
    },
  },
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<BoilerPlateProps> = (args) => <BoilerPlate {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
