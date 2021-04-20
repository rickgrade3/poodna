import { Avatar, X } from "@poodna/design-system/src";
import React from "react";
import { appStore } from "src/stores/appStore";
import Logo from "./Logo";

export default () => {
  return (
    <X>
      <Logo></Logo>
      <Avatar src={appStore.user.avatar} />
    </X>
  );
};
