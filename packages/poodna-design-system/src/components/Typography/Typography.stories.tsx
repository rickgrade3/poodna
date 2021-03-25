import React from "react";
import { Story, Meta } from "@storybook/react";
import Typography, { TypographyProps } from "./Typography";
export default {
  title: "Global/Typography",
  component: Typography,
  argTypes: {},
} as Meta;
//👇 We create a “template” of how args map to rendering
const Template: Story<TypographyProps> = (args) => (
  <div>
    <Typography variant="heading" size="text_xs">
      text_xs
    </Typography>
    <Typography variant="heading" size="text_sm">
      text_sm
    </Typography>
    <Typography variant="heading" size="text_base">
      text_base
    </Typography>
    <Typography variant="heading" size="text_lg">
      text_lg
    </Typography>
    <Typography variant="heading" size="text_xl">
      text_xl
    </Typography>
    <Typography variant="heading" size="text_2xl">
      text_2xl
    </Typography>
    <Typography variant="heading" size="text_3xl">
      text_3xl
    </Typography>
    <Typography variant="heading" size="text_4xl">
      text_4xl
    </Typography>
    <Typography variant="heading" size="text_5xl">
      text_5xl
    </Typography>
    <Typography variant="heading" size="text_6xl">
      text_6xl
    </Typography>
    <Typography variant="heading" size="text_7xl">
      text_7xl
    </Typography>
    <Typography variant="heading" size="text_8xl">
      text_8xl
    </Typography>

    <Typography variant="normal" size="text_xs">
      text_xs
    </Typography>
    <Typography variant="normal" size="text_sm">
      text_sm
    </Typography>
    <Typography variant="normal" size="text_base">
      text_base
    </Typography>
    <Typography variant="normal" size="text_lg">
      text_lg
    </Typography>
    <Typography variant="normal" size="text_xl">
      text_xl
    </Typography>
    <Typography variant="normal" size="text_2xl">
      text_2xl
    </Typography>
    <Typography variant="normal" size="text_3xl">
      text_3xl
    </Typography>
    <Typography variant="normal" size="text_4xl">
      text_4xl
    </Typography>
    <Typography variant="normal" size="text_5xl">
      text_5xl
    </Typography>
    <Typography variant="normal" size="text_6xl">
      text_6xl
    </Typography>
    <Typography variant="normal" size="text_7xl">
      text_7xl
    </Typography>
    <Typography variant="normal" size="text_8xl">
      text_8xl
    </Typography>
  </div>
);

export const Primary = Template.bind({});
