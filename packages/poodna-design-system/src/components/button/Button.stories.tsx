import React from "react";
import { storiesOf } from "@storybook/react";
import Button from "./Button";

storiesOf("Button", module)
  .add("pink", () => <Button color="#F7CAC9">Pink</Button>)
  .add("blue", () => <Button color="#9DB1D7">Blue</Button>);
