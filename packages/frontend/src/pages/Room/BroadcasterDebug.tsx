import { MenuItem, Y } from "@poodna/design-system/src";
import React from "react";
import { useRoom } from "./RoomProvider";

export default () => {
  const r = useRoom();
  return (
    <>
      <Y>
        {r.mainloop.list.map((m) => {
          return <MenuItem avatar={m.avatar}>Mainloop-{m.name}</MenuItem>;
        })}
        {r.broadcasters.list.map((m) => {
          return <MenuItem avatar={m.avatar}>BC-{m.name}</MenuItem>;
        })}
        {r.outsider.list.map((m) => {
          return <MenuItem avatar={m.avatar}>OUTSIDERS-{m.name}</MenuItem>;
        })}
      </Y>
    </>
  );
};
