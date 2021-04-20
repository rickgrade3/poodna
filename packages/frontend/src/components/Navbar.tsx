import { Avatar, X } from "@poodna/design-system/src";
import React from "react";
import Logo from "./Logo";

export default () => {
  const currentUser = {
    avatar: "src",
  };
  return (
    <X>
      <Logo></Logo>
      <Avatar src={currentUser.avatar} />
    </X>
  );
};
