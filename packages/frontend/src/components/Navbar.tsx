import { Avatar, X, Y } from "@poodna/design-system/src";
import React, { ReactElement } from "react";
import { appStore } from "src/stores/appStore";
import Logo from "./Logo";

export default (p: { children: ReactElement }) => {
  return (
    <Y gap={10}>
      <X justify="between">
        <div
          onClick={() => {
            appStore.push("/");
          }}
        >
          <Logo></Logo>
        </div>
        <Avatar src={appStore.user.avatar} />
      </X>
      <div>{p.children}</div>
    </Y>
  );
};
