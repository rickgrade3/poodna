import { Button, MenuItem, Y, Typography } from "@poodna/design-system/src";
import React from "react";
import api from "src/api";
import { appStore } from "src/stores/appStore";

export default () => {
  const { data } = api.ChatRoom.list_by_user.hook({
    id: appStore.user.id,
  });
  console.log(data);
  return (
    <Y gap={4}>
      <Y gap={10} variant={["box", "light", "rounded", "shadow"]}>
        <Y gap={4} className="mb-4">
          <Typography className="text-center" size="text_3xl" variant="heading">
            Start hosting
          </Typography>
          <Button
            variant="primary"
            size="xl2"
            onClick={() => {
              appStore.push("/create_room");
            }}
          >
            Create room
          </Button>
        </Y>
      </Y>
      <Y variant={["box", "light", "rounded"]}>
        <Typography size="text_2xl" variant="heading">
          Your room
        </Typography>
        <Y divider gap={0}>
          {((data && data?.list) || []).map((d) => {
            return (
              <MenuItem
                chevron
                key={d.id}
                onClick={() => {
                  appStore.push(`/room/${d.id}`);
                }}
              >
                {d.title || "Untitled"}
              </MenuItem>
            );
          })}
        </Y>
      </Y>
    </Y>
  );
};
